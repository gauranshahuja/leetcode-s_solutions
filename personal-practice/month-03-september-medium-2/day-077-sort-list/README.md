# Day 077 - Sort List

LeetCode 148 · Medium · Merge sort on a linked list · Wednesday, 16 September 2026 · ~50 min, 2 attempts

## Problem

Sort a singly linked list, return the new head. `O(n log n)` time, and the
follow-up wants it without dumping the values into an array - so the nodes have
to be relinked, not copied.

```
4 -> 2 -> 1 -> 3        ->  1 -> 2 -> 3 -> 4
-1 -> 5 -> 3 -> 4 -> 0  ->  -1 -> 0 -> 3 -> 4 -> 5
```

## Why merge sort and not something else

Merge sort is the one sorting algorithm that *prefers* a linked list:

- it only ever needs "the next smallest of each half", and `next` is the one
  operation a list is good at,
- merging relinks pointers, so there is no shifting and no second array,
- the split is just a pointer walk.

Quicksort is the opposite. It needs a pivot, and with no random access I either
take the head (which is `O(n^2)` on an already-sorted list, a very likely input)
or walk to the middle to find something better, which costs `O(n)` per level on
top of the partition. Then partitioning means building three separate sublists
and stitching them back, tracking three tails, and the recursion depth is
`O(n)` in the worst case rather than `O(log n)`. All of that for an in-place
win that a list does not even benefit from, since merge sort is already not
copying anything. So: merge sort.

Nice thing about this day: I didn't write a single new primitive. The split is
Day 014's slow/fast walk and the merge is the merge-two-sorted-lists routine
from the linked list week, both nearly unchanged.

## Putting it together

```js
function sortList(head) {
  if (!head || !head.next) return head;      // base case: 0 or 1 node
  const second = splitInHalf(head);          // cuts, returns second head
  return mergeTwo(sortList(head), sortList(second));
}
```

The only change to the Day 014 middle-finder is a `prev` pointer trailing
`slow`, so I can actually sever the link:

```js
while (fast && fast.next) { prev = slow; slow = slow.next; fast = fast.next.next; }
prev.next = null;
return slow;
```

## The bug: infinite recursion

Attempt 1 reused Day 014 verbatim, which returns the middle node and leaves the
list intact:

```js
const mid = middleNode(head);
return mergeTwo(sortList(head), sortList(mid));   // RangeError
```

`head` still runs through the entire list, so the "first half" was never a
half - it was the whole thing. Every recursive call got the same list and Node
gave me `Maximum call stack size exceeded`. Took me a minute to see it because
the stack trace is just `sortList` a thousand times with no hint about *why*
the input never shrank.

The invariant I should have checked up front: **both halves must be strictly
shorter than the input**. Cutting with `prev.next = null` is what makes that
true. And it's also why the `!head.next` early return matters - a 1-node list
has no `prev`, so `splitInHalf` would be a null dereference if it ever got one.

## Dry run

`[4, 2, 1, 3]`

```
            [4,2,1,3]
           /         \
      [4,2]           [1,3]
     /     \         /     \
   [4]     [2]     [1]     [3]
     \     /         \     /
      [2,4]           [1,3]
           \         /
            [1,2,3,4]
```

| merge step        | a       | b       | result    |
| ----------------- | ------- | ------- | --------- |
| leaves            | 4       | 2       | 2 -> 4    |
| leaves            | 1       | 3       | 1 -> 3    |
| halves            | 2 -> 4  | 1 -> 3  | 1 -> 2 -> 3 -> 4 |

2 levels of splitting for 4 nodes, `O(n)` work merging each level.

## Stability, and a JS note

`mergeTwo` compares with `a.val <= b.val`, so when two values are equal the
node from the left half goes first and the sort is stable. With `<` it would
still be sorted but equal nodes would swap, which matters the moment the nodes
carry a payload beyond `val`.

For the 200-element check I compared against an array sort and deliberately
wrote the comparator:

```js
[...values].sort((x, y) => x - y);
```

`values.sort()` with no comparator sorts by string, so `[10, 9]` comes back as
`[10, 9]` - "10" < "9" lexicographically. I've been bitten by that twice
already in this repo and it would have been especially confusing here, where my
first instinct on a failure would have been to blame the list code.

## Complexity

| | |
| ----- | ---------------------------------------------- |
| Time  | `O(n log n)` - `log n` split levels, `O(n)` merged per level |
| Space | `O(log n)` - recursion stack, no array copies   |

## Follow-up to try

The `O(log n)` stack is from the recursion, not from the algorithm. Bottom-up
merge sort gets it to `O(1)`: merge runs of width 1, then 2, then 4, splitting
off sublists with a small `cut(head, n)` helper. More fiddly code for a space
win I don't need today, but it's the honest answer to "truly constant space".
