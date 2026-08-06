# Day 036 - 3Sum

LeetCode 15 · Medium · Sorting plus two pointers · Thursday, 6 August 2026 · ~60 min, 4 attempts

Hardest one so far this month, and almost none of the difficulty was in
finding the triples. It was all in not reporting the same triple twice.

## Problem

All triples that sum to zero, no duplicate triples by value, any order.

```
nums = [-1, 0, 1, 2, -1, -4]
  -> [[-1, -1, 2], [-1, 0, 1]]

nums = [0, 1, 1]     -> []
nums = [0, 0, 0, 0]  -> [[0, 0, 0]]     one triple, not four
```

## Reducing it to something I already know

Fix the first number. Then I need two more numbers summing to `-nums[i]`. That
is Day 001 with a target that changes each iteration.

So my first version was literally Day 001 in a loop:

```js
for (let i = 0; i < n; i += 1) {
  const seen = new Map();
  for (let j = i + 1; j < n; j += 1) {
    const need = -nums[i] - nums[j];
    if (seen.has(need)) out.push([nums[i], nums[j], need]);
    seen.set(nums[j], j);
  }
}
```

`O(n^2)`, correct complexity, finds every triple. And it was useless, because
on `[-1,0,1,2,-1,-4]` it produced `[-1,-1,2]` twice and `[-1,0,1]` twice, and
I had no clean way to stop it. I tried a `Set` of `JSON.stringify(triple)`
keys, which works and which I immediately disliked: stringifying arrays to get
set semantics is the kind of thing that passes and then rots.

## Why sorting is the actual answer

The thing that clicked: **sorting does not help me find the triples, it helps
me skip them.**

After sorting, every repeated value sits in one contiguous block. So the
question "is this the second time I am using this value in this position?"
becomes "is it equal to its immediate neighbour?" - a single comparison, no
bookkeeping structure at all. That is why the sort is worth `O(n log n)` here
even though the overall bound is `O(n^2)` anyway.

Sorting also means the inner search can be two pointers instead of a map:
`left` from `i+1`, `right` from the end, and the sum tells you which way to go.

## The three skips

There are three positions in the triple and each one needs its own dedup. I
got this wrong three separate times, so writing them all out:

```js
// position 1: don't start a new triple with a first number I already used
if (i > 0 && a[i] === a[i - 1]) continue;

// positions 2 and 3: after recording a hit, walk off every equal value
left += 1;
right -= 1;
while (left < right && a[left] === a[left - 1]) left += 1;
while (left < right && a[right] === a[right + 1]) right -= 1;
```

Note the comparison directions. `left` looks **backwards** at `a[left - 1]`
because it has already moved past the hit. `right` looks **forwards** at
`a[right + 1]` for the same reason. I had `a[left] === a[left + 1]` at first,
which skips one too few and let `[0,0,0,0]` through as two triples.

## Dry run

`nums = [-1, 0, 1, 2, -1, -4]`, sorted: `[-4, -1, -1, 0, 1, 2]`

| i | a[i] | left | right | sum | action                        |
| - | ---- | ---- | ----- | --- | ----------------------------- |
| 0 | -4   | 1    | 5     | -3  | sum < 0, left++               |
| 0 | -4   | 2    | 5     | -3  | left++                        |
| 0 | -4   | 3    | 5     | -2  | left++                        |
| 0 | -4   | 4    | 5     | -1  | left++, pointers meet         |
| 1 | -1   | 2    | 5     | 0   | **hit** `[-1,-1,2]`         |
| 1 | -1   | 3    | 4     | 0   | **hit** `[-1,0,1]`          |
| 2 | -1   | -    | -     | -   | `a[2] === a[1]`, skipped      |
| 3 | 0    | 4    | 5     | 3   | sum > 0, right--, meet        |

Two triples, no duplicates, no set needed.

## The JS bug I should have expected by now

First run after adding the sort gave garbage. Because I wrote:

```js
const a = [...nums].sort();      // no comparator
```

`Array.prototype.sort` with no comparator converts to strings. So
`[-4,-1,-1,0,1,2]` came out as `["-1","-1","-4","0","1","2"]`, with `-4`
*after* `-1`, and every assumption the two-pointer logic rests on was dead.
Always `(x, y) => x - y` on numbers. I have now been bitten by this twice and
it is going in the permanent notes.

Related, and the reason for the spread: `.sort()` sorts **in place**. Calling
`threeSum` on someone's array and handing it back reordered is rude and caused
a confusing moment in my own tests when a later test shared the array. `[...nums]`
first. There is a test pinning that down.

## Complexity

| Part        | Cost         |
| ----------- | ------------ |
| sort        | `O(n log n)` |
| outer + two pointers | `O(n^2)` |
| **total**   | `O(n^2)` time, `O(n)` space for the copy |

The hash-map-per-`i` version is the same `O(n^2)` on paper. The sorted version
wins on dedup, not on speed.

## Pattern to remember

Sort when you need duplicates to be adjacent, not only when you need
order. Adjacency turns "have I seen this before" from a data structure into a
comparison with the neighbour.

Also: a k-sum problem is always a (k-1)-sum problem with one number fixed. 4Sum
should just be this loop wrapped in another loop, `O(n^3)`.
