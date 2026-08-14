# Day 044 - Add Two Numbers

LeetCode 2 · Medium · Linked list with carry · Friday, 14 August 2026 · ~30 min, 2 attempts

## Problem

Two numbers are handed over as linked lists of digits, **least significant
digit first**. Add them, return the sum in the same shape.

```
l1 = 2 -> 4 -> 3        (that is 342)
l2 = 5 -> 6 -> 4        (that is 465)
sum = 7 -> 0 -> 8       (that is 807)
```

Lists can be different lengths. Digits only, no leading zeroes except the
number 0 itself.

## The trap I walked into first

My first instinct was to read each list into a number, add, and split the
result back into digits:

```js
const n1 = Number(listToArray(l1).reverse().join(''));   // nope
```

It passes the three examples and then dies on the real input, because these
lists are up to 100 digits long. JS numbers are doubles, so anything above
`Number.MAX_SAFE_INTEGER` (about `9.007e15`, 16 digits) starts losing the low
digits silently. No error, just a wrong answer.

`BigInt` would survive it, but that is dodging the exercise - the problem is
*about* doing addition one column at a time.

## What actually makes this easy

The reverse order, which reads like a nuisance, is the whole gift. The head of
each list is the ones column, so **walking forward is walking in the direction
the carry travels**. No need to reverse anything, no need to know the lengths.

Then three small decisions shrink the loop to six lines:

1. A node that ran out contributes `0`. That removes the "one list is longer"
   branch completely.
2. The loop condition is `while (a || b || carry)`. The carry keeps the loop
   alive for one more node, which is how `99 + 1` grows from 2 digits to 3.
3. A dummy head, same trick as Day 013, so I never have to write
   `if (head === null) head = node; else tail.next = node;`.

## Walking through 9999999 + 9999

| step | a | b | carry in | sum | digit written | carry out |
| ---- | - | - | -------- | --- | ------------- | --------- |
| 1 | 9 | 9 | 0 | 18 | 8 | 1 |
| 2 | 9 | 9 | 1 | 19 | 9 | 1 |
| 3 | 9 | 9 | 1 | 19 | 9 | 1 |
| 4 | 9 | 9 | 1 | 19 | 9 | 1 |
| 5 | 9 | - | 1 | 10 | 0 | 1 |
| 6 | 9 | - | 1 | 10 | 0 | 1 |
| 7 | 9 | - | 1 | 10 | 0 | 1 |
| 8 | - | - | 1 | 1  | 1 | 0 |

Result `8 -> 9 -> 9 -> 9 -> 0 -> 0 -> 0 -> 1`, i.e. 10009998. Step 8 only
happens because `carry` is in the loop condition.

## Where I got stuck

Attempt 1 had the loop as `while (a || b)` and then a bolt-on afterwards:

```js
while (a || b) { ... }
if (carry) tail.next = new ListNode(carry);   // works, but...
```

That version is fine, honestly. What was *not* fine was that I originally
advanced the pointers unconditionally:

```js
a = a.next;      // TypeError once a is null
b = b.next;
```

`Cannot read properties of null`. The guards `if (a) a = a.next;` fix it. I
keep making the same class of mistake with lists: I check for null when
*reading* a value and forget to check when *moving*.

## Complexity

- Time: `O(max(m, n))`, one node per column.
- Space: `O(max(m, n))` for the output list, which the problem asks for, plus
  `O(1)` of working state.

## Takeaway

Digit-reversed lists are set up for column addition. Keep the carry in the
loop condition and let a missing node count as zero, and the special cases
stop existing.

Also filed away: in JS, any problem phrased as "the number can be 100 digits"
is telling me not to touch `Number`.
