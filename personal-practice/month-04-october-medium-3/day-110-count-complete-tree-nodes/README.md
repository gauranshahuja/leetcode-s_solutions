# Day 110 - Count Complete Tree Nodes

LeetCode 222 · Medium · Tree plus binary search · Monday, 19 October 2026 · ~35 min, 2 attempts

## Problem

Count the nodes in a **complete** binary tree: every level is full except
possibly the last, and the last is filled left to right with no gaps.

```
      1
     / \
    2   3
   / \  /
  4  5 6        ->  6
```

The constraint is the interesting part: the problem says do better than `O(n)`.

```js
function countNodesNaive(root) {
  if (!root) return 0;
  return 1 + countNodesNaive(root.left) + countNodesNaive(root.right);
}
```

That is correct and it is explicitly the thing being ruled out. I kept it in the
file purely as a cross-check.

## The insight

"Complete" is a strong promise and I was not using it. Two consequences:

1. The **leftmost** path is the longest path in the tree.
2. The **rightmost** path is the shortest.

So if `leftHeight(node) === rightHeight(node)`, there is no partial level
anywhere below - the subtree is **perfect**, and a perfect tree of height `h`
has exactly `2^h - 1` nodes. No recursion, just arithmetic.

If the two heights differ (and in a complete tree they can only differ by 1),
the last level ends somewhere inside this subtree, so recurse into both halves:

```js
if (lh === rh) return 2 ** lh - 1;
return 1 + countNodes(root.left) + countNodes(root.right);
```

## Why that is `O(log^2 n)` and not `O(n)`

Had to convince myself of this, because the code *looks* like it recurses into
everything.

The last level stops at one single boundary position. Any subtree entirely to
the left of that boundary is perfect; any subtree entirely to the right is
perfect (and empty on the last level). Only the subtrees *containing* the
boundary are imperfect, and at each level there is exactly one of those.

So the recursion is really a single root-to-leaf walk - `O(log n)` calls - and
each call does two height walks costing `O(log n)`. `O(log^2 n)` total.

The binary search is hiding in that walk: at every step I am asking "is the
boundary in the left half or the right half", which is exactly a descent over
the positions of the last level.

## Dry run

A complete tree of 12 nodes (values 1..12 in level order):

```
            1
         /     \
        2        3
      /   \     /  \
     4     5   6     7
    / \   / \  /
   8   9 10 11 12
```

| call at | leftHeight | rightHeight | perfect? | result            |
| ------- | ---------- | ----------- | -------- | ----------------- |
| `1`     | 4 (1-2-4-8)| 3 (1-3-7)   | no       | `1 + f(2) + f(3)` |
| `2`     | 3 (2-4-8)  | 3 (2-5-11)  | **yes**  | `2^3 - 1 = 7`     |
| `3`     | 3 (3-6-12) | 2 (3-7)     | no       | `1 + f(6) + f(7)` |
| `6`     | 2 (6-12)   | 1 (6)       | no       | `1 + f(12) + 0`   |
| `12`    | 1          | 1           | **yes**  | `1`               |
| `7`     | 1          | 1           | **yes**  | `1`               |

`f(3) = 1 + 2 + 1 = 4`, total `1 + 7 + 4 = 12`

Node `2` is the payoff: a 7-node subtree answered by one subtraction. Nodes `3`,
`6` are the boundary chain, and there is only ever one such chain.

## Where I got it wrong

**Off by one on the height.** I first wrote `leftHeight` counting *edges*, so a
single node gave 0 and the formula `2^0 - 1 = 0` said an existing node did not
exist. Counting *nodes* (`while (node) h += 1`) makes `2^h - 1` line up: one
node -> h = 1 -> `2^1 - 1 = 1`.

Easy to miss, because the empty tree is handled separately and the examples are
big enough that the error only shows up at single-node subtrees.

**Testing.** The one test that gave me confidence builds every complete tree
from 0 to 40 nodes and checks each count against `n`. The bug lives at the
boundaries between levels (sizes 7/8, 15/16) and a couple of hand-picked trees
skip straight over them.

## Complexity

| Version | Time | Space |
| ------- | ---- | ----- |
| Naive recursion | `O(n)` | `O(log n)` |
| Height comparison | `O(log^2 n)` | `O(log n)` |

## Alternative approaches

The other standard solution binary searches the last level directly: find the
depth `d` with one leftmost walk, count `2^(d-1) - 1` full nodes, then binary
search `0 .. 2^(d-1) - 1` for the last present index on the last level, testing
a candidate by walking down using the bits of the index (0 = left, 1 = right).
Same `O(log^2 n)` and a more obvious binary search, but the bit-walk is easier
to get wrong than comparing two heights.

## Pattern to remember

When a problem hands you a structural guarantee ("complete", "sorted",
"balanced"), the intended solution is almost certainly *replacing traversal
with arithmetic*. If the code still visits every node, the guarantee is not
being used.

Day 011's binary search was the same lesson on an array: sortedness means you
never have to look at most of it.
