# Day 075 - Copy List with Random Pointer

LeetCode 138 · Medium · Linked list, deep copy · Monday, 14 September 2026 · ~45 min, 2 attempts

## Problem

Every node has `val`, `next`, and `random`. `random` may point at any node in
the list, or at null. Return a deep copy: new nodes, same wiring, and the
original list untouched afterwards.

```
index :   0        1        2        3        4
val   :   7       13       11       10        1
random:  null  -> idx 0  -> idx 4  -> idx 2  -> idx 0
```

The "deep" part is the whole problem. If any pointer in the copy still points
at an original node, it's a shallow copy with extra steps.

Since `lib/structures` only has a plain `ListNode`, I defined a small
`RandomNode` locally in this one file, plus `buildRandomList` /
`randomListToArray` so the tests can state a whole list as
`[[val, randomIndex], ...]`.

## First instinct, and why it fails

Walk the list once, create a new node each step, and set
`copy.random = node.random`.

Two things wrong with that. The small one: `node.random` is an *original* node,
so the copy would point into the list I'm supposed to be cloning - exactly the
shallow bug. The big one: even if I translate it, `random` can point **forward**
at a node I haven't created yet. One pass cannot know where that clone will
live.

## Version 1: a map from old node to new node

Split it into "create" and "wire": pass 1 makes a bare clone of every node and
stores `old -> new` in a `Map`; pass 2 sets `copy.next = map.get(node.next)`
and `copy.random = map.get(node.random)`. Direction stops mattering because by
pass 2 every clone exists. `O(n)` time, `O(n)` space.

JS note: this has to be a `Map`, not an object. Object keys get stringified, so
every node would collapse to the key `"[object Object]"`. `Map` compares keys
by reference, which is exactly the identity I want here.

## Version 2: weave the copies in, O(1) space

The map only ever answers one question: *given an old node, where is its copy?*
If I park each copy directly behind its original, the list itself answers that
question:

```
A -> A' -> B -> B' -> C -> C'
```

The copy of `X` is `X.next`. So `random` translation becomes

```js
copy.random = node.random.next;   // the copy of node.random
```

Three passes:

| pass | does                                                |
| ---- | --------------------------------------------------- |
| 1    | insert a fresh copy behind every original node      |
| 2    | set every copy's `random` via `original.random.next` |
| 3    | unweave, so original and copy are two separate lists |

Pass 1 can advance with `node = node.next.next`: `node.next` is always the copy
I just inserted and `node.next.next` is always the old `next`.

## Dry run of the weave

Tiny list: `A(1) -> B(2)`, `A.random = B`, `B.random = B`.

| step   | chain                      | randoms set                     |
| ------ | -------------------------- | ------------------------------- |
| start  | A -> B                     | A.r=B, B.r=B                    |
| pass 1 | A -> A' -> B -> B'         | copies have random = null       |
| pass 2 | same                       | A'.r = A.r.next = B' ; B'.r = B.r.next = B' |
| pass 3 | A -> B  and  A' -> B'      | unchanged                       |

Both copies' randoms point at `B'`, inside the copy. Nothing points back at
`A` or `B`.

## The bug

My pass 3 was this at first:

```js
for (let node = head; node; node = node.next.next) {
  node.next = node.next.next;     // detach the copy
}
```

The original list came out perfect and the copy came out as a chain of single
nodes - because I never fixed `copy.next`. Each copy still pointed at the *old*
node that used to follow it, which I then re-linked away, so the copy's spine
was garbage. The fix is to move both pointers in the same step:

```js
const copy = node.next;
node.next = copy.next;
copy.next = node.next ? node.next.next : null;
```

`shareAnyNode` in the tests is what caught it. Comparing
`randomListToArray(copy)` alone would not have: a copy whose `next` still
points into the original walks the original's values and *looks* right.

## Complexity

| Version | Time   | Extra space            |
| ------- | ------ | ---------------------- |
| Map     | `O(n)` | `O(n)` for the map     |
| Weave   | `O(n)` | `O(1)` beyond the copy |

The weave is 3 passes against the map's 2, so it is not faster in wall-clock
terms. It's purely about the space line.

## Takeaway

A hash map from old object to new object is the generic deep-copy tool. When
the structure is a list, "put the copy next to the original" replaces the
map, because adjacency *is* a lookup table.

Also: for any copy problem, test node identity and not just printed shape. The
pointer surgery felt routine after Day 013 and Day 014 - what was new was a
second pointer that ignores the list's order completely.
