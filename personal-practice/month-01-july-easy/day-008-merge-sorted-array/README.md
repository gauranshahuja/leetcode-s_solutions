# Day 008 - Merge Sorted Array

LeetCode 88 · Easy · Two pointers from the back · Thursday, 9 July 2026 · ~28 min, 3 attempts

## Problem

`nums1` has length `m + n`: `m` sorted values, then `n` zeros acting as spare
room. `nums2` has `n` sorted values. Merge them so `nums1` is sorted, in
place.

```
nums1 = [1, 2, 3, 0, 0, 0], m = 3
nums2 = [2, 5, 6],          n = 3
->      [1, 2, 2, 3, 5, 6]

nums1 = [0], m = 0
nums2 = [1], n = 1
->      [1]
```

The `0`s are not data. They are empty space that happens to be printed as
zeros, which confused me for the first minute.

## The forward attempt that overwrites

Of course I started at the front, because that is what merging two sorted
lists looks like in every example I have seen:

```js
let i = 0, j = 0, write = 0;
while (i < m && j < n) {
  if (nums1[i] <= nums2[j]) nums1[write++] = nums1[i++];
  else                      nums1[write++] = nums2[j++];
}
```

Run that on the first example and watch it eat itself:

| step | compare        | write to    | nums1 after      | problem |
| ---- | -------------- | ----------- | ---------------- | ------- |
| 1    | 1 vs 2         | index 0 = 1 | `[1,2,3,0,0,0]`  | fine, no-op |
| 2    | 2 vs 2         | index 1 = 2 | `[1,2,3,0,0,0]`  | fine, no-op |
| 3    | 3 vs 2         | index 2 = 2 | `[1,2,2,0,0,0]`  | **the 3 is gone** |

At step 3 the value from `nums2` has to go at index 2, but index 2 is holding
a `3` that has not been merged yet. The write pointer catches up with the read
pointer and clobbers it. Compare that with Day 006, where `write` could never
pass `read` because it only advanced on a kept element; here the writes come
from *two* sources, so it advances faster than `i` does.

The usual fix is to copy the first `m` values of `nums1` somewhere safe first.
That works and is `O(m)` extra space, and the problem specifically wants
`O(1)`.

## Filling from the back

The thing I was not seeing: **the free space is at the end.** So fill from the
end. Compare the two largest unmerged values, put the bigger one in the last
unfilled slot, step that pointer back.

```
i     -> m - 1       last real value of nums1
j     -> n - 1       last value of nums2
write -> m + n - 1   last slot overall
```

Now overwriting is structurally impossible. At the start there are `n`
placeholder slots sitting between `i` and `write`. Every iteration moves
`write` one step left and moves exactly one of `i` or `j` one step left, so
the gap `write - i` only shrinks when the value came from `nums2`, and it
shrinks exactly `n` times in total. So `write >= i` holds the entire time,
and when `write === i` the only thing being overwritten is the value being
copied out of that same slot.

## Dry run

`nums1 = [1, 2, 3, 0, 0, 0]`, `m = 3`, `nums2 = [2, 5, 6]`, `n = 3`

| i | j | write | compare    | winner | nums1 after        |
| - | - | ----- | ---------- | ------ | ------------------ |
| 2 | 2 | 5     | 3 vs 6     | nums2  | `[1,2,3,0,0,6]`    |
| 2 | 1 | 4     | 3 vs 5     | nums2  | `[1,2,3,0,5,6]`    |
| 2 | 0 | 3     | 3 vs 2     | nums1  | `[1,2,3,3,5,6]`    |
| 1 | 0 | 2     | 2 vs 2     | nums2  | `[1,2,2,3,5,6]`    |
| 1 | -1| 1     | j exhausted, stop | - | `[1,2,2,3,5,6]` |

Row 3 is the interesting one: it writes a `3` into index 3 while the original
`3` is still sitting at index 2, so for one step the array holds two of them.
Row 4 then overwrites index 2 with the `2` from `nums2`. Every stale copy is
either paved over later or already the value that belongs there.

## Where I got stuck

Which pointers the loop should test. I first wrote:

```js
while (i >= 0 && j >= 0) { ... }
```

and then needed a second loop afterwards to drain whichever array still had
values left. That is correct but one of the two drains is pure waste: if
`nums2` runs out first, the remaining `nums1` values are **already in their
final positions**, because nothing has been written over them. Copying them
onto themselves is harmless but pointless.

So the loop condition is just `while (j >= 0)`, with `i >= 0` moved into the
comparison to handle `nums1` running out first:

```js
if (i >= 0 && nums1[i] > nums2[j])
```

Without that `i >= 0` guard, `nums1[-1]` is `undefined` and `undefined > 2`
is `false`, so it would take the `nums2` branch anyway and accidentally work.
I am not relying on an accident.

## Complexity

- Time: `O(m + n)`, every value is placed once.
- Space: `O(1)`.

## Pattern to remember

When a problem says "in place" and the spare room is at the end, write
backwards. The direction of the fill is what makes the overwrite problem
disappear.
