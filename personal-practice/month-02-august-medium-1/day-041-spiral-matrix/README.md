# Day 041 - Spiral Matrix

LeetCode 54 · Medium · Matrix traversal with shrinking bounds · Tuesday, 11 August 2026 · ~45 min, 3 attempts

No clever insight in this one. It is pure boundary discipline, and that is
exactly why it took three attempts.

## Problem

Return all values of an `m x n` matrix in spiral order.

```
[[1, 2, 3],
 [4, 5, 6],      ->  [1,2,3,6,9,8,7,4,5]
 [7, 8, 9]]

[[1,  2,  3,  4],
 [5,  6,  7,  8],   ->  [1,2,3,4,8,12,11,10,9,5,6,7]
 [9, 10, 11, 12]]
```

## My first (wrong) idea

Direction vectors plus a `visited` matrix: move in the current direction until
the next cell is off-grid or already visited, then turn right. That is a real
solution and it handles every shape without special cases.

I abandoned it for two reasons. It needs `O(m*n)` extra space for `visited`,
and I immediately walked into this:

```js
const visited = new Array(rows).fill(new Array(cols).fill(false));
```

Every row is **the same array object**. Setting `visited[0][0] = true` marks
column 0 of every row as visited, and the walk terminated after about three
cells. `fill` with an object fills with one reference, it does not make copies.
The correct form is

```js
const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
```

I have now made that mistake with an array of arrays twice. Writing it down.

## The approach that works

Four bounds describing the rectangle that is still unvisited:

```
top, bottom, left, right
```

One pass of the loop peels off the outer ring of that rectangle and pulls each
bound inward by one:

1. left to right along row `top`, then `top++`
2. top to bottom down column `right`, then `right--`
3. right to left along row `bottom`, then `bottom--`
4. bottom to top up column `left`, then `left++`

Loop while `top <= bottom && left <= right`. No extra space, every cell
touched once.

## The two guards, which are the actual problem

Passes 3 and 4 need an `if` in front of them. Passes 1 and 2 do not.

```js
if (top <= bottom) { /* leftward pass */ }
if (left <= right) { /* upward pass */ }
```

Why 1 and 2 are safe: the `while` condition was checked immediately before, so
the rectangle was non-empty when the ring started.

Why 3 and 4 are not: by the time pass 3 runs, `top` and `right` have already
moved. The rectangle may have collapsed in between.

**Single leftover row.** Take `[[1,2,3]]`. Pass 1 emits `1,2,3` and sets
`top = 1`. Pass 2 runs `r` from 1 to 0, which is empty, and sets `right = 1`.
Now `top (1) > bottom (0)`: there is no row left. Without the guard, pass 3
runs along `matrix[bottom]`, which is still row 0, from column 1 down to 0, and
emits `2, 1` again. Output `[1,2,3,2,1]`.

**Single leftover column.** Take `[[1],[2],[3]]`. Pass 1 emits `1`, pass 2
emits `2,3` and sets `right = -1`. Pass 3's loop is empty and sets
`bottom = 1`. Now `left (0) > right (-1)`. Without the guard, pass 4 walks
column `left = 0` from row 1 up to row 1 and emits `2` a second time. Output
`[1,2,3,2]`.

Both bugs only appear on degenerate shapes, which is why the 3x3 example passed
on my first attempt and I thought I was done.

## Dry run on the 3x4

`top=0, bottom=2, left=0, right=3`

| pass             | emits            | bound after |
| ---------------- | ---------------- | ----------- |
| row 0, cols 0→3  | 1, 2, 3, 4       | `top = 1`   |
| col 3, rows 1→2  | 8, 12            | `right = 2` |
| row 2, cols 2→0  | 11, 10, 9        | `bottom = 1` |
| col 0, rows 1→1  | 5                | `left = 1`  |

Second trip, rectangle is now rows 1..1, cols 1..2:

| pass             | emits  | bound after  |
| ---------------- | ------ | ------------ |
| row 1, cols 1→2  | 6, 7   | `top = 2`    |
| col 2, rows 2→1  | (none) | `right = 1`  |
| guard `top <= bottom`: 2 > 1, **skipped** | | |
| guard `left <= right`: 1 <= 1, runs rows `bottom=1` → `top=2`, empty | | `left = 2` |

`while`: `top (2) > bottom (1)`, stop.

`[1,2,3,4,8,12,11,10,9,5,6,7]` - twelve values for twelve cells, which is
the sanity check I should have been doing from the start.

## Complexity

- Time: `O(m * n)`. Each cell is pushed exactly once.
- Space: `O(1)` beyond the output array. The direction-vector version needs
  `O(m * n)` for `visited`.

## Note to self

When shrinking bounds from four sides, re-check the bounds between passes,
not only at the top of the loop. Two of the four passes run after the
rectangle may have already collapsed.

Also: count the output length against `m * n` as the first debugging step on
any matrix traversal. Duplicates and omissions both show up instantly and it
would have saved me a round of staring at 3x3 output that looked fine.
