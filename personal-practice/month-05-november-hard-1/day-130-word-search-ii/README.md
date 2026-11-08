# Day 130 - Word Search II

LeetCode 212 · Hard · Trie plus backtracking · Sunday, 8 November 2026 · ~1 hr 15 min, 3 attempts

## Problem

An `m x n` board of letters and a list of words. Return every word from the list
that can be spelled by walking through orthogonally adjacent cells, without
reusing a cell inside a single word.

```
board = [["o","a","a","n"],
         ["e","t","a","e"],
         ["i","h","k","r"],
         ["i","f","l","v"]]
words = ["oath","pea","eat","rain"]

-> ["oath","eat"]      any order
```

`"oath"` goes `o(0,0) -> a(0,1) -> t(1,1) -> h(2,1)`, `"eat"` goes
`e(1,3) -> a(1,2) -> t(1,1)`, `"pea"` has no `p`, and `"rain"` has the letters
but not as a connected path.

## The obvious wrong answer

Day 071 was Word Search I: one board, one word, DFS with backtracking. So the
first thing I wrote was Day 071 in a `for` loop over `words`. Correct, and far
too slow. With `W` words up to length `L` on an `R x C` board, each word costs a
full `O(R * C * 4^L)` search, so the total is `O(W * R * C * 4^L)`. The
constraints allow 30,000 words of length 10 on a 12x12 board: thirty thousand
independent exponential searches over the same board, most of which abandon
within two cells because the board has no such prefix.

The waste is **shared prefixes**. Searching `"abcx"`, `"abcy"` and `"abcz"`
separately re-walks `a -> b -> c` three times, and 30,000 words starting with
letters absent from the board re-discover that fact 30,000 times.

## The fix: one search, all words at once

Put the word list in a trie (Day 112) and walk the trie and the board together.
At each cell the question becomes:

is the path I have walked so far still a prefix of *any* word I care about?

That is one `Map.get` on the current trie node. If it misses, the entire subtree
of board paths underneath is dead and gets cut. All the words are tested at once,
and the total work is bounded by the trie, which has only as many nodes as there
are letters across all the words.

So the DFS carries a trie node alongside `(r, c)`. I pass the **parent** node and
look up `board[r][c]` inside the call: that makes "this cell continues no word" a
single early return at the top, and it leaves me holding both `parent` and
`node`, which the pruning needs. One change from Day 112's trie: the terminal
marker stores the **word itself** instead of a boolean, so a hit can be pushed
without rebuilding the string from the path.

## The two optimisations that actually matter

**1. Delete the word from the trie once found** - `node.word = null` right after
pushing it. The same word can often be spelled along several paths, and without
clearing the flag `"aaab"` on a board full of `a`s gets reported many times
over. Clearing it deduplicates the output with no `Set` needed, and it is what
makes the next optimisation possible.

**2. Prune exhausted nodes on the way out.**

```js
if (node.children.size === 0 && node.word === null) parent.children.delete(ch);
```

After the recursion returns, a node with no children and no word can never
contribute to any future path. Deleting it shrinks the trie as words are found,
so later starting cells bail out sooner. On the adversarial test - a 12x12 board
of all `a`s with words `"a"`, `"aa"`, `"aaa"`, ... - this is the difference
between passing and timing out. It is also why `children` is a `Map` rather than
a plain object or a 26-slot array: `delete` and `size` have to be cheap.

Visited marking needs no separate matrix: write `'#'` into `board[r][c]` before
recursing and restore the letter after. `'#'` is never a trie key, so a revisit
fails the lookup naturally, and every path restores what it took so the caller's
board comes back identical. There is a test asserting that.

## Dry run of the first few cells

Trie for `["oath","pea","eat","rain"]`, starting from `(0,0)` which holds `o`.

| step | cell  | letter | trie path | what happens                        |
| ---- | ----- | ------ | --------- | ----------------------------------- |
| 1    | (0,0) | o      | `o`       | in trie (start of "oath"), continue |
| 2    | (0,1) | a      | `oa`      | in trie, continue                   |
| 3    | (0,2) | a      | `oaa`     | not in trie, return immediately     |
| 3'   | (1,1) | t      | `oat`     | in trie, continue                   |
| 4    | (1,0) | e      | `oate`    | not in trie, return                 |
| 4'   | (2,1) | h      | `oath`    | `node.word === "oath"` -> collect |

Then from `(0,1)` the letter is `a`, the root has no `a` child, and that starting
cell is rejected in one lookup. Same for every cell whose letter is not `o`,
`p`, `e` or `r`. That rejection is the whole win over Day 071 in a loop, where
each of the four words pays for its own scan of all 16 cells.

## Where I got stuck

Two real bugs. First, I pruned too eagerly, deleting the node whenever it had no
children without checking `node.word === null`:

```js
if (node.children.size === 0) parent.children.delete(ch);   // wrong
```

Fine for a leaf whose word was just collected, but it also deletes a leaf
reached down a path that happens to be blocked, and then the word is unreachable
from every other starting cell too. It cost me `"eat"` on the sample board
depending on the iteration order of the starting cells, which is a horrible bug
to look at because it reads as nondeterministic. The condition has to be
"nothing left *and* nothing to report".

Second, while chasing the first bug I moved the board restore after an early
`return` inside the loop, which left `'#'` in the board permanently and quietly
broke every later starting cell. Hence the test on `board1[0]`.

I cross-checked against the naive per-word search from Day 071 on a few thousand
random small boards over `{a,b,c}`, comparing both the result set and that the
board came back unchanged. That is how I convinced myself the pruning was sound
and not just fast.

## Complexity

| Version                     | Time                               | Space          |
| --------------------------- | ---------------------------------- | -------------- |
| Day 071 once per word       | `O(W * R * C * 4^Lmax)`            | `O(Lmax)`      |
| Trie + single DFS           | `O(R * C * 4^Lmax)` worst case     | `O(sum of word lengths)` |

The worst-case exponent does not improve - a board of identical letters with one
long word still forces the full search. What changes is that the `W` factor
disappears and the pruning keeps the realistic case nowhere near the bound.

## Pattern to remember

Many-patterns-against-one-text is never many searches. Put the patterns in a
trie and run the text through it once. Here the "text" is a grid walk instead
of a line, but it is the same move.

That is also the idea behind Aho-Corasick, for when the text really is a string.
Worth reading up on at some point.
