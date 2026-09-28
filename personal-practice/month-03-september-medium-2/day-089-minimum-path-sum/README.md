# Day 089 - Minimum Path Sum

LeetCode 64 · Medium · Grid DP · Monday, 28 September 2026 · ~20 min, 2 attempts

## Problem

Top-left to bottom-right, moving only right or down, minimising the sum of the
cells on the path.

```
1  3  1
1  5  1
4  2  1

answer = 7     path 1 -> 3 -> 1 -> 1 -> 1
```

The movement restriction is the whole reason this is easy: a cell can only be
entered from above or from the left, so if I fill the grid top-to-bottom and
left-to-right, both predecessors are always already final. No ordering problem,
no cycles, no need for Dijkstra.

## Why greedy fails, using the example itself

The sample input is already a counterexample to the obvious greedy. Standing on
the top-left `1`, the smaller neighbour is the `1` below, not the `3` to the
right. Follow that rule the whole way and you get `1 -> 1 -> 4 -> 2 -> 1 = 9`.
The real answer takes the locally worse step onto the `3` and lands on 7. Local
cheapness says nothing about the rest of the route, which is the usual reason a
problem is DP and not greedy. Day 061 was the opposite case, where a local
choice could actually be proved safe.

## The recurrence

```
best(r, c) = grid[r][c] + min(best(r-1, c), best(r, c-1))
```

with the first row and first column special because they only have one
predecessor each.

I wrote it as bottom-up tabulation straight away. A memoised recursion would
work and be the same complexity, but here the fill order is so obvious that
recursion only buys me a stack.

## Rolling one row

The full table is `O(m*n)` space, and I only ever read the row above and the
cell to the left. So one array of length `cols` is enough, with the same slot
playing both roles at different moments:

```js
dp[c] = grid[r][c] + Math.min(dp[c], dp[c - 1]);
//                             ^^^^^  ^^^^^^^^^
//                        row above   this row
```

When I am about to write `dp[c]`, that slot has not been touched this row yet,
so it still holds the row above. `dp[c-1]` was written a moment ago, so it is
this row. Left-to-right order does the bookkeeping for me.

## The bug

First version handled the first column wrong. I wrote:

```js
for (let r = 1; r < rows; r++) {
  for (let c = 0; c < cols; c++) {         // c starting at 0
    dp[c] = grid[r][c] + Math.min(dp[c], dp[c - 1]);
  }
}
```

At `c = 0`, `dp[-1]` is `undefined` rather than an error, and
`Math.min(x, undefined)` is `NaN`, so the whole row turns to `NaN` and poisons
every row after it. Two silent steps in a row; a language with bounds checking
would have crashed and told me instantly.

Fix: start the inner loop at `c = 1` and do column 0 on its own line, since it
can only come from above (`dp[0] += grid[r][0]`).

## Dry run

```
1  3  1
1  5  1
4  2  1
```

| after row | dp              | note                                |
| --------- | --------------- | ----------------------------------- |
| row 0     | `[1, 4, 5]`     | prefix sums, only one way across    |
| row 1     | `[2, 7, 6]`     | `dp[1] = 5 + min(4, 2) = 7`, `dp[2] = 1 + min(5, 7) = 6` |
| row 2     | `[6, 8, 7]`     | `dp[2] = 1 + min(6, 8) = 7`      |

Answer `dp[cols-1] = 7`.

## Complexity

- Time `O(m * n)`, every cell read once.
- Space `O(n)` for the rolling row. The input grid is left alone, which one of
  the tests checks: writing the DP into the caller's grid saves that array and
  quietly breaks whoever passed it in.

## Note to self

Right-or-down grids are the friendliest DP there is: the dependency order is
the reading order. If movement were in all four directions this would be a
shortest-path problem and need a heap.
