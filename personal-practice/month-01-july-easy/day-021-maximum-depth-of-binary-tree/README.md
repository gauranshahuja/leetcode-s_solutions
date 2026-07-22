# Day 021 - Maximum Depth of Binary Tree

LeetCode 104 · Easy · Tree DFS and BFS · Wednesday, 22 July 2026 · ~14 min, 1 attempt

## Problem

Depth of a binary tree, counted in **nodes** on the longest root-to-leaf path.

```
    3
   / \
  9  20          -> 3     (3, 20, 15 for example)
     / \
    15  7

  1
   \             -> 2
    2

  (empty)        -> 0
```

First tree problem. A `TreeNode` has `val`, `left` and `right`, and both
children can be `null`. Same deal as the linked list days: pulling `TreeNode`
and `buildTree` out of `lib/structures` instead of writing them here. The
level-order array format with explicit `null`s took me a minute to read -
`[1, null, 2]` means root 1, no left child, right child 2.

## What clicked immediately

I expected trees to be hard and this one was not, because the shape of the
answer copies the shape of the data. A tree **is** a node plus two smaller
trees. So:

depth(tree) = 1 + the deeper of depth(left), depth(right)
depth(nothing) = 0

Which is three lines:

```js
function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

The thing I want to hold on to: that `null` check is doing two jobs. It is the
base case of the recursion **and** the missing-child guard. That is why there
is no `if (root.left)` anywhere in the function, and why a leaf works without
being a special case: both its children are `null`, both return 0,
`1 + max(0, 0)` is 1.

Compare Day 013, where every single pointer had to be checked by hand before
touching it. Recursion absorbs all of that here.

## Dry run

The example, with each call returning to its parent:

| call        | left | right | returns |
| ----------- | ---- | ----- | ------- |
| `null`      | -    | -     | 0       |
| node 9      | 0    | 0     | 1       |
| node 15     | 0    | 0     | 1       |
| node 7      | 0    | 0     | 1       |
| node 20     | 1    | 1     | 2       |
| node 3 root | 1 (from 9) | 2 (from 20) | **3** |

The answers come back up from the leaves. Nothing is passed down, which is
different from what I assumed trees would be like (I expected to be carrying a
`depth` counter downward).

## The iterative version

Wrote a BFS one as well, partly because `O(h)` stack space on a tree that is
one long chain of 10,000 nodes would blow up, and partly because levels are
clearly going to matter in later problems.

Same answer from a different question: how many **levels** does the tree have?
Peel one level off at a time, count the peels.

```js
const levelSize = queue.length - head;   // freeze the count first
for (let i = 0; i < levelSize; i += 1) { ... }
depth += 1;
```

Capturing `levelSize` before the inner loop is the whole technique. Children
get pushed during that loop, and without the frozen count the loop would run
straight into them and treat two levels as one, which gives 1 for any
non-empty tree.

### JS note

The natural way to write a queue is `queue.shift()`, and `shift()` is `O(n)`
because every remaining element is re-indexed. On a wide tree that quietly
turns an `O(n)` traversal into `O(n^2)`. So instead of shifting, I keep a
`head` index and move it forward. Costs memory (the array keeps every node it
ever held) and it is `O(1)` per read. Same note I made on Day 018 about using
an array as a queue, and this is the first time I have actually needed it.

## Complexity

| version   | time   | space |
| --------- | ------ | ----- |
| recursive DFS | `O(n)` | `O(h)` stack, `O(log n)` balanced, `O(n)` for a chain |
| level BFS | `O(n)` | `O(w)`, w = widest level |

Every node has to be visited either way, there is no structure to exploit. The
difference is only *which* shape of tree makes each one expensive: deep trees
hurt the recursion, wide trees hurt the queue.

## Takeaway

For trees, write the answer in terms of the same answer on the children. The
`null` base case usually handles the empty input and the missing children at
the same time.

Three weeks in and this is the first day where the recursive version was the
one I wrote first and the iterative version was the afterthought. Progress.
