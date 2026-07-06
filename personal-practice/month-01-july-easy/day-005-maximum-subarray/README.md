# Day 005 - Maximum Subarray

LeetCode 53 · Easy · Kadane's algorithm · Monday, 6 July 2026 · ~30 min (stuck for 15, then read the editorial for the one-line idea and coded it myself), 4 attempts

## Problem

Return the largest sum of any **contiguous** subarray.

```
[-2, 1, -3, 4, -1, 2, 1, -5, 4]  ->  6     the subarray [4, -1, 2, 1]
[1]                              ->  1
[5, 4, -1, 7, 8]                 ->  23    the whole array
```

LeetCode tags this Easy and I do not think it is. The brute force is easy,
the real answer is a trick I would not have found on my own today.

## My first (wrong) idea

First I tried something greedy: add up everything positive, skip the
negatives. Wrong, because "contiguous" means I am not allowed to skip. In
`[2, -1, 2]` the only way to get both 2s is to pay the -1, giving 3.

So I wrote the honest `O(n^2)`: fix a start, extend right, keep a running sum
so there is no third loop. Correct, kept in the file as `maxSubArrayBrute`,
and far too slow for `n = 10^5`.

## Where I got stuck

I could see the `O(n^2)` was recomputing something but could not name what.
After 15 minutes I read the first paragraph of the editorial, which handed me
the sentence I was missing:

keep the best sum of a subarray ending at the current index

That was the moment it clicked, so I am writing it out properly here.

## What finally clicked

Define `running` = the biggest sum of any subarray that **ends exactly at
`i`**. That phrasing is the whole algorithm, because a subarray ending at `i`
has only two possible shapes:

- it also contains `i-1`, so it is (best ending at `i-1`) `+ nums[i]`
- it does not, so it is just `nums[i]` on its own

There is no third case. One `Math.max` decides between them:

```js
running = Math.max(nums[i], running + nums[i]);
best    = Math.max(best, running);
```

And the two variables mean two different things, which is the part I kept
confusing:

| variable  | meaning                                             |
| --------- | --------------------------------------------------- |
| `running` | best subarray **ending at the current index**       |
| `best`    | best subarray **seen anywhere so far**              |

They have to be separate. The winning subarray does not have to end at the
last element, so if I only kept `running` I would return whatever is true at
the right edge of the array and lose the answer on something like
`[5, -10]`.

## Dry run

`nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`

| i | nums[i] | running + nums[i] | nums[i] alone | running | best |
| - | ------- | ----------------- | ------------- | ------- | ---- |
| 0 | -2      | -                 | -             | -2      | -2   |
| 1 | 1       | -1                | **1**         | 1       | 1    |
| 2 | -3      | **-2**            | -3            | -2      | 1    |
| 3 | 4       | 2                 | **4**         | 4       | 4    |
| 4 | -1      | **3**             | -1            | 3       | 4    |
| 5 | 2       | **5**             | 2             | 5       | 5    |
| 6 | 1       | **6**             | 1             | 6       | **6** |
| 7 | -5      | **1**             | -5            | 1       | 6    |
| 8 | 4       | **5**             | 4             | 5       | 6    |

Row 3 is the restart (`-2` thrown away) and rows 7-8 are why `best` has to be
kept separately: `running` ends at 5 while the answer is 6.

## The all-negatives trap

The bug I actually shipped first:

```js
let best = 0;          // wrong
let running = 0;
```

Starting both at `0` reads as harmless and it passes every example in the
problem statement. Then `[-3, -1, -7, -4]` returns `0`, because `0` is not a
sum of any subarray. It is the sum of the **empty** subarray, and the problem
asks for a non-empty one. The right answer is `-1`, the least bad single
element.

Fix: seed both from `nums[0]` and start the loop at `i = 1`.

```js
let running = nums[0];
let best = nums[0];
```

Now the first value in each variable is a genuine subarray sum, so the answer
can be negative when it has to be. Same class of mistake as a `max` seeded
with `0` anywhere: `0` is only a safe starting point when "take nothing" is
a legal answer. On Day 002 it was legal (don't trade). Here it is not.

## Complexity

| Version | Time     | Space  |
| ------- | -------- | ------ |
| Brute   | `O(n^2)` | `O(1)` |
| Kadane  | `O(n)`   | `O(1)` |

One pass, two numbers, no extra array.

## Note to self

This is the first problem where the answer was a **definition** rather than a
data structure. Days 001-004 were all "put things in a map". Here nothing
gets stored; the win came from picking the right quantity to carry (best
ending here) so that each step is a two-way choice.

Phrase to try on the next array problem I can't crack: *what is the best
answer that ends exactly at `i`, and can I get it from the one at `i-1`?*
