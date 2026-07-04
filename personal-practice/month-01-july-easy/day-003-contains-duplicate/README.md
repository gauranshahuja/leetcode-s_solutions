# Day 003 - Contains Duplicate

LeetCode 217 · Easy · Hash Set · Saturday, 4 July 2026 · ~10 min, 1 attempt

## Problem

Return `true` if any value in `nums` shows up twice or more, otherwise
`false`.

```
[1, 2, 3, 1]                   ->  true    (1 appears twice)
[1, 2, 3, 4]                   ->  false
[1, 1, 1, 3, 3, 4, 3, 2, 4, 2] ->  true
```

## First instinct

I actually guessed the answer before reading the hints, which felt good after
yesterday. At the end of Day 001 I wrote down "have I seen this before?" as
the thing a hash structure is for. This problem is literally only that
question, with no index or complement arithmetic on top. A `Set` instead of a
`Map` because I do not care *where* I saw the value, only that I did.

## The approach

```
seen = empty set
for each n:
    if n in seen -> true
    add n to seen
return false
```

Return `true` as soon as the first repeat appears. On `[1, 1, ...1000 more]`
that is two iterations, not 1002.

## The one-liner I decided against

```js
return new Set(nums).size !== nums.length;
```

Same `O(n)` on paper and it is a nice sentence to read. Two reasons I kept the
loop instead:

1. It always builds the full set, so it has no early exit. `[1, 1, <10^5 more>]`
   does all the work for nothing.
2. If this ever becomes "return the duplicated value" or "return its index",
   the loop version is already the right shape and the one-liner has to be
   thrown away.

Noted it in my head as a thing to use when `n` is small and I want short code.

## Dry run

`nums = [1, 2, 3, 1]`

| step | n | seen before step | already there? | action        |
| ---- | - | ---------------- | -------------- | ------------- |
| 1    | 1 | `{}`             | no             | add 1         |
| 2    | 2 | `{1}`            | no             | add 2         |
| 3    | 3 | `{1,2}`          | no             | add 3         |
| 4    | 1 | `{1,2,3}`        | **yes**        | return `true` |

## A JS detail I did not expect

I went looking at how `Set` decides two values are "the same", because I half
expected it to be `===`. It is not, it is SameValueZero, and that differs in
two places:

```js
new Set([0, -0]).size    // 1   -> -0 and 0 are the same member
new Set([NaN, NaN]).size // 1   -> even though NaN === NaN is false
```

So `containsDuplicate([0, -0])` is `true` and `containsDuplicate([NaN, NaN])`
would also be `true`. For this problem both are fine, arguably more correct
than `===` would be, but I wrote a test for the `-0` case so that the
behaviour is written down somewhere instead of being a surprise later.

Also worth remembering: `Set` and `Map` keep real values. A plain object
`{}` would coerce every key to a string, so `1` and `'1'` would collide. Not
an issue with an integer array, but the day the input is mixed it would be.

## Complexity

| Approach        | Time              | Space  |
| --------------- | ----------------- | ------ |
| Sort then scan  | `O(n log n)`      | `O(1)` |
| Set (this one)  | `O(n)` average    | `O(n)` |

The sort version is the trade in the other direction, and if the array were
huge and memory tight I would take it. Here `O(n)` time is worth the set.

## Pattern to remember

Three days in and a set or map has been the answer to all three. The question
each time is slightly different:

- Day 001: "have I seen `target - x`?"
- Today: "have I seen `x`?"

Same memory, different lookup key. If a problem reduces to a membership
question, stop thinking about loops.
