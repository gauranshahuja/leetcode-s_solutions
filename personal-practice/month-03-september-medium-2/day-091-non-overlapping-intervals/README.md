# Day 091 - Non-overlapping Intervals

LeetCode 435 · Medium · Greedy on intervals · Wednesday, 30 September 2026 · ~35 min, 2 attempts

## Problem

Remove the fewest intervals so that none of the remaining ones overlap.
Touching at a single point is not an overlap.

```
[[1,2],[2,3],[3,4],[1,3]]  ->  1    drop [1,3]
[[1,2],[1,2],[1,2]]        ->  2    keep one of them
[[1,2],[2,3]]              ->  0    they only touch
```

## Reframe first

"Minimum to remove" is not a greedy-shaped question. "Maximum to keep" is, and
they are the same number: `removed = n - kept`. Once it is phrased as keeping,
it is the activity-selection problem, which has a greedy proof.

## Sort by end, not by start

This is the one line that matters, and it is the opposite of Day 061, where
merging intervals needed a sort by **start** so that each interval could be
compared against the one growing behind it.

Here, start-time sorting is wrong. The counterexample that convinced me:

```
[[1, 100], [2, 3], [4, 5], [6, 7]]
```

Sorted by start, `[1,100]` comes first and gets kept, and then nothing else
fits: kept = 1, so it reports 3 removals. The real answer is to drop `[1,100]`
and keep the three short ones, which is 1 removal.

Sorted by end: `[2,3], [4,5], [6,7], [1,100]`. The three short ones are kept and
the long one is rejected at the end.

### Why end-time is the right greedy

The exchange argument, which I wrote out because I did not want to just trust it:

Take the interval that finishes earliest, call it `f`. Claim: some optimal
answer keeps `f`.

- take any optimal answer and look at the interval it keeps first, call it `g`
- `f` finishes no later than `g`, by definition of "finishes earliest"
- so swapping `g` out for `f` cannot collide with anything else in that answer,
  because everything else started at or after `g`'s end, which is at or after
  `f`'s end
- the swap keeps the same count, so it is still optimal, and now it contains `f`

Then throw away everything that overlaps `f` and repeat on what is left. Each
step is safe, so the whole sweep is.

The informal version: **finishing early is the only thing that helps you later.**
A start time tells you nothing about how much room an interval takes.

## Dry run

```
[[1,100], [11,22], [1,11], [2,12]]
```

Sorted by end: `[1,11], [2,12], [11,22], [1,100]`

| interval  | start >= lastEnd? | kept | lastEnd |
| --------- | ----------------- | ---- | ------- |
| `[1,11]`  | first, always kept | 1    | 11      |
| `[2,12]`  | `2 >= 11` no      | 1    | 11      |
| `[11,22]` | `11 >= 11` yes | 2    | 22      |
| `[1,100]` | `1 >= 22` no      | 2    | 22      |

kept 2 out of 4, so 2 removals.

Note `[11,22]` being kept: `11 >= 11` has to be `>=` and not `>`, because
touching is allowed. With `>` this returns 3.

## The bug

Not the greedy. The sort.

```js
const byEnd = intervals.sort((a, b) => a[1] - b[1]);
```

Two problems with that line, and I hit the second one first.

1. `sort` mutates in place, so the caller's array comes back reordered. Added
   `.slice()`.
2. At one point while fiddling I dropped the comparator entirely. JS
   `Array.prototype.sort` with no comparator stringifies and compares as text,
   and arrays stringify by joining with commas. So `[2,9]` and `[10,11]` get
   compared as `"2,9"` against `"10,11"`, and `[10,11]` is placed first even
   though it ends later. It then silently gives wrong answers on any input with
   mixed digit counts. There is a test in the file with two-digit bounds for
   exactly this reason.

I know about the default comparator. I have known about it since July. It still
got me, because the bug is invisible on single-digit test data, which is what
all the examples use.

## Complexity

- Time `O(n log n)`, dominated by the sort. The sweep is one pass.
- Space `O(n)` because of the copy. `O(1)` extra if mutating the input is
  acceptable.

## Takeaway

Interval problems split on what you sort by. Sort by start to merge or to
sweep coverage; sort by end to pick the most non-overlapping ones. Getting
that choice right is most of the work.

End of month three. What changed since July is not that I know more algorithms,
it is that I now reach for a shape instead of for the problem. Today I read
"minimum to remove" and immediately rewrote it as "maximum to keep" before
touching the keyboard, which three months ago I would not have thought to do.
Day 082 was Day 037 on a tree, Day 090 was Day 060 with the loop reversed, and
this is Day 061 with a different sort key. The templates are starting to
outnumber the problems.
