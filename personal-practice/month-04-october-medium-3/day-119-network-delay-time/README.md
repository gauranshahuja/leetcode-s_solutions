# Day 119 - Network Delay Time

LeetCode 743 · Medium · Dijkstra · Wednesday, 28 October 2026 · ~45 min, 2 attempts

## Problem

`times[i] = [u, v, w]`: a directed edge `u -> v` that takes `w` time. A signal
starts at node `k`. How long until **all** `n` nodes have it? `-1` if some node
never does.

```
times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2   -> 2
times = [[1,2,1]],                 n = 2, k = 1   -> 1
times = [[1,2,1]],                 n = 2, k = 2   -> -1   (node 1 unreachable)
```

The signal travels every edge in parallel, so node `i` hears it at exactly
`dist[i]`, the shortest path length from `k`. The answer is therefore
`max(dist[1..n])`, and `-1` if any of those is still infinite. Once I restated
it that way the problem became "write Dijkstra and take a max", and the actual
thinking was about *whether* Dijkstra applies.

## Why Dijkstra is allowed here

Dijkstra's whole argument is: pop the unvisited node with the smallest tentative
distance and declare it final. That is only sound because every edge weight is
**non-negative**. If some edge could be negative, a longer-looking route might
later come back cheaper, and a node I had already finalised would be wrong.

The constraints give `0 <= w <= 100`, so no negative edges. That is the sentence
I want to be able to point at before writing any shortest-path code, because
the three candidates have different preconditions:

| algorithm | works when | cost |
| --------- | ---------- | ---- |
| BFS | all weights equal (unweighted) | `O(V + E)` |
| Dijkstra | weights non-negative | `O(E log E)` |
| Bellman-Ford | any weights, detects negative cycles | `O(V * E)` |

This graph is weighted, so Day 118's plain BFS is out - BFS counts hops, not
cost. If the problem allowed negative weights I would fall back to Bellman-Ford:
relax all `E` edges `V - 1` times, which here would be `O(V * E)` and still
comfortably inside the limits for `n <= 100`. It is about six lines and worth
remembering as the safe default when I am unsure about the weights.

## The implementation

```
dist[] = Infinity, dist[k] = 0
heap   = min-heap of [distance, node], seeded with [0, k]

pop the smallest
  if its distance is worse than dist[node], it is stale -> skip
  else relax every outgoing edge and push any improvement
```

`lib/structures`' `PriorityQueue` has no decrease-key, so I use the **lazy**
variant: push a new entry each time a node improves, and ignore pops that are
out of date. A node can appear in the heap several times, which bounds the heap
at `O(E)` entries rather than `O(V)`, hence `O(E log E)` rather than
`O(E log V)`. Same thing up to a constant, and much less code than maintaining
positions inside the heap.

## The bug: the stale check

First version did not have the skip:

```js
const [d, node] = heap.pop();
for (const [next, weight] of adj[node]) {
  if (d + weight < dist[next]) { ... }
}
```

This still produces correct distances, because I compare against `dist[next]`
before improving it. What it does is re-expand nodes: a node that got pushed at
distance 4 and later improved to 2 gets its edges relaxed twice, once from the
stale 4. On a dense graph that is a lot of wasted work, and it is the kind of
thing that turns into a TLE on the bigger variants rather than a wrong answer.

So `if (d > dist[node]) continue;` is not correctness, it is the line that makes
the lazy heap affordable. I wrote a test around it
(`[[1,2,4],[1,3,1],[3,2,1],[2,4,1]]`) where node 2 is pushed at 4 and then
improved to 2, so there is definitely a stale pop to skip.

## Dry run

`times = [[1,2,10],[1,3,1],[3,2,1]]`, `n = 3`, `k = 1`

| pop | d vs dist | relaxations | dist after | heap after |
| --- | --------- | ----------- | ---------- | ---------- |
| `[0,1]` | ok | `2: 0+10 = 10`, `3: 0+1 = 1` | `1:0, 2:10, 3:1` | `[1,3], [10,2]` |
| `[1,3]` | ok | `2: 1+1 = 2 < 10` | `1:0, 2:2, 3:1` | `[2,2], [10,2]` |
| `[2,2]` | ok | node 2 has no outgoing edges | unchanged | `[10,2]` |
| `[10,2]` | `10 > dist[2] = 2` -> **stale, skipped** | - | - | empty |

`max(0, 2, 1) = 2`

The expensive direct edge `1 -> 2` never gets used, which is the point of the
test: a greedy "fewest hops" answer would have said 10.

## Edge cases I made sure to cover

- `n = 1`, no edges, `k = 1`: the source is reached at time 0, so the answer is
  `0`, not `-1`. `dist[k] = 0` handles it with no special case.
- A node with no incoming path at all: the `Infinity` check catches it.
- **Parallel edges** `[[1,2,5],[1,2,2]]`: both get pushed into the adjacency
  list, and the relaxation naturally keeps the cheaper one. No deduplication
  needed.
- A **self loop** `[1,1,3]`: `0 + 3 < dist[1] = 0` is false, so it is dropped on
  the spot. Non-negative weights mean self loops can never help.
- 1-indexed nodes: arrays are `n + 1` long and slot 0 is never touched. I did
  briefly write `new Array(n)` and read `dist[n]` out of bounds, which showed up
  immediately as `undefined` in the max loop.

## Complexity

| | |
| - | - |
| Time | `O(E log E)` - each relaxation can push one heap entry |
| Space | `O(V + E)` adjacency lists, `O(E)` worst-case heap |

With `n <= 100` and `E <= 6000` this is nothing, but the shape is what matters
for the harder graph problems.

## Pattern to remember

Before reaching for a shortest-path algorithm, check the weights. Unweighted
means BFS. Non-negative means Dijkstra with a heap. Anything negative means
Bellman-Ford. And with a heap that has no decrease-key, the lazy "skip stale
pops" line is mandatory, not optional.
