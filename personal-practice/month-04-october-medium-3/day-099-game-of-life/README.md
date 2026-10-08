# Day 099 - Game of Life

LeetCode 289 · Medium · Matrix, in-place bit encoding · Thursday, 8 October 2026 · ~40 min, 2 attempts

## Problem

Advance Conway's Game of Life by one generation on an `m x n` grid of `0`/`1`.

| current | live neighbours | next |
| ------- | --------------- | ---- |
| 1       | < 2             | 0    |
| 1       | 2 or 3          | 1    |
| 1       | > 3             | 0    |
| 0       | exactly 3       | 1    |
| 0       | anything else   | 0    |

Neighbours are the 8 surrounding cells, diagonals included.

```
[[0,1,0],        [[0,0,0],
 [0,0,1],   ->    [1,0,1],
 [1,1,1],         [0,1,1],
 [0,0,0]]         [0,1,0]]
```

Two constraints make it a problem: all cells update **simultaneously** from the
current state, and the follow-up wants it **in place** plus a word on infinite
boards.

## The obvious version, and why it is cheating

Copy the board, read from the copy, write to the original. Correct, 15 lines,
`O(m*n)` extra space. The problem asks for in place, so that was the version I
wrote to confirm my neighbour counting and then deleted.

My attempt 1 skipped the copy and wrote directly into `board`. That fails in a
specific way worth recording: cells to the right and below the one just written
read the **new** value as their current state, so the generation smears
diagonally. The top rows of the output are correct and it goes wrong partway
down, which is maddening to debug.

## The insight

A cell only needs **one bit**, but the array holds a whole JS number. So use a
second bit as scratch space:

| bit | holds              |
| --- | ------------------ |
| 0   | current generation |
| 1   | next generation    |

```js
live += board[nr][nc] & 1;      // reads always see the OLD generation
...
board[r][c] |= next << 1;       // write goes into bit 1, bit 0 untouched
```

Because every read masks with `& 1`, it does not matter how many cells have
already been stamped: bit 0 is still the original board everywhere. Then one
more pass:

```js
board[r][c] >>= 1;              // drop the old state, promote the new
```

Mid-run the cell values are 0, 1, 2 or 3, read as the pair `(next, current)`:

| value | binary | meaning                 |
| ----- | ------ | ----------------------- |
| 0     | `00`   | was dead, stays dead    |
| 1     | `01`   | was alive, will die     |
| 2     | `10`   | was dead, will be born  |
| 3     | `11`   | was alive, stays alive  |

Genuinely in place: no second matrix, `O(1)` extra space, and the caller's array
is the one that changes. There is a test for that last part
(`returned === original`), because it is easy to pass the value tests while
quietly returning a new array.

## Dry run

`[[1,1],[1,0]]`. Neighbour counts first (every cell neighbours every other in a
2x2):

| cell  | state | live neighbours | next |
| ----- | ----- | --------------- | ---- |
| (0,0) | 1     | 2 (0,1 and 1,0) | 1    |
| (0,1) | 1     | 2 (0,0 and 1,0) | 1    |
| (1,0) | 1     | 2 (0,0 and 0,1) | 1    |
| (1,1) | 0     | **3**           | 1    |

Board after pass 1: `[[3,3],[3,2]]`. After `>>= 1`: `[[1,1],[1,1]]`

The dead corner coming alive on exactly 3 neighbours is the rule I kept
forgetting to implement at all on the first pass, because the live-cell rules
are the memorable ones.

## A neater way to write the rules

Four `if` branches collapse to one line: a cell is alive next generation **iff**
it has exactly 3 live neighbours, or it is already alive and has exactly 2.

```js
const next = live === 3 || (alive && live === 2) ? 1 : 0;
```

## The infinite board follow-up

With an unbounded grid you cannot allocate it at all, so the representation has
to change: store a `Set` of `"r,c"` keys (or `r * BIG + c`) for the live cells
only, since all but finitely many cells are dead.

One generation becomes: for every live cell, increment a counter for each of its
8 neighbours in a `Map`. That Map's keys are then exactly the cells that *could*
be alive next round, since a cell with 0 live neighbours is either staying dead
or dying. Walk the Map once applying the rules. Cost is `O(live cells)` instead
of `O(board area)`, which is also the right answer for a big sparse finite
board. The bit trick does not survive that change - it is a trick about dense
fixed-size storage, not about the game.

## Complexity

| approach        | time       | space      |
| --------------- | ---------- | ---------- |
| copy the board  | `O(m * n)` | `O(m * n)` |
| two-bit in place| `O(m * n)` | `O(1)`     |
| live-cell Set   | `O(L)`     | `O(L)`     |

The 8 neighbour reads per cell are a constant, so both grid versions are linear
in the number of cells.

## Takeaway

When a grid must update simultaneously in place, look for spare room inside
each cell rather than beside the grid. One bit for "now", one bit for
"next", mask on read, shift at the end.

Same shape as the "negate a value to mark it visited" trick, except reversible
and it does not care about signs.
