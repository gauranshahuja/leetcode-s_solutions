# Day 006 - Move Zeroes

LeetCode 283 · Easy · Two pointers, in-place · Tuesday, 7 July 2026 · ~15 min, 2 attempts

## Problem

Move all the `0`s to the end of `nums`, keep the non-zero elements in their
original relative order, and do it **in place**.

```
[0, 1, 0, 3, 12]  ->  [1, 3, 12, 0, 0]
[0]               ->  [0]
```

"In place" is the actual constraint. Building a filtered array and a zeros
array and concatenating them takes about four seconds to write and is not an
answer to this question.

## First instinct

Delete each zero and push it on the end:

```js
for (let i = 0; i < nums.length; i += 1) {
  if (nums[i] === 0) {
    nums.splice(i, 1);
    nums.push(0);
  }
}
```

Two things wrong with it, and I only spotted the second one after running it.

1. **It skips elements.** `splice` shifts everything left, so the element that
   was at `i+1` is now at `i`, and then `i += 1` steps right over it. On
   `[0, 0, 1]` the first `splice` makes the array `[0, 1, 0]`, `i` moves to 1,
   and the second zero never gets looked at. Result `[0, 1, 0]`, wrong.
2. **It never ends cleanly.** The zero I pushed is now sitting at the end of
   the same array I am still walking through, so the loop can find it again
   and move it again. Mutating a thing while iterating it is a trap I should
   now recognise on sight.

`splice` is also `O(n)` per call, which makes the whole thing `O(n^2)` even
when it works.

## The approach that works

Stop deleting. **Overwrite** instead, with two indices:

- `read` visits every slot in turn
- `write` is where the next non-zero element should land

Every time `read` finds a non-zero, copy it to `write` and bump `write`. When
the scan finishes, `write` is exactly the number of non-zero elements, so
every slot from `write` to the end gets filled with `0`.

The reason this is safe: `write <= read` always, because `write` only advances
on iterations where `read` also advances. So I am only ever writing into a
slot I have already read. Nothing gets lost even when `write === read` and
the copy is a no-op.

## Dry run

`nums = [0, 1, 0, 3, 12]`

| read | nums[read] | write before | array after the step | write after |
| ---- | ---------- | ------------ | -------------------- | ----------- |
| 0    | 0          | 0            | `[0, 1, 0, 3, 12]`   | 0           |
| 1    | 1          | 0            | `[1, 1, 0, 3, 12]`   | 1           |
| 2    | 0          | 1            | `[1, 1, 0, 3, 12]`   | 1           |
| 3    | 3          | 1            | `[1, 3, 0, 3, 12]`   | 2           |
| 4    | 12         | 2            | `[1, 3, 12, 3, 12]`  | 3           |

Then the tail fill from index 3: `[1, 3, 12, 0, 0]`

The middle of the array looks like garbage during the scan (`[1, 3, 12, 3, 12]`
has duplicates in it) and that bothered me until I checked that the leftover
junk is always at or past `write`, so the fill loop paves over all of it.

## Variation I decided not to use

The other standard version swaps instead of copying:

```js
if (nums[read] !== 0) {
  [nums[write], nums[read]] = [nums[read], nums[write]];
  write += 1;
}
```

Same complexity and it needs no second loop, because the zeros get swapped
backwards as it goes. I went with copy-then-fill because the invariant
("everything before `write` is final") is easier for me to state out loud,
and the swap does pointless work when the array has no zeroes at all.

## Complexity

- Time: `O(n)`, each slot is read once and written at most once.
- Space: `O(1)`, no new array.

Against the `splice` version's `O(n^2)` that is the real win.

## Note to self

My `moveZeroes` returns `nums` even though the problem says return nothing.
That is purely so `test(...)` can see the result. The important bit is that
it edits the array it was handed, and I added a test that calls it on a
variable and then checks that **variable** afterwards, so a sneaky
`nums = nums.filter(...)` inside the function could not pass.

Pointer pair to remember: `read` scans, `write` packs. Whenever a problem
says "remove / compact / keep the order, in place", this is the shape.
