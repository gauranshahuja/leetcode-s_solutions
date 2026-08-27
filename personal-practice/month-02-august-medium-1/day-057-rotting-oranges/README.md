# Day 057 - Rotting Oranges

LeetCode 994 · Medium · Multi-source BFS on a grid · Thursday, 27 August 2026 · ~50 min, 3 attempts

## Problem

Grid of `0` (empty), `1` (fresh orange), `2` (rotten orange). Every minute,
every rotten orange rots its 4-directional fresh neighbours. Return the minutes
until no fresh orange is left, or `-1` if that never happens.

```
2 1 1        2 2 1        2 2 2        2 2 2        2 2 2
1 1 0   ->   2 1 0   ->   2 2 0   ->   2 2 0   ->   2 2 0
0 1 1        0 1 1        0 1 1        0 2 1        0 2 2
 min 0        min 1        min 2        min 3        min 4   -> 4
```

## Why yesterday's answer is wrong here

My first instinct was literally "Day 056 but with oranges": walk the grid, DFS
from each `2`, mark everything it can reach. That does find out *which* oranges
eventually rot, so it would get the `-1` case right. It cannot get the number of
minutes right.

DFS commits to one direction and runs to the end of it before looking at the
others. So from `(0,0)` it might reach `(2,2)` by snaking down the left side and
along the bottom, recording a depth of 5, when the real rot arrives in 4 minutes
by a different path. Depth in a DFS is "length of the path I happened to take",
not "length of the shortest path".

BFS expands in rings: everything one step away, then everything two steps away.
The first time a cell is reached, it is reached by a shortest path. **If the
answer is a time or a distance, it has to be BFS.** That is the sentence I want
to remember out of today.

## Multi-source

The second thing I got wrong: I ran a BFS from the first rotten orange, then
another from the next one, and took the minimum per cell. Correct, but silly -
it is one BFS per source.

Instead, push **all** the rotten oranges into the queue before the loop starts.
They sit at distance 0 together, the first ring is everything adjacent to *any*
of them, and each fresh cell is claimed by whichever front gets there first.
One pass, and "first" is already "earliest" because of how BFS orders things.

The test `two sources meet in the middle, so it is 2 and not 4` is the one that
proves it:

```
2 1 1
1 1 1
1 1 2
```

From the top-left corner alone the far corner is 4 steps away. With both
corners seeded the worst cell is only 2 minutes from the nearer source.

## The counting ending

I spent a while trying to decide "are all oranges rotten now?" by rescanning the
grid at the end. Simpler: count the fresh oranges during the initial scan and
decrement `fresh` every time one is rotted. At the end,
`fresh === 0 ? minutes : -1`. No second scan, and the `fresh > 0` condition in
the `while` also stops the loop from running a pointless extra round.

Two edge cases fell out of this and both are real LeetCode tests:

- `[[0, 2]]` - no fresh oranges at all, answer is `0`, not `1`. The early
  `if (fresh === 0) return 0;` handles it before the loop can increment.
- `[[1]]` - one fresh orange, no source. The queue is empty, the loop body never
  runs, `fresh` is still 1, so `-1`. Correct by accident, but I checked it.

## Dry run of example 1

Starting scan: queue `[(0,0)]`, `fresh = 6`.

| minute | front being drained | rots                | fresh left |
| ------ | ------------------- | ------------------- | ---------- |
| 1      | (0,0)               | (0,1), (1,0)        | 4          |
| 2      | (0,1), (1,0)        | (0,2), (1,1)        | 2          |
| 3      | (0,2), (1,1)        | (2,1)               | 1          |
| 4      | (2,1)               | (2,2)               | 0          |

Loop exits on `fresh > 0` being false, returns `minutes = 4`.

Note `(1,2)` is a `0` and is never touched, which is why `(2,2)` has to be
reached the long way round through the bottom row.

## Bits of code I reused without thinking

- the `DIRS` delta array from yesterday, unchanged
- `grid.map((row) => row.slice())` so the caller's grid survives, same per-row
  copy lesson as Day 056
- `head` index instead of `queue.shift()`, same as Day 052
- "mark the cell when you push it, not when you pop it" - here it is extra
  important, because two different fronts can be adjacent to the same fresh
  orange in the same minute, and without marking at push time `fresh` would be
  decremented twice and go negative

## Complexity

| | |
| ----- | ----- |
| Time  | `O(r * c)` - every cell enters the queue at most once |
| Space | `O(r * c)` - grid copy plus queue |

## Takeaway

Same grid, same neighbour loop, different question, different traversal.
"Which cells are connected?" -> DFS is fine. "How far / how long?" ->
BFS, and seed every source at once if there is more than one.
