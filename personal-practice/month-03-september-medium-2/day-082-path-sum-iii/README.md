# Day 082 - Path Sum III

LeetCode 437 · Medium · Tree plus prefix sum · Monday, 21 September 2026 · ~40 min, 3 attempts

## Problem

Count every downward path in a binary tree whose node values sum to
`targetSum`. The path can start and end anywhere, as long as each step goes
from a parent to one of its children.

```
        10
       /  \
      5    -3
     / \     \
    3   2     11
   / \   \
  3  -2   1

targetSum = 8  ->  3 paths
  5 -> 3
  5 -> 2 -> 1
  -3 -> 11
```

Node values can be negative. That single line kills the obvious pruning idea,
so it is worth reading twice.

## Where I started

The shape I reached for first was "a path that begins at this node", because
that is a clean recursion:

```js
function countStartingHere(node, remaining) {
  if (!node) return 0;
  const rest = remaining - node.val;
  return (rest === 0 ? 1 : 0)
       + countStartingHere(node.left, rest)
       + countStartingHere(node.right, rest);
}
```

Then wrap it: run that at the root, and also run the whole thing again at
`root.left` and `root.right`. Every node gets its own fresh DFS.

That is accepted on LeetCode and I kept it in the file as `pathSumBrute`. But a
node near the bottom of a skewed tree is re-walked once for each of its
ancestors, so it is `O(n^2)` in the bad case.

## What finally clicked

This is Day 037 wearing a tree costume.

On an array, "how many subarrays sum to k" is answered by walking the prefix
sums and asking "have I seen `running - k` before?". A downward path in a tree
**is** a subarray, just of the root-to-current chain instead of the array. Same
question, same map.

So: carry a `Map` of prefix sum -> how many times it occurs on the current
chain, seeded with `0 -> 1` so paths starting at the root are counted.

## The bug

The branching is the whole difficulty, and I got it wrong twice.

My first prefix-sum attempt was just the array version pasted in:

```js
seen.set(sum, (seen.get(sum) || 0) + 1);
walk(node.left, sum);
walk(node.right, sum);
// ...and nothing here
```

On the example above that returns 4 instead of 3. The chain `10 -> 5 -> 3` gets
its prefix sums written into the map, and when the walk comes back up and goes
down `10 -> -3 -> 11`, the map still contains them. The algorithm then happily
counts a "path" whose two ends are in different subtrees, which is not a path at
all.

The fix is one line after the two recursive calls:

```js
seen.set(sum, seen.get(sum) - 1);
```

The invariant I should have written down before coding: **the map describes the
current root-to-node chain and nothing else.** Every increment on the way down
needs a matching decrement on the way back up.

## Dry run

Chain `10 -> 5 -> 3 -> 3`, `targetSum = 8`.

| node | running | needs `running-8` | map before                  | found | count |
| ---- | ------- | ----------------- | --------------------------- | ----- | ----- |
| 10   | 10      | 2                 | `{0:1}`                     | no    | 0     |
| 5    | 15      | 7                 | `{0:1, 10:1}`               | no    | 0     |
| 3    | 18      | 10                | `{0:1, 10:1, 15:1}`         | yes   | 1  |
| 3    | 21      | 13                | `{0:1, 10:1, 15:1, 18:1}`   | no    | 1     |

The hit at the third node is `10` sitting in the map, which means the path from
*after* node 10 down to here sums to 8: that is `5 -> 3`.

Then the walk unwinds and each node removes its own entry, so when `-3` is
visited the map is back to `{0:1, 10:1}`.

## Complexity

| Version          | Time               | Space  |
| ---------------- | ------------------ | ------ |
| DFS per node     | `O(n^2)` worst     | `O(h)` |
| Prefix sum map   | `O(n)`             | `O(h)` |

The space is `O(h)`, not `O(n)`, precisely because of the backtracking - the map
never holds more entries than the current chain is deep.

## Pattern to remember

A root-to-node chain is an array. Anything I know how to do on a prefix-sum
array, I can do on a tree, as long as I undo my writes on the way back up.

Month three is starting to feel like this: the problems are not new, they are
old problems with a different container. Prefix sum plus backtracking is a
template I should expect again.
