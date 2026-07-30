# Day 029 - Rotate Array

LeetCode 189 · Easy · Array, triple reversal · Thursday, 30 July 2026 · ~35 min (the in-place part took most of it), 3 attempts

## Problem

Rotate the array right by `k` steps, in place.

```
[1,2,3,4,5,6,7], k = 3   ->  [5,6,7,1,2,3,4]
[-1,-100,3,99],  k = 2   ->  [3,99,-1,-100]
```

`k` is only promised to be non-negative, so it can be larger than the array.

## Where I started

Destination arithmetic into a second array. Element `i` lands at `(i + k) % n`:

```js
const copy = new Array(n);
for (let i = 0; i < n; i += 1) copy[(i + k) % n] = nums[i];
for (let i = 0; i < n; i += 1) nums[i] = copy[i];
```

Right answer, `O(n)` time, and honestly the version I would reach for if
nobody was watching. But the follow-up explicitly asks for `O(1)` extra space
and says there is a solution that uses it, so the copy is cheating. Kept it in
the file as `rotateCopy`.

I also tried the naive thing first: "rotate by 1, k times" with `pop()` +
`unshift()`. That is `O(n * k)` and `unshift` shifts the whole array every
single call, so with `k = 10^5` it crawls. Deleted it.

## What finally clicked

A right rotation by `k` just means *the last k elements move to the front*,
with both blocks keeping their internal order. Reversing the entire array
already puts the last `k` elements at the front - they are simply backwards,
and so is the other block. So reverse each block once more to repair it:

```
start            [1,2,3,4,5,6,7]     k = 3
reverse all      [7,6,5,4,3,2,1]
reverse [0..2]   [5,6,7,4,3,2,1]
reverse [3..6]   [5,6,7,1,2,3,4]     done
```

Three reversals, each one in place, two index variables total. Every element
is moved exactly twice, so it stays `O(n)`.

I would not have come up with this from scratch. I had the extra-array version
after 10 minutes, spent another 15 trying to do the cyclic-swap version
(following the chain `i -> (i+k)%n` and handling the multiple cycles when
`gcd(n,k) > 1`), got it half working and gave up on the bookkeeping. Read that
reversal was the usual approach, then worked out *why* on paper and coded it
myself. The cyclic version is the same complexity but I could not keep the
cycle count straight.

## The bug: forgetting `k %= n`

My first reversal version did not reduce `k` at all. With `nums = [1,2]` and
`k = 5`:

```js
reverse(nums, 0, n - 1);      // [2,1]
reverse(nums, 0, k - 1);      // reverse(nums, 0, 4) -> indices past the end
reverse(nums, k, n - 1);      // reverse(nums, 5, 1) -> lo > hi, does nothing
```

The second call reads `nums[2]`, `nums[3]`, `nums[4]` which are all
`undefined`, so it swaps real values out for `undefined`. The third call is a
no-op because `lo > hi`. Result was garbage.

Rotating by `n` is the same as not rotating, so `k %= n` is the only sane
first line. I also return early when it is 0, because then there is genuinely
nothing to do and `reverse(nums, 0, -1)` is a pointless pair of calls.

## Dry run

`[-1,-100,3,99]`, `k = 2`, `n = 4`, `shift = 2`

| step               | array                |
| ------------------ | -------------------- |
| start              | `[-1,-100,3,99]`     |
| reverse `[0..3]`   | `[99,3,-100,-1]`     |
| reverse `[0..1]`   | `[3,99,-100,-1]`     |
| reverse `[2..3]`   | `[3,99,-1,-100]`  |

## Complexity

| Version        | Time   | Space  |
| -------------- | ------ | ------ |
| pop + unshift  | `O(n*k)` | `O(1)` |
| Copy array     | `O(n)` | `O(n)` |
| Triple reverse | `O(n)` | `O(1)` |

## Pattern to remember

Reversal is a cheap way to move a block of an array without extra memory.
Reverse the whole thing, then reverse the pieces back.

Also, for anything taking a `k` that indexes around a cycle: **mod it by the
length before using it**. That bug would have hit me in a binary search or a
circular queue just as easily.

Two tests in the file exist only because of today: `k = 0` and `k > n`. Both
were bugs before they were tests.
