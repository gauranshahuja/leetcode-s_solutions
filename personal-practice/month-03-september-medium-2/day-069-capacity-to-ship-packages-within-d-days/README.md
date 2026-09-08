# Day 069 - Capacity To Ship Packages Within D Days

LeetCode 1011 · Medium · Binary search on the answer · Tuesday, 8 September 2026 · ~25 min, 1 attempt

Day 068 again. Recognised it from the shape of the question ("smallest X such
that a job fits in a budget") before I had finished the statement, wrote the
loop from memory, first try. So this page is mostly about the one part that is
genuinely different: the bounds.

## Problem

Packages in a fixed order, one sailing per day. Each day the ship takes
packages off the front of the queue while they fit under its capacity. Smallest
capacity that ships everything within `days` days.

```
weights = [1,2,3,4,5,6,7,8,9,10], days = 5  ->  15
          day 1: 1,2,3,4,5   day 2: 6,7   day 3: 8   day 4: 9   day 5: 10
weights = [3,2,2,4,1,4],       days = 3  ->  6
weights = [1,2,3,1,1],         days = 4  ->  3
```

## Same template

1. The answer is a number (a capacity).
2. One candidate can be checked in `O(n)`: walk the weights greedily, start a
   new day whenever the next package would not fit, count the days.
3. That check is monotonic - a bigger ship can never need more days.

So it is the first-true binary search over the answer space, exactly as Day
068:

```js
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (daysNeeded(weights, mid) <= days) hi = mid;
  else lo = mid + 1;
}
return lo;
```

The greedy inside `daysNeeded` deserves one sentence of justification, since
greedy is not automatically right: because the order is **fixed**, loading a
package today whenever it fits can never cost me a day later. There is no
choice about which packages go together, only about where the cuts fall, and
pushing every cut as late as possible gives the fewest cuts.

## The bounds, which is the actual content today

Yesterday `lo = 1` because speed 0 means never finishing. Here `lo = 1` would
be wrong in a more interesting way.

**`lo = max(weights)`.** A capacity below the heaviest package is not merely
slow, it is **impossible** - that package can never be loaded at all. And my
`daysNeeded` does not notice: it compares `load + w > capacity`, resets, and
then puts `w` on the empty ship anyway, reporting a finite day count for a
physically impossible plan. So for capacities below `max(weights)` the
predicate returns garbage, and garbage is not monotonic. The lower bound is
not an optimisation here, it is what keeps the search inside the region where
the predicate means anything.

(I could instead have made `daysNeeded` return `Infinity` when it sees
`w > capacity`. That also works and is arguably more honest. Starting at
`max(weights)` means the bad region is never visited, so I let the function
stay simple and wrote the reason down in a comment.)

**`hi = sum(weights)`.** One day, everything on board. `days >= 1` always, so
this is guaranteed feasible, which guarantees a `true` exists in `[lo, hi]` and
the search returns something meaningful.

Both bounds come out of a single pass:

```js
for (const w of weights) { if (w > lo) lo = w; hi += w; }
```

The range is `sum - max` wide, so `log` of that is the number of feasibility
passes. For 50k packages of weight up to 500 that is about 25 passes. Fine.

## Dry run

`weights = [3,2,2,4,1,4]`, `days = 3`. `lo = max = 4`, `hi = sum = 16`.

| lo | hi | mid | packing at mid                 | days | <= 3? | action   |
| -- | -- | --- | ------------------------------ | ---- | ----- | -------- |
| 4  | 16 | 10  | [3,2,2] [4,1,4]                | 2    | yes   | hi = 10  |
| 4  | 10 | 7   | [3,2,2] [4,1] [4]              | 3    | yes   | hi = 7   |
| 4  | 7  | 5   | [3,2] [2] [4,1] [4]            | 4    | no    | lo = 6   |
| 6  | 7  | 6   | [3,2] [2,4] [1,4]              | 3    | yes   | hi = 6   |
| 6  | 6  | -   | loop ends                      | -    | -     | return 6 |

Note how capacity 5 wastes a day on the lone `2`: `3+2 = 5` fills the ship, so
the next `2` has to start a new day, and then `4+1` and `4`. Four days. One
more unit of capacity reshuffles every boundary.

## Edge cases

- `days === weights.length` forces one package per day, so the answer is
  `max(weights)` and the binary search returns `lo` without ever moving it.
- `days === 1` forces the answer to `sum(weights)`, the other endpoint.
- Both endpoints being reachable is a decent sanity check that the bounds are
  right: if either extreme input gave something other than the matching
  endpoint, a bound would be off.

## Complexity

| | |
| - | - |
| Time  | `O(n log(sum - max))` |
| Space | `O(1)` |

## Note to self

The template is three lines of thinking (number, checkable, monotonic) plus a
standard loop. The per-problem work is:

- write the feasibility function and justify any greedy inside it
- pick `lo` as the smallest value for which the predicate is **meaningful**,
  not merely the smallest value that exists
- pick `hi` as the smallest value that is obviously feasible

Day 068 had an easy `lo` and this one had the interesting one. Two for two on
the pattern now.
