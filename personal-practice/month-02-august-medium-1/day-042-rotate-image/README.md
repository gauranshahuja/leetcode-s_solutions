# Day 042 - Rotate Image

LeetCode 48 · Medium · Matrix, in-place transpose plus reverse · Wednesday, 12 August 2026 · ~40 min, 2 attempts

## Problem

Rotate an `n x n` matrix 90 degrees clockwise, **in place**. No returning a new
grid.

```
[[1,2,3],          [[7,4,1],
 [4,5,6],    ->     [8,5,2],
 [7,8,9]]           [9,6,3]]
```

Second month, second matrix problem after Day 041, and this one is less about
loop bookkeeping and more about finding the right decomposition.

## Where I started

I wrote down the index map first, because I can never see the rotation in my
head. Top-left goes to top-right, so:

```
(0,0) -> (0,2)
(0,1) -> (1,2)
(0,2) -> (2,2)
```

which generalises to `(i, j) -> (j, n-1-i)`.

With that in hand the easy version writes itself: make a blank `n x n`, copy
every cell to its destination, return the blank. That is `rotateCopy` in the
file. It passes every example and still fails the actual problem, because the
whole point is `O(1)` extra space.

## The insight

`(i, j) -> (j, n-1-i)` is two operations I can do with nothing but swaps:

| step            | index map            | what it looks like      |
| --------------- | -------------------- | ----------------------- |
| transpose       | `(i,j) -> (j,i)`     | mirror over the diagonal |
| reverse rows    | `(j,i) -> (j,n-1-i)` | flip each row left/right |

Compose them and you get the rotation. Transposing is a swap of
`matrix[i][j]` with `matrix[j][i]`, and `Array.prototype.reverse()` already
mutates in place, so neither half allocates.

Order matters. Transpose then reverse rows gives clockwise. Reverse rows then
transpose gives counter-clockwise, which I confirmed by accident while poking
at it.

## Dry run

`[[1,2,3],[4,5,6],[7,8,9]]`

**After transpose** (swap only the upper triangle, `j > i`):

```
1 4 7
2 5 8
3 6 9
```

**After reversing each row:**

```
7 4 1
8 5 2
9 6 3
```

Which is the answer.

## The bug

Two of them, both in the first attempt.

**1. The transpose loop ran over every cell.**

```js
for (let i = 0; i < n; i += 1) {
  for (let j = 0; j < n; j += 1) {       // wrong, j must start at i + 1
    swap(matrix[i][j], matrix[j][i]);
  }
}
```

Each pair `(i,j)` / `(j,i)` gets swapped twice that way, once when the outer
loop is on `i` and once when it is on `j`, so the matrix came back untouched.
`j = i + 1` visits the upper triangle only, which is exactly one swap per pair.

**2. The thing that really cost me the time.** While debugging the above I
"made a copy to compare against":

```js
const before = matrix.map((r) => r);   // or [...matrix], same problem
```

Those row references are the *same arrays*. So `before` kept reporting that
nothing had changed, while `matrix` was being rotated under it, and for a while
I thought my swap was broken. A one-level copy of a matrix in JS copies row
pointers, not rows. For an actual snapshot it has to be
`matrix.map((r) => [...r])`.

That mistake is funny in a debug print and dangerous in real code: the moment I
start writing through a shallow "copy", my in-place solution is quietly editing
someone else's data too. So I added two tests that pin it down - the returned
object has to be `===` the input, and `target[0]` has to still be the row the
caller handed in.

## Complexity

| Version    | Time     | Space    |
| ---------- | -------- | -------- |
| Fresh grid | `O(n^2)` | `O(n^2)` |
| Transpose + reverse | `O(n^2)` | `O(1)` |

`O(n^2)` is unavoidable since every one of the `n^2` cells has to move.

## Note to self

When an in-place transform looks impossible, try to write it as a
composition of simpler in-place transforms. Rotate = transpose + flip.
Same trick should work for the 180 and counter-clockwise variants.

And: in JS, `[...matrix]` is never a matrix copy.
