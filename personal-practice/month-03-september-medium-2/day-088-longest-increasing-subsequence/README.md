# Day 088 - Longest Increasing Subsequence

LeetCode 300 · Medium · DP, then patience plus binary search · Sunday, 27 September 2026 · ~1 hr 15 min (the DP in 15, the rest arguing with the `tails` array), 4 attempts

## Problem

Length of the longest **strictly** increasing subsequence. Subsequence, not
substring, so elements may be skipped but not reordered.

```
[10, 9, 2, 5, 3, 7, 101, 18]  ->  4   e.g. [2, 3, 7, 101]
[7, 7, 7, 7]                  ->  1   strictly, so no ties
```

## The DP, which came quickly

`dp[i] = length of the best increasing subsequence that ends exactly at i`.

Anchoring on "ends at i" is the whole trick: make the state about a decision point, not about a prefix in general. Then every
subsequence ending at `i` is either `nums[i]` alone, or something ending at an
earlier `j` with `nums[j] < nums[i]`, plus one.

```js
dp[i] = 1;
for (let j = 0; j < i; j++)
  if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
```

Two things I nearly got wrong:

- the answer is `max(dp)`, not `dp[n-1]`. The best run does not have to end at
  the last element. `[1,2,3,0]` would return 1.
- `<` and not `<=`. With `<=` the `[7,7,7,7]` case returns 4.

That is `O(n^2)` and it is accepted. If the follow-up did not exist I would have
stopped here.

## The O(n log n) version, which took real effort to believe

The follow-up asks for `O(n log n)`. I read the idea, wrote it, watched it pass
every test, and still did not trust it for about half an hour.

Keep an array `tails` where

`tails[k]` is the smallest value that can end an increasing subsequence of
length `k + 1`, out of everything seen so far.

For each new `x`: binary search for the leftmost tail that is `>= x` (a lower
bound) and overwrite it with `x`. If every tail is smaller than `x`, there is no
such position and `x` appends to the end. Answer is `tails.length`.

Why it is correct, in the order the pieces finally landed for me:

1. **`tails` is sorted.** A length-5 run contains a length-4 run as a prefix,
   whose end is smaller. So `tails[3] < tails[4]` always. Sorted means binary
   searchable, which is where the `log n` comes from.
2. **Smaller tails are never worse.** If I can end a length-3 run on 9 or on 5,
   choosing 5 keeps every future option that 9 keeps, plus the numbers between
   5 and 9. So overwriting a bigger tail with a smaller one can only help.
3. **Overwriting never shortens anything.** Writing `x` at position `k` claims
   a length-`k+1` run ending at `x`; the entries left of it are still smaller
   and still valid, so `tails.length` never decreases.
4. **Appending is the only way length grows**, and it happens exactly when `x`
   beats the current longest run's tail. Which is what "extends the LIS" means.

## The thing that confused me for 30 minutes

**`tails` is not an increasing subsequence of the input.** I kept printing it,
seeing something that was not actually in the array in that order, and assuming
I had a bug.

```
nums = [1, 3, 6, 7, 9, 4, 10, 5, 6]
```

| x  | binary search result        | tails after        |
| -- | --------------------------- | ------------------ |
| 1  | append                      | `[1]`              |
| 3  | append                      | `[1,3]`            |
| 6  | append                      | `[1,3,6]`          |
| 7  | append                      | `[1,3,6,7]`        |
| 9  | append                      | `[1,3,6,7,9]`      |
| 4  | replace index 2 (`6`)       | `[1,3,4,7,9]`      |
| 10 | append                      | `[1,3,4,7,9,10]`   |
| 5  | replace index 3 (`7`)       | `[1,3,4,5,9,10]`   |
| 6  | replace index 4 (`9`)       | `[1,3,4,5,6,10]`   |

Final length 6. The real LIS is `[1,3,6,7,9,10]`. The final `tails` is
`[1,3,4,5,6,10]`, which is **not** that, and `4` comes after `6` and `7` in the
input so `[1,3,4,5,6,10]` is not a subsequence at all.

That is fine, because `tails[k]` is a claim about *lengths*, not a path. Only
its **length** is meaningful. Each slot is independently the best known ending
for a run of that size, and those runs can come from different parts of the
array. Once I stopped expecting it to be a path, the whole thing stopped feeling
like a trick.

## The bug

My binary search was an upper bound instead of a lower bound:

```js
if (tails[mid] <= x) lo = mid + 1;   // <= : finds the first tail > x
else hi = mid;
```

With `<=`, an `x` equal to an existing tail skips past it and gets appended as
if it extended the run. `[7,7,7,7]` then returns 4. Strictly increasing needs
the **lower** bound: the first tail `>= x`, so that an equal value replaces in
place and changes nothing.

Lower bound for strict, upper bound for non-decreasing. Worth writing down,
because it is the only difference between the two variants of this problem.

## Complexity

| Version          | Time         | Space  |
| ---------------- | ------------ | ------ |
| DP ending at i   | `O(n^2)`     | `O(n)` |
| tails + binary search | `O(n log n)` | `O(n)` |

## Takeaway

The `tails` array is a row of best-known endings indexed by length, not a
subsequence. Confusing "the DP table" with "the answer" is what cost me the
hour.
