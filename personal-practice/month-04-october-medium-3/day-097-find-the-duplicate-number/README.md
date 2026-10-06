# Day 097 - Find the Duplicate Number

LeetCode 287 · Medium · Floyd cycle detection on an array · Tuesday, 6 October 2026 · ~50 min, 2 attempts

## Problem

`nums` has `n + 1` entries. Every value is in `[1, n]`. Exactly one value is
repeated, possibly more than twice. Return it.

```
[1,3,4,2,2]            ->  2
[3,1,3,4,2]            ->  3
[2,5,9,6,9,3,8,9,7,1]  ->  9      (9 appears three times)
```

The part that is actually the problem: **`O(1)` extra space**, must **not
modify** the array, better than `O(n^2)`.

## The constraints are the question

Without them this is a two-line problem and would be an Easy:

```js
const seen = new Set();
for (const v of nums) { if (seen.has(v)) return v; seen.add(v); }
```

`O(n)` time but `O(n)` space. Sorting and checking neighbours is `O(1)` space
but mutates. Negating `nums[Math.abs(v)]` as a visited marker also mutates.
Every natural approach breaks one of the two rules, which is a strong hint that
the intended solution comes from somewhere else.

I did spend ten minutes on binary search over the value range (count entries
`<= mid`; if the count exceeds `mid` the duplicate is below). That one is
legitimate - `O(n log n)`, `O(1)` space, no mutation - and it is what I would
fall back on. But the problem is pointing at an `O(n)` answer.

## The reframing

**Read the array as a linked list.** Index `i` is a node, and its single
outgoing edge points at index `nums[i]`.

```
nums = [1, 3, 4, 2, 2]
index:  0  1  2  3  4

0 -> 1 -> 3 -> 2 -> 4 -> 2 -> 4 -> 2 -> ...
```

Two facts make this work, and both come straight from the constraints:

1. **Every node has exactly one successor.** Values are in `[1, n]` and there
   are `n + 1` indices, so `nums[i]` is always a valid index. The walk never
   falls off the end, and since there are finitely many nodes it must repeat.
   **So there is always a cycle.**
2. **Index 0 is never anyone's successor**, because no value is 0. So index 0
   is guaranteed to sit on the straight tail *before* the cycle, which is
   exactly the starting position Floyd's algorithm assumes.

And the punchline: the **entrance** to the cycle is the node that two different
indices point at. Two indices pointing at the same node means that value appears
twice in `nums`. So the duplicate value *is* the cycle entrance.

That turns this into the second half of Day 015 (Linked List Cycle), with
`nums[x]` where `node.next` used to be.

## Honest note

I did not get the "array is a linked list" jump on my own. I had the Set and
binary-search versions, re-read the constraints twice, then read the editorial's
first paragraph - far enough to see "consider the array as a linked list" - and
closed it there. Both phases I wrote myself from the Day 015 memory. The
reframing was the whole difficulty and I was handed it.

## The two phases

```js
let slow = 0, fast = 0;
do {                              // do/while: they start equal
  slow = nums[slow];
  fast = nums[nums[fast]];
} while (slow !== fast);

slow = 0;                         // reset to the head
while (slow !== fast) {
  slow = nums[slow];
  fast = nums[fast];              // both one step now
}
return slow;
```

Phase 2 is the part that looks like magic. The algebra: let the tail be `a` long
and the cycle `c` long, and say they meet `b` steps in. Fast covers twice slow's
distance, which works out to `a = (c - b) mod c`. So walking `a` steps from the
head and `a` steps from the meeting point both land on the entrance. Hence: one
pointer back to 0, both at speed 1, and where they meet is the answer.

## Dry run

`nums = [1,3,4,2,2]`, list `0 -> 1 -> 3 -> 2 -> 4 -> 2 -> ...` (cycle is `2, 4`)

| step | phase | slow | fast |
| ---- | ----- | ---- | ---- |
| 1    | 1     | 1    | 3    |
| 2    | 1     | 3    | 4    |
| 3    | 1     | 2    | 4    |
| 4    | 1     | 4    | 4    |
|      |       | meet at node 4, reset slow to 0 | |
| 5    | 2     | 1    | 2    |
| 6    | 2     | 3    | 4    |
| 7    | 2     | 2    | 2    |

Meet at node **2**. Return `2`

Note that the meeting point (4) is *not* the answer. I returned it on attempt 1
and got 4 instead of 2, which is exactly what skipping phase 2 looks like.

## Complexity

| approach               | time         | space  | mutates? |
| ---------------------- | ------------ | ------ | -------- |
| Set                    | `O(n)`       | `O(n)` | no       |
| sort + scan            | `O(n log n)` | `O(1)` | **yes**  |
| negation marking       | `O(n)`       | `O(1)` | **yes**  |
| binary search on value | `O(n log n)` | `O(1)` | no       |
| Floyd                  | `O(n)`       | `O(1)` | no       |

Only the last one hits every requirement at once.

## Note to self

When the constraints rule out every obvious structure, the problem wants you
to notice that the input already is a structure. `n+1` slots holding
values in `[1, n]` plus "O(1) space" means "this array is a pointer array".
