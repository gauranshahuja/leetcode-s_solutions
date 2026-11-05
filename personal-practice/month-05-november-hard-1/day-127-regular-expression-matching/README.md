# Day 127 - Regular Expression Matching

LeetCode 10 · Hard · 2D DP with wildcards · Thursday, 5 November 2026 · ~1 hr 40 min (read a hint for the two-branch star rule at the hour mark), 4 attempts

## Problem

Does pattern `p` match the **whole** string `s`?

- `.` matches any single character
- `*` matches zero or more of the **preceding** element

```
s = "aa",  p = "a"        ->  false
s = "aa",  p = "a*"       ->  true
s = "ab",  p = ".*"       ->  true     ".*" is "any char, zero or more times"
s = "aab", p = "c*a*b"    ->  true     c zero times, a twice, then b
s = "",    p = "a*b*c*"   ->  true
```

## The thing that breaks naive attempts

`*` is **not a character**. It is a modifier on the character in front of it.
`"a*"` is one unit meaning "any number of a's including none", and `"*"` on its
own is not a legal pattern at all.

My first two attempts failed because I treated `*` as a wildcard matching any
sequence - a real thing, it is tomorrow's problem (LeetCode 44), but not this
one. With that reading `"abcd"` would match `"d*"`, and it must not: `"d*"` is
"zero or more d's" and `"abcd"` has an `a` in front.

So the pattern cannot be read one character at a time left to right. Looking at
`p[j]` means peeking at `p[j+1]` to find out whether `p[j]` is free-standing or
half of a starred pair. Cleaner, and what I ended up doing: look at `p[j-1]`
and ask "is this a `*`?", so the pair is handled when I reach its second half.

## Building the recurrence

After an hour I had the table shape but kept writing the star case as one
transition instead of two, so I went and read a hint. It was one line - "a `*`
either matches zero copies or one more copy" - and that was enough; I wrote the
rest out myself from there. Annoying, because it is obvious in hindsight.

`dp[i][j]` = does `s[0..i-1]` fully match `p[0..j-1]`?

`dp[0][0] = true` - empty matches empty.

**Case A: `p[j-1]` is `*`.** Let `x = p[j-2]`, the element being repeated. Two
branches, OR-ed together:

| branch          | transition    | meaning                                           |
| --------------- | ------------- | ------------------------------------------------- |
| skip the pair   | `dp[i][j-2]`  | `x` appears zero times, throw the whole `x*` away |
| consume one char | `dp[i-1][j]` | `x` matches `s[i-1]`, eat it, **keep the pattern** |

The second branch is the one I got wrong twice. It is `dp[i-1][j]`, not
`dp[i-1][j-2]`. The `j` stays put on purpose: after using `x*` to swallow one
character of `s`, the group is still sitting there and can swallow the next one
too. That is what makes it "zero or more" rather than "exactly one". It is only
available when `x` can match `s[i-1]`, i.e. `x === '.'` or `x === s[i-1]`.

**Case B: `p[j-1]` is `.` or a literal.** It has to match `s[i-1]` directly, so
`dp[i][j] = dp[i-1][j-1]`, and `false` if it does not match.

## `dp[0][j]` - the initialisation I forgot

I had the whole table working and `isMatch("", "a*b*c*")` came back `false`.

The empty string is matchable by a non-empty pattern, as long as the pattern is
nothing but starred groups. So row 0 is not all-false after column 0:

```js
for (let j = 1; j <= n; j += 1) {
  if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
}
```

Each `x*` group contributes nothing, so truth hops two columns at a time:
`dp[0][0]=T -> dp[0][2]=T -> dp[0][4]=T -> dp[0][6]=T` for `"a*b*c*"`. Columns 1,
3, 5 stay false, because `"a"`, `"a*b"`, `"a*b*c"` all demand at least one real
character.

Missing this does not only break the empty-string case, it poisons everything
that depends on row 0, so `isMatch("b", "a*b")` was false too. That was the
clue that sent me to the base row rather than the transitions.

## Dry run

`s = "aab"`, `p = "c*a*b"`. `m = 3`, `n = 5`.

Row 0 first: `p[1]` is `*` so `dp[0][2] = dp[0][0] = T`; `p[3]` is `*` so
`dp[0][4] = dp[0][2] = T`. Columns 1, 3, 5 false.

|          | ""(0) | c(1) | *(2) | a(3) | *(4) | b(5) |
| -------- | ----- | ---- | ---- | ---- | ---- | ---- |
| **""(0)**| T     | F    | T    | F    | T    | F    |
| **a(1)** | F     | F    | F    | T    | T    | F    |
| **a(2)** | F     | F    | F    | F    | T    | F    |
| **b(3)** | F     | F    | F    | F    | F    | T    |

Reading the interesting cells:

- `dp[1][4]` (`"a"` vs `"c*a*"`): `p[3]` is `*` over `a`. Skip branch is
  `dp[1][2] = F`. Consume branch: `a` matches `s[0]`, so `dp[0][4] = T`. True.
- `dp[2][4]` (`"aa"` vs `"c*a*"`): skip is `dp[2][2] = F`, consume is
  `dp[1][4] = T`. True. This is the group eating a second character, with `j`
  unchanged, exactly as the recurrence says.
- `dp[3][5]` (`"aab"` vs `"c*a*b"`): `p[4]` is the literal `b`, matches `s[2]`,
  so take the diagonal `dp[2][4] = T`.

## Where I got stuck

Beyond the `dp[0][j]` row, the other 20 minutes went on `p[j-2]` being
`undefined`. If a malformed pattern starts with `*`, then at `j = 1` the code
reads `p[-1]` and `dp[i][-1]`, and JS hands back `undefined` instead of
throwing. `dp[i][j]` then becomes `undefined`, which is falsy so it mostly
behaves, but the table stops holding booleans and `!dp[i][j]` starts doing
something I never reasoned about. Hence the explicit `j >= 2 ? ... : false`
guard. LeetCode promises well-formed patterns, but I want the array typed.

`isMatchRecursive` stays in the file. Exponential and useless for submission,
but it reads like the problem statement, and I diffed it against the table on a
few thousand random strings and patterns over `{a, b, .}` with random stars.
That is how I convinced myself the two branches were right.

## Complexity

| Version   | Time        | Space      |
| --------- | ----------- | ---------- |
| Recursion | exponential | `O(m + n)` stack |
| Table     | `O(m * n)`  | `O(m * n)` |

The table could roll down to two rows since `dp[i][j]` only reads rows `i` and
`i-1`, but after yesterday's diagonal mess on Day 126 I left it as the full
grid, and `m * n` here is tiny.

## Follow-up to try

LeetCode 44, Wildcard Matching, where `*` matches any **sequence** rather than
repeats of one character. Should be strictly easier, because the pattern can be
read one character at a time again. Doing it tomorrow.
