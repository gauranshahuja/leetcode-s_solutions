# Day 053 - Validate Binary Search Tree

LeetCode 98 · Medium · BST with min/max bounds · Sunday, 23 August 2026 · ~40 min, 3 attempts

## Problem

Is this binary tree a valid BST? Rules:

- every value in a node's **left subtree** is strictly less than the node
- every value in a node's **right subtree** is strictly greater
- both subtrees are themselves BSTs

```
    2              5
   / \            / \
  1   3          1   4      <- 3 sits under 4, but 3 < 5
                    / \        and it is in 5's RIGHT subtree
                   3   6
  valid            invalid
```

## My first (wrong) idea

I read the definition too fast and implemented the obvious local version: at
each node, check the left child is smaller and the right child is bigger, then
recurse.

```js
if (root.left  && root.left.val  >= root.val) return false;
if (root.right && root.right.val <= root.val) return false;
return isValidBstLocal(root.left) && isValidBstLocal(root.right);
```

Looks right. Passes `[2,1,3]`. Passes a handful of trees I drew myself. And it
is still wrong, because it never checks a node against its **grandparents**.

The counterexample that killed it:

```
      5
     / \
    1   6
       / \
      4   7
```

`[5, 1, 6, null, null, 4, 7]`

Walk my check over it:

| node | left child | right child | local verdict |
| ---- | ---------- | ----------- | ------------- |
| 5    | 1 < 5 ok   | 6 > 5 ok    | fine          |
| 1    | -          | -           | fine          |
| 6    | 4 < 6 ok   | 7 > 6 ok    | fine          |

Every local check passes, so my function says `true`. But 4 is in the right
subtree of 5, and 4 < 5, so the tree is **not** a BST. Searching for 4 from the
root would go right at 5 and never come back.

I kept `isValidBstLocal` in the solution file with a test that asserts it
returns the wrong answer, because that test is the actual lesson.

## What finally clicked

A node is not only constrained by its parent. It is constrained by **every
ancestor it passed on the way down**. Coming down from the root:

- when I step **left** from a node, everything below gets a new ceiling: `node.val`
- when I step **right**, everything below gets a new floor: `node.val`

So I carry an open interval `(low, high)` down the recursion, and each node only
answers one question: am I inside my interval?

```js
if (node.val <= low || node.val >= high) return false;
walk(node.left,  low,      node.val);
walk(node.right, node.val, high);
```

Same walk on the broken tree:

| node | interval            | inside? |
| ---- | ------------------- | ------- |
| 5    | `(-inf, +inf)`      | yes     |
| 1    | `(-inf, 5)`         | yes     |
| 6    | `(5, +inf)`         | yes     |
| 4    | `(5, 6)`            | **no**  |

It dies exactly where it should.

## Things I had to be careful about

- **Strict comparisons.** Duplicates are not allowed, so `<=` and `>=`, not
  `<` and `>`. `[2,2,3]` must be false and my first bounds version said true.
- **Initial bounds.** I started with `null` meaning "no bound yet" and ended up
  with `if (low !== null && node.val <= low)` noise everywhere. `-Infinity` and
  `Infinity` are real numbers to compare against in JS and the node values are
  int32, so there is no range where this bites. Much cleaner.
- Bounds get **tightened**, never widened. I briefly passed `node.val` as both
  bounds on both sides, which rejects everything past depth 2.

## Complexity

| | |
| ------ | ------ |
| Time   | `O(n)` - each node checked once |
| Space  | `O(h)` recursion stack, `O(n)` if the tree is a chain |

## Alternative approach

Inorder traversal of a BST is sorted, so you can walk inorder and check each
value is strictly greater than the previous one. `lib/structures` already has
`inorder`, so it is almost a one-liner. I did not use it here because it
allocates the whole value array, and the bounds version can bail out at the
first bad node instead of finishing the walk. Worth remembering though - that
same "inorder is sorted" fact feels like it is going to come back all week.

## Takeaway

For trees, "is this property true here?" is almost never a local question.
If the definition says *every node in the subtree*, the recursion has to
carry context down, not just look at its own two children.
