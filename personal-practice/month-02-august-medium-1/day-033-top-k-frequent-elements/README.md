# Day 033 - Top K Frequent Elements

LeetCode 347 · Medium · Counting plus bucket sort · Monday, 3 August 2026 · ~40 min, 2 attempts

## Problem

Return the `k` most frequent values. Any order. The answer is guaranteed
unique, so there is never a tie sitting exactly on the `k`-th slot.

```
nums = [1,1,1,2,2,3], k = 2  ->  [1,2]
nums = [1],           k = 1  ->  [1]
```

## Step one is last month

Count with a `Map`. That part I did not have to think about at all, it is the
same counting pass as Day 003 and Day 004:

```js
counts.set(n, (counts.get(n) || 0) + 1);
```

The interesting half is what to do with the counts once I have them.

## First working version, then the better one

The obvious thing is to sort the map entries by count and slice `k`:

```js
return [...counts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, k)
  .map((e) => e[0]);
```

That is accepted and I would ship it in real code. But it is `O(d log d)` where
`d` is the number of distinct values, and the problem is clearly hinting at
better than `O(n log n)`.

## The insight: the sort key is bounded

A frequency cannot be bigger than `n`. Anything with a small bounded integer
key does not need comparison sorting, it needs **indexing**. So:

```
buckets[f] = list of values that appear exactly f times
```

Build that in one pass over the map, then walk `buckets` from the high end
down, collecting until I have `k` values. Highest frequencies come out first by
construction. No comparisons anywhere.

## Dry run

`nums = [1,1,1,2,2,3]`, `k = 2`, so `n = 6`.

Counts: `1 -> 3`, `2 -> 2`, `3 -> 1`

Buckets (7 slots, index 0..6):

| index | 0  | 1   | 2   | 3   | 4  | 5  | 6  |
| ----- | -- | --- | --- | --- | -- | -- | -- |
| holds | [] | [3] | [2] | [1] | [] | [] | [] |

Sweep down from 6:

| freq | bucket | out     |
| ---- | ------ | ------- |
| 6..4 | empty  | []      |
| 3    | [1]    | [1]     |
| 2    | [2]    | [1,2] full, stop |

## The bug

I sized the buckets array as `nums.length`:

```js
const buckets = Array.from({ length: nums.length }, () => []);
```

Looks right, feels right, and then `[5,5,5,5,5]` throws because the count is
`5` and the last valid index is `4`. A frequency can be exactly `n`, so I need
`n + 1` slots. Index `0` then sits there unused, which bothered me for a second
until I accepted that one wasted array slot is the price of not writing
`freq - 1` everywhere. I added that exact case as a test.

Second thing I checked on purpose: `[0,0,0,1,1,2]`. If I had written
`counts[n] = counts[n] || 0` on a plain object with `0` as a key it would still
work, but I wanted a test pinning down that a value of `0` is treated as a
value and not as "missing".

## Why not a heap?

A min-heap of size `k` is the textbook answer here and I have `PriorityQueue`
sitting in `lib/structures.js`, so it would have been easy. Push each
`[value, count]`, pop when the heap exceeds `k`. That is `O(d log k)`.

Buckets win for two reasons:

1. `O(n)` beats `O(d log k)` when `d` is close to `n`.
2. Heap code here needs a custom comparator and a pop-when-too-big rule, and I
   would have had to double check whether my `PriorityQueue` is a min-heap by
   default. The bucket version has no comparator at all.

The heap would win if `k` were tiny and the values streamed in without being
countable up front. That is a different problem (and I suspect I will meet it
later as "k largest in a stream").

## Complexity

| Approach     | Time         | Space  |
| ------------ | ------------ | ------ |
| sort entries | `O(d log d)` | `O(d)` |
| min-heap     | `O(d log k)` | `O(k)` |
| buckets      | `O(n)`       | `O(n)` |

## Pattern to remember

If the thing you want to sort by is an integer with a known small range,
do not sort. Make an array indexed by it.

That is counting sort wearing a different hat, and "frequency" is always
bounded by the input size, so this trick is available on basically every
top-k-by-count problem.
