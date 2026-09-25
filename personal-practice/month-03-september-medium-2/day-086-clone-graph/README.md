# Day 086 - Clone Graph

LeetCode 133 · Medium · Graph DFS plus a hash map · Friday, 25 September 2026 · ~30 min, 2 attempts

## Problem

Deep copy a connected undirected graph, given a reference to one node. Each
node has a `val` and a list of `neighbors`.

```
1 --- 2          every edge is stored twice:
|     |            node1.neighbors = [2, 4]
4 --- 3            node2.neighbors = [1, 3]
                   node3.neighbors = [2, 4]
adjacency:         node4.neighbors = [1, 3]
[[2,4],[1,3],[2,4],[1,3]]
```

There is no `GraphNode` in `lib/structures`, so the class is defined at the top
of the solution file. Values are unique and run `1..n`, which the test helpers
rely on.

## Where I started

Copy a node, then copy its neighbours, then their neighbours. Which is the right
instinct and immediately blows the stack, because an undirected edge `a-b` means
`a` is in `b.neighbors` **and** `b` is in `a.neighbors`. Every edge is a
two-node cycle. There is no such thing as an acyclic input here.

## The insight

The map from original node to its copy is not a speed-up bolted on afterwards.
It *is* the base case. "Have I already started copying this node?" is the only
thing that stops the recursion.

And the ordering matters more than it looks:

```js
const copy = new GraphNode(original.val);
copies.set(original, copy);          // register BEFORE recursing
for (const nb of original.neighbors) copy.neighbors.push(dfs(nb));
```

Registering first means that when the walk loops back to a node that is still
mid-copy, it gets handed the half-filled copy. That looks wrong the first time
you see it, but it is fine: the object identity is already final, and the frame
that owns that node will finish filling its neighbour list. Nobody else needs to.

Swap those two lines and it never terminates.

## The bug

Not the map ordering, which I got right. It was a JavaScript thing:

```js
function cloneGraph(node, copies = new Map()) {
  // ...
  for (const nb of node.neighbors) copy.neighbors.push(cloneGraph(nb));
  //                                                              ^^ no copies
}
```

I used a default parameter for the map so the public signature would stay
`cloneGraph(node)`, then forgot to thread it through the recursive call. Every
recursive call got a **fresh empty map**, so nothing was ever remembered and it
ran until `RangeError: Maximum call stack size exceeded`.

The fix was to stop being clever: create the map once in the outer function and
let an inner `dfs` close over it. Default-parameter accumulators only work if
every recursive call remembers to pass them, which is exactly the thing I will
forget.

## Dry run

Starting at node 1 on the square.

| call       | map before (originals)  | action                                      |
| ---------- | ----------------------- | ------------------------------------------- |
| dfs(1)     | `{}`                    | make 1', register, recurse on 2             |
| dfs(2)     | `{1}`                   | make 2', register, recurse on 1             |
| dfs(1)     | `{1, 2}`                | **hit** - return 1' (neighbours still empty) |
| dfs(3)     | `{1, 2}`                | make 3', register, recurse on 2             |
| dfs(2)     | `{1, 2, 3}`             | hit - return 2'                             |
| dfs(4)     | `{1, 2, 3}`             | make 4', register, recurse on 1 and 3       |
| ...        |                         | both hits, 4' finished                      |
| back in 1  | `{1, 2, 3, 4}`          | 1'.neighbors = [2', 4']                  |

## How I tested it

Structural equality alone is not enough. A function that just returns the input
node passes "same adjacency list". So the tests check three separate things:

1. `toAdjacency(copy)` equals the original adjacency list - same shape
2. `sharesAnyNode(original, copy)` is `false` - no node object appears in both
3. pushing a neighbour onto the copy leaves the original's adjacency unchanged

Point 2 is the one that actually proves it is a copy, and it needs a `Set` of
node objects by identity, not by `val`.

## Complexity

| Measure | Cost                                         |
| ------- | -------------------------------------------- |
| Time    | `O(V + E)` - each node once, each edge twice |
| Space   | `O(V)` map + `O(V)` recursion depth          |

## Note to self

"Visited set" and "memo table" can be the same object. When the thing you
memoise is the node identity, the memo is what breaks the cycle.

BFS with a queue works identically here and would avoid the deep recursion on a
long chain. DFS was shorter to write and the constraints are small (n <= 100),
so I left it.
