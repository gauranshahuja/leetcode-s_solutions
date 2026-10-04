# Day 095 - Count Number of Nice Subarrays

LeetCode 1248 · Medium · Sliding window, at-most trick · Sunday, 4 October 2026 · ~30 min, 2 attempts

Easier than the last two days, and worth it for one reframing I want written
down properly, because I am fairly sure it is going to keep showing up.

## Problem

Count the subarrays of `nums` containing **exactly** `k` odd numbers.

```
nums = [1,1,2,1,1], k = 3

[1,1,2,1]     odds: 1,1,1  -> nice
[1,1,2,1,1]   odds: 1,1,1,1 -> 4 odds, not nice
  [1,2,1,1]   odds: 1,1,1  -> nice

answer: 2
```

```
nums = [2,2,2,1,2,2,1,2,2,2], k = 2   ->  16
```

That second one is the example that shows what the problem is really about: the
two odd numbers are fixed, so all 16 answers come from how much even padding you
can take on each side. 4 choices on the left times 4 on the right.

## Where I got stuck for ten minutes

I tried to write it as one window maintaining "exactly `k` odds" and it does not
work. The window has to be able to *repair* itself by shrinking, and:

- too many odds -> shrinking from the left fixes it
- too **few** odds -> shrinking only makes it worse

So "exactly k" is not a shrinkable condition and a single two-pointer window
cannot hold it. I spent a while trying to bolt a second counter on before
stopping to think.

## The reframing

```
exactly(k) = atMost(k) - atMost(k - 1)
```

`atMost(k)` *is* shrinkable, so it is a textbook window. Subtract the count for
`k-1` and what survives is exactly the subarrays with `k` odds, because every
subarray with at most `k` odds either has fewer than `k` (counted in both terms,
cancels) or exactly `k` (counted only in the first).

Two `O(n)` passes, still `O(n)` overall, and `atMostKOdd` is 15 lines I can
write without thinking.

## The counting line

Inside `atMostKOdd`, once `left` has been pushed far enough right that the
window `[left, right]` has at most `k` odds:

```js
total += right - left + 1;
```

Every start position from `left` to `right` gives a valid subarray ending at
`right`, and there are `right - left + 1` of them. No inner loop. The first
time I saw this (Day 065) I did not believe it; now it is the line I look for.

## Dry run

`nums = [1,1,2,1,1]`, `k = 3`.

`atMost(3)`:

| right | nums[r] | odd | left after shrink | adds | total |
| ----- | ------- | --- | ----------------- | ---- | ----- |
| 0     | 1       | 1   | 0                 | 1    | 1     |
| 1     | 1       | 2   | 0                 | 2    | 3     |
| 2     | 2       | 2   | 0                 | 3    | 6     |
| 3     | 1       | 3   | 0                 | 4    | 10    |
| 4     | 1       | 4 -> 3 | 1              | 4    | 14    |

`atMost(2)`:

| right | odd | left after shrink | adds | total |
| ----- | --- | ----------------- | ---- | ----- |
| 0     | 1   | 0                 | 1    | 1     |
| 1     | 2   | 0                 | 2    | 3     |
| 2     | 2   | 0                 | 3    | 6     |
| 3     | 3 -> 2 | 1              | 3    | 9     |
| 4     | 3 -> 2 | 2              | 3    | 12    |

`14 - 12 = 2`

## Small JS note

I used `nums[right] & 1` rather than `nums[right] % 2 === 1`. For the given
constraints (`1 <= nums[i] <= 10^5`) they are identical, but `%` keeps the sign
in JS, so `-3 % 2` is `-1` and the `=== 1` test silently fails on negative odd
numbers. `(-3) & 1` is `1`. Costs nothing to get it right by default.

Also nice: `odd += nums[right] & 1` works as both the test and the increment,
no `if` needed.

## Complexity

- Time: `O(n)`. Two passes of a window where each pointer only moves forward.
- Space: `O(1)`. Three integers.

## Pattern to remember

`exactly(k) = atMost(k) - atMost(k-1)`. When the condition you want is an
equality, and the "at most" version is shrinkable, count twice and subtract.

This generalises far beyond odd numbers. Same move works for:

- Subarrays with exactly `k` distinct integers (LeetCode 992)
- Subarrays with exactly `k` zeros / `k` of any property
- Anything where you can only maintain a monotone bound, not an equality

The pattern is: **find the monotone relaxation of your condition, count that,
and difference it.** I expect to use this more than any other counting trick.
