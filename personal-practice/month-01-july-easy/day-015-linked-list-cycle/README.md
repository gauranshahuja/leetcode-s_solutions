# Day 015 - Linked List Cycle

LeetCode 141 · Easy · Floyd cycle detection · Thursday, 16 July 2026 · ~20 min, 2 attempts

## Problem

Does the list loop back on itself?

```
3 -> 2 -> 0 -> -4
     ^           |
     +-----------+        true   (tail points back at index 1)

1 -> 2 -> 3 -> null       false
```

Follow-up asks for `O(1)` extra space, and that is the only reason this is an
interesting problem instead of a two line one.

## First instinct

Keep a `Set` of nodes I have already stepped on. If I land on one twice, it is
a cycle; if I reach `null`, it is not. That is `hasCycleSet` in the file and
it took about three minutes.

One real trap in it though: the set has to hold the **nodes**, not the values.

```js
seen.add(node.val);   // wrong
```

`[1,1,1,1]` with no cycle at all would report `true`, because the second node
holds a value I have already seen. A `Set` of objects compares by reference,
which is exactly what I want here, so `seen.add(node)` is right and
`seen.add(node.val)` is nonsense. I did write the value version first.

Cost: `O(n)` memory. The follow-up wants `O(1)`.

## What I guessed from yesterday

I wrote at the end of Day 014 that if fast and slow are both running and the
list loops, fast should eventually lap slow. That turned out to be the whole
algorithm, which was a nice feeling.

Day 014: run slow and fast, care about **where slow ends up**.
Day 015: run slow and fast, care about **whether they collide**.

Identical loop skeleton, including the same `fast && fast.next` guard I got
wrong yesterday. The only new line is `if (slow === fast) return true;`.

## Why it actually works

I wanted more than "they probably bump into each other eventually".

- No cycle: `fast` hits the end, the loop condition fails, return `false`.
  Nothing clever needed.
- Cycle: `fast` enters the loop first and can never leave it. `slow` enters
  later and also can never leave. So from some point on, both are inside a
  ring of length `L`.
- Inside the ring, each pass moves fast 2 and slow 1, so the gap between them
  (measured forward, fast to slow, around the ring) **shrinks by exactly one
  per pass**. It cannot jump over zero because it only changes by one at a
  time. So it reaches zero, and zero gap means the same node.

That also bounds the work: at most `L` passes once both are in the ring, and
getting there takes at most `n` passes. `O(n)`.

## Dry run

`[3,2,0,-4]` with the tail pointing back at index 1, so the ring is
`2 -> 0 -> -4 -> 2`, length 3:

| pass | slow | fast  | meet? |
| ---- | ---- | ----- | ----- |
| start| 3    | 3     | -     |
| 1    | 2    | 0     | no    |
| 2    | 0    | 2     | no    |
| 3    | -4   | -4    | **yes** |

And `[1,2,3,4,5]` with no cycle: fast goes 1, 3, 5, then `fast.next` is null,
loop ends, `false`.

## The bug

I put the comparison in the wrong place at first:

```js
while (fast && fast.next) {
  if (slow === fast) return true;   // checked before moving
  slow = slow.next;
  fast = fast.next.next;
}
```

Both start on the head, so `slow === fast` is true on the very first check and
every list on earth "has a cycle". **Move first, then compare.** Obvious in
hindsight and I lost a few minutes to it.

Edge cases I checked after that: empty list (loop never runs, `false`), a
single node with `next` pointing at itself (`true`, and it needs that
post-move comparison to be found), and a list of identical values with no
cycle (`false`, which is what kills the value-based set version).

## Complexity

| Version | Time   | Space  |
| ------- | ------ | ------ |
| Set     | `O(n)` | `O(n)` |
| Floyd   | `O(n)` | `O(1)` |

## Note to self

Fast and slow pointers are turning out to be one pattern with several uses:

- halfway point -> where slow stops (Day 014)
- cycle exists -> do they collide (today)

Apparently there is a follow-up where you find the node where the cycle
*starts* by resetting one pointer to the head after the collision and walking
both at speed one. I don't see why that works yet, so I am noting it down
rather than pretending I do.
