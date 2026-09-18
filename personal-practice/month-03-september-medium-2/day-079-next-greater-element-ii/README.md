# Day 079 - Next Greater Element II

LeetCode 503 · Medium · Monotonic stack, circular array · Friday, 18 September 2026 · ~25 min, 2 attempts

## Problem

Same as "next greater element" but the array is circular: after the last index
the search continues at index 0. Strictly greater. No answer -> -1.

```
[1, 2, 1]        ->  [2, -1, 2]        the last 1 wraps round to the 2
[5, 4, 3, 2, 1]  ->  [-1, 5, 5, 5, 5]  everything wraps to the max
[1, 1, 1]        ->  [-1, -1, -1]      equal is not greater
```

## Starting point: Day 047 with one change

Daily Temperatures is this problem without the wrap, and I still had the shape
in my head: a stack of indices whose answer is pending, values non-increasing
from bottom to top. A new value pops and answers everything smaller than it.

The only new thing is the wrap, and the trick for that is simply to **walk the
array twice**:

```js
for (let step = 0; step < 2 * n; step += 1) {
  const i = step % n;
  ...
}
```

`i = step % n` is the same as writing the array out twice and running the
ordinary algorithm over `[1,2,1,1,2,1]`. Any element that had nothing greater
to its right in the first copy gets a second chance against everything in the
second copy, which is exactly "wrap around". And anything still unanswered
after `2n` steps has nothing greater anywhere in the array, so its -1 is final.

## The push guard

```js
if (step < n) stack.push(i);
```

The second lap answers questions, it does not ask them. Every index already
went onto the stack during the first lap, so pushing again in the second lap
means the same index can be answered twice.

I assumed that would produce *wrong* answers and nearly wrote a comment saying
so, then actually checked: because the second lap sees the identical sequence,
the re-answer is always the same value as the first answer. So pushing on both
laps is only wasted work, not a wrong result. (I threw a few thousand random
arrays at both versions to be sure - identical output every time.) The guard
stays because `n` pointless pushes and the pops that follow them are real work,
and because "the second lap only resolves leftovers" is the sentence that
explains the algorithm.

## The bug

Attempt 1 doubled the loop bound and forgot the modulo:

```js
for (let i = 0; i < 2 * n; i += 1) {
  while (stack.length && nums[stack[stack.length - 1]] < nums[i]) res[stack.pop()] = nums[i];
  if (i < n) stack.push(i);
}
```

`nums[3]` on a length-3 array is `undefined`, and `2 < undefined` is `false`
(not a type error, not a throw - just quietly false, because the comparison
coerces to `NaN`). So the second lap did nothing at all and I got

```
[1,2,1]  ->  [2, -1, -1]      instead of  [2, -1, 2]
```

A silent wrong answer rather than a crash, which is the annoying kind. If the
comparison had been `>` instead of `<` it would have been equally false and I'd
have been just as confused. Lesson: when a loop runs past `length`, JS will not
tell me - I have to spot it.

## Dry run

`nums = [1, 2, 1]`, so `2n = 6` steps. `res` starts `[-1, -1, -1]`.

| step | i | nums[i] | stack before | pops / answers        | stack after | push? |
| ---- | - | ------- | ------------ | --------------------- | ----------- | ----- |
| 0    | 0 | 1       | `[]`         | -                     | `[0]`       | yes   |
| 1    | 1 | 2       | `[0]`        | 1 < 2 -> res[0] = 2   | `[1]`       | yes   |
| 2    | 2 | 1       | `[1]`        | 2 < 1? no             | `[1, 2]`    | yes   |
| 3    | 0 | 1       | `[1, 2]`     | 1 < 1? no             | `[1, 2]`    | no    |
| 4    | 1 | 2       | `[1, 2]`     | 1 < 2 -> res[2] = 2 | `[1]`      | no    |
| 5    | 2 | 1       | `[1]`        | 2 < 1? no             | `[1]`       | no    |

Index 1 (the value 2) is never popped, so it keeps its -1. Index 2 got its
answer on step 4, in the second lap, which is the wrap doing its job.

## Complexity

| | |
| ----- | ------------------------------------------------------- |
| Time  | `O(n)` - `2n` steps, each index pushed once and popped at most once |
| Space | `O(n)` - stack, plus the `n`-sized result               |

`2n` iterations with a `while` inside still totals `O(n)`: the inner loop can
only pop what was pushed, and at most `n` things were ever pushed.

## Pattern to remember

Circular array + any "scan rightwards" algorithm = run the scan for `2n`
steps with `i % n`, and only register each index during the first lap.

Works for the next-smaller variant and for circular subarray sums too. Writing
`i % n` is cheaper than concatenating `nums` with itself, which was my first
instinct and would have doubled the memory for no reason.
