# Day 013 - Reverse Linked List

LeetCode 206 · Easy · Linked list, pointer rewiring · Tuesday, 14 July 2026 · ~30 min, 3 attempts

## Problem

Flip a singly linked list and return the new head.

```
1 -> 2 -> 3 -> 4 -> 5 -> null
becomes
5 -> 4 -> 3 -> 2 -> 1 -> null
```

First linked list problem of this whole thing, so I spent the first five
minutes just getting straight what a node is: an object with `val` and `next`,
and `next` is the *only* way to move. There is no going backwards and no
`length` and no indexing. From today on I am pulling `ListNode`, `buildList`
and `listToArray` out of `lib/structures` instead of retyping them.

## My first (wrong) idea

My instinct was to cheat: dump the values into an array, reverse it, build a
fresh list. Works, `O(n)` time, but it allocates a second whole list and dodges
the actual skill the problem is teaching. So I made myself do it with pointers.

## The bug that cost me two attempts

Here is what I wrote, and it hung the terminal:

```js
let prev = null;
let curr = head;
while (curr !== null) {
  curr.next = prev;      // <- rewired BEFORE saving where I was going
  prev = curr;
  curr = curr.next;      // <- this is now prev, not the next node
}
```

The order looks harmless and it is completely broken. The moment
`curr.next = prev` runs, the link to the rest of the list is gone, overwritten.
So the `curr = curr.next` on the last line does not advance, it reads back the
pointer I just wrote and walks *backwards* into `prev`.

Trace it on `1 -> 2 -> 3`:

| pass | curr | after `curr.next = prev` | `curr = curr.next` gives |
| ---- | ---- | ------------------------ | ------------------------ |
| 1    | 1    | `1 -> null`              | `null` - loop ends, returns just `1` |

With `prev = null` on the first pass it quietly returns a one node list and
throws away 2 and 3. If I start `prev` as anything non-null, it ping pongs
between two nodes forever, which is the version that hung.

## The fix

Save the bridge before burning it. Four lines, and the order of all four
matters:

```js
const next = curr.next;   // 1. remember the way forward
curr.next = prev;         // 2. now it's safe to flip
prev = curr;              // 3. slide prev up
curr = next;              // 4. slide curr up
```

Return `prev`, not `curr`. When the loop ends `curr` is `null` (that is why it
ended) and `prev` is sitting on the last node I touched, which is the old tail
and the new head. Getting that return wrong was attempt 3: I returned `curr`
and got `null` back, which at least was an obvious kind of wrong.

## Dry run

`1 -> 2 -> 3`, showing the state at the *end* of each pass:

| pass | next | prev (reversed part so far) | curr (not yet touched) |
| ---- | ---- | --------------------------- | ---------------------- |
| 0    | -    | `null`                      | `1 -> 2 -> 3`          |
| 1    | 2    | `1 -> null`                 | `2 -> 3`               |
| 2    | 3    | `2 -> 1 -> null`            | `3`                    |
| 3    | null | `3 -> 2 -> 1 -> null`       | `null`                 |

Return `prev` = `3 -> 2 -> 1`.

Nice way to think about it: the list is being eaten from the front and spat
back out in front of `prev`. `prev` is a growing reversed list, `curr` is the
shrinking original.

## Edge cases

- `head === null`: loop body never runs, returns `prev` which is still `null`.
  No special case needed, which was a relief.
- one node: one pass, `1.next` becomes `null` (it already was), returns the
  same node.
- The old head has to end up as a real tail with `next === null`. There is a
  test that walks to the end and checks it, because my broken version left two
  nodes pointing at each other, and a cycle like that makes `listToArray` spin
  forever. The guard counter in `lib/structures` suddenly makes sense.

## Complexity

- Time `O(n)`, every node visited once, nothing re-walked.
- Space `O(1)`, three pointers and no new nodes. This is the part the
  array-and-rebuild version loses on.

## Alternative approach

There is a recursive version: reverse the rest of the list, then stick the
current node on the end of it.

```
reverse(head):
  if head is null or head.next is null -> head
  newHead = reverse(head.next)
  head.next.next = head
  head.next = null
  return newHead
```

Shorter, but `O(n)` stack, and `head.next.next = head` is the kind of line I
would misread at a glance. Sticking with the loop until recursion itself feels
more automatic.

## Pattern to remember

With linked lists, always save `next` before you overwrite it. The
pointer you are about to write over is your only route to the rest of the
data.

Also: `prev = null` at the start is not a placeholder, it is the new tail's
`next`. The initial value is doing real work.
