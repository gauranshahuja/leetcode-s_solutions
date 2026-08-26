# Day 056 - Number of Islands

LeetCode 200 · Medium · Grid DFS, flood fill · Wednesday, 26 August 2026 · ~45 min, 2 attempts

## Problem

Grid of `'1'` (land) and `'0'` (water). Count islands. Cells connect
horizontally and vertically only, diagonals do not count.

```
1 1 1 1 0          1 1 0 0 0
1 1 0 1 0          1 1 0 0 0
1 1 0 0 0          0 0 1 0 0
0 0 0 0 0          0 0 0 1 1

   -> 1               -> 3
```

## The realisation that made it easy

I stared at this as a grid problem for ten minutes before the obvious thing
landed: **the grid is a graph**. Each land cell is a node. There is an edge
between two land cells if they are orthogonal neighbours. "Island" is just the
word this problem uses for *connected component*.

Which means I already know the algorithm. Walk every cell. The first time I
land on an unvisited `'1'`, that is a component nobody has counted yet, so
`islands += 1` and then flood the entire component so none of its cells can
start another count. The answer is how many times I had to start a flood.

No new technique, just the first time a graph has shown up without anyone
drawing nodes and arrows for me.

## Two bookkeeping decisions

**1. Sinking the land vs a separate `visited` set.**

A `Set` of `"r,c"` strings works, but every neighbour check becomes a string
concat plus a hash lookup, and the whole thing is allocating garbage.
Overwriting the cell with `'0'` does the same job in one assignment: a sunk cell
is indistinguishable from water, so every later check naturally skips it.

The cost is that it destroys the input, which matters here because my tests
reuse the same grid object. So I copy first:

```js
const g = grid.map((row) => row.slice());
```

My first attempt was `const g = grid.slice()`, and the second test on the same
grid returned `0`. Of course: `slice()` on the outer array copies the *row
references*, so `g[r][c] = '0'` was writing straight through to the caller's
rows. There is a test now (`the input grid was not sunk`) that counts the land
in the original afterwards, so this cannot silently come back.

**2. The direction deltas.**

Instead of four near-identical blocks for up/down/left/right:

```js
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

for (const [dr, dc] of DIRS) {
  const nr = cr + dr;
  const nc = cc + dc;
  if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
  ...
}
```

One bounds check instead of four copies of it, and adding diagonals later would
mean adding four pairs to the array and nothing else. This is the shape I want
burned in for every grid problem from here.

## Why an explicit stack and not recursion

The natural flood fill is recursive. But the grid can be 300x300, and if it is
solid land then one component is 90,000 cells, which is 90,000 nested calls.
Node's default stack dies somewhere around 10k frames, so that is a
`RangeError: Maximum call stack size exceeded` rather than a wrong answer. The
explicit stack is the same traversal with the frames moved onto the heap.

## The bug that cost me the second attempt

I originally sank cells when **popping** them:

```js
const [cr, cc] = stack.pop();
if (g[cr][cc] !== '1') continue;
g[cr][cc] = '0';
```

It gives the right island count, but a cell with three land neighbours gets
pushed three times before any of those pushes is processed, so the stack
inflates to several times the component size. Marking at push time means a cell
can enter the stack exactly once.

## Dry run on example 2

| start cell | fill reaches              | islands |
| ---------- | ------------------------- | ------- |
| (0,0)      | (0,0) (0,1) (1,0) (1,1)   | 1       |
| (2,2)      | (2,2) alone               | 2       |
| (3,3)      | (3,3) (3,4)               | 3       |

Everything else is water or already sunk when the scan reaches it.

## Complexity

- Time `O(r * c)`: each cell is read by the outer scan once and pushed at most
  once.
- Space `O(r * c)`: the grid copy, plus an all-land stack in the worst case.

## Alternative approach

Union-find also solves it: union each land cell with its right and down land
neighbour, then count distinct roots. `lib/structures` has a `DSU` with path
halving, so it is not much code. It is the better tool when islands get
*added* one at a time and you need the count after each addition, because
flood fill would have to re-run from scratch. For a single static grid the fill
is simpler and has a better constant.

## Pattern to remember

Grid = implicit graph. Connected components = flood fill. Mark visited by
mutating the grid (on a copy), march neighbours with a delta array, and use
an explicit stack so a big component cannot overflow.
