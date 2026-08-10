# Day 040 - Find First and Last Position of Element in Sorted Array

LeetCode 34 · Medium · Binary search bounds · Monday, 10 August 2026 · ~30 min, 2 attempts

Day 039 was binary search with the array shape fighting me. This one is binary
search where the array is perfectly ordinary and the *question* is the twist.

## Problem

Sorted array with possible repeats. Return `[firstIndex, lastIndex]` of
`target`, or `[-1, -1]`.

```
[5,7,7,8,8,10], target 8  ->  [3,4]
[5,7,7,8,8,10], target 6  ->  [-1,-1]
[],             target 0  ->  [-1,-1]
```

## The trap in the obvious approach

Plain binary search finds *some* index holding the target, then expand left and
right while the neighbours are equal. Works, reads fine, and is `O(n)` in the
worst case: `[2,2,2,2,2,...]` with `target = 2` makes the expansion walk the
entire array. The required bound is `O(log n)`, so the search itself has to
land on the edge of the block.

## What I actually needed was Day 012 again

Day 012 (Search Insert Position) computed "the index where `target` should go",
which is the first index whose value is `>= target`. That is `lowerBound`. At
the time I treated it as the answer to that specific problem. It is really a
**primitive**, and almost every "find the boundary" question is one or two
calls to it:

```js
function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;              // exclusive
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;                   // mid is still a candidate
  }
  return lo;
}
```

Then:

```js
first = lowerBound(nums, target);
last  = lowerBound(nums, target + 1) - 1;
```

`lowerBound(target)` is the first index `>= target`, so if the target exists
that index *is* the first occurrence. `lowerBound(target + 1)` is the first
index `>= target + 1`, which for integers is the first index strictly greater
than `target`, so one less than that is the last occurrence.

One helper, two calls, no duplicated loop. My first version had two
near-identical 12-line binary searches with three flipped comparisons between
them and I could not keep them straight in my head.

## The three details that make `lowerBound` correct

These are the bits I got wrong before and want written down:

1. **`hi = nums.length`, exclusive.** Starting at `length - 1` makes the
   "target is bigger than everything" answer unrepresentable, since the correct
   return is `length`.
2. **`while (lo < hi)`, not `lo <= hi`.** The range is half-open, so `lo === hi`
   means empty and the search is finished. With `<=` it loops forever once
   `hi = mid` and `mid === lo`.
3. **`hi = mid`, not `hi = mid - 1`.** When `nums[mid] >= target`, `mid` itself
   is a possible answer. Dropping it with `mid - 1` is how you get an
   off-by-one that only shows up when the answer is at the block's left edge.

## Dry run

`nums = [5,7,7,8,8,10]`, `target = 8`

`lowerBound(nums, 8)`:

| lo | hi | mid | nums[mid] | `< 8`? | action     |
| -- | -- | --- | --------- | ------ | ---------- |
| 0  | 6  | 3   | 8         | no     | `hi = 3`   |
| 0  | 3  | 1   | 7         | yes    | `lo = 2`   |
| 2  | 3  | 2   | 7         | yes    | `lo = 3`   |
| 3  | 3  | -   | -         | -      | return **3** |

`lowerBound(nums, 9)` runs the same way and returns **5**, the index of the
`10`, since that is the first value not below 9.

So the answer is `[3, 5 - 1] = [3, 4]`

## The "not found" check

`first` can be `nums.length` (everything was smaller), which would make
`nums[first]` read `undefined`. So the guard has to test the length **before**
indexing:

```js
if (first === nums.length || nums[first] !== target) return [-1, -1];
```

The second half catches the `target = 6` case: `lowerBound` returns 1, which
holds `7`, so 6 is simply absent. `lowerBound` always returns a valid insertion
point, never a promise that the value is there. Easy to forget.

## Honest caveat on `target + 1`

It depends on the values being integers. For floats, `target + 1` would skip
over any value strictly between `target` and `target + 1`, and for strings
`+ 1` is nonsense (and would do string concatenation, which in JS would
silently "work" and be wrong). The general fix is a second helper where the
only change is `<` becoming `<=`:

```js
if (nums[mid] <= target) lo = mid + 1; else hi = mid;   // upperBound
```

LeetCode 34 guarantees integers, so I kept the one-helper version and left this
note instead.

## Complexity

- Time: `O(log n)`, two independent binary searches.
- Space: `O(1)`.

## Pattern to remember

Do not write a binary search that looks for a value. Write one that looks for
a boundary (`lowerBound`), and get the value questions out of it by
calling it with `target` and `target + 1`.

That single primitive covers: insert position, count of occurrences
(`upper - lower`), first/last index, and "number of elements less than x".
