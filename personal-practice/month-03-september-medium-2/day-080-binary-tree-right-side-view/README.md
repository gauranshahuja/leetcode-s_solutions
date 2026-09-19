# Day 080 - Binary Tree Right Side View

LeetCode 199 · Medium · BFS, last node per level · Saturday, 19 September 2026 · ~18 min, 1 attempt

## Problem

Looking at the tree from the right, list the visible values top to bottom. In
other words: the rightmost node of each level.

```
    1            ->  [1, 3, 4]
   / \
  2   3
   \   \
    5   4
```

## The trap

"Rightmost of each level" is not "follow the right children". This tree breaks
the lazy version:

```
      1         right-pointer walk: 1 -> 3 -> (null)   = [1, 3]
     / \        correct answer:     [1, 3, 4, 5]
    2   3
   /
  4
 /
5
```

Levels 2 and 3 exist only underneath `2`, which is a left child. So the view
has to be computed level by level, not by walking a single path. I put that
exact tree in the tests (`[1,2,3,4,null,null,null,5]`) because it is the one
shape that catches the mistake.

## Approach

Day 052's level-order loop, holding each level as an array:

```js
let level = [root];
while (level.length) {
  out.push(level[level.length - 1].val);   // the whole answer for this level
  const next = [];
  for (const node of level) {
    if (node.left) next.push(node.left);
    if (node.right) next.push(node.right);
  }
  level = next;
}
```

Children are pushed left then right, so the array is in left-to-right order and
the last element is the rightmost node. Nothing else to decide.

Keeping the level as its own array (rather than one long queue with a
`size = queue.length` snapshot) also avoids `shift()`. `Array.prototype.shift`
is `O(n)` in V8 for anything but tiny arrays, since the remaining elements get
moved down, so a queue driven by `shift()` turns an `O(n)` traversal into
roughly `O(n^2)` on a wide tree. Swapping `level = next` is one pointer
assignment.

## Dry run

Tree `[1, 2, 3, null, 5, null, 4]`

| level array (values) | rightmost taken | next level built |
| -------------------- | --------------- | ---------------- |
| `[1]`                | 1               | `[2, 3]`         |
| `[2, 3]`             | 3               | `[5, 4]`         |
| `[5, 4]`             | 4               | `[]`             |

Output `[1, 3, 4]`. Note level 2 is `[5, 4]`: 5 is a *right* child of 2 and 4
is a *right* child of 3, and the rightmost is 4 because of where its parent
sat, not because of which pointer it hangs off.

## The DFS version

Worth writing because it's three lines shorter and the trick is cute:

```js
function walk(node, depth) {
  if (!node) return;
  if (depth === out.length) out.push(node.val);
  walk(node.right, depth + 1);
  walk(node.left, depth + 1);
}
```

Go right before left, so the first node encountered at any depth is the
rightmost one there. `out.length` is both the answer and the record of how many
levels have been seen, so `depth === out.length` means "nobody has reported
from this depth yet".

Which one is better depends on the tree: BFS holds a whole level (`O(n/2)` on a
full tree), DFS holds a path (`O(n)` on a degenerate one). I kept the BFS one
as the primary because "last of each level" is the literal statement of the
problem, and a test checks they agree on the awkward tree above.

## Complexity

| | BFS | DFS |
| ----- | ---- | ---- |
| Time  | `O(n)` | `O(n)` |
| Space | `O(w)`, widest level | `O(h)`, height |

## Note to self

Left side view = same code, take `level[0]` (or recurse left first). This one
took a quarter of the time of yesterday's problem - level-order is properly in
my fingers now, and the only thinking was about the counterexample tree rather
than the traversal.
