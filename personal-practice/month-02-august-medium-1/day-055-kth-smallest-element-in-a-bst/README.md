# Day 055 - Kth Smallest Element in a BST

LeetCode 230 · Medium · BST inorder traversal · Tuesday, 25 August 2026 · ~35 min (25 of it on the iterative walk), 2 attempts

## Problem

Return the k-th smallest value in a BST, 1-indexed. `k` is always valid.

```
      5
     / \
    3   6
   / \
  2   4
 /
1
                inorder -> 1 2 3 4 5 6
  k = 3  ->  3
```

Follow-up in the problem statement: if the tree changes often and you query it
often, can you do better than visiting everything?

## Where I started

The fact I already had from Day 053: **inorder on a BST comes out sorted.**
`lib/structures` exports `inorder`, so version one was two lines:

```js
const values = inorder(root);
return values[k - 1];
```

That is correct and I kept it in the file as `kthSmallestFlatten`. The problem
is that it is `O(n)` time and `O(n)` extra memory no matter what k is. For
`k = 1` on a tree of 10,000 nodes it still walks all 10,000 and builds a
10,000-element array to read one slot out of it.

## The version I actually want

To stop early I need to be *inside* the traversal when the k-th value appears.
Recursion makes that awkward: I would have to thread a counter and a result
through every frame, and even after finding the answer the remaining frames
still unwind. So: inorder by hand with an explicit stack.

```js
while (node || stack.length) {
  while (node) { stack.push(node); node = node.left; }
  node = stack.pop();
  seen += 1;
  if (seen === k) return node.val;
  node = node.right;
}
```

The shape, said out loud:

1. push the entire left spine from wherever I am - all of those are "not yet
   emitted ancestors"
2. pop one: because its left subtree is fully drained, it is the next smallest
3. count it; if that was the k-th, return right there
4. move to its right child and repeat from step 1

The stack only ever holds one root-to-node path, so it is `O(h)`, and the loop
only emits k values, so it is `O(h + k)` time.

## Dry run, k = 3 on the tree above

| step | node (before) | stack        | pop | seen | note            |
| ---- | ------------- | ------------ | --- | ---- | --------------- |
| 1    | 5             | `[5,3,2,1]`  | 1   | 1    | pushed the spine 5-3-2-1 |
| 2    | 1.right=null  | `[5,3,2]`    | 2   | 2    |                 |
| 3    | 2.right=null  | `[5,3]`      | 3   | 3    | `seen === k` -> **3** |

Nodes 4, 5 and 6 are never touched. That is the whole reason for the rewrite.

## The bug

First attempt at the iterative walk, I pushed the node again after popping it:

```js
node = stack.pop();
seen += 1;
stack.push(node);        // ???
node = node.right;
```

I think I was half-remembering a preorder loop. It makes the outer `while` never
terminate on a leaf, and the count climbs forever. Printing `seen` and watching
it pass the node count made it obvious. Once a node is popped it is **done** -
its left side is drained, its own value is emitted, and its right side is
reached through `node = node.right`, not through the stack.

Second small thing: `if (seen === k)` has to come after the increment but
*before* `node = node.right`, otherwise I step past the answer and return the
next value up. Off by one, as usual.

## Complexity

| Version          | Time       | Space  |
| ---------------- | ---------- | ------ |
| Flatten inorder  | `O(n)`     | `O(n)` |
| Stack, stop at k | `O(h + k)` | `O(h)` |

## Follow-up to try

The real answer to the "queried often" follow-up is to store a **subtree size**
on every node. Then finding the k-th is a descent: if the left subtree holds
`L` nodes, compare k with `L + 1` and go left, stop, or go right with
`k - L - 1`. That is `O(h)` per query with `O(h)` maintenance on insert and
delete. Not needed for the plain problem but it is the thing that makes a BST
behave like an indexable sorted list, and I want to implement it some day.

## Note to self

Recursive traversal is for "visit everything". Explicit-stack traversal is for
"visit until". If a tree problem has an early exit in it, write the loop.
