# Day 072 - Combination Sum

LeetCode 39 · Medium · Backtracking with reuse · Friday, 11 September 2026 · ~30 min, 2 attempts

## Problem

Pick numbers from `candidates` (all distinct, all positive) so they add up to
`target`. A candidate can be reused as many times as I want. Return every
distinct multiset, not every ordering.

```
candidates = [2,3,6,7], target = 7  ->  [[2,2,3], [7]]
candidates = [2,3,5],   target = 8  ->  [[2,2,2,2], [2,3,3], [3,5]]
candidates = [2],       target = 1  ->  []
```

## Where I started

By now the backtracking skeleton writes itself - push, recurse, pop, same as
Day 049. So I typed the subsets version from memory:

```js
walk(i + 1, remaining - nums[i]);
```

and got `[[7]]` for the first example. The `[2,2,3]` answer never appeared,
because `i + 1` means "that candidate is spent now". That is the rule for
subsets, not for this.

## The one-character fix

```js
walk(i, remaining - nums[i]);   // index i stays legal
```

Passing `i` says: you may pick this same candidate again, but you may never go
back to an earlier one. That second half is the part that does the dedupe work
for free. Every combination comes out in non-decreasing index order, so
`[3,2,2]` is simply never generated - there is no branch that goes from index 1
back to index 0.

That is the thing worth remembering: I did not write any "have I seen this
combination" check. The index floor **is** the dedupe.

## Dry run

`candidates = [2,3,6,7]`, `target = 7`

| path    | remaining | start | what happens                       |
| ------- | --------- | ----- | ---------------------------------- |
| []      | 7         | 0     | take 2                             |
| [2]     | 5         | 0     | take 2 again (start stayed 0)      |
| [2,2]   | 3         | 0     | 2 > 3? no, take 2                  |
| [2,2,2] | 1         | 0     | 2 > 1 -> break, dead end           |
| [2,2]   | 3         | 1     | take 3 -> remaining 0, record   |
| [2]     | 5         | 1     | take 3, then 3 > 2 -> dead end     |
| [2]     | 5         | 2     | 6 > 5 -> break                     |
| []      | 7         | 1     | 3, 3+3=6, then 3 > 1 -> dead end   |
| []      | 7         | 3     | take 7 -> remaining 0, record   |

Two answers, `[2,2,3]` and `[7]`.

## The prune

Sorting the candidates is not needed to be correct, but it buys a cheap cut:

```js
if (nums[i] > remaining) break;
```

Because the array is ascending, the first candidate that overshoots means every
candidate after it overshoots too, so `break` rather than `continue`. On
`[2,3,5]` with target 20 that trims a lot of the tree. It also has the nice
side effect that each combination comes out already sorted, which makes the
expected values in the tests readable.

## Small thing that cost me a minute

I pushed `path` instead of `path.slice()` the first time, so all 11 answers for
`[2,3,5] / 20` ended up being the same (empty, by the end) array. Third time
I've done that in this repo. The array in `out` has to be a snapshot.

## Complexity

- Time: `O(n^(target / min(candidates)))` upper bound - the recursion depth is
  capped by `target / smallest candidate`, and each level branches over at most
  `n` candidates. The `break` makes it much smaller in practice.
- Space: `O(target / min)` for the path and the stack, output not counted.

## Pattern to remember

`i + 1` = each element used at most once. `i` = unlimited reuse.
`start` as a floor is what stops permutations of the same multiset.

Combination Sum II (no reuse, but duplicate candidates) is going to need both
ideas at once: `i + 1` for the reuse rule plus a skip for equal siblings. That
feels like the same trick as Subsets II, which is next on my list.
