# Day 108 - Binary Tree Zigzag Level Order Traversal

LeetCode 103 · Medium · BFS with alternating direction · Saturday, 17 October 2026 · ~25 min, 2 attempts

## Problem

Level order traversal, except alternate levels come out right to left.

```
      3
     / \
    9  20
      /  \
     15   7

->  [[3], [20, 9], [15, 7]]
```

Level 0 left-to-right, level 1 right-to-left, level 2 left-to-right again.

## This is Day 052 plus one line

Day 052 was plain level order and I already settled the structure there:

```js
let queue = [root];
while (queue.length) {
  const level = [], next = [];
  for (const node of queue) {
    level.push(node.val);
    if (node.left) next.push(node.left);
    if (node.right) next.push(node.right);
  }
  out.push(level);
  queue = next;
}
```

Two arrays, swapped at the end of each round. No `shift()` - `Array.prototype
.shift()` reindexes the whole array, so a "pop from the front" BFS is `O(n^2)`
on a wide level. Rebuilding `next` is `O(1)` per node.

Today's change is one line:

```js
out.push(leftToRight ? level : level.reverse());
leftToRight = !leftToRight;
```

## My first (wrong) idea

I thought the direction should live in the *traversal*: on odd levels, enqueue
`right` before `left` so the next level naturally comes out flipped.

```js
if (leftToRight) { next.push(node.left); next.push(node.right); }
else             { next.push(node.right); next.push(node.left); }
```

That reverses level 1 correctly and then breaks level 2. Try it on
`[1,2,3,4,5,6,7]`:

- level 1 is visited as `3, 2` - good
- while visiting `3` I enqueue `7, 6`, then visiting `2` I enqueue `5, 4`
- so level 2 is `7, 6, 5, 4`, and level 2 should be left-to-right: `4, 5, 6, 7`

The flips compound. The traversal order and the output order are two different
things and trying to make one do the job of the other means tracking parity in
two places.

The fix is to keep the walk *always* left-to-right and flip only the collected
array. Then there is exactly one place where direction exists.

## Why reverse the level and not the queue

Same reason, stated differently: the queue is the input to the *next* round, so
reversing it changes what the next round's children order looks like. The level
array is finished output - nothing downstream reads it. Reversing a finished
thing is safe, reversing a live thing is not.

`level.reverse()` mutates in place, which is fine here because `level` is
freshly built and nothing else holds a reference. If I wanted the loop to read
more declaratively, `next.unshift(node.val)` on odd levels does the same job
without the reverse, but `unshift` is `O(width)` each time so the level build
becomes quadratic in the width. Reverse once at the end is cheaper.

## Dry run

`[1,2,3,4,null,null,5,6]`:

```
        1
       / \
      2   3
     /     \
    4       5
   /
  6
```

| round | queue  | level collected | leftToRight | emitted  |
| ----- | ------ | --------------- | ----------- | -------- |
| 0     | `[1]`  | `[1]`           | true        | `[1]`    |
| 1     | `[2,3]`| `[2,3]`         | false       | `[3,2]`  |
| 2     | `[4,5]`| `[4,5]`         | true        | `[4,5]`  |
| 3     | `[6]`  | `[6]`           | false       | `[6]` |

Round 2 is the one that catches the bad version. Here `4` comes from `2` and `5`
comes from `3`, enqueued in that order because the walk never changed
direction, and `leftToRight` is true again so it is emitted as-is.

## Complexity

| | |
| --- | --- |
| Time | `O(n)` - every node enqueued and read once; the reverses sum to `O(n)` total |
| Space | `O(w)` for the queue where `w` is the widest level, plus `O(n)` output |

## Note to self

If a problem adds a *presentation* rule to a traversal, change the output,
not the traversal. Alternating the walk direction almost always double-flips
somewhere and the sample test will not show it.

Same instinct as DFS problems where you collect in natural order and sort at the
end instead of trying to visit in sorted order.
