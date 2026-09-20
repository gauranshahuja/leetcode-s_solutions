# Day 081 - Construct Binary Tree from Preorder and Inorder Traversal

LeetCode 105 · Medium · Tree construction from traversals · Sunday, 20 September 2026 · ~55 min, 3 attempts

## Problem

Given both traversals of a binary tree with distinct values, rebuild the tree.

```
preorder = [3, 9, 20, 15, 7]
inorder  = [9, 3, 15, 20, 7]

        3
       / \
      9   20
         /  \
        15   7
```

Distinct values is load bearing. With duplicates the two traversals stop
identifying a single tree - `pre = [1,1]`, `in = [1,1]` fits both "root with a
left child" and "root with a right child".

## The insight

Each traversal answers exactly one question, and neither can do it alone:

- **preorder** = `root, left..., right...` -> the first element of any preorder
  window is that subtree's **root**.
- **inorder** = `left..., root, right...` -> the root's position in inorder
  splits the rest into the two subtrees, which gives me their **sizes**.

So: take the root from preorder, find it in inorder, split, recurse.

## First version: slice everything

```js
const rootVal = pre[0];
const mid = ino.indexOf(rootVal);
node.left  = build(pre.slice(1, mid + 1), ino.slice(0, mid));
node.right = build(pre.slice(mid + 1),    ino.slice(mid + 1));
```

This is how I got it working, and the arguments *are* "the preorder and inorder
of this subtree". Both slice boundaries come from `mid`, since the left subtree
has exactly `mid` nodes and so occupies `pre[1 .. mid]`.

It is also `O(n^2)`: `indexOf` scans and both `slice` calls copy, once per
node. Kept in the file as `buildTreeFromPreInSlice` with a test, because it is
the honest first draft and the thing the fast version has to agree with.

## Second version: a Map and index windows

Two fixes:

1. `ino.indexOf(value)` -> a `Map` of value to inorder index, built once.
   `O(1)` per node.
2. no slicing. Each call takes the inorder window `[lo, hi]` it owns, and the
   preorder side is **one shared cursor** that only moves forward.

```js
let cursor = 0;

function build(lo, hi) {
  if (lo > hi) return null;
  const rootVal = pre[cursor++];
  const node = new TreeNode(rootVal);
  const mid = indexOfValue.get(rootVal);
  node.left  = build(lo, mid - 1);
  node.right = build(mid + 1, hi);
  return node;
}
```

The shared cursor is the bit I had to sit with. It works because preorder is
`root, (all of left), (all of right)`: the left recursion consumes exactly one
preorder entry per node it builds, so when it returns, `cursor` is sitting on
the right subtree's root. No arithmetic needed. Termination comes entirely from
the inorder window, and `lo > hi` takes nothing from preorder.

## The bug

While tidying up I swapped the two recursive lines so the tree read "right then
left":

```js
node.right = build(mid + 1, hi);
node.left  = build(lo, mid - 1);
```

`RangeError: Maximum call stack size exceeded`.

With the order swapped, the right subtree takes its root from `cursor` before
the left subtree has consumed anything, so it reads a value belonging to the
*left* subtree. That value's inorder index lands **outside** the window
`[mid+1, hi]`, and the next call gets a window no smaller than its parent's: on
the example, `build(2,4)` reads 9, whose inorder index is 0, and recurses into
`build(1,4)` - wider than where it started. Nothing shrinks, nothing stops.

The shared cursor silently couples the two recursive calls. They look
independent and are not: **preorder consumption order is part of the
algorithm**, not a style choice. Attempt 2 was a dumber version of the same
mistake, `const rootVal = pre[lo]`, treating the inorder window index as if it
indexed preorder - same overflow, same cause.

## Dry run

`pre = [3, 9, 20, 15, 7]`, `in = [9, 3, 15, 20, 7]`. Map: `9->0, 3->1, 15->2,
20->3, 7->4`.

| call           | cursor before | root | mid | left call   | right call  |
| -------------- | ------------- | ---- | --- | ----------- | ----------- |
| `build(0, 4)`  | 0             | 3    | 1   | `build(0,0)` | `build(2,4)` |
| `build(0, 0)`  | 1             | 9    | 0   | `build(0,-1)` -> null | `build(1,0)` -> null |
| `build(2, 4)`  | 2             | 20   | 3   | `build(2,2)` | `build(4,4)` |
| `build(2, 2)`  | 3             | 15   | 2   | null        | null        |
| `build(4, 4)`  | 4             | 7    | 4   | null        | null        |

Five `build` calls returning a node, five preorder entries consumed. The roots
come out 3, 9, 20, 15, 7 - the preorder again, which is the sanity check that
the cursor never jumped. The tests compare `treeToArray` output rather than
traversals, since the traversals are the *input*.

## Complexity

| Version | Time     | Space                           |
| ------- | -------- | ------------------------------- |
| slice + `indexOf` | `O(n^2)` | `O(n^2)` allocated across the recursion |
| Map + windows     | `O(n)`   | `O(n)` map + `O(h)` stack       |

## Pattern to remember

Preorder (or postorder) gives you roots in order; inorder gives you sizes.
Pass windows plus one shared cursor, never copies - and the cursor means
the recursive calls must happen in traversal order.

Postorder + inorder is the same problem with the cursor walking backwards from
the end and the **right** subtree built first, which I'd have found confusing
before today.
