# Day 038 - Sort Colors

LeetCode 75 · Medium · Dutch national flag, 3-way partition · Saturday, 8 August 2026 · ~35 min, 3 attempts

## Problem

Array of only `0`, `1`, `2`. Sort it **in place**, no library sort. Follow-up
asks for a single pass with constant extra space.

```
[2,0,2,1,1,0]  ->  [0,0,1,1,2,2]
[2,0,1]        ->  [0,1,2]
```

## The easy version first

Counting sort. Count how many 0s, 1s, 2s, then overwrite the array:

```js
const c = [0, 0, 0];
for (const n of nums) c[n] += 1;
let i = 0;
for (let v = 0; v < 3; v += 1) for (let j = 0; j < c[v]; j += 1) nums[i++] = v;
```

`O(n)` time, `O(1)` space, and it is in place in the sense that it does not
allocate a second array. It is also two passes, and it *overwrites* rather
than rearranges, which would not be allowed if the values carried anything
else with them (think sorting records by a 3-valued key). So the one-pass
version is the one actually being asked for.

## The one-pass idea

Three cursors carving the array into four regions. The invariant, which holds
at the top of every iteration:

```
[ 0s        ][ 1s        ][ unknown      ][ 2s        ]
 0 ... low-1  low ... mid-1  mid ... high   high+1 ... n-1
```

`mid` is the only cursor that reads anything. The unknown region shrinks from
both ends until it is empty.

| `nums[mid]` | what to do                                   | pointers      |
| ----------- | -------------------------------------------- | ------------- |
| `0`         | swap into the 0 region                       | `low++, mid++` |
| `1`         | it is already where it belongs                | `mid++`       |
| `2`         | swap out to the 2 region                      | `high--` only |

## The bug, and it took me two runs to see it

I had `mid += 1` in the `2` branch as well. Symmetry felt right.

It is wrong, and the reason is worth stating precisely: when I swap
`nums[mid]` with `nums[high]`, the value arriving at `mid` comes from the
**unknown** region. Nobody has looked at it. Advancing `mid` past it leaves an
unclassified value sitting in the settled zone.

The `0` branch does *not* have this problem, which is why the asymmetry is
real and not sloppiness. The value arriving at `mid` from `low` is either a
`1` (the 1-region is what `low` points into) or `mid` itself when
`low === mid`. Either way it is already known to be fine.

Smallest input that exposes it: `[1, 2, 0]`.

| step | array     | low | mid | high | note                        |
| ---- | --------- | --- | --- | ---- | --------------------------- |
| init | [1,2,0]   | 0   | 0   | 2    |                             |
| 1    | [1,2,0]   | 0   | 1   | 2    | saw a `1`, mid++            |
| 2    | [1,0,2]   | 0   | 1   | 1    | saw a `2`, swapped, high--  |
| 2'   | **buggy** | 0   | 2   | 1    | mid++ too, so `mid > high`  |

The buggy version stops right there and returns `[1,0,2]`. The correct version
keeps `mid` at 1, inspects the `0` that just arrived, swaps it down, and
finishes `[0,1,2]`. There is a test named after this.

Annoyingly the LeetCode example `[2,0,2,1,1,0]` passes *with* the bug, which is
how it survived my first run.

## Dry run of the real thing

`[2,0,2,1,1,0]`

| array           | low | mid | high | `nums[mid]` | action          |
| --------------- | --- | --- | ---- | ----------- | --------------- |
| [2,0,2,1,1,0]   | 0   | 0   | 5    | 2           | swap 0↔5, high-- |
| [0,0,2,1,1,2]   | 0   | 0   | 4    | 0           | swap 0↔0, low++ mid++ |
| [0,0,2,1,1,2]   | 1   | 1   | 4    | 0           | swap 1↔1, low++ mid++ |
| [0,0,2,1,1,2]   | 2   | 2   | 4    | 2           | swap 2↔4, high-- |
| [0,0,1,1,2,2]   | 2   | 2   | 3    | 1           | mid++           |
| [0,0,1,1,2,2]   | 2   | 3   | 3    | 1           | mid++           |
| [0,0,1,1,2,2]   | 2   | 4   | 2    | -           | `mid > high`, stop |

Six elements, six iterations.

## Why `mid <= high` and not `mid < high`

Position `high` is **inside** the unknown region, not outside it. Stopping at
`mid < high` leaves the last unknown element unexamined, which breaks on
`[1,0]` style inputs. The region definitions in the comment block are what
settle this: the 2-region starts at `high + 1`.

## Complexity

- Time: `O(n)`. Every iteration either advances `mid` or retreats `high`, and
  they start `n` apart.
- Space: `O(1)`. Three integers, destructuring swaps, no new array.

## Pattern to remember

3-way partition: `low` / `mid` / `high`, and only advance `mid` when the
value it is leaving behind has actually been classified. Swapping from the
*far* end always means re-examining the same slot.

This is the partition step of quicksort with equal elements handled properly,
so I expect it back whenever a problem has a small fixed set of categories:
"move all evens before odds", "partition around a pivot value", that family.
