# Day 062 - Longest Consecutive Sequence

LeetCode 128 · Medium · Hash set, sequence starts · Tuesday, 1 September 2026 · ~30 min, 2 attempts

Month three, same families as before but one notch harder. Starting with a hash
set problem, which is familiar ground after Day 003.

## Problem

Length of the longest run of consecutive integers you can assemble out of the
array. Array order does not matter, duplicates count once, and it must run in
O(n).

```
[100, 4, 200, 1, 3, 2]            -> 4      (1,2,3,4)
[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]    -> 9      (0..8)
[]                                -> 0
```

## The easy-but-wrong-complexity answer

Dedupe, sort, scan:

```js
const sorted = [...new Set(nums)].sort((a, b) => a - b);
// then count how long each "+1 each step" streak lasts
```

This is genuinely fine code and I wrote it in about four minutes. It is also
`O(n log n)` and the problem says O(n) out loud, so it is the answer to a
different question. I kept it in the file as `longestConsecutiveSorted` and use
it as an oracle in the tests.

(The comparator is not optional there. `[...new Set([10, 9, 100])].sort()`
gives `[10, 100, 9]` because the default comparator stringifies. That one has
bitten me enough times now that I type `(a, b) => a - b` on reflex.)

## What makes it O(n)

A Set gives O(1) membership, so the real question is: how do I avoid walking
the same run over and over?

The answer is to only ever walk a run **from its left end**. And I can test for
that end in one lookup:

`n` starts a run if and only if `n - 1` is not in the set.

Everything that is not a start gets `continue`d on sight. So the run `1,2,3,4`
is walked exactly once (from the 1) rather than four times.

```js
for (const n of pool) {
  if (pool.has(n - 1)) continue;
  let length = 1;
  while (pool.has(n + length)) length += 1;
  best = Math.max(best, length);
}
```

The nested `while` makes it *look* quadratic. It is not: across the whole outer
loop, the total number of while-steps is at most the number of distinct values,
because a value is only stepped on by the single run that starts below it. So
the work is "n membership checks for the starts, plus n membership checks for
the walking" = O(n).

## Dry run

`nums = [100, 4, 200, 1, 3, 2]`, set = `{100, 4, 200, 1, 3, 2}`

| n   | `n-1` in set? | start? | walk            | length | best |
| --- | ------------- | ------ | ------ | --------------- | ---- |
| 100 | 99 no         | yes    | 101? no         | 1      | 1    |
| 4   | 3 **yes**     | no     | skipped         | -      | 1    |
| 200 | 199 no        | yes    | 201? no         | 1      | 1    |
| 1   | 0 no          | yes    | 2,3,4 then 5 no | 4      | 4 |
| 3   | 2 **yes**     | no     | skipped         | -      | 4    |
| 2   | 1 **yes**     | no     | skipped         | -      | 4    |

Four membership checks were enough to find the 1,2,3,4 run; the three values
inside it cost one lookup each.

## The bug

My first version looped over `nums` instead of over the set:

```js
for (const n of nums) {          // wrong collection
  if (pool.has(n - 1)) continue;
  ...
}
```

Passes every test I had written. Then I tried `[1, 1, 1, 1, 1, 2, 3, 4, 5]` and
realised each of the five 1s is a valid start, so each one re-walks the whole
run. Push that to 50k copies of 1 and it is `O(n * runLength)` again, which is
exactly the thing I was trying to avoid. Iterating the deduped set fixes it and
costs nothing.

## Complexity

| Version    | Time         | Space  |
| ---------- | ------------ | ------ |
| Sort + scan | `O(n log n)` | `O(n)` |
| Set + starts | `O(n)` avg | `O(n)` |

## Pattern to remember

When a problem is about *values* rather than *positions*, the array order is
noise and a Set is the real data structure. And when the brute force is
"expand from everywhere", look for a cheap local test that identifies the one
place worth expanding from. Here that test is a single `has(n - 1)`.

Same shape as Day 003's "is it already in the set", just asking a smarter
question of the set.
