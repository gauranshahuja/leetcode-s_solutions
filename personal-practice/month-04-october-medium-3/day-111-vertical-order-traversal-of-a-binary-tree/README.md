# Day 111 - Vertical Order Traversal of a Binary Tree

LeetCode 987 · Medium · BFS plus sorting by column · Tuesday, 20 October 2026 · ~40 min, 3 attempts

## Problem

Assign each node a `(row, col)`: root is `(0, 0)`, a left child is
`(row+1, col-1)`, a right child is `(row+1, col+1)`. Report values grouped by
column, columns left to right, and within a column top row first.

The rule that makes this a Medium: if two nodes share the **same row and the
same column**, the one with the **smaller value** comes first.

```
      1
     / \
    2   3
   / \ / \
  4  5 6  7

->  [[4], [2], [1, 5, 6], [3], [7]]
```

`5` (right child of 2) and `6` (left child of 3) both land at `(2, 0)`.

## Approach

BFS from the root carrying `(row, col)` with each node, bucket into a
`Map` keyed by column, then sort.

```js
const queue = [[root, 0, 0]];
for (let i = 0; i < queue.length; i += 1) {
  const [node, row, col] = queue[i];
  if (node.left)  queue.push([node.left,  row + 1, col - 1]);
  if (node.right) queue.push([node.right, row + 1, col + 1]);
}
```

Index pointer instead of `shift()`, same reason as Day 108: `shift()` reindexes
the array, so a shift-based BFS goes quadratic on a wide level. Nothing is ever
removed, `i` just walks forward and the array grows behind it.

## What BFS gives you and what it does not

**Gives you:** rows in non-decreasing order. A column's entries arrive top-down
on their own, so no row sort is strictly needed.

**Does not give you:** the same-row tie-break. Within a row, BFS visits in
*parent* order - everything under node `2` before everything under node `3`.
For the example that happens to produce `5, 6`, which is also value order, so
it looks fine. Feed it `[1,2,3,4,6,5,7]` - the same tree with those two leaves
swapped - and BFS now reaches `6` first, both still at `(2, 0)`, but the answer
must still be `[1, 5, 6]`. That was attempt 2 failing, and it is exactly the
hidden case people lose this problem to.

So the comparator has to be explicit:

```js
.sort((a, b) => a[0] - b[0] || a[1] - b[1])   // row, then value
```

I sort by row too, even though BFS already ordered it: it costs nothing and the
function stays correct if I ever switch the walk to DFS.

## The Map ordering trap

Attempt 1 did this and I assumed the output was sorted:

```js
return [...byCol.values()].map(...)   // wrong
```

`Map` iterates in **insertion order**, which here is the order each column was
first discovered by BFS: `0, -1, 1, -2, 2` for the example tree. Nothing like
left to right.

A plain object does not save you either - the ascending-numeric key treatment
only applies to non-negative array indices, and `-1` coerces to the regular
string key `"-1"`. Columns here are negative by definition.

So sort the keys and index back in, with a numeric comparator because the
default one compares stringified numbers:

```js
const columns = [...byCol.keys()].sort((a, b) => a - b);
```

## Dry run

`[3, 1, 4, 0, 2, 2, 5]`:

```
       3
      / \
     1   4
    / \ / \
   0  2 2  5
```

| node | row | col | bucket after                |
| ---- | --- | --- | --------------------------- |
| 3    | 0   | 0   | `0: [(0,3)]`                |
| 1    | 1   | -1  | `-1: [(1,1)]`               |
| 4    | 1   | 1   | `1: [(1,4)]`                |
| 0    | 2   | -2  | `-2: [(2,0)]`               |
| 2    | 2   | 0   | `0: [(0,3), (2,2)]`         |
| 2    | 2   | 0   | `0: [(0,3), (2,2), (2,2)]`  |
| 5    | 2   | 2   | `2: [(2,5)]`                |

Map key order: `0, -1, 1, -2, 2`. Sorted: `-2, -1, 0, 1, 2`.
Result: `[[0], [1], [3, 2, 2], [4], [5]]`

## Attempt 3 was a test bug, not a code bug

I wrote a negative-values test expecting `[1, -5, -6]` for column 0, the
comparator said `[1, -6, -5]`, and I went hunting in the code. "Smaller value
first" means smaller *number*, and `-6 < -5`. My expected value was wrong, not
the sort. Worth noting because "smaller" quietly reads as "earlier" when every
example is positive.

## Complexity

| | |
| --- | --- |
| Time | `O(n log n)` - the column sort plus the per-bucket sorts; the BFS itself is `O(n)` |
| Space | `O(n)` for the queue, the buckets and the output |

Tracking min/max column during the walk and bucketing into an offset array
would drop the column sort, but the within-column tie-break still needs one, so
the bound does not move.

## Note to self

When a traversal *almost* produces the required order, write the comparator
anyway. "BFS already sorts the rows" is true, and it is the kind of true that
makes you skip the tie-break that is actually being tested.
