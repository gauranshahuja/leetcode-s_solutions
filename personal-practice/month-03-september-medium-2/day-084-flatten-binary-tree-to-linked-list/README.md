# Day 084 - Flatten Binary Tree to Linked List

LeetCode 114 · Medium · Tree pointer rewiring · Wednesday, 23 September 2026 · ~45 min (the O(1) one took most of it), 3 attempts

## Problem

Rewire the tree in place into a right-leaning chain. Every `left` must end up
null, and walking `right` must visit the nodes in the tree's original
**pre-order**.

```
      1
     / \        flatten
    2   5       ------->   1 -> 2 -> 3 -> 4 -> 5 -> 6   (all via .right)
   / \   \
  3   4   6
```

No new nodes. Follow-up asks for `O(1)` extra space, which is the only reason
this is interesting.

## Where I started

Collect the pre-order into an array, then stitch:

```js
const order = [];
preorder(root, order);     // nodes, not values
for (let i = 0; i < order.length - 1; i++) {
  order[i].left = null;
  order[i].right = order[i + 1];
}
```

Works, `O(n)` time, but `O(n)` extra space for the array, which is the thing the
follow-up is asking me not to do. Did not keep it.

## Version that is actually nice: reverse pre-order

The forwards recursion is annoying because after flattening the left subtree I
have to find the **tail** of that flattened chain before I can attach the right
subtree. That is an extra walk, or an extra return value.

Going backwards removes the problem entirely. Visit `right`, then `left`, then
the node. By the time I touch a node, everything that comes after it in
pre-order is already a finished chain sitting in `prev`:

```js
walk(node.right);
walk(node.left);
node.right = prev;
node.left = null;
prev = node;
```

That is the same "build the list back to front with a trailing pointer" move as
reversing a linked list, which is why it felt familiar.

## The O(1) version

Walk down the right spine with a plain `while` loop. At each node:

1. if there is no left child, nothing to do, step right
2. if there is, find the **rightmost** node of the left subtree
3. hang the current right subtree off that rightmost node
4. move the left subtree over to `right`, set `left = null`
5. step right (which is now the old left child) and repeat

Step 2 is the bit I had to derive rather than remember. Why rightmost? Because
in pre-order, the last node visited inside a subtree is the one you reach by
going right as far as possible. So that is exactly where the stuff after the
subtree has to be re-attached.

It looks like it should be `O(n log n)` or worse because of the inner hunt, but
each edge is traversed at most twice overall (once by the outer loop, once by
one rightmost search), so it is still `O(n)`.

## Dry run of the O(1) version

Starting tree `[1,2,5,3,4,null,6]`.

| step | cur | has left? | action                                         | right spine so far |
| ---- | --- | --------- | ---------------------------------------------- | ------------------ |
| 1    | 1   | yes (2)   | rightmost of `2` is `4`; `4.right = 5`; `1.right = 2` | 1,2                |
| 2    | 2   | yes (3)   | rightmost of `3` is `3`; `3.right = 4`; `2.right = 3` | 1,2,3              |
| 3    | 3   | no        | step right                                     | 1,2,3,4            |
| 4    | 4   | no        | step right                                     | ...                |
| 5    | 5   | no        | step right                                     | ...,5,6            |
| 6    | 6   | no        | step right -> null, loop ends                  | 1,2,3,4,5,6     |

## The bug

I forgot `node.left = null` in the reverse pre-order version on the first run.
The spine came out perfectly correct, so my first test passed and I nearly moved
on. The tree was still a tree though, with every original left pointer intact.

That is why there is a test in the file that only checks the `left` pointers:

```js
function anyLeftLeftOver(root) {
  for (let node = root; node; node = node.right) {
    if (node.left !== null) return true;
  }
  return false;
}
```

Lesson: when a problem states two conditions ("right chain" *and* "all lefts
null"), write a test per condition. Checking only the interesting one let a
half-done answer look finished.

## Complexity

| Version            | Time   | Space              |
| ------------------ | ------ | ------------------ |
| Pre-order array    | `O(n)` | `O(n)`             |
| Reverse pre-order  | `O(n)` | `O(h)` call stack  |
| Morris-style loop  | `O(n)` | `O(1)`             |

## Takeaway

Pointer-rewiring problems get easier when built back to front, and the "find
the rightmost node of the left subtree" splice is the generic way to turn a
tree walk into a loop with no stack.

That splice is the same trick as Morris inorder traversal, which I had read
about and never actually used. Now I have.
