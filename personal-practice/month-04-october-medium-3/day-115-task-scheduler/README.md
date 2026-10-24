# Day 115 - Task Scheduler

LeetCode 621 · Medium · Greedy with counting · Saturday, 24 October 2026 · ~50 min (long detour through a heap simulation first), 3 attempts

## Problem

Every task takes 1 unit of CPU time. Two runs of the **same** task must be at
least `n` units apart. The CPU may idle. Minimum total time to run everything?

```
tasks = ["A","A","A","B","B","B"], n = 2   -> 8
tasks = ["A","A","A","B","B","B"], n = 0   -> 6
tasks = ["A","C","A","B","D","B"], n = 1   -> 6
```

The task *names* are irrelevant and so is their order in the input. Only the
multiset of counts matters, which is the hint that the answer is arithmetic
rather than a search.

## Where I started (and abandoned)

My first instinct was to simulate: max-heap on remaining count, pop up to
`n + 1` distinct tasks per round, push back whatever still has work, count the
shortfall of any round that could not be filled as idle. That works, and it is
what I would write if the problem wanted the schedule itself. But it is a pile
of bookkeeping, and halfway through I stopped and asked what the answer really
depends on. Two numbers.

## Deriving the formula with slots

Take the most frequent task, call its count `maxCount`. Those copies must be
spaced out, so write them down first with `n` empty slots after each:

`A:3, B:3, n = 2`

```
frame width = n + 1 = 3

|  A  _  _  |  A  _  _  |  A
   \_______/   \_______/   ^
    frame 1     frame 2    leftover
```

Two things fall out of the picture. There are `maxCount - 1` **complete frames**
of width `n + 1` (the last `A` needs no cooldown after it, so it is not a full
frame), and any task tied at `maxCount` has to sit in the leftover as well,
because it also appears once per frame plus one extra. So the tail is
`countOfMax` wide, not 1 wide.

```
total = (maxCount - 1) * (n + 1) + countOfMax
      = (3 - 1) * 3 + 2
      = 8
```

Filling in `B` (also count 3, so `countOfMax = 2`):

```
|  A  B  _  |  A  B  _  |  A  B        -> 8 units, 2 of them idle
```

Non-tied tasks drop into the remaining `_` slots and never make the schedule
longer, because every slot they use was already being paid for.

## When the formula is too small

Flip it: lots of tasks, no single dominant one.
`A:3, B:3, C:3, D:2, E:1`, `n = 2`, 12 tasks total.

```
frames = (3 - 1) * 3 + 3 = 9        but there are 12 tasks
```

9 is nonsense, I cannot run 12 tasks in 9 units. What happens physically is that
the extra tasks *widen* the frames past `n + 1`, and once the frames are wide
enough there is no idling left:

```
|  A  B  C  D  |  A  B  C  D  |  A  B  C  E      -> 12 units, zero idle
```

Same task in consecutive rows is now 4 apart, comfortably more than `n`. So the
real answer is

```js
Math.max(tasks.length, (maxCount - 1) * (n + 1) + countOfMax)
```

and the clamp is not defensive coding, it is the second half of the result.

## The bug that cost me the third attempt

I counted frequencies into a fixed 26-slot array:

```js
const counts = new Array(26).fill(0);
for (const t of tasks) counts[t.charCodeAt(0) - 65] += 1;
let countOfMax = 0;
for (const c of counts) if (c === maxCount) countOfMax += 1;   // BUG
```

On an empty task list `maxCount` is 0, and then **all 26 zeros match it**, so
`countOfMax = 26` and the formula returns `-(n + 1) + 26`. With `n = 0` that is
25 units to run no tasks.

A `Map` fixes it by construction: no entry exists for a task that never
appeared, so an empty input gives `countOfMax = 0` and the `Math.max` with
`tasks.length = 0` returns 0. With the array I would have needed
`if (c > 0 && c === maxCount)`.

## Dry run of the formula

| tasks | n | counts | maxCount | countOfMax | frames | len | answer |
| ----- | - | ------ | -------- | ---------- | ------ | --- | ------ |
| AAABBB | 2 | A:3 B:3 | 3 | 2 | 8 | 6 | **8** |
| AAABBB | 1 | A:3 B:3 | 3 | 2 | 6 | 6 | **6** |
| AAABBB | 0 | A:3 B:3 | 3 | 2 | 4 | 6 | **6** |
| ACABDB | 1 | A:2 B:2 C:1 D:1 | 2 | 2 | 4 | 6 | **6** |
| ABA | 2 | A:2 B:1 | 2 | 1 | 4 | 3 | **4** |

The `n = 0` row is a nice sanity check: cooldown of zero should always be
`tasks.length`, and the clamp is what delivers that.

## Complexity

- Time: `O(t)` - one pass to count, then two passes over at most 26 entries
- Space: `O(1)` - the map is bounded by the alphabet

The simulation I abandoned would have been `O(t log 26)` and the same space, so
this is not a big asymptotic win. It is five lines instead of thirty, though.

## Pattern to remember

When the input order is irrelevant and only counts matter, try to *derive* the
answer before simulating it. Draw the frames. The dominant element sets the
skeleton, ties widen the tail, and everything else either fits in the gaps or
overflows them - and the overflow case is always just "no idle time at all".
