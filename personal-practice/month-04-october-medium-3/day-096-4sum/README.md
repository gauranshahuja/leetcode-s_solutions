# Day 096 - 4Sum

LeetCode 18 · Medium · Generalised k-sum · Monday, 5 October 2026 · ~45 min, 2 attempts

## Problem

Every **unique** quadruplet in `nums` summing to `target`. Unique by value, not
by index, so repeated input numbers must not yield repeated quadruplets.

```
nums = [1,0,-1,0,-2,2], target = 0
  ->  [[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]

nums = [2,2,2,2,2], target = 8
  ->  [[2,2,2,2]]      (not five copies of it)
```

## The decision I made up front

I could have written `fourSum` as two nested loops wrapped around the two
pointer scan from Day 036 (3Sum). That is about 25 lines and I know it works.

Instead I wrote it as a recursive `kSum`, because the structure is obvious once
you say it out loud:

```
4Sum = fix one element, then 3Sum the suffix
3Sum = fix one element, then 2Sum the suffix
2Sum = two pointers on a sorted array   <- base case
```

One function covers all three, and the tests at the bottom run 2Sum, 3Sum and
4Sum through the same code path. If I had to do 5Sum tomorrow it would be a
parameter change. This is the kind of thing I would not have attempted in month
two; now the template feels like a tool rather than something to memorise.

## How the recursion works

```js
function kSum(nums, target, k, start) {
  if (k === 2) return twoSumSorted(nums, target, start);

  for (let i = start; i <= n - k; i += 1) {
    if (i > start && nums[i] === nums[i - 1]) continue;
    for (const tail of kSum(nums, target - nums[i], k - 1, i + 1)) {
      res.push([nums[i], ...tail]);
    }
  }
}
```

- `start` is the recursion's real argument: each level only looks at the suffix
  after the element the level above fixed. That is what stops the same four
  values being found in 24 different orders.
- `i <= n - k` leaves room for the `k-1` elements the deeper levels need.
- `nums[i] === nums[i-1] && i > start` is the dedupe. Because the array is
  sorted, equal values are adjacent, so skipping a repeated *head* skips every
  quadruplet that head would have produced - all of which were already found.

## The prune

```js
if (nums[start] * k > target) return res;   // smallest k already overshoot
if (nums[n - 1] * k < target) return res;   // largest k cannot reach it
```

Both hold only because the array is sorted. Not needed for correctness but it
cuts the branching badly on clustered input, and it made the all-twos test
return instantly instead of walking the whole triple loop.

## Where attempt 1 went wrong

I put the duplicate skip in the wrong place - on the recursive result instead of
the loop head:

```js
for (let i = start; i <= n - k; i += 1) {
  const tails = kSum(nums, target - nums[i], k - 1, i + 1);
  if (i > start && nums[i] === nums[i - 1]) continue;   // too late
  ...
}
```

Correct output, but it does all the recursive work and *then* throws it away.
On `[2,2,2,2,2]` that is five full subtrees computed to keep one. Moved the
`continue` above the recursive call and it was fine. Classic case of writing the
right condition in the wrong line.

## Dry run

`nums = [1,0,-1,0,-2,2]`, sorted to `[-2,-1,0,0,1,2]`, target `0`.

| level | fixed   | target left | range          | 2Sum finds   |
| ----- | ------- | ----------- | -------------- | ------------ |
| k=4   | -2      | 2           | `[-1,0,0,1,2]` |              |
| k=3   | -1      | 3           | `[0,0,1,2]`    | `[1,2]`      |
| k=3   | 0       | 2           | `[0,1,2]`      | `[0,2]`      |
| k=3   | 0 (dup) | -           | -              | skipped      |
| k=4   | -1      | 1           | `[0,0,1,2]`    |              |
| k=3   | 0       | 1           | `[0,1,2]`      | `[0,1]`      |
| k=3   | 0 (dup) | -           | -              | skipped      |
| k=4   | 0       | 0           | `[0,1,2]`      | nothing      |

Which assembles to `[-2,-1,1,2]`, `[-2,0,0,2]`, `[-1,0,0,1]`.

## Numbers big enough to matter

The constraints allow `|nums[i]| <= 10^9` and `|target| <= 10^9`, so a sum of
four elements can reach `4 * 10^9`. That is well inside
`Number.MAX_SAFE_INTEGER` (about `9.007 * 10^15`), so plain JS numbers are
exact here and I do **not** need `BigInt`. Worth checking rather than assuming:
the usual advice for this problem in other languages is "watch for 32-bit
integer overflow", which is a C++/Java concern that simply does not apply.

The one JS trap that genuinely applies: `nums.slice().sort((a,b) => a-b)`.
The default comparator sorts lexicographically, so `[2, 10, -1]` becomes
`[-1, 10, 2]` and every pointer argument collapses. I have made that mistake
enough times that I now type the comparator before the parenthesis.

## Complexity

| k | time       | space                   |
| - | ---------- | ----------------------- |
| 2 | `O(n)`     | `O(1)`                  |
| 3 | `O(n^2)`   | `O(1)` + output         |
| 4 | `O(n^3)`   | `O(k)` stack + output   |

General: `O(n^(k-1))` after the `O(n log n)` sort, because each recursion level
adds a linear loop and the base case is linear.

## Follow-up to try

Hash-map 4Sum: build a map of all pair sums, then match pairs of pairs. That is
`O(n^2)` time but needs careful index bookkeeping to avoid reusing elements, and
the dedupe gets much worse. The two-pointer version is `O(n^3)` and passes, so
not today.
