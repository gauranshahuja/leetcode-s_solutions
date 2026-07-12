# Day 011 - Binary Search

LeetCode 704 · Easy · Binary search · Sunday, 12 July 2026 · ~20 min, 3 attempts

## Problem

Sorted ascending, no duplicates. Return the index of `target`, or `-1`.
Required to run in `O(log n)`.

```
nums = [-1, 0, 3, 5, 9, 12], target = 9  ->  4
nums = [-1, 0, 3, 5, 9, 12], target = 2  ->  -1
```

I have known what binary search *is* for years. Writing it from a blank file
turned out to be a different thing, and the two bugs below are apparently the
two everybody gets.

## The shape

A window `[lo, hi]` with **both ends inclusive**, holding every index that
could still be the answer. Look at the middle:

- `nums[mid] === target` -> done
- `nums[mid] < target` -> the answer is strictly right of `mid`, so `lo = mid + 1`
- otherwise -> strictly left, so `hi = mid - 1`

Each round halves the window, so 10^4 elements take about 14 comparisons.

## The boundary I got wrong

First version used `<`:

```js
while (lo < hi) {        // wrong for an inclusive window
```

It passed the first example and then failed `search([5], 5)`, returning `-1`
for an array whose only element *is* the target. With `lo = hi = 0` the window
still contains exactly one live candidate, index 0, but `lo < hi` is already
false so the body never runs and that candidate is never checked.

The rule I wrote down to stop guessing at this: **the loop condition has to
match how the window is defined.**

| window        | empty when  | loop while     |
| ------------- | ----------- | -------------- |
| `[lo, hi]` both inclusive | `lo > hi` | `lo <= hi` |
| `[lo, hi)` hi exclusive   | `lo === hi` | `lo < hi`  |

I am using inclusive (`hi = nums.length - 1`), so it is `<=`. Pick one
convention and keep it, because mixing them is where the off-by-one lives.

Nice side effect: with an empty array `hi` starts at `-1`, `0 <= -1` is false,
and `-1` falls out without a special case.

## The other bug: not moving past mid

Second version:

```js
if (nums[mid] < target) lo = mid;     // wrong
else hi = mid;
```

Infinite loop. On a two-element window, `mid` lands on `lo`, and setting
`lo = mid` changes nothing, so the same `mid` gets tested forever. `mid` has
already been compared and is known not to be the target, so it must be
excluded: `mid + 1` and `mid - 1`. That exclusion is also what guarantees the
window shrinks every iteration.

## The midpoint

I wrote `(lo + hi) / 2` first and it is wrong in JS for a reason that has
nothing to do with overflow:

```js
const mid = (0 + 1) / 2;   // 0.5
nums[0.5]                  // undefined
```

JS does not do integer division, so this needs an explicit floor. And the
version I want to make a habit of is:

```js
const mid = lo + ((hi - lo) >> 1);
```

Two things in one line. `hi - lo` is the gap, so the sum `lo + hi` is never
formed at all, which is the thing that overflows a 32-bit int in C or Java.
And `>> 1` is an integer halving, so no `Math.floor` needed.

Honest note: JS numbers are doubles, so `lo + hi` would not actually
overflow at any array length that can exist. Here the `>>` is really just
doing the flooring, and the `lo + (gap >> 1)` form is muscle memory I would
rather build now than relearn in a language where it matters. The flip side
is that `>>` coerces to a signed 32-bit int, so it is not unconditionally
safe either, just safe for any array I will ever have.

## Dry run

`nums = [-1, 0, 3, 5, 9, 12]`, `target = 9`

| lo | hi | mid | nums[mid] | compare      | next window |
| -- | -- | --- | --------- | ------------ | ----------- |
| 0  | 5  | 2   | 3         | 3 < 9, go right | `[3, 5]`  |
| 3  | 5  | 4   | 9         | match        | return `4` |

And a miss, `target = 2`:

| lo | hi | mid | nums[mid] | compare      | next window |
| -- | -- | --- | --------- | ------------ | ----------- |
| 0  | 5  | 2   | 3         | 3 > 2, go left | `[0, 1]`  |
| 0  | 1  | 0   | -1        | -1 < 2, go right | `[1, 1]` |
| 1  | 1  | 1   | 0         | 0 < 2, go right | `[2, 1]` |

`lo = 2 > hi = 1`, window empty, return `-1`. The third row is the one the
`<` version would have skipped.

## Complexity

- Time: `O(log n)`.
- Space: `O(1)`, iterative. The recursive version is `O(log n)` stack.

## Note to self

Two questions to answer before writing the loop, every time:

1. Is `hi` inclusive or exclusive? That fixes the loop condition.
2. Can `mid` stay in the next window? For plain search, no, so always
   `mid + 1` / `mid - 1`.

Getting those two right up front would have saved both bugs.
