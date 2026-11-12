# Day 134 - LFU Cache

LeetCode 460 · Hard · Design: frequency buckets · Thursday, 12 November 2026 · ~2 hr 20 min, 4 attempts (plus a hint, see below)

Hardest design problem in the repo so far. I got most of the way on my own and
then had to go and read a hint for the one piece that makes it O(1).

## Problem

Fixed-capacity cache with `get(key)` and `put(key, value)`, both **O(1)**. When
it is full, evict the key with the smallest use count. On a tie, evict the least
recently used of the tied keys. Both `get` and a `put` that overwrites an
existing key count as a use.

```
LFUCache(2)
put(1,1) put(2,2)
get(1)   -> 1        counts: 1->2, 2->1
put(3,3)             2 is the only count-1 key, so 2 is evicted
get(2)   -> -1
get(3)   -> 3        counts: 1->2, 3->2
put(4,4)             tie at count 2; key 1 was used earlier, so 1 is evicted
get(1)   -> -1
get(3)   -> 3
get(4)   -> 4
```

## What LFU needs that LRU did not

Day 076 (LRU) has exactly **one** ordering: recency. One doubly linked list,
hottest at the head, evict the tail, and a `get` is "unlink, relink at the
head". The hash map only exists to find the node to unlink.

LFU has **two** orderings, nested:

1. primary: use count, smallest first
2. secondary: among keys sharing a count, recency, oldest first

A single list cannot express that, because promoting a key from count 3 to
count 4 moves it to a different *group*, not just a different position. So:

| LRU                       | LFU                                        |
| ------------------------- | ------------------------------------------ |
| key -> value              | key -> value                               |
| key -> list node          | key -> use count                           |
| one recency list          | one recency list **per count**              |
| evict the list tail       | evict the oldest key in the smallest bucket |
| -                         | a pointer to the smallest non-empty bucket  |

That last row is the one that is easy to skip and impossible to do without.

## Attempt 1 and why it was not O(1)

I got to frequency buckets on my own. What I could not get rid of was finding
the smallest non-empty bucket:

```js
// attempt 1 eviction - wrong complexity
let f = 1;
while (!this.buckets.has(f)) f += 1;   // O(max count)
```

That is a scan, and the max count grows with the number of operations, so it is
not O(1) in any meaningful sense. I tried sorting the bucket keys (worse), I
tried a min-heap of counts (log, and it goes stale when a bucket empties), and
after about fifty minutes I gave up and read the hints on the problem page. The
hint was one sentence, and it is the whole problem:

the minimum count only ever moves in two ways

Once stated, it is easy to prove:

- an **insert** always creates a key with count 1, so `minCount = 1`
- a **use** moves one key from bucket `f` to bucket `f + 1`. If `f` was not the
  minimum, nothing changes. If `f` was the minimum and the bucket is still
  non-empty, nothing changes. If `f` was the minimum and the bucket just
  emptied, then that key was the unique minimum and the new minimum is exactly
  `f + 1`
- an **eviction** removes a key from `buckets[minCount]`; if that empties the
  bucket, the next insert immediately sets `minCount = 1` anyway

There is no fourth case. So `minCount` is maintained by two assignments and
never searched for. I coded it myself after that, but the invariant was not
mine and I am writing that down honestly.

## Buckets as plain Sets

A JS `Set` iterates in insertion order, deletes in O(1), and
`set.values().next().value` gives the oldest member in O(1). That is already an
ordered set, so I did not hand-roll a doubly linked list per bucket the way I
would have to in C++ or Java.

One sharp edge: re-adding a key that is already in a `Set` does **not** move it
to the end. That would silently break the recency tie-break. It is safe here
only because a use always `delete`s from bucket `f` and `add`s to a *different*
bucket `f + 1`, so a key is never re-added to a Set it already occupies. I
wrote that as a comment in the file because future me will absolutely forget it.

## Dry run (capacity 3)

Buckets written as `count: [oldest ... newest]`.

| call        | result | buckets after                       | minCount | why                             |
| ----------- | ------ | ----------------------------------- | -------- | ------------------------------- |
| put(1,10)   |        | `1: [1]`                            | 1        |                                 |
| put(2,20)   |        | `1: [1,2]`                          | 1        |                                 |
| put(3,30)   |        | `1: [1,2,3]`                        | 1        | now full                        |
| get(1)      | 10     | `1: [2,3]`, `2: [1]`                | 1        | bucket 1 not empty              |
| get(1)      | 10     | `1: [2,3]`, `3: [1]`                | 1        |                                 |
| get(2)      | 20     | `1: [3]`, `2: [2]`, `3: [1]`        | 1        |                                 |
| put(4,40)   |        | `1: [4]`, `2: [2]`, `3: [1]`        | 1        | unique min, evict 3             |
| get(4)      | 40     | `2: [2,4]`, `3: [1]`                | **2**    | bucket 1 emptied, min rises     |
| put(5,50)   |        | `1: [5]`, `2: [4]`, `3: [1]`        | 1        | tie 2 vs 4, evict 2 (older)  |

The `get(4)` line is the only place `minCount` ever goes up, and the `put(5,50)`
line is the whole reason buckets have to be ordered internally.

## The bug in attempt 3

Overwriting an existing key. I wrote `put` as:

```js
if (this.values.has(key)) {
  this.values.set(key, value);
  return;                        // wrong - a put is a use
}
```

so updating a value left the count alone. That passes the LeetCode example,
because the example never overwrites. It showed up immediately in the random
cross-check against the O(n) oracle, which is why that test exists: I wrote 3000
mixed operations over 10 keys at capacity 4 and compared the two
implementations' return sequences element by element. Two bugs came out of that
run - this one, and `minCount` not being reset to 1 on insert when the cache had
just been emptied by an eviction.

## Complexity

| operation | buckets version | naive oracle |
| --------- | --------------- | ------------ |
| `get`     | O(1)            | O(1)         |
| `put`     | O(1)            | O(n) evict   |
| space     | O(capacity)     | O(capacity)  |

"O(1)" here means a constant number of Map/Set operations, each O(1) average.

## Note to self

When eviction has a tie-break rule, the data structure needs one level per
ordering key. Bucket by the primary, order within the bucket by the
secondary, and keep a pointer to the bucket you will evict from. The pointer
is the hard part, and it is maintainable precisely because counts only ever
go up by one.

Also: keep the stupid O(n) version. It cost me ten lines and it caught two real
bugs that my hand-written sequences did not.
