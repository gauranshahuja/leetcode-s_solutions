# Day 052 - Binary Tree Level Order Traversal

LeetCode 102 · Medium · BFS by levels · Saturday, 22 August 2026 · ~30 min, 2 attempts

## Problem

Given the root of a binary tree, return its values grouped by depth: one array
per level, left to right.

```
        3
       / \
      9  20
         / \
       15   7

  ->  [[3], [9, 20], [15, 7]]
```

Empty tree gives `[]`.

## Where I started

Every tree problem so far (Days 021-024) I solved with recursion, so my first
move was the same reflex: recurse and collect. But recursion goes *down* one
branch at a time, and this problem wants a *sideways* order. Node 9 and node 20
are in completely different subtrees and they have to end up in the same array.

That is the point where it clicked that this needs a queue rather than a stack.
Depth-first follows one path to the bottom; breadth-first sweeps a whole row
before going deeper. First time I have actually needed BFS instead of DFS.

## The part I got wrong

My first version used a queue and *did* produce `[3, 9, 20, 15, 7]` in the
right order, but every value landed in one flat array. So I tried to split it
by looping "while there is anything at this level":

```js
while (head < queue.length) {
  const level = [];
  for (let i = head; i < queue.length; i += 1) {   // <-- re-read every iteration
    const node = queue[i];
    head += 1;
    level.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  out.push(level);
}
```

`queue.length` is re-evaluated on every pass of the inner `for`, and I am
pushing children *into that same queue* while looping. So the finish line keeps
moving away and the inner loop swallows the entire tree. Output:
`[[3, 9, 20, 15, 7]]`.

## What fixed it

Freeze the count before the inner loop starts:

```js
const levelSize = queue.length - head;
for (let i = 0; i < levelSize; i += 1) { ... }
```

Everything in the queue right now is the current level. Everything pushed from
here on is a child, so it is the next level. One number, and the levels cut
themselves apart.

## Dry run

`[3, 9, 20, null, null, 15, 7]`

| round | head | queue             | levelSize | read      | pushed  | out so far            |
| ----- | ---- | ----------------- | --------- | --------- | ------- | --------------------- |
| 1     | 0    | `[3]`             | 1         | 3         | 9, 20   | `[[3]]`               |
| 2     | 1    | `[3,9,20]`        | 2         | 9, 20     | 15, 7   | `[[3],[9,20]]`        |
| 3     | 3    | `[3,9,20,15,7]`   | 2         | 15, 7     | -       | `[[3],[9,20],[15,7]]` |
| 4     | 5    | same              | -         | head == length, stop | |         |

## The JS detail worth keeping

I wrote `queue.shift()` at first because that is what a queue "should" look
like. `shift()` removes the front element and re-indexes everything after it,
so it is O(n) per call. On a tree whose bottom level has 30,000 nodes that
makes the traversal quadratic for no reason.

Instead the array just grows and a `head` integer walks forward. Memory is a
bit wasteful (the consumed prefix stays allocated) but every dequeue is O(1).
I am going to keep using this shape for grid BFS too.

## Complexity

- Time `O(n)` - every node is pushed once, read once.
- Space `O(n)` - output is `O(n)` regardless; the queue array also keeps all
  `n` slots because of the head-pointer trick. A proper ring buffer would be
  `O(width)`.

## Alternative approach

You can do it with DFS if you pass the depth down and index into the output:

```js
const walk = (node, depth) => {
  if (!node) return;
  if (!out[depth]) out[depth] = [];
  out[depth].push(node.val);
  walk(node.left, depth + 1);
  walk(node.right, depth + 1);
};
```

That gives the same arrays because left is always visited before right at the
same depth. I went with BFS because the level boundary is explicit instead of
being a side effect of the visit order - and because tomorrow's problems want
me comfortable with a queue.

## Note to self

"Snapshot the size, then drain" is the whole pattern for anything
level-by-level: zigzag traversal, right side view, level averages, minimum
depth. The loop body barely changes.
