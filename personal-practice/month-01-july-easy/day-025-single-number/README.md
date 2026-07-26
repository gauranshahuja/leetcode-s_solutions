# Day 025 - Single Number

LeetCode 136 · Easy · Bit manipulation, XOR · Sunday, 26 July 2026 · ~30 min (20 of it staring at the space constraint), 2 attempts

## Problem

Every number appears twice except one. Find the one.

```
[2,2,1]       -> 1
[4,1,2,1,2]   -> 4
[1]           -> 1
```

Required: `O(n)` time **and** `O(1)` extra space.

## Where I started

Counting map, because at this point that is my reflex for anything involving
"appears twice":

```js
const counts = new Map();
for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);
for (const [value, count] of counts) if (count === 1) return value;
```

Works, passes, and is the version I would write at work. It is also `O(n)`
space, and the problem asks for `O(1)`. I left it in `solution.js` as
`singleNumberCount` because I like seeing the two next to each other.

I also thought about sorting and walking in steps of two. Sorting is
`O(n log n)` and sorting *in place* mutates the caller's array, so it loses on
both counts.

## The insight

A pair has to cancel without me remembering that I saw it. That is exactly
what XOR does:

| fact                  | meaning                                  |
| --------------------- | ---------------------------------------- |
| `a ^ a === 0`         | a number annihilates itself              |
| `a ^ 0 === a`         | 0 is the identity, safe to start from    |
| commutative + associative | the array order is irrelevant        |

So XOR-ing the whole array collapses it:

```
4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)     rearranged, which XOR allows
= 4 ^ 0 ^ 0
= 4
```

Three lines, one variable, no memory of anything. The duplicates do not need
to be adjacent, or sorted, or counted - they just need to exist in pairs.

Thinking about it bit by bit also helps: for any single bit position, the
duplicated numbers contribute an even number of 1s, so that column XORs to 0.
Only the lonely number's bits survive.

## Dry run

`[4,1,2,1,2]`, accumulator starts at 0.

| step | n | acc before | acc after | binary after |
| ---- | - | ---------- | --------- | ------------ |
| 1    | 4 | 0          | 4         | `100`        |
| 2    | 1 | 4          | 5         | `101`        |
| 3    | 2 | 5          | 7         | `111`        |
| 4    | 1 | 7          | 6         | `110`        |
| 5    | 2 | 6          | 4         | `100`     |

It wanders around and lands back on 4, which looked like luck until I checked
each bit column separately.

## The JS gotcha I checked on purpose

JS bitwise operators convert to **signed 32-bit** before operating, so `^`
does not behave like a plain number operator for big values. Here it is fine:
LeetCode caps the values at about 3 * 10^4, and negatives still cancel
(`-1 ^ -1` is 0, `0 ^ -3` is -3), which is why I added a negative test.

But if the inputs could exceed 2^31 - 1 this trick would quietly break, since
`2 ** 31 ^ 0` is `-2147483648`, not `2147483648`. Worth remembering before
reaching for XOR on arbitrary numbers.

## Complexity

| Version      | Time   | Space  |
| ------------ | ------ | ------ |
| Counting map | `O(n)` | `O(n)` |
| XOR fold     | `O(n)` | `O(1)` |

## Takeaway

When a constraint says `O(1)` space and the data comes in pairs, look for an
operation that *cancels* instead of a structure that *remembers*.

First time all month that the trick was an arithmetic property rather than a
data structure, and the one-liner felt like a different kind of problem to
Day 001's map. Follow-up to try: Single Number II (every element three times)
and Missing Number, which I am told is XOR with the index range.
