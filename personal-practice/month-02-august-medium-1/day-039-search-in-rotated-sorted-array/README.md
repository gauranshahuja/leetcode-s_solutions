# Day 039 - Search in Rotated Sorted Array

LeetCode 33 · Medium · Binary search on a rotated array · Sunday, 9 August 2026 · ~40 min, 3 attempts

## Problem

A sorted array of distinct integers was rotated at an unknown pivot. Find
`target`'s index, or `-1`. Must be `O(log n)`.

```
original: [0,1,2,4,5,6,7]
rotated:  [4,5,6,7,0,1,2]

target 0 -> 4
target 3 -> -1
```

## Where I started

Two-step plan: binary search for the pivot index first, then binary search the
correct half. That is a legitimate solution and it is `O(log n)`.

I abandoned it because the pivot search has its own set of boundary cases
("what if it is not rotated at all") and I ended up with two tricky loops
instead of one. One loop that handles the pivot inline is less code and fewer
places to be wrong.

## The insight

A rotation introduces **exactly one** break point in the array - the single
place where the value drops instead of rising. That is the whole structure.

So for any `mid`, the break can live in `[lo..mid]` or in `[mid..hi]`, but not
both. Whichever half does **not** contain it is an ordinary sorted run, and
inside an ordinary sorted run I can tell by two comparisons whether the target
could possibly be in there.

## How to tell which half is sorted

One comparison:

```js
if (nums[lo] <= nums[mid]) {
  // [lo .. mid] is sorted
} else {
  // [mid .. hi] is sorted
}
```

Why that works: suppose the break *were* somewhere in `[lo..mid]`. Then going
from `lo` to `mid` the values would drop past it and start again from the
small end, so `nums[mid]` would be **less** than `nums[lo]`. It is not. So the
break is not in there, and `[lo..mid]` rises the whole way.

The `<=` rather than `<` is for the window where `lo === mid`, which happens
on every two-element step. A single element is trivially sorted, so it has to
land in the first branch.

## Then the range check

Once I know which half is sorted, I know its exact value range, so:

```js
// left half sorted, spanning nums[lo] .. nums[mid]
if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;   // inside, go left
else lo = mid + 1;                                            // not inside, go right
```

The asymmetric bounds (`<=` on the low side, `<` on the high side) are because
`nums[mid] === target` was already handled and returned at the top of the loop.
Including `mid` again would be harmless but it is cleaner to keep each index
owned by exactly one case.

Mirror image for the right half: `nums[mid] < target && target <= nums[hi]`.

## Dry run

`nums = [4,5,6,7,0,1,2]`, `target = 0`

| lo | hi | mid | nums[mid] | sorted half | target in it? | next        |
| -- | -- | --- | --------- | ----------- | ------------- | ----------- |
| 0  | 6  | 3   | 7         | left (4..7) | no (0 < 4)    | `lo = 4`    |
| 4  | 6  | 5   | 1         | left (0..1) | yes (0 < 1)   | `hi = 4`    |
| 4  | 4  | 4   | 0         | -           | -             | **return 4** |

For `target = 3` the same three steps run but the range check fails every
time, so `lo` marches past `hi` and the loop exits with `-1`.

## The bug

My first working-ish version checked the wrong side's bound:

```js
if (nums[lo] <= nums[mid]) {
  if (target < nums[mid]) hi = mid - 1;     // missing the lower bound
  else lo = mid + 1;
}
```

Without `nums[lo] <= target` this sends the search into the left half for any
target smaller than `nums[mid]`, including targets that are actually in the
rotated tail on the right. `search([4,5,6,7,0,1,2], 0)` returned `-1`: `0 < 7`
so it dove left into `[4,5,6]` and never came back out.

Both bounds are needed. The sorted half's range is a window, not a half-line,
*because the array wraps*. That is the one real difference from Day 011.

I also, separately, forgot `nums.length - 1` and wrote `hi = nums.length`,
which then read `nums[nums.length]` as `undefined` and made every comparison
`false`. Classic. The empty-array test catches it now.

## Complexity

- Time: `O(log n)`. One of the two halves is discarded every iteration, same as
  any binary search.
- Space: `O(1)`.

## Pattern to remember

Binary search does not need a globally sorted array. It needs a test at
`mid` that reliably eliminates one side. Here the test is "which half is
sorted, and is the target inside its range".

That reframing is the one that will matter later: the array property can be
"sorted", "monotone predicate", "peak-shaped", whatever, as long as `mid`
gives a definite direction.

## Follow-up to try

LeetCode 81 is the same problem with duplicates allowed, and I can already see
the problem: `nums[lo] === nums[mid]` no longer tells you which half is sorted,
so it degrades to `O(n)` in the worst case. 153 (Find Minimum in Rotated
Sorted Array) is the pivot search I avoided today, so I should go do that one
properly.
