# Day 014 - Middle of the Linked List

LeetCode 876 · Easy · Fast and slow pointers · Wednesday, 15 July 2026 · ~12 min, 2 attempts

## Problem

Return the **middle node** of a linked list. Not the value, the node, so
everything after it comes along too. Even length means two middles, and the
problem wants the second.

```
[1,2,3,4,5]     ->  node 3,  so the answer prints as [3,4,5]
[1,2,3,4,5,6]   ->  node 4,  so [4,5,6]      (4, not 3)
```

## Where I started

The obvious thing, and it is not even bad: walk the list counting nodes, then
walk again `Math.floor(n / 2)` steps.

```js
let n = 0;
for (let p = head; p; p = p.next) n += 1;
let node = head;
for (let i = 0; i < Math.floor(n / 2); i += 1) node = node.next;
return node;
```

Two passes, `O(n)` either way. I wrote it, it passed, and then I went looking
for the one pass version because the "two pointers" tag made it clear that was
the point.

## The insight

I don't need to know the length to know the halfway point. I need two walkers
at different speeds.

If `fast` moves two nodes for every one that `slow` moves, then `fast` has
always travelled exactly twice as far. So the moment `fast` reaches the end,
`slow` is at the middle.

That is it. No arithmetic, no counting, the geometry does the division for me.
Day 013 was about rewiring links; this is the other linked list trick, which
is to run more than one pointer over the same list.

## Dry run

`[1,2,3,4,5]` (odd):

| pass | slow | fast | `fast && fast.next`? |
| ---- | ---- | ---- | -------------------- |
| start| 1    | 1    | yes                  |
| 1    | 2    | 3    | yes                  |
| 2    | 3    | 5    | `fast.next` is null, stop |

slow = 3.

`[1,2,3,4,5,6]` (even):

| pass | slow | fast | `fast && fast.next`? |
| ---- | ---- | ---- | -------------------- |
| start| 1    | 1    | yes                  |
| 1    | 2    | 3    | yes                  |
| 2    | 3    | 5    | yes                  |
| 3    | 4    | null | `fast` is null, stop |

slow = 4, the second middle, which is what was asked. Starting both pointers
at the head is what makes it land there. If I had started `fast` at
`head.next` I would get the first middle instead. Good thing to remember,
since some problems want that one.

## Where I got stuck

The loop condition. My first try was just `while (fast.next !== null)` and it
threw on the even length case:

```
TypeError: Cannot read properties of null (reading 'next')
```

because `fast.next.next` had already walked `fast` off the end and set it to
`null`, and then the condition tried to read `.next` of `null`. Both halves
are needed and the order is not optional:

- `fast !== null` catches even length (fast stepped clean off the edge)
- `fast.next !== null` catches odd length (fast is standing on the last node)

`&&` short circuits, so testing `fast` first is what makes it safe to touch
`fast.next` at all. Same shape as checking an object exists before reading a
property off it, I just hadn't connected the two ideas.

Also: `middleNode(null)` returns `null` with no special case, because `slow`
starts as `head` and the loop never runs.

## Complexity

| | |
| ------ | ------ |
| Time   | `O(n)`, fast does about n/2 passes and touches every node once |
| Space  | `O(1)`, two pointers |

Same big-O as the counting version, but one traversal instead of two, and it
works if I could only read the list once.

## Takeaway

Two pointers at **different speeds** measures a fraction of a list without
knowing its length. Today it was half. The obvious next thing is: if fast and
slow are both running and the list loops back on itself, fast must eventually
lap slow, which smells like how you would detect a cycle. Going to find out
tomorrow.
