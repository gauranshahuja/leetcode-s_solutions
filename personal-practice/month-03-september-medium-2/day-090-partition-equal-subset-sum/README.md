# Day 090 - Partition Equal Subset Sum

LeetCode 416 · Medium · Subset-sum DP · Tuesday, 29 September 2026 · ~50 min, 3 attempts

## Problem

Can the array be split into two groups with equal sums? Every element must be
used.

```
[1, 5, 11, 5]  ->  true     {1,5,5} and {11}, both 11
[1, 2, 3, 5]   ->  false    total is 11
```

## The reduction

The two groups are complements of each other. If I choose one group, the other
one is whatever is left, and there is no freedom in it. So "split into two equal
halves" is really:

is there a subset summing to `total / 2`?

That is plain subset-sum, and I have the shape for that. Two immediate
consequences:

- **odd total is an instant `false`.** The numbers are integers, so there is no
  way to land on `total / 2` when that is not a whole number. One modulo check
  before any DP runs.
- I never have to think about the second group at all.

## The table, and then no table

The textbook version is 2D: `dp[i][s]` = can the first `i` numbers make `s`.

```
dp[i][s] = dp[i-1][s]            // skip nums[i-1]
        || dp[i-1][s - nums[i-1]] // take it, if it fits
```

Both terms read from row `i-1` only. That is the signal that the row can be
dropped and the array reused in place:

```js
const reach = new Array(half + 1).fill(false);
reach[0] = true;                       // the empty subset
for (const n of nums)
  for (let s = half; s >= n; s--)
    if (reach[s - n]) reach[s] = true;
```

Note `reach[0] = true` is the empty subset, not "zero is in the array". It is
the seed that everything else is built from, and forgetting it makes the whole
array false forever.

## Why the inner loop goes backwards

This is the part worth writing down properly, because I got it wrong and the
wrong version *looks* fine.

The 1D array is pretending to be two rows at once. For the pretence to hold,
when I write `reach[s]` while processing `n`, the value I read at `reach[s - n]`
must be from **before** `n` was considered.

- going **down** from `half`, the slot `s - n` is at a lower index, which this
  pass has not reached yet. So it still holds the previous row. Correct.
- going **up** from `n`, the slot `s - n` is at a lower index, which this pass
  already wrote. So it may already include `n`, and adding `n` again uses the
  same element twice.

Forwards turns the problem into "unbounded" subset-sum, where each number may be
reused as many times as you like. Which is a real problem (it is Day 060's coin
change), just not this one.

Concretely, `nums = [3]`, `half = 6`:

| direction | step            | result                                  |
| --------- | --------------- | --------------------------------------- |
| forwards  | `s=3`: `reach[0]` true -> `reach[3] = true` | |
| forwards  | `s=6`: `reach[3]` **now true** -> `reach[6] = true` | claims 3+3 ✗ |
| backwards | `s=6`: `reach[3]` false -> nothing | |
| backwards | `s=3`: `reach[0]` true -> `reach[3] = true` | correct |

So `canPartition([3, 3])` is true (that one is genuine), but my forwards version
also returned true for `[3, 9]` (total 12, half 6) by using the 3 twice. That
test case is what finally showed it - every example with duplicates had hidden
the bug, because for those the answer happened to be right.

## Dry run

`nums = [1, 5, 11, 5]`, `total = 22`, `half = 11`.

| after | reachable sums                   |
| ----- | -------------------------------- |
| start | `{0}`                            |
| 1     | `{0, 1}`                         |
| 5     | `{0, 1, 5, 6}`                   |
| 11    | `{0, 1, 5, 6, 11}` -> **hit** |

`reach[11]` is set, so the function returns early and never looks at the last
`5`. The subset is `{11}` and the complement is `{1, 5, 5}`.

## Complexity

| Measure | Cost                                                    |
| ------- | ------------------------------------------------------- |
| Time    | `O(k * total/2)` for `k` numbers                         |
| Space   | `O(total/2)` booleans                                   |

Pseudo-polynomial, not polynomial: the cost depends on the *value* of the sum,
not just the count of numbers. With `k <= 200` and values `<= 100` the half is
at most 10,000, so it is about 2 million boolean writes. Fine.

## Pattern to remember

1D knapsack: iterate the capacity backwards for 0/1 (each item once),
forwards for unbounded (items reusable). The loop direction is the whole
difference between two different problems.

Day 060 ran the same shape forwards on purpose. Same code, one `-=` instead of
a `+=`, completely different question. That is the kind of thing I want to
recognise instantly rather than re-derive.
