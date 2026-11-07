# Day 129 - Word Ladder

LeetCode 127 · Hard · BFS on an implicit graph · Saturday, 7 November 2026 · ~45 min, 2 attempts

Shortest of the week. The algorithm was obvious within a minute, the hard part
is a modelling decision rather than a coding one.

## Problem

Change `beginWord` into `endWord` one letter at a time. Every intermediate word
must appear in `wordList`. Return the number of words in the shortest chain,
counting both ends, or 0 if no chain exists.

```
beginWord = "hit", endWord = "cog"
wordList  = ["hot","dot","dog","lot","log","cog"]
-> 5        hit -> hot -> dot -> dog -> cog

same thing without "cog" in the list
-> 0
```

`beginWord` is not required to be in the list. `endWord` is.

## Straight away: this is BFS

Unweighted shortest path, so BFS, exactly like Day 057 (Rotting Oranges). Each
level is one letter change, and the first time `endWord` comes up the level
number is the answer. No Dijkstra needed, all edges cost 1. The only real
question is **what the graph is**.

## Why I do not build the graph

The obvious move is to precompute an adjacency list: for every pair of words,
check whether they differ in exactly one position, and if so link them. That is
`O(N^2 * L)`, so with `N` up to 5000 and `L` up to 10, around 250 million
character comparisons before the search even starts.

The alternative is to never build it. From a word, generate its neighbours on
demand by trying all 25 other letters in each of the `L` positions and keeping
the candidates that are in a `Set` of the word list:

```
"hot" -> aot bot cot ... zot
         hat hbt hct ... hzt
         hoa hob hoc ... hoz
```

That is `25 * L` candidates per word, each one a `Set` lookup. For
`N = 5000, L = 10` that is about 1.3 million lookups instead of 250 million
comparisons, and the adjacency is never stored.

The general shape: **when the vertex set is huge but the neighbour rule is
cheap, keep the graph implicit.** The grid problems did this without me
noticing - nobody builds an adjacency list for a grid, you just do `r +/- 1`,
`c +/- 1`. Here the "coordinates" happen to be strings. It only wins because `L`
is small: for 1000-character words, `26 * L` per word would be worse than
comparing against the other words, and the right answer would be the "bucket by
wildcard pattern" trick (`h*t -> [hot, hit, hat]`).

## The implementation details that matter

**Deleting is visiting.** Instead of a separate `visited` set, I remove each
word from the word set the moment it is queued. A word reached at level `k` can
never usefully be reached again, since BFS already found it at the shortest
distance. One structure, no chance of two getting out of sync.

**One level at a time.** The frontier is a whole array and I build the next array
from it, so `steps` increments once per level. Pushing `[word, distance]` pairs
into one queue works too, but storing the distance per word is wasted when every
word in a level shares it. It also avoids `shift()`, which is `O(n)` because it
reindexes, and which turns a linear BFS into a quadratic one.

**Restore the character.** Inside the position loop I mutate a char array and
have to put the original letter back before moving on, otherwise position `i+1`
varies against an already corrupted word. Forgot this on attempt 1 and got
garbage neighbours on anything longer than two letters.

## Dry run

`"hit"` -> `"cog"`, list `["hot","dot","dog","lot","log","cog"]`.

| level | frontier            | new words found       | set left after        |
| ----- | ------------------- | --------------------- | --------------------- |
| 1     | `["hit"]`           | `hot`                 | dot dog lot log cog   |
| 2     | `["hot"]`           | `dot`, `lot`          | dog log cog           |
| 3     | `["dot","lot"]`     | `dog`, `log`          | cog                   |
| 4     | `["dog","log"]`     | `cog`                 | (empty)               |
| 5     | `["cog"]`           | hits `endWord`        |                       |

Answer 5, matching `hit -> hot -> dot -> dog -> cog`.

Level 1 generates 75 candidates from `"hit"` and keeps exactly one. That ratio
is what the implicit graph exploits: almost nothing is a word, and a failed
`Set` lookup is free.

## The bug

First version checked for `endWord` when **pushing** rather than when popping:

```js
if (unvisited.has(candidate)) {
  if (candidate === endWord) return steps;   // off by one
```

That returns 4 instead of 5, because when `"cog"` is discovered `steps` is still
the level of `"dog"`. Either return `steps + 1` there or check on dequeue. I
moved the check to the top of the per-word loop, which also handles
`beginWord === endWord` for free.

## Bidirectional BFS

Kept as `ladderLengthBidirectional`. Grow a frontier from each end and stop when
they touch. With branching factor `b` and answer depth `d`, one-sided BFS
touches roughly `b^d` words and two-sided roughly `2 * b^(d/2)`. Big practical
win even though the worst case is unchanged. Two things it needs:

- always expand the **smaller** frontier, swapping the two sets when needed.
  Without that the forward side can blow up and the extra bookkeeping buys
  nothing.
- when a candidate is already in the opposite frontier, the answer is
  `steps + 1`, not `steps`, since it is one word beyond the side being expanded.

More code for the same answer, so the one-sided version stays as the main
solution, but I wanted to have written it once.

## Complexity

| Version          | Time                     | Space      |
| ---------------- | ------------------------ | ---------- |
| Build graph then BFS | `O(N^2 * L)`         | `O(N^2)`   |
| Implicit BFS     | `O(N * L^2 * 26)`        | `O(N * L)` |
| Bidirectional    | same worst case, ~`b^(d/2)` in practice | `O(N * L)` |

The extra `L` on the implicit row is building and hashing each candidate string.

## Pattern to remember

If the neighbour relation is a cheap rule, do not materialise the graph.
Generate neighbours inside the BFS loop and let a hash set decide which ones
are real.
