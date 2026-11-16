# Day 106 - Combination Sum II

LeetCode 40 · Medium · Backtracking with duplicate skipping · Thursday, 15 October 2026 · ~25 min, 2 attempts

## Problem

Every combination of `candidates` that sums to `target`. Each array element may
be used **at most once**, the input **may contain duplicates**, and the output
must not list the same combination twice.

```
candidates = [10,1,2,7,6,1,5], target = 8
->  [[1,1,6], [1,2,5], [1,7], [2,6]]

candidates = [2,5,2,1,2], target = 5
->  [[1,2,2], [5]]
```

## How this differs from Day 072

Day 072 (Combination Sum) had unlimited reuse and a distinct input. This one
flips both, and each flip costs exactly one line:

| | Day 072 | today |
| --- | --- | --- |
| element reuse | allowed | at most once |
| recursive call | `back(i, remain - nums[i])` | `back(i + 1, remain - nums[i])` |
| input duplicates | none | yes |
| dedup | not needed | `if (i > start && nums[i] === nums[i-1]) continue;` |

The reason it took me a second attempt is that I only changed the first one. With
`i + 1` but no skip, `[1,1,6]` came out **twice** - once picking the 1 at index 0
and once picking the 1 at index 1. Same multiset, different positions.

## Getting the skip condition right

This is the part I always have to reason out rather than remember.

Sort first, so equal values sit in runs. Then inside one `for` loop - one *slot*
of the combination being filled - only the first element of a run is allowed:

```js
if (i > start && nums[i] === nums[i - 1]) continue;
```

`i > start` is load-bearing. The condition says "I am not the first choice
considered for this slot, and I am the same value as the previous choice for
this slot". That previous choice already explored every completion, so I would
only re-explore it.

What it deliberately does **not** block: picking the second 1 at a *deeper*
level. At depth 1 `start` is 1, so `i === 1` has `i > start` false, and the 1 at
index 1 is allowed. That is how `[1,1,6]` still gets built exactly once.

The wrong version I tried first was `if (i > 0 && nums[i] === nums[i-1])`, which
blocks the duplicate everywhere and loses `[1,1,6]` entirely.

## Dry run

Sorted: `[1,1,2,5,6,7,10]`, target 8.

| depth | start | i | nums[i] | check                       | remain after |
| ----- | ----- | - | ------- | --------------------------- | ------------ |
| 0 | 0 | 0 | 1  | take                                | 7 |
| 1 | 1 | 1 | 1  | `i > start`? no -> allowed          | 6 |
| 2 | 2 | 2 | 2  | take -> 4 left, nothing fits        | - |
| 2 | 2 | 4 | 6  | take -> 0 -> record `[1,1,6]`       | 0 |
| 1 | 1 | 2 | 2  | take                                | 5 |
| 2 | 3 | 3 | 5  | take -> 0 -> record `[1,2,5]`       | 0 |
| 1 | 1 | 5 | 7  | take -> 0 -> record `[1,7]`         | 0 |
| 0 | 0 | 1 | 1  | `i > start` and equal -> **skip**   | - |
| 0 | 0 | 2 | 2  | take -> ... -> record `[2,6]`    | 6 |
| 0 | 0 | 6 | 10 | `10 > 8` -> **break**               | - |

## Two small things

**`break`, not `continue`, on overshoot.** Once `nums[i] > remain`, the sorted
tail is all bigger, so there is nothing left to try in this loop. `continue`
would still be correct, just pointless work.

**The comparator.** `[...candidates].sort((a, b) => a - b)`. The default
`sort()` stringifies, so `[10, 2]` sorts to `[10, 2]`, and that quietly breaks
*both* the duplicate-run logic and the break-early prune. I added a test with a
two-digit candidate specifically to catch this, because with single digits the
default comparator looks fine.

Also: I sort a copy. Mutating the caller's array is the kind of thing that only
bites you later.

## Complexity

- Time: `O(2^n)` in the worst case - every subset is potentially a candidate
  path - plus `O(n log n)` for the sort. The duplicate skip and the overshoot
  break cut the real tree down a lot but do not change the bound.
- Space: `O(n)` for the recursion and the current path, not counting output.

## Pattern to remember

"Each element once" is `i + 1`. "Each *answer* once, despite duplicate
inputs" is sort + skip-equal-at-the-same-level. They are independent fixes
and you usually need both.

Four days of backtracking variants now (072, 073, 074 and this one) and the
template has not changed once - only the loop guard and the recursion index do.
Worth keeping that in mind when the next one shows up.
