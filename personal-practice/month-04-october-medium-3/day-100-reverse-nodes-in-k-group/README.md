# Day 100 - Reverse Nodes in k-Group

LeetCode 25 · Hard · Linked list surgery · Friday, 9 October 2026 · ~1 hr 15 min, 4 attempts

Day 100, and fitting that it is the one where I went back to drawing boxes and
arrows on paper like it was July.

## Problem

Reverse the list in chunks of `k`. A final chunk shorter than `k` stays as it
is. Values may not be swapped, the nodes themselves have to be relinked, and it
should be `O(1)` space.

```
1 -> 2 -> 3 -> 4 -> 5,  k = 2   ->   2 -> 1 -> 4 -> 3 -> 5
1 -> 2 -> 3 -> 4 -> 5,  k = 3   ->   3 -> 2 -> 1 -> 4 -> 5
1 -> 2 -> 3 -> 4 -> 5,  k = 6   ->   1 -> 2 -> 3 -> 4 -> 5
```

## Why four attempts

Reversing a whole list (Day 013) is three lines I can type from memory.
Reversing a *segment* is much harder, because a segment has two seams and both
need the pointer you are about to overwrite. What went wrong, in order:

1. **Reversed first, counted after.** I reversed whatever was there and then
   discovered the group was short, with the list already mangled. There is no
   undo. The count has to happen *before* any pointer moves.
2. **Lost the new tail.** After the reversal I did
   `groupPrev.next = kth; groupPrev = groupPrev.next;` which sets `groupPrev` to
   `kth` - the new *head* of the group, not its tail. Next group then attached
   itself in the middle and the list came out as a 3-element loop.
3. **Seeded the reversal with `null`.** Copying Day 013 literally gives
   `let prev = null`, which makes the group's old head terminate the list. Output
   was `[2,1]` for `[1,2,3,4,5]` with `k=2`: everything after the first group
   gone.
4. Correct.

## The three pointers

| name        | what it is                                      |
| ----------- | ----------------------------------------------- |
| `groupPrev` | last node of the finished part, starts at dummy |
| `kth`       | last node of the group about to be reversed     |
| `groupNext` | `kth.next`, first node after the group          |

The dummy earns its keep: the first group's reversal changes the list head, and
without it you need a separate "is this the first group" branch. With it every
group is handled identically and the answer is `dummy.next`.

## Count before you cut

```js
let kth = groupPrev;
for (let i = 0; i < k && kth; i += 1) kth = kth.next;
if (!kth) break;
```

Walking `k` steps from `groupPrev` lands on the `k`-th node of the group, since
`groupPrev` sits one before it starts. Falling off the end means fewer than `k`
remain, so break and leave the tail alone. Handles `k > length` for free.

## The bit that fixed attempt 3

Seed the reversal with `groupNext` rather than `null`:

```js
let prev = groupNext;              // not null
let node = groupPrev.next;
while (node !== groupNext) {
  const after = node.next;
  node.next = prev;
  prev = node;
  node = after;
}
```

The first iteration operates on the group's old head, and `prev` is `groupNext`
at that moment, so the old head gets wired straight to the rest of the list as
part of the reversal. No separate fixup line. And using `node !== groupNext` as
the stop condition means it still works when `groupNext` is `null` on the final
group.

## Pointer state, drawn out

`1 -> 2 -> 3 -> 4 -> 5`, `k = 2`. `D` is the dummy.

**Group 1, before:**

```
D -> 1 -> 2 -> 3 -> 4 -> 5 -> null
^    ^    ^    ^
|    |    |    groupNext
|    |    kth
|    groupPrev.next (old head)
groupPrev
```

**after reversing, before the splice** - `D.next` still points at 1, node 1 now
points at `groupNext` (3), and node 2 points at 1:

```
D -> 1 -> 3 -> 4 -> 5        2 -> 1 -> 3 -> ...
```

**after `groupPrev.next = kth` and `groupPrev = oldHead`:**

```
D -> 2 -> 1 -> 3 -> 4 -> 5 -> null
          ^
          groupPrev   (correct: last node of the finished part)
```

**Group 2** repeats it from `groupPrev = 1`, giving
`D -> 2 -> 1 -> 4 -> 3 -> 5`. The third round walks `k=2` from node `3`, hits
`null`, breaks, and node `5` is left alone.

The line I kept getting wrong is the order of these two:

```js
const newGroupPrev = groupPrev.next;   // read BEFORE overwriting
groupPrev.next = kth;
groupPrev = newGroupPrev;
```

`groupPrev.next` is still the old head at that moment, and the old head is the
group's new tail. Read it first.

## Complexity

- Time `O(n)`. Each node is touched twice: once by the counting walk, once by
  the reversal. `2n` pointer steps total, so still linear.
- Space `O(1)`. Four pointers and a dummy. The recursive version is cleaner to
  read but costs `O(n/k)` stack, which the follow-up explicitly rules out.

## Note to self

Segment reversal has two seams. Keep a pointer to the node *before* the
segment and the node *after* it, seed `prev` with the one after, and read
`groupPrev.next` for the new tail before you overwrite it.

Also: on a linked list, count first and mutate second. Mutation is not undoable.
Day 077 (Sort List) needed the same discipline about splitting before merging,
but there the recursion hid the seams. This one has nowhere to hide.
