# Day 066 - Find All Anagrams in a String

LeetCode 438 · Medium · Fixed-size window of counts · Saturday, 5 September 2026 · ~30 min, 2 attempts

## Problem

All start indices of substrings of `s` that are anagrams of `p`.

```
s = "cbaebabacd", p = "abc"  ->  [0, 6]     "cba" and "bac"
s = "abab",       p = "ab"   ->  [0, 1, 2]  windows overlap, all count
```

## This is Day 064 again

Day 064 (Permutation in String) was the same mechanism: a window of
`p.length` characters sliding over `s`, and a comparison of 26-slot count
arrays. The only difference is that 567 could `return true` on the first hit
and this one has to keep going and collect every index.

That difference is exactly what makes the lazy version annoying here. In 567
the average case bailed out early; in 438 I compare the full 26 slots for
**every** window, every time, start to finish. Still `O(26n)` and still linear
by the textbook, but it is 26x more work than necessary and I said at the end
of Day 064 that I would fix it. So, fixing it.

## The improvement: a `matches` counter

Instead of asking "are all 26 slots equal?" from scratch each step, keep a
number:

```
matches = how many of the 26 letters satisfy win[letter] === need[letter]
```

The window is an anagram exactly when `matches === 26`.

Now the point. One step changes `win` in at most two slots: one letter comes
in, one goes out. A slot's agreement can only flip when that slot changes. So
each step repairs `matches` with at most two O(1) updates:

| event | condition after the change | update |
| ----- | -------------------------- | ------ |
| `win[x]++` | `win[x] === need[x]` | it just became equal, `matches++` |
| `win[x]++` | `win[x] === need[x] + 1` | it was equal and just left, `matches--` |
| `win[x]--` | `win[x] === need[x]` | `matches++` |
| `win[x]--` | `win[x] === need[x] - 1` | `matches--` |

Any other value means the slot was already wrong and is still wrong, so
nothing changes. The whole per-step cost is now four comparisons instead of
26.

The initial value is the bit I got wrong first (see below): before anything is
added, `win` is all zeros, so every letter that `p` does not use is **already
matching**. So `matches` starts at `26 - distinct(p)`, not at 0.

## The bug

```js
let matches = 0;                 // wrong starting point
```

With `p = "abc"` that means the 23 letters d..z never get counted (they are
never touched, so the `win[x]++` rules never run for them), `matches` tops out
at 3, and `matches === 26` is never true. Empty output on every input. Took me
a couple of minutes of `console.log(matches)` to see that the counter was
measuring "letters I have fixed" rather than "letters that agree", which are
only the same thing if you start from a correct baseline.

The fix is the loop over all 26 slots counting `need[i] === 0`.

## Dry run

`p = "abc"`, so `need = {a:1, b:1, c:1}` and `matches` starts at
`26 - 3 = 23`. `s = "cbaebabacd"`, `m = 3`.

| r | in | out | window | matches | hit?        |
| - | -- | --- | ------ | ------- | ----------- |
| 0 | c  | -   | "c"    | 24      | window not full |
| 1 | b  | -   | "cb"   | 25      | window not full |
| 2 | a  | -   | "cba"  | **26**  | push 0   |
| 3 | e  | c   | "bae"  | 24      | no          |
| 4 | b  | b   | "aeb"  | 24      | no          |
| 5 | a  | a   | "eba"  | 24      | no          |
| 6 | b  | e   | "bab"  | 24      | no          |
| 7 | a  | b   | "aba"  | 24      | no          |
| 8 | c  | a   | "bac"  | **26**  | push 6   |
| 9 | d  | b   | "acd"  | 24      | no          |

Result `[0, 6]`.

Two details in the loop ordering that are easy to fumble:

- evict at `r >= m`, not `r >= m - 1`, so the first full window is not
  immediately broken
- check for a hit at `r >= m - 1`, after both the insert and the evict

## Complexity

| | |
| - | - |
| Time  | `O(n + m)`, with a small constant now instead of 26 |
| Space | `O(1)` for the two count arrays, plus the output |

## Takeaway

When a derived fact has to be recomputed every step, check how much of its
input actually changed. Here only 2 of 26 slots move per step, so recomputing
all 26 is 24 slots of wasted work. Same reasoning as keeping a running sum
instead of re-summing a window.

Also: 567 and 438 are the same problem with a different return type. Nice to
notice that and not re-derive it from zero.
