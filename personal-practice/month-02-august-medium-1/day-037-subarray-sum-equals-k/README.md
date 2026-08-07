# Day 037 - Subarray Sum Equals K

LeetCode 560 · Medium · Prefix sum plus hash map · Friday, 7 August 2026 · ~50 min, 3 attempts

## Problem

How many contiguous subarrays sum to exactly `k`? Count them, do not list
them. `nums` can contain negatives and zeros.

```
nums = [1,1,1],  k = 2  ->  2      (indices 0..1 and 1..2, they overlap)
nums = [1,2,3],  k = 3  ->  2      ([1,2] and [3])
nums = [1,-1,0], k = 0  ->  3      ([1,-1], [1,-1,0], [0])
```

## My first instinct was wrong, and this is the lesson of the day

Three days ago I learned sliding windows (Day 034) and I came straight at this
with one:

```js
let left = 0, sum = 0, count = 0;
for (let right = 0; right < nums.length; right += 1) {
  sum += nums[right];
  while (sum > k) {        // shrink from the left
    sum -= nums[left];
    left += 1;
  }
  if (sum === k) count += 1;
}
```

It passes `[1,1,1], k=2`. It is completely broken, and not in a small way.

**Why.** A sliding window relies on a monotonicity guarantee: *extending the
window to the right can only increase the sum, and shrinking from the left can
only decrease it.* That is what makes "sum too big, shrink" a valid decision -
you know you are moving in the right direction and will never need to go back.

With negative numbers that guarantee is gone. Extending right can **decrease**
the sum. So "sum > k, therefore shrink" is no longer sound: the fix might have
been to extend instead. On `[1,-1,0], k=0` the window version reports 1 when
the answer is 3.

It also cannot count overlapping answers properly even on all-positive input,
because a window keeps one `left` per `right` and here several different lefts
can be valid for the same right.

So: **sliding window needs all non-negative values** (or some other
monotonic measure). That is the rule I was missing, and it is the real content
of this problem. A window problem and a prefix-sum problem look identical until
you check the sign of the input.

## The approach that works

Prefix sums. Define `P(i)` = sum of the first `i` elements, `P(0) = 0`. Then

```
sum(nums[i..j]) = P(j+1) - P(i)
```

so

```
sum(nums[i..j]) === k    <=>    P(i) === P(j+1) - k
```

Walk left to right carrying the current prefix. At each position the number of
subarrays **ending here** is the number of earlier prefixes equal to
`prefix - k`. Keep a map of prefix value to **how many times it has occurred**
and the answer accumulates in one pass.

This is Day 001 again (look up the complement instead of searching for it), but
the map stores a count rather than an index, because two different starts can
give the same prefix and both of them are valid answers.

## Dry run

`nums = [1, 2, 1, 2, 1]`, `k = 3`

| n | prefix | need = prefix - k | map before          | found | count |
| - | ------ | ----------------- | ------------------- | ----- | ----- |
| - | 0      | -                 | `{0:1}`             | -     | 0     |
| 1 | 1      | -2                | `{0:1}`             | 0     | 0     |
| 2 | 3      | 0                 | `{0:1, 1:1}`        | 1     | 1     |
| 1 | 4      | 1                 | `{0:1, 1:1, 3:1}`   | 1     | 2     |
| 2 | 6      | 3                 | `{0:1,1:1,3:1,4:1}` | 1     | 3     |
| 1 | 7      | 4                 | `{...,6:1}`         | 1     | 4  |

Four subarrays: `[1,2]`, `[2,1]`, `[1,2]`, `[2,1]`. All overlapping, all
counted, no window could have done that.

## Two things I got wrong

**Forgot the `{0: 1}` seed.** Without it the answer for `[1,2,3], k=3` is 1
instead of 2, because the subarray `[1,2]` starts at index 0 and needs to match
the empty prefix. The seed is not a hack, `P(0) = 0` is a genuine prefix - the
sum of no elements.

**Stored before counting.** Same ordering trap as Day 001:

```js
seen.set(prefix, (seen.get(prefix) || 0) + 1);
count += seen.get(prefix - k) || 0;      // wrong order
```

With `k = 0` this counts the empty subarray at every position, since `prefix`
matches itself the instant it is inserted. `[0,0,0], k=0` came out as 9 instead
of 6. Count first, then insert.

## Complexity

| Approach            | Time     | Space  |
| ------------------- | -------- | ------ |
| every subarray      | `O(n^2)` | `O(1)` |
| prefix sum + counts | `O(n)`   | `O(n)` |

## Note to self

Before reaching for a sliding window, ask: can the values be negative?
If yes, the window's monotonicity is gone and the answer is almost always
prefix sums plus a hash map instead.

Window for "longest/shortest range with property X" on non-negative data.
Prefix sums plus a map for "count ranges with exact sum X" on anything.

## Follow-up to try

LeetCode 974 (Subarray Sums Divisible by K) is this with `prefix % k` as the
map key, and 525 (Contiguous Array) is this after mapping `0 -> -1`. Same
skeleton, different key function.
