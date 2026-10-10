# Day 101 - Merge k Sorted Lists

LeetCode 23 · Hard · Divide and conquer, or a heap · Saturday, 10 October 2026 · ~50 min (wrote both versions), 2 attempts

Marked Hard but it did not feel like yesterday's Hard. Both approaches were
clear from the start; the time went into writing both and convincing myself the
complexities really are the same.

## Problem

`k` sorted linked lists in, one sorted linked list out. Lists may be empty, the
array of lists may be empty. Let `N` be the total node count.

```
[[1,4,5], [1,3,4], [2,6]]   ->   [1,1,2,3,4,4,5,6]
[]                          ->   []
[[]]                        ->   []
```

## The one to avoid

Fold left: merge list 0 with list 1, then that result with list 2, and so on.

```js
let acc = null;
for (const l of lists) acc = mergeTwo(acc, l);
```

That is `O(N * k)`: the accumulator grows as it goes, so by round `i` you are
re-walking roughly `i * N/k` nodes, which sums to `N * k / 2`. With `k = 10^4`
it times out. Getting rid of that factor is the whole problem.

## Version A - min-heap of the heads

At any moment the next node of the answer is the **smallest of the `k` current
heads**. Nothing else can be: each list is sorted, so a list's smallest unused
node is its head.

So keep exactly those `k` heads in a min-heap. Pop the smallest, append it, and
push its successor to take its place. The heap size stays `<= k`, which is where
`log k` rather than `log N` comes from.

```js
const pq = new PriorityQueue((x, y) => x.val - y.val);
for (const head of lists) if (head) pq.push(head);
// ...
const node = pq.pop();
tail.next = node;
tail = node;
if (node.next) pq.push(node.next);
```

`PriorityQueue` comes from `lib/structures`, with a comparator on `.val`.

### The bug I had to fix

`tail.next = null` at the end. Without it the final node still points into
whatever remained of its original list - and since I splice nodes rather than
copy them, that is usually a node already in the output. My first run spun
inside `listToArray` until its `guard < 100000` cutoff dumped 100,000 values at
me. Appending a node does not detach it from where it came from: only the loop's
own `tail.next = node` overwrites the previous link, and the last node never
gets that treatment.

## Version B - pairwise merge

No heap at all. Merge the lists in pairs, halving how many remain each round,
until one is left.

```
round 0:  L0  L1  L2  L3  L4
           \  /    \  /    |
round 1:    A       B     L4
             \     /      /
round 2:        C       L4
                 \     /
round 3:            D
```

An odd list out just carries over to the next round untouched.

**Why this is also `O(N log k)`:** there are `ceil(log2 k)` rounds, and within a
round the lists being merged are pairwise disjoint, so a round touches each node
at most once - `O(N)`. `log k` rounds at `O(N)` each.

The difference from the fold-left version is that pairing keeps the merged
pieces roughly **the same size as each other** for as long as possible, so no
single accumulator gets rescanned repeatedly.

## Comparing them

|                 | heap                        | pairwise                    |
| --------------- | --------------------------- | --------------------------- |
| Time            | `O(N log k)`                | `O(N log k)`                |
| Extra space     | `O(k)` heap                 | `O(k)` round array          |
| Where log k comes from | heap depth, per node | number of rounds            |
| Needs a heap    | yes                         | **no**                      |
| Comparator bugs | possible                    | none, `mergeTwo` is 1 compare |
| Streaming?      | yes, works on infinite lists | no, needs all lists up front |

Same asymptotics, different placement: the heap pays `log k` on **every node**,
pairwise pays `O(N)` on **every round**. Pairwise has the better constant
because `mergeTwo` is a tight pointer loop with no sift-up/sift-down. The heap
wins when the lists arrive as a stream, since it only ever holds live heads.

If I only got to write one it would be pairwise - fewer moving parts and
`mergeTwo` is code I will reuse. The heap is the one I would *say* out loud,
because it is the expected answer.

## Dry run (heap)

`[[1,4,5], [1,3,4], [2,6]]`. Heap shown as the values of the nodes in it.

| step | heap before | pop | push     | output so far |
| ---- | ----------- | --- | -------- | ------------- |
| 1    | 1, 1, 2     | 1   | 4        | 1             |
| 2    | 1, 2, 4     | 1   | 3        | 1 1           |
| 3    | 2, 3, 4     | 2   | 6        | 1 1 2         |
| 4    | 3, 4, 6     | 3   | 4        | 1 1 2 3       |
| 5    | 4, 4, 6     | 4   | 5        | 1 1 2 3 4     |
| 6    | 4, 5, 6     | 4   | -        | 1 1 2 3 4 4   |
| 7    | 5, 6        | 5   | -        | ... 5         |
| 8    | 6           | 6   | -        | ... 6      |

Note the heap holds 3 entries for most of the run, never 8. That is the `log k`.

## Edge cases the tests cover

- `[]` -> `null`. The heap starts empty so the `while` never runs; pairwise
  needs its own `round.length === 0` guard.
- `[[], [], []]` -> `null`. `buildList([])` returns `null`, so the `if (head)`
  filter drops them before either algorithm sees them.
- Both functions **consume** their input nodes, so every test builds fresh
  lists. Learned that by reusing one built list across two tests and getting a
  result that was right the first time and nonsense the second.

## Takeaway

`O(N log k)` for "combine k sorted things" comes in two flavours: pay `log k`
per element with a heap, or pay `O(N)` per round for `log k` rounds by
halving. Reach for halving when the inputs are all available up front.

The fold-left trap is the real lesson: "merge them all together" sounds
`O(N)`-ish and is quietly `O(Nk)` because of the growing accumulator.
