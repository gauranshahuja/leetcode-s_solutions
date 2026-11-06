# Day 128 - Wildcard Matching

LeetCode 44 · Hard · 2D DP, plus a greedy O(n) version · Friday, 6 November 2026 · ~65 min (DP in 15; the greedy version took the rest, and I read the editorial for why one star is enough), 3 attempts

## Problem

Does pattern `p` match all of `s`?

- `?` matches exactly one character
- `*` matches any sequence of characters, including the empty sequence

```
s = "aa",    p = "a"       ->  false
s = "aa",    p = "*"       ->  true
s = "cb",    p = "?a"      ->  false
s = "adceb", p = "*a*b"    ->  true
s = "acdcb", p = "a*c?b"   ->  false
```

## This is easier than yesterday, and here is why

Day 127's `*` meant "zero or more of the preceding element", so it was a
modifier and the pattern had to be consumed two symbols at a time. Here `*` is
self-contained and means "any sequence". Three consequences, all in my favour:

1. Each pattern character can be classified on its own, no lookahead.
2. `dp[0][j]` is a plain prefix-of-stars check instead of the two-column hop
   `dp[0][j-2]`.
3. There is a greedy linear-ish solution, which there is not for LeetCode 10,
   because all stars here behave identically so only the most recent one ever
   needs remembering.

The DP went in on the first try in 15 minutes, which after yesterday felt
suspicious enough that I went looking for the catch.

## The DP

`dp[i][j]` = does `s[0..i-1]` fully match `p[0..j-1]`? Base row:

```js
for (let j = 1; j <= n; j += 1) dp[0][j] = dp[0][j - 1] && p[j - 1] === '*';
```

The empty string matches a leading run of `*` and nothing more: the first
non-star sets a false and every column after it inherits it. That is exactly
where this differs from Day 127, where `"a*b*c*"` had truths at columns 0, 2, 4,
6 with falses in between. Transitions:

| `p[j-1]`  | `dp[i][j]`                     | reasoning                        |
| --------- | ------------------------------ | -------------------------------- |
| `*`       | `dp[i-1][j] \|\| dp[i][j-1]`   | star eats `s[i-1]`, or star eats nothing |
| `?`       | `dp[i-1][j-1]`                 | consumes one of each             |
| literal   | `p[j-1] === s[i-1] && dp[i-1][j-1]` | same, but has to agree      |

The `*` row is worth reading slowly. `dp[i-1][j]` keeps the pattern position and
advances in `s`, so the star stays open and swallows one more character.
`dp[i][j-1]` advances past the star, so it closes having swallowed nothing.
Those two cover every possible split, so one OR is enough and no inner loop over
"how many characters does this star take" is needed. My first instinct was that
inner loop, at `O(m^2 n)`.

## Dry run of the DP

`s = "adceb"`, `p = "*a*b"`.

|          | ""(0) | *(1) | a(2) | *(3) | b(4) |
| -------- | ----- | ---- | ---- | ---- | ---- |
| **""(0)**| T     | T    | F    | F    | F    |
| **a(1)** | F     | T    | T    | T    | F    |
| **d(2)** | F     | T    | F    | T    | F    |
| **c(3)** | F     | T    | F    | T    | F    |
| **e(4)** | F     | T    | F    | T    | F    |
| **b(5)** | F     | T    | F    | T    | T |

Column 1 is all true because a leading `*` can absorb any prefix. Column 3 goes
true at row 1 and stays true, because once `"a"` is matched the second star can
absorb everything after it. The answer cell leans on `dp[4][3]`, i.e. `"adce"`
matched `"*a*"`, plus the literal `b`.

## The greedy version, and where I lost 40 minutes

Since a `*` can absorb anything, don't decide how much. Assume it absorbs
nothing, keep walking, and when the walk gets stuck, hand the most recent star
one more character. State: `star` = index in `p` of the last `*` seen (`-1` if
none), `mark` = index in `s` where that star was standing. Four cases in the
loop: characters agree (advance both), pattern is `*` (record `star`/`mark`,
advance `j` only), stuck but a star exists (`j = star + 1`, `mark += 1`,
`i = mark`), stuck with no star (`false`).

**Why only the last star matters**: I did not believe this and first wrote a
pointless version keeping a stack of stars, then went and read the editorial's
argument for it before trusting the single-star version. It is short: suppose
extending an *earlier* star by one character would fix things. Everything
between that star and the latest one matched literally, so that whole block can
shift right by one and the latest star absorbs the character instead. Identical
reachable set, so the older stars are dead weight.

The three things that went wrong:

```js
} else if (star !== -1) {
  j = star + 1;
  i = mark + 1;     // WRONG: mark itself never advances
}
```

That loops forever on `"acdcb"` / `"a*c?b"`, because each retry restarts `s`
from the same `mark + 1`. `mark` is the state, so it has to be incremented and
then `i` set from it.

Second: I forgot the trailing-star drain. `isMatchGreedy("abc", "abc**")` exits
the loop with `i === 3` and `j === 3`, and returning `j === p.length` without
draining says false. Trailing stars match the empty tail, so walk them off.

Third: the `j < p.length` guards on the first two branches. Without them, once
the pattern is exhausted but `s` is not, `p[j]` is `undefined` and things still
work by accident. Comparing `undefined` to a character is luck, not logic. Then
I diffed the greedy version against the table on 60,000 random string/pattern
pairs over `{a, b, *, ?}` before trusting it.

## Comparing the two

| Version | Time                        | Space      | Notes                       |
| ------- | --------------------------- | ---------- | --------------------------- |
| DP      | `O(m * n)`                  | `O(m * n)` | obviously correct, easy to write |
| Greedy  | `O(m + n)` typical, `O(m * n)` worst | `O(1)` | needs an argument, trivial to get wrong |

The greedy worst case still exists - `s = "aaa...aab"` against `p = "*a*a*a*b"`
forces repeated restarts - but it is `O(1)` space and on anything resembling a
real glob it is a single pass. If I had to ship one I would ship the DP unless
memory mattered, purely because the greedy version has three off-by-ones
waiting in it and I found all three the hard way.

## Takeaway

"Any sequence" wildcards let you defer the decision and backtrack once, and
only to the most recent wildcard. "Zero or more of the previous character"
wildcards do not, because the stars are no longer interchangeable.

That sentence is the real difference between LeetCode 10 and 44, and doing them
on consecutive days made it obvious in a way reading both statements did not.
