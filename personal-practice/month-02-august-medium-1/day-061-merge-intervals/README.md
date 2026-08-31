# Day 061 - Merge Intervals

LeetCode 56 · Medium · Sorting plus interval merging · Monday, 31 August 2026 · ~30 min, 2 attempts

## Problem

Merge all overlapping intervals and return the result. Touching ends count as
overlapping.

```
[[1,3],[2,6],[8,10],[15,18]]  ->  [[1,6],[8,10],[15,18]]
[[1,4],[4,5]]                 ->  [[1,5]]
```

## Where I started

My first thought was "compare every interval with every other one and merge
whenever they touch". That is `O(n^2)` and, worse, merging changes the list
while I am iterating it, so a merged interval may now overlap something I
already walked past. I would need to keep re-running the whole pass until
nothing changes.

The fix is the usual one: **take the disorder out of the problem first.** Sort
by start. Then anything that can overlap the interval I am currently building
is sitting right next to it, and one left-to-right pass is enough.

## The sweep

Keep the output list, and only ever look at its **last** entry:

```js
if (cur[0] <= last[1]) {
  if (cur[1] > last[1]) last[1] = cur[1];   // extend
} else {
  out.push(cur);                            // gap, start fresh
}
```

Why checking only the last entry is enough: starts are non-decreasing, so if
`cur` does not reach back to `last[1]`, it certainly does not reach anything
earlier in the output, because those all ended before `last` did.

The condition is `<=` and not `<` because `[1,4]` and `[4,5]` have to merge.
That is a problem-statement detail, not a logic one, and it is the kind of thing
I would get wrong under time pressure.

## The bug: `.sort()` with no comparator

This cost me the second attempt and it is pure JavaScript, not algorithms.

```js
const sorted = intervals.slice().sort();   // wrong
```

`Array.prototype.sort` with no comparator converts every element to a **string**
and sorts lexicographically. For arrays of arrays that means comparing
`"2,6"`, `"1,3"`, `"10,12"`:

```
[[2,6],[1,3],[10,12]].sort()  ->  [[1,3],[10,12],[2,6]]
```

`"10,12"` sorts before `"2,6"` because `'1' < '2'`. My sweep then saw
`[1,3]`, `[10,12]`, `[2,6]` and produced `[[1,3],[10,12]]` - it dropped the
overlap between `[1,3]` and `[2,6]` entirely and silently. With single-digit
test data everything passed, which is how it survived the first run.

`.sort((a, b) => a[0] - b[0])` and it is correct. I have been bitten by this on
plain number arrays before, but I had never thought about what it does to nested
arrays. There is a test with a two-digit start in the file now specifically to
catch it.

Second, smaller thing: `.sort()` sorts **in place**, so sorting the caller's
array reorders their data. And `intervals.slice()` is not enough either, because
I mutate `last[1]`, which would write through to their inner arrays - the same
shallow-copy lesson as Day 056. So:
`intervals.map((pair) => pair.slice())` before sorting, and a test that asserts
the input is untouched afterwards.

## Dry run

Input `[[1,3],[2,6],[8,10],[15,18]]` (already sorted by start)

| i | cur      | last in out | `cur[0] <= last[1]`? | action                    | out                     |
| - | -------- | ----------- | -------------------- | ------------------------- | ----------------------- |
| - | -        | -           | -                    | seed with first           | `[[1,3]]`               |
| 1 | `[2,6]`  | `[1,3]`     | 2 <= 3 yes           | extend end 3 -> 6         | `[[1,6]]`               |
| 2 | `[8,10]` | `[1,6]`     | 8 <= 6 no            | push                      | `[[1,6],[8,10]]`        |
| 3 | `[15,18]`| `[8,10]`    | 15 <= 10 no          | push                      | `[[1,6],[8,10],[15,18]]` |

And the containment case `[[1,10],[2,3]]`: `2 <= 10` so they merge, and
`max(10, 3)` keeps the end at 10. Without the `max` I would return `[[1,3]]`,
which is the other classic way to get this wrong.

## Complexity

| | |
| ----- | ----- |
| Time  | `O(n log n)` - the sort; the sweep itself is `O(n)` |
| Space | `O(n)` - the copy and the output |

Can't beat `n log n` in general: merging in linear time would sort numbers in
linear time, by turning each `x` into `[x, x]`.

## End of month 2

Last day of August, so looking back at the month as a whole:

- **Trees stopped being scary.** Day 052 to Day 055 all came down to "pick the
  traversal that matches the question" - levels need a queue, ordering needs
  inorder, navigation needs the BST property. Day 053 was the one that taught me
  something real: a subtree property is not a parent-child property.
- **Graphs were the hardest part**, and Day 058 is the only day this month I
  gave up and read about the algorithm instead of deriving it. In-degrees are
  not something I would have invented. Days 056 and 057 were easier than
  expected: once "the grid is a graph" lands, the rest is the neighbour loop
  plus picking DFS or BFS.
- **DP took the most attempts** (Day 060, four of them) but the least surprise.
  Day 059 was Day 019 with a `max` instead of a `+`, and Day 060 was the first
  time I had to be careful about the *representation* (`Infinity`) rather than
  the recurrence.

Pattern I keep coming back to: almost every medium this month was an easy
problem plus one bookkeeping decision. The algorithm is rarely the hard bit.

## Takeaway

If the input order is arbitrary and the answer is about neighbours, sort
first. After sorting, "compare with the last thing I kept" replaces "compare
with everything".
