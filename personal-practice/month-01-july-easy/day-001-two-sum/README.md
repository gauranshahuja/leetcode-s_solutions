# Day 001 - Two Sum

LeetCode 1 · Easy · Array + Hash Map · Thursday, 2 July 2026 · ~20 min (most of it on the brute force), 2 attempts

## Problem

Given an array `nums` and a number `target`, return the **indices** of the two
numbers that add up to `target`.

- Exactly one valid answer exists.
- The same element cannot be used twice.

```
nums = [2, 7, 11, 15], target = 9   ->  [0, 1]   because 2 + 7 = 9
nums = [3, 2, 4],      target = 6   ->  [1, 2]
nums = [3, 3],         target = 6   ->  [0, 1]
```

## First thing I tried

Two nested loops. Pick `i`, then look at every `j` after it and check the sum.
It works and it is honestly the first thing anyone writes, but it is
`O(n^2)` - for 10,000 numbers that is 50 million comparisons.

I kept it in the file as `twoSumBrute` so I can compare the two side by side.

## The approach that actually works

The thing I was missing: **I don't have to search for the partner.** When I am
standing on `nums[i]`, I already know exactly which number I need:

```
need = target - nums[i]
```

So the only real question is "have I seen `need` already?" - and that is a
hash map lookup, not a loop.

So: walk once through the array, and for each number

1. compute `need = target - nums[i]`
2. if `need` is already in the map -> answer is `[map.get(need), i]`
3. otherwise store `nums[i] -> i` and move on

One pass, no nested loop.

## Dry run

`nums = [2, 7, 11, 15]`, `target = 9`

| i | nums[i] | need | map before    | in map? | action              |
| - | ------- | ---- | ------------- | ------- | ------------------- |
| 0 | 2       | 7    | `{}`          | no      | store `2 -> 0`      |
| 1 | 7       | 2    | `{2:0}`       | **yes** | return `[0, 1]`  |

## The bug I hit

My first version stored the number in the map **before** doing the lookup:

```js
seen.set(nums[i], i);          // wrong order
if (seen.has(target - nums[i])) ...
```

That passes the normal cases but breaks when `target === 2 * nums[i]`. With
`nums = [5, 1, 10]` and `target = 10`, index 0 holds 5, needs 5, and finds the
5 it just inserted - so it returns `[0, 0]`, using the same element twice.

Fix is just the ordering: **check first, then store.** Then the map only ever
contains elements strictly before `i`.

## Complexity

| Version     | Time     | Space  |
| ----------- | -------- | ------ |
| Brute force | `O(n^2)` | `O(1)` |
| Hash map    | `O(n)`   | `O(n)` |

Classic trade: spend memory to delete a loop.

## Takeaway

When a problem asks for a pair, stop searching forward and start
remembering backward. "Have I seen the complement?" turns `O(n^2)` into
`O(n)`.

This complement-in-a-map trick is going to come back a lot - I can already see
it fitting "Contains Duplicate" and "Subarray Sum Equals K".
