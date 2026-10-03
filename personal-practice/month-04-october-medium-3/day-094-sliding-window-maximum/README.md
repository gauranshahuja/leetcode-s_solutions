# Day 094 - Sliding Window Maximum

LeetCode 239 · Hard · Monotonic deque · Saturday, 3 October 2026 · ~55 min, 3 attempts

## Problem

A window of width `k` slides across `nums` one step at a time. Report the
maximum inside it at every position, so `n - k + 1` numbers out.

```
nums = [1,3,-1,-3,5,3,6,7], k = 3

[1  3  -1] -3  5  3  6  7   ->  3
 1 [3  -1  -3] 5  3  6  7   ->  3
 1  3 [-1  -3  5] 3  6  7   ->  5
 1  3  -1 [-3  5  3] 6  7   ->  5
 1  3  -1  -3 [5  3  6] 7   ->  6
 1  3  -1  -3  5 [3  6  7]  ->  7
```

## First instinct

Rescan each window: `O(n * k)`. For `n = 10^5` and `k = 10^5 / 2` that is
2.5 billion comparisons. Kept it as `maxSlidingWindowNaive` for the agreement
test and nothing else.

Second instinct was a max-heap, which I reached for because Day 047 (Daily
Temperatures) had already made me stack-shaped and I wanted something different.
More on why the heap loses below.

## The observation that makes it O(n)

If `j > i` and `nums[j] >= nums[i]`, then **index `i` is dead forever.** Any
future window that still contains `i` must also contain `j` (because `j` is to
the right and the window only moves right), and `j` is at least as big. So `i`
can never be an answer again.

Keep only the indices that survive that test and they are automatically in
**strictly decreasing value order**, front to back. The front of that sequence
is the maximum of the current window, for free.

## Indices, not values

I wrote the first version storing values and got stuck within a minute: when
the window advances, how do you know whether the value at the front *left* the
window? You cannot, because the position is exactly what you threw away.

So the deque holds indices and the value is always `nums[dq[head]]`. Two pops
with two different jobs:

| end   | condition                   | reason                       |
| ----- | --------------------------- | ---------------------------- |
| front | `dq[head] <= i - k`         | that index slid off the left |
| back  | `nums[dq[tail-1]] <= nums[i]` | dominated by the new element |

## Dry run

`nums = [1,3,-1,-3,5,3,6,7]`, `k = 3`. Deque shown as indices with their values.

| i | nums[i] | front evict | back evict      | deque after    | output |
| - | ------- | ----------- | --------------- | -------------- | ------ |
| 0 | 1       | -           | -               | `[0:1]`        | -      |
| 1 | 3       | -           | pops 0 (1<=3)   | `[1:3]`        | -      |
| 2 | -1      | -           | -               | `[1:3, 2:-1]`  | 3      |
| 3 | -3      | -           | -               | `[1:3,2:-1,3:-3]` | 3   |
| 4 | 5       | 1 is <= 1   | pops 3, 2       | `[4:5]`        | 5      |
| 5 | 3       | -           | -               | `[4:5, 5:3]`   | 5      |
| 6 | 6       | -           | pops 5, 4       | `[6:6]`        | 6      |
| 7 | 7       | -           | pops 6          | `[7:7]`        | 7   |

Row `i = 4` is the one worth staring at: the front eviction and the back
eviction both fire in the same step, for unrelated reasons.

## The bug that cost me attempt 2

I used a plain array and `shift()` for the front:

```js
while (dq.length && dq[0] <= i - k) dq.shift();   // O(n) per call
```

It gives the right answers, but `Array.prototype.shift()` has to reindex the
whole array, so it is `O(n)`. On a decreasing input like `[5,4,3,2,1]` the front
is evicted every single step and the "O(n)" solution is quietly `O(n^2)` again.
Same gotcha I hit on Day 063 using `shift()` as a queue head.

Fix: a flat `Int32Array` with `head` and `tail` indices. `head += 1` instead of
`shift()`, `tail -= 1` instead of `pop()`. Nothing is ever moved. Also meant I
had to stop writing `dq.length` and start writing `tail > head`, which is where
attempt 2 broke before I was done converting it.

## Why not a heap

A max-heap of `[value, index]` pairs also works: push each element, and before
reading the top, pop while `top.index <= i - k` (lazy deletion). That is
`O(n log k)` and about the same amount of code.

The deque is better because:

- every element enters and leaves exactly once, so `O(n)` with a tiny constant
- the dominance rule throws elements away *permanently*, where the heap keeps
  stale entries alive until they happen to reach the top
- no comparator, no `PriorityQueue` import

`O(n log k)` is fine for the LeetCode limits, so this is a "both pass" situation
rather than a correctness one. But the deque is the one that actually
understands the problem.

## Complexity

| Version          | Time         | Space  |
| ---------------- | ------------ | ------ |
| Rescan window    | `O(n * k)`   | `O(1)` |
| Max-heap, lazy   | `O(n log k)` | `O(n)` |
| Monotonic deque  | `O(n)`       | `O(k)` |

The `O(n)` claim is amortised: the inner `while` can pop many elements in one
step, but each index is popped at most once across the entire run, so the total
pop count is bounded by `n`.

## Takeaway

"Later and not smaller means the earlier one is dead" is the monotonic-deque
trigger. When it holds, the structure maintains itself and the answer is
always sitting at one end.

Day 047 was the stack version of this idea (next greater element). This is the
same idea with an expiry date attached, which is why it needs both ends.
