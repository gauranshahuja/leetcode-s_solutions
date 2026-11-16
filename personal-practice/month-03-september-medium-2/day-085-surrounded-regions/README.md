# Day 085 - Surrounded Regions

LeetCode 130 · Medium · Grid DFS from the border · Thursday, 24 September 2026 · ~50 min, 20 of them wasted, 3 attempts

## Problem

Flip every `'O'` region that is completely surrounded by `'X'`. Regions connect
4-directionally. In place.

```
X X X X          X X X X
X O O X    ->    X X X X
X X O X          X X X X
X O X X          X O X X
```

The bottom-left `O` stays because it is on the border, so it is not surrounded.
Everything else was enclosed.

## My first (wrong) idea, and the 20 minutes it cost

I read "surrounded" and wrote code that looks for surrounded things. Flood each
region, collect its cells, and watch for a border cell while flooding:

```js
const region = [];
let touchesEdge = false;
// ...flood, pushing into region, setting touchesEdge when r or c is on the rim
if (!touchesEdge) for (const [r, c] of region) board[r][c] = 'X';
```

This is not wrong exactly, it is just carrying a bag around for no reason. I
then made it worse by trying to flip cells *during* the flood and undo them if
the region turned out to touch the edge, which is where I lost the time: a cell
already flipped to `'X'` stops the flood from spreading, so half the region
never gets visited and the undo has nothing to undo.

I threw it away.

## The inversion

The property is not really "is this region surrounded". It is **"can this region
reach the border"**. Those are the same question, and one of them has an obvious
starting point.

So: do not look for enclosed regions at all. Flood *inward from the border* and
mark everything you reach as a survivor. After that, one sweep:

| cell after the flood | meaning                      | becomes |
| -------------------- | ---------------------------- | ------- |
| `'#'`                | reachable from the border    | `'O'`   |
| `'O'`                | never reached, so enclosed   | `'X'`   |
| `'X'`                | wall                         | `'X'`   |

No bags, no undo, no second pass over regions. The `'#'` marker is doing double
duty as both "visited" and "this one survives", which is why no `seen` set is
needed.

## Walking through the example

Border `O` cells: only `(3,1)`.

| phase            | board                                        |
| ---------------- | -------------------------------------------- |
| start            | `XXXX / XOOX / XXOX / XOXX`                  |
| flood from (3,1) | `XXXX / XOOX / XXOX / X#XX`  (it has no `O` neighbours) |
| sweep: `O -> X`  | `XXXX / XXXX / XXXX / X#XX`                  |
| sweep: `# -> O`  | `XXXX / XXXX / XXXX / XOXX`               |

The three inner `O`s at `(1,1) (1,2) (2,2)` are connected to each other but to
nothing on the rim, so the flood never touches them.

## Two things I had to fix

**Marking at pop time instead of push time.** With an explicit stack, if you
only mark a cell when you pop it, a cell that is a neighbour of two cells
already on the stack gets pushed twice. It still gives the right answer, but the
stack can grow past `O(m*n)`. Marking at push time keeps the invariant "a cell
on the stack has already been marked".

**Recursion depth.** I started with a recursive DFS and it is
fine for the test boards, but a `200 x 200` board of all `'O'` is a 40,000-deep
call chain and Node throws `RangeError: Maximum call stack size exceeded`. Grid
floods in JS want an explicit stack. Day 056 already used an explicit stack for exactly this reason.

## Complexity

- Time `O(m * n)`. Each cell is marked once and pushed once, plus the final
  sweep.
- Space `O(m * n)` worst case for the stack. No second board is allocated, which
  is what "in place" is asking for.

## Pattern to remember

When a property is "not reachable from X", do not try to verify it directly.
Compute "reachable from X" and take the complement.

Same shape as the "count what you don't want by counting what you do want" move.
I have now hit it twice in one month, so it is going in the list of first things
to try on a grid problem.
