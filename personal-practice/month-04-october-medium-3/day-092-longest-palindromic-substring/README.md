# Day 092 - Longest Palindromic Substring

LeetCode 5 · Medium · Expand around centre · Thursday, 1 October 2026 · ~35 min, 2 attempts

Start of month four. The problems from here on are the ones I used to scroll
past, so the plan is: recognise the template fast, then spend the time on the
part that is actually specific to the problem.

## Problem

Return the longest substring of `s` that reads the same both ways. Contiguous,
so `"aba"` counts but the subsequence `"aa"` inside `"abca"` does not.

```
"babad"            ->  "bab"        ("aba" is equally valid)
"cbbd"             ->  "bb"
"a"                ->  "a"
"forgeeksskeegfor" ->  "geeksskeeg"
```

## Where I started

Generate every substring, check each one. That is `O(n^2)` substrings times
`O(n)` to verify, so `O(n^3)`. It passes nothing above small inputs but it gave
me a correct answer to diff against, so I kept it as `longestPalindromeBrute`.

Second thought was the DP table (`dp[i][j]` = is `s[i..j]` a palindrome,
built by length). That is `O(n^2)` time but also `O(n^2)` space, and I remember
writing it in a tutorial once without really understanding it.

## The reframing

Stop asking "is this substring a palindrome" and start asking "how far can this
centre grow". The expansion *is* the check, so the inner `O(n)` verification
vanishes and you get `O(n^2)` time with `O(1)` space.

The catch, and the only genuinely tricky bit: **there are 2n-1 centres.**

- odd length palindromes are centred on a character: `"aba"` has centre `b`
- even length ones are centred on the *seam between* two characters: `"abba"`
  has no middle character, its centre is the `b|b` gap

So each index gets expanded twice, once as `(i, i)` and once as `(i, i+1)`. If
you only do the first you get `"cbbd" -> "b"`, which is exactly the wrong answer
I produced on attempt 1.

## The off-by-one I got wrong first

The `while` loop only stops *after* the ends stop matching, so when it exits
`l` and `r` are both one step too far out. My first length calculation was:

```js
const len = r - l + 1;      // wrong, counts the two failed ends
```

which is 2 too big. The real span is `[l+1, r-1]`, so:

```
len   = (r - 1) - (l + 1) + 1 = r - l - 1
start = l + 1
```

Nice side effect: this formula is also correct for the even case that never
matched at all. `expand(i, i+1)` with `s[i] !== s[i+1]` exits immediately with
`r - l - 1 === 0`, which never beats `bestLen`, so no special case needed.

## Dry run

`s = "cbbd"`, starting `bestLen = 1`, `bestStart = 0`

| i | centre   | grows to (l, r) | len | beats best? |
| - | -------- | --------------- | --- | ----------- |
| 0 | `(0,0)`  | `(-1, 1)`       | 1   | no          |
| 0 | `(0,1)`  | `(0, 1)`        | 0   | no (c != b) |
| 1 | `(1,1)`  | `(0, 2)`        | 1   | no (c != b) |
| 1 | `(1,2)`  | `(0, 3)`        | 2   | **yes**  |
| 2 | `(2,2)`  | `(1, 3)`        | 1   | no          |
| 2 | `(2,3)`  | `(2, 3)`        | 0   | no          |
| 3 | `(3,3)`  | `(2, 4)`        | 1   | no          |

`bestStart = 1`, `bestLen = 2` -> `s.slice(1, 3)` = `"bb"`.

## Complexity

| Version          | Time     | Space    |
| ---------------- | -------- | -------- |
| Every substring  | `O(n^3)` | `O(1)`   |
| DP table         | `O(n^2)` | `O(n^2)` |
| Expand on centre | `O(n^2)` | `O(1)`   |

Worst case for the expansion is a string like `"aaaa...a"` where every centre
runs the full width, which is where the `n^2` comes from.

## About Manacher

There is an `O(n)` algorithm for this (Manacher's). I read the first half of the
explanation, saw that it reuses previously computed palindrome radii mirrored
across the current centre, and decided not to learn it today. `O(n^2)` with
`O(1)` space is accepted on LeetCode and I would not be able to re-derive
Manacher under pressure, so memorising it would be fake knowledge. Noted as
something to come back to when I have a clear afternoon.

## Note to self

When a problem is about a symmetric shape, enumerate centres, not
endpoints. And count the centres carefully: a symmetric shape of even size
has its centre between elements, not on one.

The `2n-1` thing is the whole problem. Everything else is a slice.
