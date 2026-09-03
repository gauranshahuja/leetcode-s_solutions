# Day 064 - Permutation in String

LeetCode 567 · Medium · Fixed-size sliding window of counts · Thursday, 3 September 2026 · ~25 min, 2 attempts

## Problem

Does `s2` contain a substring that is a permutation of `s1`?

```
s1 = "ab",  s2 = "eidbaooo"   ->  true     ("ba" starts at index 3)
s1 = "ab",  s2 = "eidboaoo"   ->  false
s1 = "abc", s2 = "ccccbbbbaaaa" -> false   all the letters, never adjacent
```

## Restating it so it stops being a string problem

"Permutation" means order is irrelevant, so a permutation of `s1` is nothing
but a multiset of 26 letter counts. And a substring of `s1`'s length is a
window. So:

is there a window of `s2` of length `s1.length` whose letter counts equal
`s1`'s letter counts?

Once it is phrased that way there is no cleverness left, only bookkeeping. The
window size is **fixed**, which is a different and much calmer animal than
Day 034 or yesterday's Day 063: no shrink condition, no "is the window legal
yet" question. One character in on the right, one out on the left, forever.

## The loop

```js
win[in]++;
if (r >= m) win[out]--;                  // out = s2[r - m]
if (r >= m - 1 && sameCounts(win, need)) return true;
```

Three details I had to get right:

- `r >= m` for the eviction, not `r >= m - 1`. At `r = m - 1` the window is
  exactly full for the first time and nothing should leave yet.
- `r >= m - 1` for the comparison, so I do not compare a half-built window.
- `m > s2.length` has to bail out early. Not because the loop breaks, but
  because without it the function would be relying on the comparison never
  firing, which is a worse reason for the right answer.

## The bug

I wrote the comparison as

```js
if (win === need) return true;        // always false
```

which is the dumbest possible JS mistake and I stared at `false` on the first
example for a few minutes before I saw it. Two arrays are two objects, `===` is
reference identity, done. `JSON.stringify(win) === JSON.stringify(need)` would
work and is tempting for a one-liner, but it allocates two strings on every
single character of `s2`, so I wrote the 26-slot loop instead.

## Dry run

`s1 = "ab"` so `need = {a:1, b:1}`, `m = 2`. `s2 = "eidbaooo"`.

| r | in  | out | window | counts        | full? | equal? |
| - | --- | --- | ------ | ------------- | ----- | ------ |
| 0 | e   | -   | "e"    | e:1           | no    | -      |
| 1 | i   | -   | "ei"   | e:1 i:1       | yes   | no     |
| 2 | d   | e   | "id"   | i:1 d:1       | yes   | no     |
| 3 | b   | i   | "db"   | d:1 b:1       | yes   | no     |
| 4 | a   | d   | "ba"   | b:1 a:1       | yes   | **yes** |

Returns true at index 3, which is where `"ba"` starts (`r - m + 1`).

## Complexity

| | |
| - | - |
| Time  | `O(26 n)` = `O(n)` where n = `s2.length` |
| Space | `O(1)`, two arrays of 26 |

The `26` in there is the part I am not happy about: a full 26-slot comparison
for every character of `s2` is real work even if the complexity class hides it.
There is an obvious fix (keep a counter of how many of the 26 slots currently
match, and update it by at most 2 per step) and I did not do it today because
the array compare was already passing. Writing it down as a follow-up.

## Follow-up to try

Same problem but "return *all* the start indices" - that is LeetCode 438 and it
cannot return early, so the 26-slot compare happens for every window and the
matches-counter actually pays off. Doing that one soon.
