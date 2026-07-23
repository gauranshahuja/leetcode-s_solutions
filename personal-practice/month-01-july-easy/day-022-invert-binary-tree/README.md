# Day 022 - Invert Binary Tree

LeetCode 226 · Easy · Tree recursion · Thursday, 23 July 2026 · ~18 min, 2 attempts

## Problem

Swap the left and right child of every node in a binary tree and return the
root. Mirror image of the original.

```
      4                    4
    /   \                /   \
   2     7      ->      7     2
  / \   / \            / \   / \
 1   3 6   9          9   6 3   1
```

Level-order in / level-order out: `[4,2,7,1,3,6,9]` -> `[4,7,2,9,6,3,1]`.

## Where I started

My first instinct was wrong in a boring way: I swapped `root.left` and
`root.right` and thought I was done. That mirrors exactly one level. The
children keep their own ordering, so anything below depth 1 is still facing
the original direction.

Once I accepted that the swap has to happen at *every* node, recursion is the
obvious shape: do the swap here, then hand the same instruction to both
children.

## The bug

This was attempt 1, and it looks completely reasonable:

```js
root.left = invertTree(root.right);
root.right = invertTree(root.left);   // root.left is already the NEW one
```

The second line reads `root.left` *after* line 1 overwrote it. So instead of
inverting the original left subtree, it re-inverts the subtree it just put
there, flipping it straight back, and the original left subtree is dropped on
the floor entirely.

Fix: resolve both recursive calls into locals first, then assign.

```js
const left = invertTree(root.left);
const right = invertTree(root.right);
root.left = right;
root.right = left;
```

Lesson that is not really about trees: if two assignments both read and write
the same fields, do all the reading first.

## Dry run

`[2,1,3]`, so root 2 with children 1 and 3.

| call           | left after recursion | right after recursion | writes            |
| -------------- | -------------------- | --------------------- | ----------------- |
| `invert(1)`    | null                 | null                  | leaf, nothing moves |
| `invert(3)`    | null                 | null                  | leaf, nothing moves |
| `invert(2)`    | node 1               | node 3                | `2.left = 3`, `2.right = 1` |

Output `[2,3,1]`.

## Edge case that bit me (in my own tests)

Not the algorithm, the test data. I expected `[1,2,3,null,4]` to invert to
`[1,3,2,4]` and got `[1,3,2,null,null,4]`. That is correct and my expectation
was lazy: the level-order array keeps the position of a missing child, so node
3 (now on the left) contributes two `null` slots before node 4 shows up under
node 2. `treeToArray` only trims the nulls at the very end, not the ones in
the middle.

So: when I hand-write expected tree arrays, I have to count the empty slots
too, not just the values.

## Complexity

- Time `O(n)` - one visit per node, and the swap itself is two pointer writes.
- Space `O(h)` where `h` is the height. Balanced tree is `O(log n)`, a
  degenerate chain is `O(n)` of call stack.

## Alternative approach

There is an iterative version: push the root into a queue (or stack), pop a
node, swap its children, push both children, repeat. Same `O(n)` time, and the
extra space becomes an explicit queue instead of the call stack. I wrote it
out on paper to check I could, but the recursive one is four lines and reads
exactly like the definition of the problem, so that is what I kept.

## Note to self

"Do the small thing here, trust the recursive call for the rest" finally
feels natural instead of like a trick.

Day 021 was depth, today is a swap, and underneath they are the same walk:
handle `null`, recurse into both children, combine the two answers. The only
thing that changes between problems is what "combine" means: a `1 + max(...)`
yesterday, a pointer swap today.
