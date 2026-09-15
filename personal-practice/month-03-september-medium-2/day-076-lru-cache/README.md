# Day 076 - LRU Cache

LeetCode 146 · Medium · Design: hash map plus doubly linked list · Tuesday, 15 September 2026 · ~1 h 10 min, over two sittings (got the structure down in the morning, fixed the eviction bug after work), 3 attempts

## Problem

Fixed capacity cache. `get(key)` returns the value or -1. `put(key, value)`
inserts or overwrites. Both count as "using" the key. When a `put` would push
past capacity, drop the key that was used longest ago. Both operations have to
be O(1) average - that constraint is the problem, otherwise this is a sorted
list and a timestamp.

## Why one structure is not enough

I wrote out what each operation needs before coding anything, which is the
first time I've bothered to do that and it saved me.

| need                           | hash map | list ordered by recency |
| ------------------------------ | -------- | ----------------------- |
| find a key's value             | O(1)     | O(n)                    |
| find the least recently used   | O(n)     | O(1)  (it's the end)    |
| move a used key to "newest"    | -        | O(1) **if** I already hold the node |

So keep both and have them share: the map stores `key -> node`, and the nodes
form a doubly linked list ordered most-recent-first. A `get` looks the node up
in the map and unlinks/relinks it in O(1), because the map handed me the node
itself and the node knows its neighbours.

Two things that are not optional:

- **doubly** linked. Unlinking a node in O(1) requires `prev`. With a singly
  linked list I'd have to walk from the head to find the predecessor, which is
  the O(n) I'm trying to avoid.
- the node stores **`key` as well as `value`**. Eviction starts from
  `tail.prev`, and after unlinking it I have to delete it from the map too. The
  node has to be able to tell me its own key. (This was attempt 2's bug, below.)

Sentinel head and tail nodes mean `#pushFront` and `#unlink` never test for
null: `#unlink` is `node.prev.next = node.next; node.next.prev = node.prev;`,
two writes and no branches. That is the payoff for the two wasted nodes.

## Dry run

Capacity 3, the sequence used in the tests. Order shown most recent first.

| # | call          | returns | order after  | note                        |
| - | ------------- | ------- | ------------ | --------------------------- |
| 1 | put(1,1)      |         | 1            |                             |
| 2 | put(2,2)      |         | 2, 1         |                             |
| 3 | put(3,3)      |         | 3, 2, 1      | full                        |
| 4 | get(1)        | 1       | 1, 3, 2      | read promotes 1             |
| 5 | put(4,4)      |         | 4, 1, 3      | evicts **2**, not 1      |
| 6 | get(2)        | -1      | 4, 1, 3      |                             |
| 7 | get(3)        | 3       | 3, 4, 1      |                             |
| 8 | put(1,99)     |         | 1, 3, 4      | overwrite, size stays 3     |
| 9 | get(1)        | 99      | 1, 3, 4      |                             |
|10 | put(5,5)      |         | 5, 1, 3      | evicts 4                    |
|11 | get(4)        | -1      | 5, 1, 3      |                             |
|12 | get(5)        | 5       | 5, 1, 3      |                             |
|13 | get(3)        | 3       | 3, 5, 1      |                             |
|14 | put(6,6)      |         | 6, 3, 5      | evicts 1                    |
|15 | get(1)        | -1      | 6, 3, 5      |                             |

Step 5 is the one that matters: without the promotion at step 4, the eviction
would have taken key 1.

## The bug that cost me the second sitting

Attempt 2 evicted from the list but not from the map:

```js
if (this.map.size === this.capacity) {
  this.#unlink(this.tail.prev);     // gone from the list...
}                                    // ...still in the map
```

The symptom was not obvious: `get` on an evicted key returned its old value
instead of -1, because the map still held the orphaned node. And since
`map.size` never came down, every later `put` thought it had to evict, so the
list drained to nothing while the map kept everything.

Fix is two lines, and it is why the node carries the key:

```js
const lru = this.tail.prev;
this.#unlink(lru);
this.map.delete(lru.key);
```

The test that catches it is `never grows past capacity`, which records
`cache.size` after every single call.

Edge case I nearly shipped broken: `capacity = 0`. Without the guard, the first
`put` sees `map.size === capacity` (0 === 0), takes `this.tail.prev` - which is
the **head sentinel** - unlinks it and corrupts the list.

## The Map-only version

A plain JS `Map` iterates in insertion order, and `delete` + `set` moves a key
to the back. So the Map is already a recency list:

```js
get(key) { const v = this.map.get(key); this.map.delete(key); this.map.set(key, v); return v; }
put(key, value) { /* delete if present, else evict this.map.keys().next().value */ }
```

That is a third of the code and still O(1), so it is the version I'd write at
work. What it costs:

- it leans on a language guarantee (Map insertion order, and re-inserting
  moving the key to the back). Translate it to C++ or Java and it stops
  working, which is the opposite of what the question is asking for.
- every hit does a delete and an insert instead of a few pointer writes, and
  every eviction allocates an iterator via `map.keys().next()`.
- there is nowhere to hang per-entry bookkeeping. LFU, a TTL, or "pin this
  entry" all need real nodes.

Both versions run the same 15-call sequence in the tests and agree, which
checks that my hand-rolled list orders things the way insertion order does.

## Complexity

| operation | time | why                                        |
| --------- | ---- | ------------------------------------------ |
| `get`     | O(1) | map lookup + unlink + push front           |
| `put`     | O(1) | same, plus at most one eviction            |
| space     | O(capacity) | map entry + node per key             |

## Pattern to remember

Hash map for "where is it", linked list for "what order are they in", and the
map's values are the list's nodes so neither one has to search.

That pairing is the shape of LFU as well (map of key -> node, plus a map of
frequency -> list), which is the obvious next one to try.
