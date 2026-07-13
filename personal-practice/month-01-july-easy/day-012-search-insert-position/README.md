# Day 012 - Search Insert Position

LeetCode 35 · Easy · Binary search, lower bound · Monday, 13 July 2026 · ~15 min, 2 attempts

## Problem

Sorted array of distinct numbers and a `target`. Return where the target is,
or where it would have to go.

```
nums = [1, 3, 5, 6], target = 5  ->  2   (it's already there)
nums = [1, 3, 5, 6], target = 2  ->  1   (goes between 1 and 3)
nums = [1, 3, 5, 6], target = 7  ->  4   (goes on the end)
nums = [1, 3, 5, 6], target = 0  ->  0   (goes at the front)
```

Must be `O(log n)`.

## Where I started

This is the direct follow-up to Day 011. Same sorted array, same binary
search, one extra sentence in the question. So I pasted yesterday's loop in
and tried to bolt the insert position on afterwards:

```js
// day 011 shape
let lo = 0, hi = nums.length - 1;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (nums[mid] === target) return mid;
  if (nums[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return ???;   // <- stared at this for a while
```

I sat there trying to work out what to return. `lo`? `hi`? `hi + 1`? I tried
`hi` first and got `0` instead of `1` for `target = 2`, which is how I learned
that guessing at the end of a binary search is a bad plan.

## What finally clicked

The insert position is not a special case bolted onto the search. It **is**
the search, if I change what I am searching for:

find the first index whose value is `>= target`

That index is the answer in both situations. If the target exists, the first
value `>= target` is the target itself. If it doesn't, that index is exactly
the slot it would be pushed into. So there is nothing to return at the end
except the boundary the loop converged to: **`lo`**.

Two changes make the loop converge to that boundary:

| Plain search (Day 011) | Boundary search (today)      |
| ---------------------- | ---------------------------- |
| `hi = nums.length - 1` | `hi = nums.length`           |
| `while (lo <= hi)`     | `while (lo < hi)`            |
| `hi = mid - 1`         | `hi = mid`                   |
| returns `-1` if absent | returns `lo`, always a valid slot |

`hi` starts past the end because "append" is a legal answer. And `hi = mid`
rather than `mid - 1` because when `nums[mid] >= target`, mid is still a
candidate and I must not throw it away. There is no early `return mid` at all
now, which felt wrong at first but means the loop has exactly one exit.

## Dry run

`nums = [1, 3, 5, 6]`, `target = 2`

| lo | hi | mid | nums[mid] | `< 2`? | what happens |
| -- | -- | --- | --------- | ------ | ------------ |
| 0  | 4  | 2   | 5         | no     | `hi = 2`     |
| 0  | 2  | 1   | 3         | no     | `hi = 1`     |
| 0  | 1  | 0   | 1         | yes    | `lo = 1`     |
| 1  | 1  | -   | -         | -      | loop ends, return `1` |

And `target = 7` on the same array walks `lo` all the way up to `4`, which is
`nums.length`, which is "stick it on the end". The half open window handles
that with no extra branch.

## Edge case that bit me

The empty array. With `hi = nums.length - 1` that is `-1`, and
`while (lo <= hi)` is false immediately, so the old shape would fall out to
whatever I guessed at the bottom. With the half open version `lo = hi = 0`,
the loop never runs, and it returns `0`. Correct for free.

Also checked `[1,1,1,3]` with target `1` even though the problem promises
distinct values, just to see which end of the run it lands on. It returns `0`,
the first one, because of the `>=` comparison. Worth knowing: this is the
"lower bound" flavour, not "upper bound".

## Complexity

- Time `O(log n)`, window halves every pass.
- Space `O(1)`, just the two indices.

## Note to self

Binary search is not only for "is it there". It is for **finding a boundary in
something monotonic**. The pattern:

```
while (lo < hi) {
  mid = ...
  if (bad(mid)) lo = mid + 1;
  else hi = mid;
}
return lo;   // first index that is not bad
```

Once the predicate `nums[mid] < target` is written as "mid is too far left",
the answer is just where the loop stops. I suspect I will be reusing this
exact skeleton for "first bad version" and "find minimum in rotated array"
style problems.
