# Day 120 - Redundant Connection

LeetCode 684 · Medium · Union-Find · Thursday, 29 October 2026 · ~15 min, 1 attempt

## Problem

A tree on `n` nodes plus one extra edge: `n` nodes, `n` edges, exactly one
cycle. Return an edge whose removal leaves a tree. If several work, return the
one that appears **last** in the input.

```
edges = [[1,2],[1,3],[2,3]]                 -> [2,3]
edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]     -> [1,4]
```

In the second one the cycle is `1-2-3-4-1`, so any of those four edges would do
as a pure graph question. `[1,4]` is the one asked for because it is the last of
them in the input. `[1,5]` is nowhere near the cycle - node 5 would fall off.

## Straight to Union-Find

The question "does adding this edge create a cycle?" is the single thing DSU is
for. I have had it since Day 087 (Number of Provinces), where I used it to count
components; here I use the return value of `union` instead of the final count.

```js
for (const [u, v] of edges) {
  if (!dsu.union(u, v)) return [u, v];
}
```

That is the entire solution. `lib/structures`' `DSU.union` returns `false` when
the two nodes already share a root, which is precisely "a path between them
already exists", which is precisely "this edge closes a cycle".

Why an edge joining two *different* components can never be the answer: it is
the only connection between those two halves, so deleting it disconnects the
graph and the result is not a tree.

## The part worth thinking about: why "first failure" = "last in input"

This is the bit I would have got wrong a month ago. The problem wants the
**last** valid edge in the input, and my loop returns the **first** union that
fails. Those sound opposite.

The cycle has some set of edges. For the union of `[u, v]` to fail, `u` and `v`
must already be connected, which can only have happened through edges processed
*earlier*. So when I hit the first failure, all the other cycle edges are behind
me, and the one in my hand is the latest of them in input order.

Put differently: feeding the edges in input order means the cycle is only ever
detected at the moment its final edge arrives. There is exactly one cycle, so
there is exactly one such moment, and the tie-break comes for free. If I had
sorted the edges first, or iterated backwards, the answer would still be *a*
removable edge but not necessarily the one asked for.

## Dry run

`edges = [[1,2],[2,3],[2,4],[3,4],[4,5]]`

| edge | find(u) | find(v) | same? | action | components |
| ---- | ------- | ------- | ----- | ------ | ---------- |
| `[1,2]` | 1 | 2 | no | union | `{1,2} {3} {4} {5}` |
| `[2,3]` | 1 | 3 | no | union | `{1,2,3} {4} {5}` |
| `[2,4]` | 1 | 4 | no | union | `{1,2,3,4} {5}` |
| `[3,4]` | 1 | 1 | **yes** | return `[3,4]` | - |

Note `[4,5]` never gets looked at, and it is a good thing: it is a genuine tree
edge, and a naive "return the last edge" guess would have picked it. The cycle
here is `2-3-4-2` and `[3,4]` is its last member in the input.

## Alternatives I considered

- **DFS per edge**: for each edge, remove it and check whether the rest is still
  connected. `O(n)` per edge, `O(n^2)` overall, and fiddly to implement.
- **Find the cycle with DFS, then pick its last edge**: works, but needs cycle
  extraction from a parent map and then an index lookup into the input. More
  moving parts than one `union` call.
- **Topological-style leaf peeling**: repeatedly delete degree-1 nodes until
  only the cycle is left, then pick the last cycle edge in input order. `O(n)`
  and quite nice, but again more code.

DSU wins on both lines of code and on complexity, which is why it gets reached
for first for anything about connectivity or cycles in an **undirected** graph.
(Directed graphs are different - Day 117's Kahn's algorithm, not DSU, because
`union` throws direction away.)

## Complexity

| | |
| - | - |
| Time | `O(n * a(n))`, effectively linear - one `union` per edge, with path halving and union by rank |
| Space | `O(n)` for the parent and rank arrays |

## Note to self

`union` returning false is cycle detection in an undirected graph. And when
a problem asks for "the last valid one", check whether processing in input
order already guarantees it before adding any extra bookkeeping - here it did,
and the temptation to add a "keep scanning and remember the latest" loop would
have been both slower and wrong.

Follow-up: Redundant Connection II (the directed version, LeetCode 685). Same
input shape but the cycle can be a node with two parents, and DSU alone is not
enough. That one is rated hard and I can see why.
