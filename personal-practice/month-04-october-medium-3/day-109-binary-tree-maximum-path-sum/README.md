# Day 109 - Binary Tree Maximum Path Sum

LeetCode 124 · Hard · Tree DP · Sunday, 18 October 2026 · ~1 hr 10 min, 3 attempts

## Problem

A path is any sequence of nodes connected by edges with no repeats. It does not
have to include the root, does not have to end at a leaf, and can bend once -
up one side and down the other. Return the maximum sum of node values on a path.

```
    1              -10
   / \             /  \
  2   3           9    20
                      /  \
                     15    7

answer: 6         answer: 42  (15 + 20 + 7, the root is not in it)
```

Values may be negative.

## The shape, which I already knew

This is Day 083 (Diameter of a Binary Tree) with sums instead of edge counts.
That day taught me the pattern: a single DFS where **what you return is not what
you are measuring**.

| | Day 083 | today |
| --- | --- | --- |
| returned up | height below me | best sum of a path going only down from me |
| recorded as answer | left height + right height | left arm + my value + right arm |

Why the split: a path that bends at a node is finished. My parent cannot extend
it, because entering from the parent and leaving down both sides would visit me
twice. So the bent value is compared into a running `best` and thrown away,
while the thing I hand up is strictly one-armed.

And why this covers everything: every path has a unique topmost node, and at
that node it is a bending (or single-armed, or single-node) path. So evaluating
"best path turning here" at every node evaluates every path exactly once.

## The clamp is the whole problem

```js
const left  = Math.max(0, down(node.left));
const right = Math.max(0, down(node.right));
```

`down(child)` can come back negative. If the best I can do going down the left
side is `-7`, then attaching the left side costs me 7. I am not obliged to
attach it - a path is allowed to stop at this node. So the real choice per arm
is "this arm, or no arm", and "no arm" contributes 0.

`Math.max(0, x)` is that choice. The 0 is **the sum of an empty arm**, not a
value taken from the tree. That distinction is what I got wrong twice:

**Attempt 1** - no clamp at all:

```js
const left = down(node.left);
const right = down(node.right);
best = Math.max(best, node.val + left + right);
```

Both sample trees still pass, which is why it took me a third attempt to spot.
It fails on `[10, -5, -5]`: the answer is 10, the root alone, but with no clamp
the root's turn value is `10 - 5 - 5 = 0` and neither child beats that.

**Attempt 2** - clamped too much. I also wrapped the return:

```js
return Math.max(0, node.val + Math.max(left, right));   // wrong
```

and initialised `best = 0`. That treats "a path with no nodes" as legal and
breaks every all-negative tree: `[-3]` returns 0 instead of `-3`. The path must
contain at least one node, so:

- clamp the **arms** (optional extras) at 0
- never clamp **`node.val`** (mandatory)
- start `best` at `-Infinity`, not 0

I was going in circles on the second one for a good twenty minutes, so I read
the editorial's two sentences about why the clamp applies to children only,
then closed it and rewrote the function. The idea was the part I was missing,
not the code.

## Dry run

```
      1
    /   \
  -2    -3
  / \   /
 1   3 -2
/
-1
```

Post-order, so children resolve before parents.

| node | down(left) | clamped | down(right) | clamped | turn value here | returns |
| ---- | ---------- | ------- | ----------- | ------- | --------------- | ------- |
| -1   | 0          | 0       | 0           | 0       | **-1**          | -1      |
| 1    | -1         | 0       | 0           | 0       | **1**           | 1       |
| 3    | 0          | 0       | 0           | 0       | **3**           | 3       |
| -2   | 1          | 1       | 3           | 3       | -2+1+3 = **2**  | -2+3 = 1 |
| -2   | 0          | 0       | 0           | 0       | **-2**          | -2      |
| -3   | -2         | **0**   | 0           | 0       | **-3**          | -3      |
| 1    | 1          | 1       | -3          | **0**   | 1+1+0 = **2**   | 2       |

`best = max(-1, 1, 3, 2, -2, -3, 2) = 3` - a single node, node `3`, beats
every longer path. Both clamps fired, at `-3` and at the root.

## Complexity

| | |
| --- | --- |
| Time | `O(n)` - one visit per node, constant work each |
| Space | `O(h)` recursion stack; `O(n)` if the tree is a chain |

## Takeaway

Return the extendable quantity, record the finished one. And when an optional
contribution can be negative, `Math.max(0, ...)` is "skip it" - apply it only
to the optional parts, never to the part the answer must contain.

Second time this two-quantity DFS has come up (083 was the first). I wrote the skeleton from memory in about four minutes; the 50
minutes went on the clamp, which is the thing that is actually new here.
