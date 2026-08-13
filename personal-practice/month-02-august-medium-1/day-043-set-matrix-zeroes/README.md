# Day 043 - Set Matrix Zeroes

LeetCode 73 · Medium · Matrix, O(1) extra space · Thursday, 13 August 2026 · ~45 min, 3 attempts

## Problem

If `matrix[i][j] === 0`, blank out all of row `i` and all of column `j`. In
place.

```
[[1,1,1],          [[1,0,1],
 [1,0,1],    ->     [0,0,0],
 [1,1,1]]           [1,0,1]]
```

## My first (wrong) idea

Blank as I go:

```js
for (let i = 0; i < m; i += 1)
  for (let j = 0; j < n; j += 1)
    if (matrix[i][j] === 0) blankRowAndCol(i, j);   // wrong
```

This floods. The zeroes I write are indistinguishable from the zeroes that
were there to begin with, so the next cell I visit sees a fresh 0 and blanks
another row, and three iterations later the whole matrix is zero. Mutating the
thing I am still scanning, again.

## The fix that works but costs memory

Two passes with the decision separated from the writing:

```js
const rows = new Set();
const cols = new Set();
// pass 1: record
// pass 2: if (rows.has(i) || cols.has(j)) matrix[i][j] = 0;
```

That is correct and took about five minutes. `O(m + n)` extra space though,
and the follow-up on the problem page specifically asks for `O(1)`.

## The insight

I don't need *new* memory for those two sets. Row 0 and column 0 are already
`m + n` cells of storage, and if either of them ends up needing to be blanked,
whatever I scribbled there gets overwritten anyway.

```
matrix[i][0] === 0   ->  row i gets blanked
matrix[0][j] === 0   ->  column j gets blanked
```

The collision is `matrix[0][0]`, which both schemes want. So row 0 gets taken
out of the marker system entirely: one boolean `firstRowHasZero`, read before
any marker is written, applied at the very end. `matrix[0][0]` then means
"column 0 needs blanking" and nothing else.

## Why the apply pass runs backwards

This is the part I got wrong on attempt 2. `matrix[i][0]` is simultaneously:

- row `i`'s marker, and
- a real cell that may need to be blanked.

So if the inner loop goes left to right, `j = 0` is handled first, I set
`matrix[i][0] = 0`, and now every remaining cell in the row reads
"row i is marked" even when it wasn't. Whole row wrongly blanked.

Going right to left, the marker cell is the **last** thing written in its own
row, so every read of it happened while it still meant what it said. Row 0 is
never touched by that loop at all, which is why the column markers survive to
the end.

## Dry run

`[[1,0,3],[4,5,6],[7,8,0]]` - the case that caught me, because row 0 has a
real zero *and* has to hold markers.

| stage | matrix | note |
| ----- | ------ | ---- |
| start | `1 0 3 / 4 5 6 / 7 8 0` | |
| read row 0 | same | `firstRowHasZero = true` |
| mark (2,2) | `1 0 0 / 4 5 6 / 0 8 0` | set `matrix[2][0]` and `matrix[0][2]` |
| apply row 2 | `1 0 0 / 4 5 6 / 0 0 0` | its own marker is 0 |
| apply row 1 | `1 0 0 / 4 0 0 / 0 0 0` | cols 1 and 2 marked, col 0 is not |
| row 0 last | `0 0 0 / 4 0 0 / 0 0 0` | the flag fires |

Final cell `matrix[1][0]` stays 4, which is right: row 1 had no zero and
column 0 had no zero.

## Complexity

- Time `O(m * n)` - three sweeps, no nesting beyond the grid.
- Space `O(1)` - one boolean. The sets version was `O(m + n)`.

## Pattern to remember

When a problem wants `O(1)` space on a grid, look for cells whose current
contents you are allowed to destroy, and keep the bookkeeping there. Then
work out which of those cells is read last and write it last.

Related to Day 042 in spirit: both are "stop allocating a second grid and
think about the order of the writes instead".
