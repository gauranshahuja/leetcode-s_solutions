# Day 118 - 01 Matrix

LeetCode 542 · Medium · Multi-source BFS · Tuesday, 27 October 2026 · ~20 min, 1 attempt

## Problem

Replace each cell with its distance to the nearest `0`, moving only in the four
cardinal directions.

```
input            output
0 0 0            0 0 0
0 1 0     ->     0 1 0
1 1 1            1 2 1
```

## Which template fits

"Shortest distance in an unweighted grid" is BFS, no question. The only real
decision is **what goes in the queue first**, and that is where this problem
earns its medium rating.

The obvious reading is "for each 1, find the nearest 0", which turns into a BFS
starting at every 1. With `m*n` cells, each BFS can touch the whole grid before
it finds a zero, so that is `O((m*n)^2)`. For the 200x200 case in the
constraints that is 1.6 billion cell visits, and LeetCode allows up to 10^4
cells per side in some variants. Not viable.

Invert it: **run one BFS that starts from all the zeros simultaneously.** Push
every zero with distance 0, then flood outwards. The first time the flood
reaches a cell is the shortest distance to the *nearest* source, because BFS
expands the entire frontier one ring at a time - a cell cannot be reached at
distance 3 by one source if another source would have reached it at distance 2,
since every distance-2 cell was dequeued before any distance-3 cell was
enqueued.

One BFS, every cell enqueued exactly once: `O(m*n)`.

## Same shape as Day 057

Day 057 was Rotting Oranges, which is literally this: all the rotten oranges go
into the queue at once and the answer is how many rings the flood needed. There
I returned the final minute count; here I keep the per-cell arrival time, which
the BFS was already computing and I was throwing away.

Seeing that straight away is the reason today took twenty minutes instead of an
hour. The template is "multi-source BFS", and recognising that the sources are
the zeros - not the ones - is the entire insight.

## Dry run

`mat = [[0,1,1],[1,1,1],[1,1,1]]`, one source at `(0,0)`.

`dist` starts as all `-1` (which doubles as "not visited"), then the single zero
is seeded.

| ring | dequeued | newly set | dist grid |
| ---- | -------- | --------- | --------- |
| 0 | `(0,0)` | `(0,1)=1`, `(1,0)=1` | `0 1 -1 / 1 -1 -1 / -1 -1 -1` |
| 1 | `(0,1)` | `(0,2)=2`, `(1,1)=2` | `0 1 2 / 1 2 -1 / -1 -1 -1` |
| 1 | `(1,0)` | `(2,0)=2` | `0 1 2 / 1 2 -1 / 2 -1 -1` |
| 2 | `(0,2)` | `(1,2)=3` | - |
| 2 | `(1,1)` | `(2,1)=3` | `(0,2)` and `(1,0)` already set, skipped |
| 2 | `(2,0)` | - | `(1,0)` and `(2,1)` already set |
| 3 | `(1,2)`, `(2,1)` | `(2,2)=4` | `0 1 2 / 1 2 3 / 2 3 4` |

Note `(1,1)` tried to visit `(1,0)` and found `dist = 1` already there. The
`if (dist[nr][nc] !== -1) continue` guard is what makes each cell cost `O(1)`
total rather than `O(1)` per neighbour that reaches it.

## Two JS details that matter here

**Row aliasing.** This is the trap I almost walked into again:

```js
const dist = new Array(rows).fill(new Array(cols).fill(-1));   // WRONG
```

`fill` puts the *same* array object in every slot, so writing `dist[0][0]`
changes column 0 of every row. `Array.from({ length: rows }, () => ...)` calls
the factory per row and gives genuinely separate arrays. Same reason the brute
force copies with `mat.map((row) => row.slice())` instead of `mat.map((row) => row)`.

**The queue head.** `queue.shift()` is `O(n)` in V8 because it re-indexes, so a
BFS over 40,000 cells with `shift` is quadratic for no reason. I keep a `head`
index and let the array grow. I also store cells as `r * cols + c` integers
rather than `[r, c]` pairs, which skips one array allocation per cell.

## Complexity

| Version | Time | Space |
| ------- | ---- | ----- |
| Scan every 0 for every 1 (or BFS from each 1) | `O((m*n)^2)` | `O(m*n)` |
| Multi-source BFS | `O(m*n)` | `O(m*n)` |

I kept the brute force in the file as a cross-check. Because the grid has no
walls, "nearest zero" is just the smallest Manhattan distance, which makes the
brute force trivially correct and a good oracle for the BFS - but it is the same
`O((m*n)^2)` cost as BFS-from-each-1, so it is only there for testing.

There is also a two-pass DP for this problem (sweep top-left to bottom-right
taking `min(up, left) + 1`, then bottom-right to top-left taking
`min(down, right) + 1`) which is `O(m*n)` with `O(1)` extra space. It only works
because there are no obstacles. BFS survives walls, so I prefer it as the thing
to remember.

## Takeaway

When "from each X, find the nearest Y" is too slow, flip the direction and
flood from all the Ys at once. Multi-source BFS computes every answer in a
single pass, and the cost drops from quadratic to linear without any
cleverness beyond deciding what to seed the queue with.
