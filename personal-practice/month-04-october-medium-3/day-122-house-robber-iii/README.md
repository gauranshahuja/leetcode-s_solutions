# Day 122 - House Robber III

LeetCode 337 · Medium · Tree DP · Saturday, 31 October 2026 · ~30 min, 2 attempts

## Problem

The houses form a binary tree. Robbing a node means neither of its children can
be robbed. Grandchildren are fine. Maximise the total.

```
      3            rob the root plus both grandchildren:
     / \           3 + 3 + 1 = 7
    2   3
     \   \
      3   1        -> 7

      3            skip the root instead:
     / \           left subtree best 1 + 3 = 4, right subtree best 5
    4   5          4 + 5 = 9  beats  3 + 4 + 1 = 8
   / \   \
  1   3   1        -> 9
```

## Day 059, bent into a tree

Day 059 (House Robber, the street version) came down to two numbers walked along
the array:

```js
let robbed = 0;   // best total if I take the current house
let skipped = 0;  // best total if I do not
for (const v of nums) [robbed, skipped] = [skipped + v, Math.max(robbed, skipped)];
```

The constraint there was "not two in a row". Here it is "not a parent and its
child": the same constraint on a different shape, so the state is the same two
numbers. They just have to flow **up from the leaves** instead of left to right.

```
robbed[node]  = node.val + skipped[left] + skipped[right]
skipped[node] = max(robbed[left],  skipped[left])
              + max(robbed[right], skipped[right])
```

Robbing a node bans both children, so it can only add their `skipped` values.
Skipping a node bans nothing, so each child independently contributes whichever
of its own two numbers is larger. A null child returns `[0, 0]` and the base
case is done.

## The version I started with, and why I dropped it

My first instinct was the single-value recursion:

```js
function rob(node) {
  if (!node) return 0;
  const withNode = node.val
    + (node.left  ? rob(node.left.left)  + rob(node.left.right)  : 0)
    + (node.right ? rob(node.right.left) + rob(node.right.right) : 0);
  const withoutNode = rob(node.left) + rob(node.right);
  return Math.max(withNode, withoutNode);
}
```

Correct, and exponential. Every grandchild subtree is solved twice, once as a
grandchild of this node and once as a child of the child.

The usual patch is a `Map` keyed on the node object, which works nicely in JS
since `Map` takes object keys by identity without stringifying anything. But the
pair version makes the memo unnecessary: **if each call returns both answers,
nothing ever needs to be asked twice.** One post-order pass, `O(n)`, no cache.

That is the lesson of the day. "Memoise on the node" and "return a tuple of
states" fix the same recomputation, and the tuple is shorter whenever the number
of states is small and fixed.

## Dry run

Second example: `[3,4,5,1,3,null,1]`

Post-order, so leaves first. Each row is `[robbed, skipped]`.

| node | left pair | right pair | robbed | skipped | pair |
| ---- | --------- | ---------- | ------ | ------- | ---- |
| `1` (under 4) | `[0,0]` | `[0,0]` | `1 + 0 + 0 = 1` | `0 + 0 = 0` | `[1,0]` |
| `3` (under 4) | `[0,0]` | `[0,0]` | `3` | `0` | `[3,0]` |
| `4` | `[1,0]` | `[3,0]` | `4 + 0 + 0 = 4` | `max(1,0) + max(3,0) = 4` | `[4,4]` |
| `1` (under 5) | `[0,0]` | `[0,0]` | `1` | `0` | `[1,0]` |
| `5` | `[0,0]` | `[1,0]` | `5 + 0 + 0 = 5` | `0 + max(1,0) = 1` | `[5,1]` |
| `3` (root) | `[4,4]` | `[5,1]` | `3 + 4 + 1 = 8` | `max(4,4) + max(5,1) = 9` | `[8,9]` |

`max(8, 9) = 9`

Node `4` is the interesting row: `robbed` and `skipped` tie at 4, because taking
the 4 is worth exactly as much as taking its children `1 + 3`. The root then
uses the `skipped` branch anyway, and the tie costs nothing.

## The bug

Attempt 1 of the pair version had this:

```js
const robbed = node.val + Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
```

I pasted the `skipped` line and forgot to change it, so robbing a node allowed
its children to be robbed too. Example 2 came out as 13 (`3 + 4 + 5 + 1`), an
obviously illegal haul, so it was quick to spot. Worth saying plainly:
**`robbed` must read index 1 of both children, never a max.** The whole
constraint lives in that one index.

## Complexity

- Time: `O(n)` - every node visited once, constant work per node
- Space: `O(h)` recursion stack, so `log n` when balanced and `n` for a chain

The left-skewed chain test (`4 -> 1 -> 2 -> 3`, answer 7 from the 4 and the 3) is
partly there to cover the degenerate shape. `n` up to 10^4 is fine recursively
in Node; a 10^5-deep chain would want an explicit stack.

## Takeaway

Tree DP = decide the small set of states a subtree can be in, then return all
of them from one post-order call. If a recursion needs a memo keyed on nodes,
check first whether it is really just missing a second return value.

## End of month 4

That is October done: 31 days, and the whole month was the medium problems that
do not come apart on the first read. Looking back at the ten days I just
finished, the thing that changed is not that I know more algorithms. It is that
I now spend the first few minutes deciding **which template applies** instead of
typing. Day 118 took twenty minutes because I recognised Day 057 inside it. Day
121 took forty because I recognised Day 060 and got the recognition *wrong* -
same loops, different question - which was a better lesson than getting it
right.

The list of things that keep coming back is short, which is reassuring: prefix
DP, a bounded heap with a comparator I have to invert, multi-source BFS, Kahn's,
DSU, 1D knapsack with the loop order picked deliberately, and a post-order pass
carrying a tuple.

November is the hard tier and I am honestly nervous about it. The pattern I keep
seeing in hard problems is that they are two mediums stacked, and the stacking
is the part nobody teaches. The plan is unchanged: read the problem twice, say
which template it looks like out loud, and if nothing fits after 45 minutes,
read the editorial for the one idea I am missing and then write the code myself.
That worked all month.
