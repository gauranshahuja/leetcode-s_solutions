# Day 123 - Trapping Rain Water

LeetCode 42 · Hard · Two pointers · Sunday, 1 November 2026 · ~70 min, 3 attempts

First day of the hard month. Getting *an* answer took 15 minutes, getting the
O(1)-space answer and being able to say why it is correct took the other 55.

## Problem

`height[i]` is a bar of width 1. It rains, water collects in the dips. Return
the total units of water.

```
height = [0,1,0,2,1,0,1,3,2,1,2,1]  ->  6
height = [4,2,0,3,2,5]              ->  9
```

## Where I started

My first instinct was to go looking for "dips": find a local minimum, walk out
left and right until the bars stop rising, compute the pool. That falls apart on
`[4,2,0,3,2,5]`, because the `3` in the middle is underwater as well. Water does
not come in separate pools you can find locally, it comes as one water line per
index.

So I threw that away and wrote the definition instead. For a single column `i`:

```
water[i] = min(tallest bar at or left of i, tallest bar at or right of i) - height[i]
```

Both maxima are taken **inclusive** of `i`, which is what makes the subtraction
never go negative. That is `trapNaive`, and it is `O(n^2)` because it rescans
both directions for every index.

## Killing the rescans

The two inner loops recompute the same prefix max and suffix max over and over.
Build them once:

- `maxLeft[i]` = running max going forward
- `maxRight[i]` = running max going backward

then one more pass summing `min(maxLeft[i], maxRight[i]) - height[i]`. That is
`trapPrefix`, `O(n)` time and `O(n)` space. Two months ago I would have stopped
here.

## Why the two-pointer version is allowed to work

This is the actual content of the day and it took me a while to be comfortable
with it rather than just memorising the code.

The formula only ever uses `min(maxLeft, maxRight)`. It never needs both numbers
on their own. So at any moment I do not have to know both sides, **I only have
to be certain about the smaller side**.

Setup: `lo` at the left end, `hi` at the right end, `leftMax` = tallest bar in
`[0..lo]`, `rightMax` = tallest bar in `[hi..n-1]`. Say `height[lo] < height[hi]`.
Then:

- `rightMax >= height[hi] > height[lo]`, and `rightMax` is an actual bar sitting
  somewhere to the right of `lo`.
- So the true right maximum for index `lo` is at least `height[hi]`, and
  therefore at least as tall as anything `leftMax` could be once I eventually
  learn the middle of the array.
- Hence `min(trueLeft(lo), trueRight(lo))` is simply `leftMax`, and I can settle
  `lo` right now, with zero knowledge about the bars in between.

That is the whole invariant: **the shorter side's water line is already known**,
because the taller side provides a bound that can only get better, never worse.
Settle that index, move that pointer inward, repeat. Mirror image when the right
bar is the shorter one.

Related to Day 035 (Container With Most Water) in shape, but the reasoning is
different. There I moved the shorter pointer because keeping it could never
improve the answer. Here I move it because its answer is already final. Same
gesture, different justification, and I conflated the two for ten minutes.

## Dry run

`height = [4,2,0,3,2,5]`, so the answer should be 9.

| lo | hi | height[lo] | height[hi] | shorter | leftMax | rightMax | adds | total |
| -- | -- | ---------- | ---------- | ------- | ------- | -------- | ---- | ----- |
| 0  | 5  | 4          | 5          | left    | 0 -> 4  | 0        | -    | 0     |
| 1  | 5  | 2          | 5          | left    | 4       | 0        | +2   | 2     |
| 2  | 5  | 0          | 5          | left    | 4       | 0        | +4   | 6     |
| 3  | 5  | 3          | 5          | left    | 4       | 0        | +1   | 7     |
| 4  | 5  | 2          | 5          | left    | 4       | 0        | +2   | 9     |
| 5  | 5  | -          | -          | stop    | 4       | 0        | -    | 9  |

`rightMax` never got touched on this input, which looked suspicious at first:
the side you never move is the side whose running max you never need.

## The bug

My first two-pointer attempt used `<=` the wrong way and updated the max
*after* adding water:

```js
total += leftMax - height[lo];   // before leftMax knows about height[lo]
leftMax = Math.max(leftMax, height[lo]);
```

On `[2,0,2]` the very first step then adds `0 - 2 = -2` and the total goes
negative. The order has to be: if this bar is a new maximum it holds no water
and becomes the new wall, otherwise it holds `leftMax - height[lo]`. Those two
cases are exclusive, which is why the code reads as `if/else` and not as two
statements.

## Complexity

| Version          | Time     | Space  |
| ---------------- | -------- | ------ |
| Per-index rescan | `O(n^2)` | `O(1)` |
| Prefix/suffix    | `O(n)`   | `O(n)` |
| Two pointers     | `O(n)`   | `O(1)` |

## Alternative approaches

A monotonic stack like Day 102's (Largest Rectangle in Histogram), but decreasing, also solves this: keep indices of bars in decreasing height, and when a taller
bar arrives, pop and settle the water trapped between the popped bar's
neighbours. `O(n)` time but `O(n)` space, so strictly worse here. Still worth
noticing that histogram-shaped problems keep reducing to the same stack. I did
not write it out, the two-pointer argument was the thing I wanted today.

## Note to self

When a formula uses `min(a, b)`, check whether you can get away with only ever
knowing which of the two is smaller. That is often the whole O(1)-space trick.
