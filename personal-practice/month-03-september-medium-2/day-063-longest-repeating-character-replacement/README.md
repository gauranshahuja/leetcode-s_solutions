# Day 063 - Longest Repeating Character Replacement

LeetCode 424 · Medium · Sliding window with a max-count · Wednesday, 2 September 2026 · ~55 min, and most of it was not coding, 3 attempts

## Problem

Uppercase string `s`, budget `k`. Change at most `k` characters to anything you
like. How long can you make a substring that is all one letter?

```
s = "ABAB",    k = 2  ->  4    (two B -> A, whole string becomes AAAA)
s = "AABABBA", k = 1  ->  4    ("AABA" -> "AAAA", or "ABBA" -> "BBBB")
s = "AAAA",    k = 2  ->  4    budget left over, answer is still just 4
```

## Setting it up

This is the variable-size window template again, so the only real work is
writing down the legality test. For a window of length `L` whose most common
letter appears `maxCount` times, the characters I have to pay to replace are
exactly the other ones:

```
cost(window) = L - maxCount        window is legal  <=>  L - maxCount <= k
```

So: extend right, update the count for the incoming letter, and if the window
became illegal, pull `left` forward.

```js
count[in]++;
maxCount = Math.max(maxCount, count[in]);
if (right - left + 1 - maxCount > k) { count[s[left]]--; left++; }
```

And then the thing that makes this problem actually interesting.

## `maxCount` is never decreased, and the answer is still exact

When `left` moves forward I decrement that letter's count but I leave
`maxCount` alone. So `maxCount` is not "the max count of the current window",
it is "the largest single-letter count I have ever seen in any window". It can
be stale and too large, which means the legality test can be too lenient and
the current window can be genuinely illegal.

I did not believe this for a while. Here is the argument that convinced me, in
two halves. Note first that because I shrink with `if` (one step) and not
`while`, the window length never decreases - every step it either grows by one
or stays put - so the answer is simply the final length.

**It never over-reports.** Say the window length reaches `S` at some point.
At that moment the test passed, so `maxCount >= S - k`. That `maxCount` is the
true count of some letter `c` inside some earlier window, and every earlier
window had length `<= S` (lengths are non-decreasing). Take that earlier window
and pad it out to length exactly `S` inside `s`. It still contains at least
`maxCount >= S - k` copies of `c`, so at most `k` characters that are not `c`,
so `k` replacements really do make it uniform. A window length of `S` is
therefore achievable somewhere in the string, even if the window sitting in my
variables right now is not that one.

**It never under-reports.** Suppose the true optimum is the substring
`s[a..b]`, length `OPT`, whose most common letter `c` leaves at most `k`
non-`c` characters. If my answer came out below `OPT`, then by the time
`right = b` the left pointer must have moved past `a`. Look at the step where
`left` went from `a` to `a + 1`: the test had just failed on the window
`s[a..right]`, so that window needed more than `k` replacements, so it contains
more than `k` characters that are not `c`. But `s[a..right]` is a *prefix* of
`s[a..b]`, which contains at most `k` of them in total. A prefix cannot hold
more of something than the whole. So `left` never passes `a` before
`right` reaches `b`, and the window does reach length `OPT`.

So the stale value is safe in both directions. The reason people get this wrong
(me, for 20 minutes) is treating `maxCount` as a property of the current window
and then "fixing" it. Fixing it is not wrong, just slower.

## My first two tries

Attempt 1 recomputed the max honestly on every shrink:

```js
maxCount = Math.max(...count);   // 26 slots, every single step
```

Correct, `O(26n)`, and it passed. I only went looking for the `if`-and-never-
decrease version because the editorial comments were arguing about it.

Attempt 2 was the one that was actually wrong. I convinced myself the answer
was just `maxCount + k`:

```js
return maxCount + k;             // wrong
```

`"AAAA"` with `k = 2` returns 6, which is longer than the string. The budget
being unused is a real case and the cap matters. Returning `s.length - left`
(the final window length) has the cap built in, which is why I like it better
than tracking a separate `best` variable here.

## Dry run

`s = "AABABBA"`, `k = 1`. (`len` is the window length after the step.)

| r | char | counts            | maxCount | len before shrink | cost | action        | len |
| - | ---- | ----------------- | -------- | ----------------- | ---- | ------------- | --- |
| 0 | A    | A:1               | 1        | 1                 | 0    | keep          | 1   |
| 1 | A    | A:2               | 2        | 2                 | 0    | keep          | 2   |
| 2 | B    | A:2 B:1           | 2        | 3                 | 1    | keep          | 3   |
| 3 | A    | A:3 B:1           | 3        | 4                 | 1    | keep          | 4   |
| 4 | B    | A:3 B:2           | 3        | 5                 | 2    | shrink (drop A) | 4 |
| 5 | B    | A:2 B:3           | 3        | 5                 | 2    | shrink (drop A) | 4 |
| 6 | A    | A:2 B:3           | 3        | 5                 | 2    | shrink (drop B) | 4 |

Answer `7 - 3 = 4`. Notice the window at `r = 6` is `"BABBA"`-ish and not
legal; it does not matter, the length never grew past 4.

## Complexity

- Time `O(n)`, one pass, `left` only moves forward.
- Space `O(1)` - 26 counters regardless of input size.

## Note to self

Two separate ideas got bundled together here and it is worth keeping them
apart:

1. The window legality test is `length - maxCount <= k`. That is the problem.
2. Shrinking by one step and never lowering `maxCount` is an optimisation whose
   correctness needs the prefix argument above. That is the trick.

If I am ever unsure in an interview, write version 1 (`Math.max(...count)` on
shrink). It is the same complexity class and I can explain it in one sentence.
