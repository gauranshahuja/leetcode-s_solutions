# Day 083 - Diameter of Binary Tree

LeetCode 543 · Medium · Tree DFS returning two things · Tuesday, 22 September 2026 · ~25 min, 2 attempts

## Problem

Longest path between any two nodes in a binary tree. The path is allowed to
bend, and it does not have to include the root.

```
      1
     / \
    2   3
   / \
  4   5

answer = 3     path 4 -> 2 -> 1 -> 3, which is 3 edges
```

Length is in **edges**. One node alone is 0, not 1.

## First instinct

"Height of left plus height of right at the root." Which is right for this
example and wrong in general, because the longest path can sit entirely inside
one subtree and never come near the root.

The tree I used to convince myself is `[1,2,null,3,4,5,null,null,6]`: a root
with only a left child, under which the shape widens out again. Its longest
path is `5 -> 3 -> 2 -> 4 -> 6`, 4 edges, and the root is not on it. Measuring
at the root only sees `1 -> 2 -> 3 -> 5`, which is 3.

## The insight

Every path has exactly one **highest** node on it, the point where it bends.
At that node the path is "deepest reach left" + "deepest reach right". So I
don't need to guess where the bend is: ask the question at every node and keep
the maximum.

That gives the shape this problem is really teaching:

- the recursion **returns** the height, because the parent needs it
- the recursion **records** the diameter into a variable outside itself

```js
function height(node) {
  if (!node) return 0;
  const left = height(node.left);
  const right = height(node.right);
  best = Math.max(best, left + right);   // record
  return 1 + Math.max(left, right);      // return
}
```

One DFS, two different quantities. Day 021 only needed the returned value;
this is the version where the interesting answer is the side effect.

## The off-by-one everyone hits

Nodes vs edges. My first run printed 4 on the first example instead of 3.

I had written:

```js
best = Math.max(best, left + right + 1);  // counting nodes
```

which is the number of *nodes* on the bent path. Edges are one fewer.

Rather than subtract at the end, I picked the height convention that makes the
arithmetic come out right by itself: count height in **nodes**, so `null` is 0
and a leaf is 1. Then `left + right` at the bend is already an edge count, with
no correction anywhere. Counting height in edges (`null` is -1) also works if
you add 2 back, but I would forget the 2.

## Dry run

On the example tree, in post-order:

| node | left h | right h | `l + r` | best so far | returns |
| ---- | ------ | ------- | ------- | ----------- | ------- |
| 4    | 0      | 0       | 0       | 0           | 1       |
| 5    | 0      | 0       | 0       | 0           | 1       |
| 2    | 1      | 1       | 2       | 2           | 2       |
| 3    | 0      | 0       | 0       | 2           | 1       |
| 1    | 2      | 1       | 3       | **3**    | 3       |

## Complexity

- Time `O(n)` - each node is visited once, and the work per node is two
  comparisons.
- Space `O(h)` for the call stack, which is `O(log n)` balanced and `O(n)` on a
  chain.

## Alternative I tried

Returning `[height, diameter]` as a pair so nothing is captured from outside
(`diameterPair` in the file). It is the same algorithm and the same complexity,
and in a language without closures it would be the natural way. In JS the
destructuring just makes it harder to read, so the captured variable stays.

## Note to self

When a DFS needs to report one thing upward and accumulate a different thing
globally, that is not a hack, it is the pattern. Return what the parent needs,
record what the answer needs.

I expect this exact split again on "max path sum" and on tree problems where
the answer is about subtrees rather than about the root.
