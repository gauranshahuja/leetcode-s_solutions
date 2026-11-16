# Day 131 - N-Queens

LeetCode 51 · Hard · Backtracking with diagonal sets · Monday, 9 November 2026 · ~1 hr 10 min, 2 attempts

Ninth day of the hard month. I had been putting N-Queens off since the
backtracking week because the diagonals looked fiddly. They are not fiddly,
they are two subtractions.

## Problem

Place `n` queens on an `n x n` chessboard so that none of them attack each
other, and return **every** distinct arrangement. A queen attacks along its
row, its column, and both diagonals. Output each board as an array of strings.

```
n = 4  ->  [[".Q..", "...Q", "Q...", "..Q."],
            ["..Q.", "Q...", "...Q", ".Q.."]]
n = 1  ->  [["Q"]]
n = 2  ->  []        (no arrangement exists)
```

## The one observation that shrinks the problem

n queens, n rows, and no two queens may share a row. So **every row holds
exactly one queen**. That kills the "which square" search immediately: the
state is just a column choice per row, and the recursion is one level per row.

This is the same shape as Day 049 and Day 051 - choose, recurse, un-choose -
only the "is this choice legal" test is more interesting.

## The attack test

My first instinct was the naive one: before placing at `(r, c)`, walk up the
column and up both diagonals checking for a `Q`. That is O(n) work per
candidate square, so O(n) extra on every node of the tree.

The better test is to notice what stays constant along a diagonal:

| direction        | invariant     |
| ---------------- | ------------- |
| column           | `c`           |
| anti-diagonal `/`| `r + c`       |
| main diagonal `\`| `r - c`       |

Check it on a 4x4 grid and it is obvious: `(0,3)`, `(1,2)`, `(2,1)`, `(3,0)`
all have `r + c == 3`.

So three `Set`s of integers (`cols`, `sums`, `diffs`), and the legality test is
three O(1) membership checks instead of a scan. Add on the way in, delete on
the way out.

`r - c` goes negative, which bothered me for about ten seconds until I
remembered a JS `Set` holds any number quite happily - no need to offset by
`n - 1` the way you would with a fixed-size array.

## Dry run (n = 4)

Columns tried left to right, `x` means rejected by one of the sets.

| row | tries            | takes | sets after                                 |
| --- | ---------------- | ----- | ------------------------------------------ |
| 0   | 0                | 0     | cols{0} sums{0} diffs{0}                   |
| 1   | 0 x, 1 x, 2      | 2     | cols{0,2} sums{0,3} diffs{0,-1}            |
| 2   | 0 x, 1 x, 2 x, 3 | 3     | cols{0,2,3} sums{0,3,5} diffs{0,-1,-1}? no |

That last line is where the first branch dies: `(2,3)` has `r - c = -1`, which
the queen at `(1,2)` already owns. Row 2 runs out of columns, so we unwind to
row 1, try column 3, and so on. The first board that survives to row 4 is
`.Q.. / ...Q / Q... / ..Q.`

## The bug

n = 4 came back as two boards, both identical, both wrong. Cause:

```js
boards.push(queenAt);   // wrong - stores a reference
```

Every entry in the output was the same live array, which the next backtrack
step then mutated. Same shallow-copy mistake as the matrix rows on Day 042, in
different clothes. Rendering to strings inside the `row === n` branch fixes it
because the strings are built right there and never change afterwards.

## Bitmask version

Once the sets are just "which columns are forbidden", they are a bitmask. Three
integers, passed down rather than mutated:

```js
let free = full & ~(cols | sums | diffs);
while (free !== 0) {
  const bit = free & -free;   // lowest legal column
  free ^= bit;
  place(row + 1, cols | bit, ((sums | bit) << 1) & full, (diffs | bit) >> 1);
}
```

The shifts are the clever bit. A queen in column `c` blocks column `c + 1` on
the next row down one diagonal and `c - 1` down the other, so instead of
storing `r + c` keys you just slide the whole threat mask one step per row.
`& full` after the left shift stops threats walking off the right edge.

`31 - Math.clz32(bit)` turns the isolated bit back into a column index.

Measured at n = 9 on my machine: sets 95 ms, bitmask 26 ms. I would still write
the set version first in an interview and mention this one.

## Complexity

- Time: `O(n!)` with heavy pruning, both versions. Rendering a board is `O(n^2)`.
- Space: `O(n)` for the state, plus `O(n^2)` per board in the output, which is
  unavoidable since the boards *are* the answer.

## Note to self

Any time a constraint is "same diagonal", reach for `r + c` and `r - c`
before you write a scan. Same trick will work on the diagonal-threat part of
anything board-shaped.

Also: tests for this kind of problem should include an **independent** checker,
not just hard-coded expected boards. I wrote `isValidBoard` with a dumb
all-pairs loop and ran it over every n = 7 answer. That is the test that would
actually catch a wrong diagonal key, because it shares no code with the solver.
