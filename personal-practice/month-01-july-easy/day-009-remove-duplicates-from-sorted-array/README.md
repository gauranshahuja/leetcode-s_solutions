# Day 009 - Remove Duplicates from Sorted Array

LeetCode 26 · Easy · Two pointers, in-place · Friday, 10 July 2026 · ~12 min, 1 attempt

## Problem

`nums` is sorted ascending. Keep one copy of each distinct value at the front
of the array, in place, and return how many there are. Anything left in the
tail is ignored by the grader.

```
nums = [1, 1, 2]                      ->  k = 2, nums starts [1, 2]
nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] ->  k = 5, nums starts [0, 1, 2, 3, 4]
```

## Same shape as Day 006

I recognised this within about twenty seconds of reading it, which is a first.
Move Zeroes three days ago was: scan with `read`, pack the elements worth
keeping at `write`, and the pointer pair does the compaction. This is the
identical skeleton with a different keep test:

| | Day 006 | Day 009 |
| --- | --- | --- |
| keep when | `nums[read] !== 0` | `nums[read] !== nums[write - 1]` |
| after the scan | fill the tail with 0 | return `write` |
| `write` starts at | 0 | 1 |

That is the whole difference. The "keep" condition on Day 006 looked at the
element alone; here it compares against something already kept, which is why
`write` has to start at 1 (there must be a kept element to compare with) and
why `nums[0]` is kept for free.

## Why sorted matters

If the input were not sorted, "is this value new?" would need a set, like Day
003. Sorted means all the copies of a value sit in one run, so the only thing
I can collide with is the value immediately before me. One comparison
replaces the whole set.

## The approach

```
if the array is empty -> 0
write = 1
for read from 1 to end:
    if nums[read] !== nums[write - 1]:
        nums[write] = nums[read]
        write += 1
return write
```

`nums[write - 1]` is "the last value I decided to keep", which is the thing I
actually mean. I could compare against `nums[read - 1]` and it would pass,
because the scan never disturbs the slot directly behind `read`, but that is
leaning on a side effect of the index arithmetic rather than on the
invariant.

## Dry run

`nums = [0, 0, 1, 1, 1, 2]`

| read | nums[read] | write | nums[write-1] (last kept) | new? | array after      | write after |
| ---- | ---------- | ----- | ------------------------- | ---- | ---------------- | ----------- |
| 1    | 0          | 1     | 0                         | no   | `[0,0,1,1,1,2]`  | 1           |
| 2    | 1          | 1     | 0                         | yes  | `[0,1,1,1,1,2]`  | 2           |
| 3    | 1          | 2     | 1                         | no   | `[0,1,1,1,1,2]`  | 2           |
| 4    | 1          | 2     | 1                         | no   | `[0,1,1,1,1,2]`  | 2           |
| 5    | 2          | 2     | 1                         | yes  | `[0,1,2,1,1,2]`  | 3           |

Returns `3`, prefix is `[0, 1, 2]`. The junk at indices 3-5 is left alone
on purpose, which still feels like cheating but is exactly what the problem
asks for.

## Edge case that bit me

Not really a bite, more a thing I checked before running: the empty array.
`write` starting at 1 is a lie when there is no `nums[0]` to keep, and
`nums[write - 1]` would be `nums[0]` which is `undefined`. The loop body
never runs on an empty array, so it would actually return `1` for a
zero-length input, claiming one distinct value that does not exist.

LeetCode guarantees `nums.length >= 1` so it would never show up there, but
my own runner passes `[]`, so the guard is one line:

```js
if (nums.length === 0) return 0;
```

## Complexity

- Time: `O(n)`, one scan.
- Space: `O(1)`.

The naive version (`[...new Set(nums)]`) is also `O(n)` in time and would be
my choice in real code, but it allocates a whole new array and the problem
explicitly wants the original mutated.

## Note to self

Three in-place array problems in four days (006, 008, 009) and all three were
pointers rather than anything clever. Running list of the variants:

- `read` / `write` moving the same direction -> compaction (006, 009)
- `lo` / `hi` moving towards each other -> mirrored comparison (007)
- both starting at the back -> merging into spare room (008)
