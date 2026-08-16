# Day 046 - Reorder List

LeetCode 143 · Medium · Linked list, three techniques combined · Sunday, 16 August 2026 · ~50 min, 3 attempts

## Problem

Reorder the list so it alternates front, back, front, back:

```
1 -> 2 -> 3 -> 4         becomes   1 -> 4 -> 2 -> 3
1 -> 2 -> 3 -> 4 -> 5    becomes   1 -> 5 -> 2 -> 4 -> 3
```

Values must not be changed, only the links. So dumping the values into an
array and writing them back is out.

## This is three earlier days stitched together

That is the actual content of this problem, and once I saw it the coding was
mechanical:

| step | what it is | where I learned it |
| ---- | ---------- | ------------------ |
| 1 | find the middle with slow/fast | **Day 014** |
| 2 | reverse the second half in place | **Day 013** |
| 3 | interleave two lists | new, and it is the easy part |

No new technique. The problem is a test of whether I can *recognise* the two
things I already have. That is the first time a problem has felt like that, and
it is a much better feeling than learning a new trick.

## Why reversing the back half is the whole trick

The answer needs me to alternately take from the front and take from the back.
Taking from the front of a singly linked list is one pointer hop. Taking from
the back is impossible, there are no backward links.

So: cut the list in half and reverse the back half. Now "step backwards from
the end" is "step forwards through the reversed piece", and both walks are the
cheap kind.

```
1 2 3 4 5    ->    [1 2 3]  and  [5 4]
                     ^              ^
                   front          back
```

Then zip them: `1`, `5`, `2`, `4`, `3`.

## Dry run

`1 -> 2 -> 3 -> 4 -> 5`

**Find middle.** Condition is `fast.next && fast.next.next`:

| slow | fast | continue? |
| ---- | ---- | --------- |
| 1 | 1 | yes (2 and 3 exist) |
| 2 | 3 | yes (4 and 5 exist) |
| 3 | 5 | no, `fast.next` is null |

`slow` is on 3, the **last node of the first half**. Cut there:
`[1,2,3]` and `[4,5]`.

**Reverse the back:** `[5,4]`.

**Interleave:**

| front | back | after stitching |
| ----- | ---- | --------------- |
| 1 | 5 | `1 -> 5 -> 2 ...` |
| 2 | 4 | `1 -> 5 -> 2 -> 4 -> 3` |
| 3 | null | loop stops |

Node 3's `next` is already null from the cut, so the list terminates on its
own.

## The bugs (all three attempts, in order)

**1. I forgot the cut.**

```js
const second = slow.next;
// slow.next = null;        <- missing
```

The "first half" still ran into the second half, so after interleaving, node 3
pointed at 4 which pointed back into the chain. `listToArray` has a guard
against cycles, so instead of hanging I got a 100,000 element array back, which
was at least an obvious symptom.

**2. I used the Day 014 loop condition verbatim.** `while (fast && fast.next)`
stops `slow` on the *first node of the second half* for even lengths. With
`[1,2,3,4]` that put the halves at `[1]` and `[2,3,4]`, so the back half was
longer, and the leftover node ended up stranded in the middle of the output.
Switching to `fast.next && fast.next.next` makes the first half the longer one
for odd lengths and equal for even, which is what the interleave wants.

Worth remembering that "find the middle" has two different right answers
depending on which half you want the extra node in.

**3. Clobbering a link before saving it.**

```js
front.next = back;
const backNext = back.next;    // too late, nothing broke here, but...
back.next = front.next;        // this reads the link I just overwrote
```

`front.next` is `back` by then, so `back.next = back` and the list eats itself.
Both `next` pointers have to be saved **before** either assignment. Writing the
two `const` lines first, every time, is the habit I want.

## Complexity

- Time: `O(L)`. Three separate passes, each linear, so `3L` steps.
- Space: `O(1)`. The array version would be `O(L)` and is also disqualified by
  the "links only" rule.

## Note to self

When a list problem needs access from both ends, cut it and reverse one
side. And when a problem feels like three steps, check whether each step is
already a solved day.
