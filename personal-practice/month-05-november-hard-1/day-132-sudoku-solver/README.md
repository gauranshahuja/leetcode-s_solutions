# Day 132 - Sudoku Solver

LeetCode 37 · Hard · Backtracking with constraint sets · Tuesday, 10 November 2026 · ~55 min, 3 attempts

Day 131 was "place one thing per row, columns and diagonals must not clash".
This is "place one thing per blank, rows and columns and boxes must not clash".
Same animal, bigger constraint table.

## Problem

Fill every `.` in a 9x9 grid so each row, each column and each 3x3 box holds the
digits 1-9 exactly once. Cells are single-character strings. Must be done
**in place** - the caller keeps its own array.

```
5 3 .  . 7 .  . . .          5 3 4  6 7 8  9 1 2
6 . .  1 9 5  . . .          6 7 2  1 9 5  3 4 8
. 9 8  . . .  . 6 .          1 9 8  3 4 2  5 6 7
8 . .  . 6 .  . . 3    ->    8 5 9  7 6 1  4 2 3
4 . .  8 . 3  . . 1          4 2 6  8 5 3  7 9 1
7 . .  . 2 .  . . 6          7 1 3  9 2 4  8 5 6
. 6 .  . . .  2 8 .          9 6 1  5 3 7  2 8 4
. . .  4 1 9  . . 5          2 8 7  4 1 9  6 3 5
. . .  . 8 .  . 7 9          3 4 5  2 8 6  1 7 9
```

## Where I started

Straight brute force: for each blank, try 1-9, and check legality by scanning
the row, the column and the box. That is 27 cell reads per candidate per cell,
and it genuinely does work - but it is doing the same scans tens of thousands of
times over.

## The structure that fixes it

Keep the answer to "what is already used" instead of recomputing it:

```js
rows[r]  // Set of digits used in row r
cols[c]  // Set of digits used in column c
boxes[b] // Set of digits used in box b
```

Built once from the givens, then maintained by the search: three `add`s when a
digit goes down, three `delete`s when it comes back up. Legality is three `has`
calls. That is the entire difference between the two versions.

Box numbering is the only arithmetic:

```js
boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3)
```

Rows 0-2 / cols 0-2 is box 0, rows 0-2 / cols 6-8 is box 2, rows 6-8 / cols 6-8
is box 8.

I also collect the blanks into a flat `empties` list up front, so the recursion
is `fill(k)` over an index instead of hunting for the next `.` each call.

## Dry run - the first row of the example

| cell  | row has | col has | box has     | candidates | picks |
| ----- | ------- | ------- | ----------- | ---------- | ----- |
| (0,2) | 5,3,7   | 8       | 5,3,6,9,8   | 1, 2, 4    | 1     |
| (0,3) | 5,3,1,7 | 1,8,4   | 7,1,9,5     | 2, 6       | 2     |
| (0,4) | given 7 | -       | -           | -          | -     |
| (0,5) | 5,3,1,7,2 | 5,3,9 | 7,1,9,5,2   | 4, 6, 8    | 4     |

The real answer has `4` at `(0,2)`, so that first branch is doomed - it just
does not find out for a while. Eventually some cell deeper down has zero
candidates, `fill` returns `false` all the way back up here, the `1` is undone
and it tries `2`, then `4`.

Instrumented node counts (one count per digit actually written to the board):

| puzzle            | blanks | placements |
| ----------------- | ------ | ---------- |
| LeetCode example  | 51     | 4,208      |
| the harder one    | 54     | 13,528     |

So even a 3-clue difference roughly triples the work. That is the shape of the
search space.

## The bug that cost me the third attempt

Box index. I wrote it as:

```js
const b = Math.floor(r / 3) + Math.floor(c / 3) * 3;   // wrong
```

which is the box index of the *transposed* grid. It is self-consistent, so the
solver happily produced a grid where every row and column was perfect and three
of the boxes had duplicates. Worse, it still passed my first two tests, because
I had only checked rows and columns.

That is why the verifier in the file walks all 27 groups and computes the box
cells its own way (`[i/3*3 + j/3][(i%3)*3 + (j%3)]`) rather than calling
`boxIndex`. If the verifier reuses the solver's helper, it cannot catch the
solver's helper being wrong.

Smaller one I nearly shipped: writing `board[r][c] = d` with `d` a **number**
while the sets hold strings. `rows[r].has('5')` is `false` when the set contains
the number `5`, so it cheerfully placed duplicate digits. `String(d)` once, at
the top of the loop.

## Follow-up to try

The classic speedup is picking the **most constrained cell** first (minimum
remaining values) instead of walking `empties` in index order: at each step,
choose the blank with the fewest legal digits. A cell with one candidate gets
forced immediately and never generates a branch, so the tree gets much thinner.
It costs an O(81) scan per node, which is a bad trade on easy puzzles and a very
good one on 17-clue puzzles. Worth coming back to with the bitmask popcount
trick from yesterday, since "how many candidates" is then just
`popcount(~(rows[r] | cols[c] | boxes[b]))`.

## Complexity

- Time: exponential in the worst case. The real bound is "however much the 27
  constraints prune", which for a well-formed puzzle is small.
- Space: `O(1)` really - 27 sets of at most 9 entries, an 81-long blank list,
  recursion depth at most 81.

## Note to self

Constraint sets are not an optimisation you bolt on, they are the data model.
Decide what "already used" means, keep it in sync with the board, and the
search code becomes four lines.
