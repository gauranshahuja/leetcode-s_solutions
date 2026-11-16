# Day 138 - Count of Smaller Numbers After Self

LeetCode 315 · Hard · Merge sort with index tracking · Monday, 16 November 2026 · ~1 hr 30 min, 3 attempts

## Problem

For every index `i`, count how many elements to the **right** of `i` are
**strictly** smaller than `nums[i]`. Return the counts in the original index
order.

```
nums = [5, 2, 6, 1]  ->  [2, 1, 1, 0]

5 : 2 and 1 are smaller      -> 2
2 : 1 is smaller             -> 1
6 : 1 is smaller             -> 1
1 : nothing to the right     -> 0
```

Two words are doing all the work: **strictly** (equal values do not count) and
**original order** (whatever the algorithm reorders internally has to be undone
before the answer comes out).

## This is an inversion count in disguise

A pair `(i, j)` with `i < j` and `nums[j] < nums[i]` is an inversion. The answer
at index `i` is "how many inversions have `i` as their left end". And inversion
counting is what a merge sort is already doing without being asked.

Picture the merge step with both halves sorted. If I take an element from the
**right** half before some element of the left half, then that right-half value
is smaller than every left-half element still waiting, and it started out to the
right of all of them. One comparison, several inversions identified at once.

So: keep a running count `fromRight` of how many right-half elements have been
emitted in this merge, and whenever a left-half element is emitted, credit it
with the current `fromRight`. Every pair gets compared in exactly one merge
across the whole recursion, so every inversion is counted exactly once.

Same merge I wrote on Day 077 for Sort List, with two changes: sort an array of
**indices** instead of the values, and add three lines of bookkeeping.

## Why indices and not values

The counts have to come back in original positions, so I need to know where an
element *started*. Sorting `idx = [0, 1, ..., n-1]` by `nums[idx[k]]` keeps that
link alive: when `idx[i]` is emitted, `counts[idx[i]]` is the slot to credit.
Sorting the values directly throws the mapping away on the first swap.

## Dry run: [5, 2, 6, 1]

`idx` starts as `[0, 1, 2, 3]`.

| merge        | comparison       | action                    | fromRight | counts        |
| ------------ | ---------------- | ------------------------- | --------- | ------------- |
| [5] vs [2]   | 5 <= 2? no       | take right (idx 1)        | 1         | `[0,0,0,0]`   |
|              | left exhausted?  | take left (idx 0), credit | 1         | `[1,0,0,0]`   |
| [6] vs [1]   | 6 <= 1? no       | take right (idx 3)        | 1         | `[1,0,0,0]`   |
|              |                  | take left (idx 2), credit | 1         | `[1,0,1,0]`   |
| [2,5] vs [1,6] | 2 <= 1? no     | take right (idx 3)        | 1         | `[1,0,1,0]`   |
|              | 2 <= 6? yes      | take left (idx 1), credit | 1         | `[1,1,1,0]`   |
|              | 5 <= 6? yes      | take left (idx 0), credit | 1         | `[2,1,1,0]`   |
|              | left exhausted   | take right (idx 2)        | 2         | `[2,1,1,0]` |

Index 0 gets credited twice, once per level - 1 from the inner merge and 1 from
the outer, which is exactly the two elements smaller than 5.

## The bug

Tie-break direction. My first merge condition was:

```js
const takeLeft = j >= hi || (i < mid && nums[idx[i]] < nums[idx[j]]);   // wrong
```

With `<`, equal values send the merge down the right-hand branch, so an equal
element gets counted as smaller. `countSmaller([-1, -1])` returned `[1, 0]`
instead of `[0, 0]`. `<=` fixes it, and it is the same `<=` that makes a merge
sort stable - the problem says *strictly* smaller, so ties have to be resolved
toward the left half.

Second mistake, caught two minutes later: I had written

```js
counts[i] += fromRight;        // wrong - i is a position in idx, not an index into nums
```

instead of `counts[idx[i]] += fromRight`. The totals were right, they were just
filed under the wrong names - which produced a correct-looking answer for
`[5,2,6,1]` by coincidence and garbage for anything longer. That is why the big
test cross-checks 2000 values against the brute force rather than trusting a
four-element example.

## The Fenwick alternative

Same question from the other end. Walk the array **right to left**, keeping a
frequency table of everything seen so far - which is, by construction, exactly
"everything to the right of the current index". The answer at `i` is then a
prefix sum over that table: how many seen values are strictly less than
`nums[i]`.

```js
for (let i = n - 1; i >= 0; i -= 1) {
  const r = rankOf.get(nums[i]);
  counts[i] = prefix(r - 1);   // r - 1 => strictly smaller
  bump(r);
}
```

Values go up to 10^4 in magnitude and can be negative, so compress them to ranks
`1..k` by sorted order first. Two things to be careful about:

- ranks must be **1-based**. A Fenwick index of 0 makes `k -= k & -k` loop
  forever, because `0 & -0` is 0 and `k` never moves.
- `[...new Set(nums)].sort((a, b) => a - b)` - the comparator is not optional.
  `[-60, 7, 100].sort()` gives `[-60, 100, 7]`, which would silently assign
  nonsense ranks.

Roughly the same runtime as the merge sort here. I would still write the merge
sort, because it is a sort I already know plus three lines. The BIT is the one
to reach for when the question becomes "how many values in range `[a, b]`", which
a merge pass cannot answer.

## Complexity

| version     | time         | space  |
| ----------- | ------------ | ------ |
| brute force | `O(n^2)`     | `O(n)` |
| merge sort  | `O(n log n)` | `O(n)` |
| Fenwick     | `O(n log n)` | `O(n)` |

## Looking back at 138 days

Written on the last day of the run, so: the real jump was month 3. Months 1 and
2 were mostly "recognise the shape" - two pointers, a hash map, a stack - and I
could usually get there by pattern-matching against something I had already
done. Month 3 is where that stopped working and I had to actually state an
invariant before writing code, and the days where I wrote first and thought
second are the days that took three hours.

Still shaky: DP where I have to invent the state. Yesterday's Burst Balloons is
the honest example - I had the tools and still needed the editorial, because I
kept asking the wrong question about the interval. Tabulation I can do; deciding
*what the subproblem is* is the gap. Graphs too, if I am being fair: I have done
the standard traversals but nothing with real shortest-path or flow.

Next: re-solve from a blank file the two days I needed help on this month (134
and 137), because "I followed the editorial" is not the same as "I can produce
it". Then segment trees and proper graph algorithms. Weekly rather than daily
from here - daily was the right forcing function to start with, and lately it
has been costing more than it teaches.
