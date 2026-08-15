# Day 045 - Remove Nth Node From End of List

LeetCode 19 · Medium · Linked list, gap of two pointers · Saturday, 15 August 2026 · ~25 min, 1 attempt

## Problem

Delete the nth node from the **end** of a singly linked list, return the head.
`n` is always valid.

```
1 -> 2 -> 3 -> 4 -> 5,  n = 2   ->   1 -> 2 -> 3 -> 5
1,                      n = 1   ->   (empty list)
1 -> 2,                 n = 1   ->   1
```

Follow-up on the problem page: one pass.

## Where I started

Count the nodes, then walk `length - n` steps and unlink. That is
`removeNthFromEndTwoPass` in the file and it took about four minutes. Two
traversals, `O(1)` space, completely fine in practice.

I kept it because it also documents the index arithmetic: the node to delete
sits at 0-based index `length - n`, so I have to stop on index `length - n - 1`
to be able to reach past it. Starting from a dummy instead of the head shifts
everything by one and the loop becomes a clean `length - n` steps.

## The one-pass idea

Hold two pointers a fixed distance apart.

If `fast` is exactly `n` nodes ahead of `slow`, then when `fast` lands on the
**last** node, `slow` is `n` nodes back from the end, which is precisely one
before the node I want gone. The gap is doing the counting, so I never need to
know the length.

So:

1. move `fast` forward `n` times
2. move both forward until `fast.next === null`
3. `slow.next = slow.next.next`

## Why the dummy head matters so much here

This is the bit worth writing down. Removing a node from a singly linked list
needs its **predecessor**, and the head has none. Without a dummy I would need:

```js
if (n === length) return head.next;   // special case, and I need length again
```

which drags the two-pass measurement back in through the window.

Starting both pointers on `dummy` instead of `head` means:

- "the node before the target" always exists, even when the target is the head
- the answer is always `dummy.next`, which is `null` for a one-node list that
  just lost its only node, with no extra branch

One fake node deletes two special cases. Same trick as the one I used for
building the output in Day 044, used for the opposite purpose: there it saved
me an append branch, here it saves me a delete branch.

## Dry run

`1 -> 2 -> 3 -> 4 -> 5`, `n = 2`

| phase | slow on | fast on |
| ----- | ------- | ------- |
| start | dummy | dummy |
| after opening the gap (2 steps) | dummy | 2 |
| step | 1 | 3 |
| step | 2 | 4 |
| step | 3 | 5 (last, loop stops) |

`slow` is on 3, `slow.next` is 4, so `3.next = 5`. Result
`1 -> 2 -> 3 -> 5`.

And the head case, `1 -> 2`, `n = 2`:

| phase | slow on | fast on |
| ----- | ------- | ------- |
| start | dummy | dummy |
| gap (2 steps) | dummy | 2 |
| `fast.next` is null, loop never runs | dummy | 2 |

`dummy.next = dummy.next.next`, so the list becomes `2`, returned as
`dummy.next`. No special case fired.

## Edge case I checked on purpose

`[1, 2, 2, 2, 3]` with `n = 3`. The node at that position holds the value 2,
and so do its neighbours. A value-based delete would remove the wrong one or
all of them. Pointer-based delete removes exactly the one at that position,
which is what the problem asks. Worth a test because it is the kind of thing a
"clever" rewrite would break.

## Complexity

| Version  | Traversals | Time   | Space  |
| -------- | ---------- | ------ | ------ |
| Measure first | 2 | `O(L)` | `O(1)` |
| Gap of n | 1 | `O(L)` | `O(1)` |

Same big-O. The one-pass version matters when the list is a stream you can
only read once.

## Pattern to remember

Two pointers at a fixed gap convert "nth from the end" into "nth from
the current position", which is something you can do without knowing the
length. The gap is the measurement.

Different from the Day 014 slow/fast pair, where the gap *grows* because fast
moves twice per step. Fixed gap finds an offset from the end; doubling speed
finds the middle.
