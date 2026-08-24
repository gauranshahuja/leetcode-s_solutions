# Day 054 - Lowest Common Ancestor of a BST

LeetCode 235 · Medium · BST ordering · Monday, 24 August 2026 · ~20 min, 1 attempt

## Problem

Given a BST and two nodes `p` and `q` (both guaranteed to be in the tree),
return the deepest node that has both of them in its subtree. A node is
allowed to be its own ancestor.

```
            6
          /   \
         2     8
        / \   / \
       0   4 7   9
          / \
         3   5

  p=2, q=8 -> 6
  p=2, q=4 -> 2     (2 is an ancestor of 4, and of itself)
  p=3, q=5 -> 4
```

## The insight

I expected this to be the hard "general binary tree" LCA: recurse into both
sides, see which side each target came back from, and bubble up. That version
has to touch every node because a plain binary tree gives you no idea which way
to go.

A BST does tell you which way to go. Standing at `node`:

- `p.val` and `q.val` **both less** than `node.val` -> both are somewhere in the
  left subtree, so the meeting point is deeper left. Nothing at or right of
  `node` can be it.
- both **greater** -> same thing to the right.
- **anything else** -> either they are on opposite sides of `node`, or `node` is
  one of them. In both cases nothing below can contain both, so `node` is the
  answer.

That last bullet is the whole trick: the first node where the two values stop
agreeing on a direction is the LCA. It is one walk down, no recursion, no extra
state.

## Walking through p=3, q=5

| node | 3 vs node | 5 vs node | decision     |
| ---- | --------- | --------- | ------------ |
| 6    | smaller   | smaller   | go left      |
| 2    | bigger    | bigger    | go right     |
| 4    | smaller   | bigger    | they split -> **4** |

And `p=2, q=4`:

| node | 2 vs node | 4 vs node | decision     |
| ---- | --------- | --------- | ------------ |
| 6    | smaller   | smaller   | go left      |
| 2    | equal     | bigger    | not both-less, not both-greater -> **2** |

The "node is one of the targets" case falls out of the same `else` branch for
free, which is nicer than special-casing it.

## Small thing that tripped me for a minute

Nothing in the algorithm, but the LeetCode signature takes **node references**,
not values, and `buildTree` gives me a root. So my tests needed a `findNode`
helper to fish the actual node objects out of the tree first. Wrote it as a
plain BST descent (`val < node.val ? left : right`) which is three lines and
also a free reminder of why BST search is `O(h)`.

Also: the comparisons are on `.val`, not on the node objects. `p < node` would
be comparing objects and JS would happily coerce them to `NaN`-ish nonsense
instead of erroring.

## Complexity

- Time `O(h)`: one step per level. Balanced tree -> `O(log n)`, degenerate chain
  -> `O(n)`.
- Space `O(1)`: a single `node` variable. The recursive form would cost `O(h)`
  stack for no gain here, since this is tail recursion in disguise.

## Pattern to remember

When the structure already encodes an ordering, stop searching and start
*navigating*. The BST version of LCA is `O(h)` and `O(1)` space while the
general tree version is `O(n)` - the entire difference is that a comparison
tells me which branch to throw away.

Easiest day in a while, mostly because Day 053 had already forced me to think
about "what does an ancestor constrain" rather than "what does a parent
constrain".
