# Day 087 - Number of Provinces

LeetCode 547 · Medium · Union-Find · Saturday, 26 September 2026 · ~30 min, 2 attempts

## Problem

Count connected components, except the input is an **adjacency matrix** rather
than an edge list or a grid.

```
isConnected = [[1,1,0],
               [1,1,0],
               [0,0,1]]

cities 0 and 1 are linked, city 2 is alone  ->  2 provinces
```

Two details in the input format that change the loops:

- the matrix is symmetric, so `[i][j]` and `[j][i]` are the same edge
- the diagonal is always 1, every city is "connected to itself"

So scanning the whole `n x n` is doing every edge twice plus `n` useless
self-edges. Scanning `j > i` only is the same work halved.

## Why I picked DSU

A DFS over the matrix is also `O(n^2)` and is, honestly, slightly simpler for
this exact question. I wrote both (`findCircleNumDfs` is in the file) and they
are the same length.

I went with union-find because of what it gives me that DFS does not:

- the component count is **maintained**, not computed. `DSU.count` starts at
  `n` and drops by one on every union that actually merges two different roots,
  so the answer is correct at every point in the loop, not only at the end.
- that makes it the structure for the streaming version of this question
  ("after each new road is built, how many provinces are there now?"), which
  DFS answers only by re-running from scratch.

DFS is the better choice when the graph is sparse and stored as a list, since
then it is `O(V + E)` and DSU still has to be fed the edges one by one. Here the
matrix read is `O(n^2)` whatever I do, so the structure is free to be the nicer
one. I did not write my own: `lib/structures` already has a DSU with path
halving and union by rank, and it tracks `count`.

## Dry run

```
isConnected = [[1,1,0,0],
               [1,1,1,0],
               [0,1,1,0],
               [0,0,0,1]]
```

| i, j | cell | union     | parent after        | count |
| ---- | ---- | --------- | ------------------- | ----- |
| -    | -    | -         | `[0,1,2,3]`         | 4     |
| 0,1  | 1    | merge     | `[0,0,2,3]`         | 3     |
| 0,2  | 0    | skip      | `[0,0,2,3]`         | 3     |
| 0,3  | 0    | skip      | `[0,0,2,3]`         | 3     |
| 1,2  | 1    | merge     | `[0,0,0,3]`         | 2     |
| 1,3  | 0    | skip      | `[0,0,0,3]`         | 2     |
| 2,3  | 0    | skip      | `[0,0,0,3]`         | 2  |

City 0 and city 2 are never directly linked. They land in the same province
because `find(2)` walks up to 0. That is the case that separates "count rows
with a 1 in them" style wrong answers from a real component count, so it is in
the tests.

## The bug

My first version did not use `dsu.count` at all. I counted edges instead:

```js
let merges = 0;
for (let i = 0; i < n; i += 1)
  for (let j = i + 1; j < n; j += 1)
    if (isConnected[i][j] === 1) { dsu.union(i, j); merges += 1; }
return n - merges;
```

"Each merge removes one component, so subtract." That is true of merges, but not
of edges. A triangle (0-1, 0-2, 1-2) has three edges and only two of them merge
anything: the third one finds both cities already sharing a root. On three
cities it returns 0 provinces instead of 1.

The DSU in `lib/structures` already answers this properly - `union` returns
`false` when the two were already connected, and `count` is only decremented on
a real merge. So the fix was to delete my counter and read `dsu.count`. There is
a test with a triangle in the file now so that version cannot come back.

## Complexity

| Version     | Time                   | Space  |
| ----------- | ---------------------- | ------ |
| Union-Find  | `O(n^2)` plus near-constant find/union | `O(n)` |
| DFS         | `O(n^2)`               | `O(n)` |

The `a(n)` inverse-Ackermann factor from path compression plus union by rank is
below 5 for any input that fits in memory, so it does not show up next to the
`n^2` matrix read.

## Pattern to remember

Components in a static graph: DFS or DSU, pick either. Components that have
to stay correct while edges arrive: DSU, no contest.

Day 056 and Day 058 both walked graphs that were handed to me whole. This is the
first one where the structure, not the traversal, is the thing worth keeping.
