# Day 070 - Search a 2D Matrix II

LeetCode 240 · Medium · Staircase search from a corner · Wednesday, 9 September 2026 · ~35 min, 2 attempts

## Problem

Rows sorted left to right, columns sorted top to bottom. Is `target` in the
matrix?

```
 1   4   7  11  15
 2   5   8  12  19
 3   6   9  16  22
10  13  14  17  24
18  21  23  26  30

target = 5   -> true
target = 20  -> false
```

The trap is thinking this is LeetCode 74 with a different picture. It is not:
there, each row started above where the previous one ended, so flattening gave
one sorted list and a single binary search over `m*n` worked. Here row 3 starts
at 10 while row 2 already reached 19. Flattening gives `1,4,7,11,15,2,5,...`
which is not sorted, so the flatten-and-binary-search idea is simply wrong on
this input, not just slow.

## Where I started

Rows are sorted, so binary search each row: `O(m log n)`. That is a completely
reasonable answer and I wrote it in five minutes
(`searchMatrixPerRow`, still in the file). For a 1000 x 1000 matrix it is about
10,000 comparisons.

But the columns are sorted too, and that version throws that information away
entirely. If both directions carry information there should be a way to use
both.

## The insight: start in a corner where the comparison is unambiguous

Take the **top-right** cell, `matrix[0][n-1]`. It is:

- the **largest** in its row
- the **smallest** in its column

That double role is what makes one comparison decisive:

| comparison | what it tells me | move |
| ---------- | ---------------- | ---- |
| `value > target` | everything below it in this column is even bigger, so the target is not anywhere in this column | `col--` |
| `value < target` | everything to its left in this row is even smaller, so the target is not anywhere in this row | `row++` |
| `value === target` | found | - |

So **every single comparison deletes a whole row or a whole column.** There
are `m + n` of them to delete, so the loop runs at most `m + n` times. For
1000 x 1000 that is 2000 comparisons instead of 10,000, and it is five lines
of code with no binary search in it at all.

```js
let row = 0, col = n - 1;
while (row < m && col >= 0) {
  if (matrix[row][col] === target) return true;
  if (matrix[row][col] > target) col--;
  else row++;
}
return false;
```

Bottom-left (`matrix[m-1][0]`) works the same way with the moves flipped:
too big means go up, too small means go right.

## Why the top-left corner cannot work

This is the part I wanted to be sure about rather than just remember.

`matrix[0][0]` is the **smallest** in its row **and** the smallest in its
column. So if `matrix[0][0] < target` - which is the only interesting case -
the target could be further right, or further down, or both. Nothing is
eliminated. One comparison, zero information, and the "search" degenerates into
exploring both branches, which is the whole matrix.

Same for bottom-right: largest in its row and largest in its column, so
`value > target` leaves left and up both open.

The usable corners are exactly the two where the cell is a maximum in one
direction and a minimum in the other. That is the general lesson: a decision
point is only useful if the two possible answers point in **different**
directions.

## Dry run

`target = 5`, starting at `(0, 4)`.

| row | col | value | vs 5 | move     |
| --- | --- | ----- | ---- | -------- |
| 0   | 4   | 15    | >    | col -> 3 |
| 0   | 3   | 11    | >    | col -> 2 |
| 0   | 2   | 7     | >    | col -> 1 |
| 0   | 1   | 4     | <    | row -> 1 |
| 1   | 1   | 5     | =    | true  |

And a miss, `target = 20`:

| row | col | value | vs 20 | move     |
| --- | --- | ----- | ----- | -------- |
| 0   | 4   | 15    | <     | row -> 1 |
| 1   | 4   | 19    | <     | row -> 2 |
| 2   | 4   | 22    | >     | col -> 3 |
| 2   | 3   | 16    | <     | row -> 3 |
| 3   | 3   | 17    | <     | row -> 4 |
| 4   | 3   | 26    | >     | col -> 2 |
| 4   | 2   | 23    | >     | col -> 1 |
| 4   | 1   | 21    | >     | col -> 0 |
| 4   | 0   | 18    | <     | row -> 5 |

`row` is now past the last index, loop ends, `false`. 9 comparisons on a 25
cell grid, and the path is a proper staircase: only ever one step left or one
step down, never both at once and never back.

## The bug

First version:

```js
while (row < matrix.length && col > 0) {     // wrong guard
```

`col > 0` stops one column early, so a target living in column 0 is never
compared. `searchMatrix(grid, 18)` (bottom-left corner) returned `false`.
Needs `col >= 0`, since column 0 is a real column. Classic off-by-one from
reusing the shape of a `for` loop guard where the index is counting down to
zero rather than up to a length.

## Complexity

| Version | Time | Space |
| ------- | ---- | ----- |
| Binary search each row | `O(m log n)` | `O(1)` |
| Staircase from a corner | `O(m + n)` | `O(1)` |

Worth noticing `O(m + n)` beats `O(m log n)` for any `n` above about 2, and the
code is shorter. Not the usual trade.

## Pattern to remember

In a grid sorted in two directions, stand where the two sort orders
disagree. One comparison then kills a whole line.
