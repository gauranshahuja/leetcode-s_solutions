# Day 065 - Max Consecutive Ones III

LeetCode 1004 · Medium · Sliding window with a budget · Friday, 4 September 2026 · ~20 min, 1 attempt

Fast one. Third month is starting to feel different: I recognised the template
before I finished reading the problem statement.

## Problem

Binary array `nums`, integer `k`. Flip at most `k` zeros to ones. Longest run
of consecutive ones afterwards?

```
nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2  ->  6
nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3  ->  10
```

## Reframe first, code second

The word "flip" is a distraction. Nothing in the answer depends on *which*
zeros get flipped or on the array being modified. If I pick any window and it
contains `z` zeros, I can turn that window into all ones exactly when
`z <= k`. So:

longest subarray containing at most `k` zeros

which is the variable-size window template from Day 063 with a constraint that
costs one comparison instead of 26.

```js
if (nums[right] === 0) zeros++;
while (zeros > k) { if (nums[left] === 0) zeros--; left++; }
best = Math.max(best, right - left + 1);
```

That is the whole solution. "At most k of something" is turning out to be the
most common window constraint there is: Day 034 was "at most 0 duplicates",
Day 063 was "at most k characters that are not the majority one", this is
"at most k zeros".

## `while`, not `if` - and why that differs from Day 063

Yesterday-ish I shrank the window by a single step and never lowered
`maxCount`, because the recorded length was still provably achievable even
when the live window was illegal. That trick does not transfer here, and it
also is not needed.

Not needed, because `zeros <= k` is an exact test that costs nothing to
maintain, so there is no reason to let it drift.

Does not transfer, because one step is not enough to restore legality anyway.
If the left element is a `1`, dropping it shrinks the window but leaves
`zeros` exactly where it was, so the window is still illegal. I have to keep
walking left forward until I actually throw away a zero. Hence `while`.

The cost is still O(n): `left` never moves backwards, so across the whole run
it advances at most `n` times in total, however they are distributed between
iterations.

## Dry run

`nums = [1,1,1,0,0,0,1,1,1,1,0]`, `k = 2`

| r  | nums[r] | zeros after | shrink?                  | left | window len | best |
| -- | ------- | ----------- | ------------------------ | ---- | ---------- | ---- |
| 0  | 1       | 0           | no                       | 0    | 1          | 1    |
| 1  | 1       | 0           | no                       | 0    | 2          | 2    |
| 2  | 1       | 0           | no                       | 0    | 3          | 3    |
| 3  | 0       | 1           | no                       | 0    | 4          | 4    |
| 4  | 0       | 2           | no                       | 0    | 5          | 5    |
| 5  | 0       | 3           | yes, walk past 1,1,1,0   | 4    | 2          | 5    |
| 6  | 1       | 2           | no                       | 4    | 3          | 5    |
| 7  | 1       | 2           | no                       | 4    | 4          | 5    |
| 8  | 1       | 2           | no                       | 4    | 5          | 5    |
| 9  | 1       | 2           | no                       | 4    | 6          | 6 |
| 10 | 0       | 3           | yes, walk past 0         | 5    | 6          | 6    |

The answer 6 is the window `[0,0,1,1,1,1]` starting at index 4: two zeros
flipped, four ones already there.

Worth noticing row 5: the `while` ran four times in one iteration. That is the
part that makes the `if` version wrong here and the amortised argument
necessary.

## Edge cases I checked on purpose

- `k = 0`. Degenerates into "longest existing run of ones", which the same
  code handles with no special case.
- All zeros with `k = 2` gives 2, not 0. The window of two flipped zeros is a
  legitimate answer.
- `k` larger than the number of zeros gives the whole array. Nothing clamps
  `k`, nothing needs to.

## Complexity

- Time `O(n)`
- Space `O(1)`

## Pattern to remember

Three days in a row of windows now, and the shape is always the same four
lines: admit the right element, repair the constraint, measure, record. All the
difficulty in these problems lives in two decisions - what counts as "legal",
and whether repairing takes one step or many.
