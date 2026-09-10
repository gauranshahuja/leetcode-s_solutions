# Day 071 - Word Search

LeetCode 79 · Medium · Backtracking on a grid · Thursday, 10 September 2026 · ~40 min, 3 attempts

## Problem

Can the word be spelled by walking the grid one step at a time, up/down/
left/right, never reusing a cell?

```
A B C E
S F C S
A D E E

"ABCCED" -> true    A(0,0) B(0,1) C(0,2) C(1,2) E(2,2) D(2,1)
"SEE"    -> true
"ABCB"   -> false   the second B would have to be the same B again
```

`"ABCB"` is the whole problem in one example. All four letters exist and are
adjacent in the right order; the only thing stopping it is the no-reuse rule.

## The shape

Backtracking, same skeleton as the Day 049-051 run: choose, recurse, undo. The
difference is what the mutable state is. There the state was a partial answer
array I pushed to and popped from; here it is the board itself, and the choice
is which neighbour to step onto.

```
dfs(r, c, i):
  if board[r][c] !== word[i]: fail
  if i is the last index: success
  mark (r, c)
  try the four neighbours with i + 1
  unmark (r, c)
```

The outer part is just "try `dfs(r, c, 0)` from every cell", since the word can
start anywhere.

## Marking is the rule, not an optimisation

This is the bit worth writing down. In most backtracking problems the visited
set is there to prune repeated work. Here it is **load bearing**: without it
the answers are wrong, not slow.

Board `[['A','A']]` and the word `"AAA"`. Start at `(0,0)`, step right to
`(0,1)`, step back left to `(0,0)`, and the word matches. Three characters out
of two cells. So "do not reuse a cell" has to be enforced, and enforcing it
means the search needs to know which cells the **current path** is standing on.

Not a global visited array, note. A cell used by a path that failed must be
free again for the next path to try. That is exactly what distinguishes
backtracking state from a plain DFS visited set, and it is why the unmark
exists.

I used the board itself as the marker:

```js
const letter = board[r][c];
board[r][c] = '#';        // '#' never appears in a word, so it mismatches
... recurse ...
board[r][c] = letter;     // put it back
```

Overwriting with `'#'` means the recursive call hits `board[r][c] !== word[i]`
and fails on its own, so there is no separate "have I been here" check at all.
No extra `m x n` array either. The cost is that the function mutates its input
during the search, which I decided was acceptable only because it restores
everything before returning. I added a test that reads `board[0][0]` after all
the searches to make sure that is actually true.

## Attempts 1 and 2 (both the same mistake, twice)

**Attempt 1:** I forgot the restore entirely.

```js
board[r][c] = '#';
return up || down || left || right;     // cell never released
```

`"ABCCED"` still passed, because that path succeeds on the first try and never
needs to reuse anything. `"SFDA"` failed, because the first exploration from
`S(1,0)` wandered into cells that it then permanently blocked, and the correct
path needed one of them. Symptom of a missing restore: the first attempt from a
starting cell works, later ones mysteriously do not.

**Attempt 2:** I restored it, but only on the failure path.

```js
if (up || down || left || right) return true;   // early return, no restore
board[r][c] = letter;
return false;
```

Which looks careful and is still broken. It happens to be harmless when the
answer is `true` (nothing runs afterwards), but it left me with two exits to
reason about, and when I later added the `word.length === 0` guard I nearly
put it in the wrong place. Collapsing to a single result variable and one
return made the restore unmissable:

```js
const found = ...;
board[r][c] = letter;
return found;
```

The undo belongs on the single way out of the frame. If there are two ways
out, there are two places to forget it.

## Dry run

`"SFDA"` on the example board. Only the successful branch is shown; the search
tries starting cells in row-major order and fails quickly on all the non-`S`
ones.

| step | at    | word[i] | board | action |
| ---- | ----- | ------- | ----- | ------ |
| 1 | (1,0) S | S | match | mark, go to neighbours |
| 2 | (0,0) A | F | mismatch | fail, back up |
| 3 | (2,0) A | F | mismatch | fail, back up |
| 4 | (1,1) F | F | match | mark, go deeper |
| 5 | (0,1) B | D | mismatch | fail |
| 6 | (2,1) D | D | match | mark, go deeper |
| 7 | (2,0) A | A | match, last index | **true** |

On the way back up every frame restores its cell, so the board ends as it
started.

## Complexity

| | |
| - | - |
| Time  | `O(m n * 4^L)` worst case, `L` = word length. Really closer to `3^L` past the first step, since one of the four neighbours is always the cell I just came from (and is marked). |
| Space | `O(L)` recursion depth. No extra grid, the marks live in the board. |

The `m n` factor is for trying every starting cell. A cheap win I did add: bail
out immediately if `word.length > m * n`. A better one I did not bother with is
counting letters in the board first and rejecting a word that needs more `Q`s
than exist.

## Note to self

Two things to carry forward to the next grid-backtracking problem:

1. The marker and the restore are a pair. Write both lines at the same time,
   with one return between them.
2. Mutating the input as scratch space is fine if the invariant is "every
   frame leaves the board exactly as it found it", and that invariant is worth
   an actual test rather than a comment.
