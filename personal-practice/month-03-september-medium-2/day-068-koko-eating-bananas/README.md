# Day 068 - Koko Eating Bananas

LeetCode 875 · Medium · Binary search on the answer · Monday, 7 September 2026 · ~45 min, 2 attempts

First time I have met this pattern and it took a while to see it, so this one
is written out properly for future me.

## Problem

`piles[i]` bananas in pile `i`, `h` hours available. Koko commits to a single
speed `s` bananas/hour for the whole session. Each hour she eats from one pile
only: if that pile has fewer than `s` left she finishes it and waits out the
rest of the hour. Smallest `s` that clears every pile within `h` hours.

```
piles = [3,6,7,11],       h = 8  ->  4
piles = [30,11,23,4,20],  h = 5  ->  30
piles = [30,11,23,4,20],  h = 6  ->  23
```

The one-pile-per-hour rule is the whole reason this is not arithmetic. A pile
of size `p` costs `ceil(p / s)` hours, and the leftover minutes at the end of a
pile are thrown away rather than carried into the next one. So the total is
`sum of ceil(p / s)`, which is **not** `ceil(sum / s)`.

## Where I got stuck

"Binary search" was in the topic list and I could not find anything to binary
search. The array is unsorted. Sorting the piles does not help, since the total
hours do not care about the order. I sat there for a good 15 minutes looking
for a sorted thing.

What finally clicked: **the sorted thing is the answer space.**

I am looking for a number `s` between 1 and `max(piles)`. For each candidate I
can ask one yes/no question:

```js
feasible(s) = hoursNeeded(piles, s) <= h
```

Line those answers up for `s = 1, 2, 3, ...` and they look like this:

```
s         1      2      3      4      5      6 ...
feasible  no     no     no     yes    yes    yes ...
                               ^ the answer
```

False for a while, then true forever. **That** is my sorted array. It is
monotonic because eating faster can never make the job take longer: raising
`s` can only lower (or hold) each `ceil(p / s)`, so `hoursNeeded` is
non-increasing, so once `feasible` turns true it stays true.

And "find the first `true` in a sorted boolean array" is the same first-true binary search as Day 012, except each element is computed by calling a function
instead of being read out of memory. That one sentence is the pattern.

## Choosing the bounds

- `lo = 1`. Speed 0 eats nothing, so the smallest meaningful candidate is 1.
- `hi = max(piles)`. At that speed every pile takes exactly one hour, total
  `piles.length` hours, and the problem guarantees `h >= piles.length`. So
  `hi` is always feasible. That matters: it means there is definitely a `true`
  in range and the search cannot walk off the end. If I had used `sum(piles)`
  as `hi` it would also be correct, just one extra step of searching for no
  reason.

Picking `hi` as the smallest *definitely feasible* value is the part I want to
remember. The predicate's shape makes the search correct; the bounds make it
terminate somewhere sensible.

## The loop

```js
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (hoursNeeded(piles, mid) <= h) hi = mid;      // mid might BE the answer
  else lo = mid + 1;                               // mid is definitely not
}
return lo;
```

`hi = mid` and not `hi = mid - 1`: a feasible `mid` is still a candidate, so it
must stay inside the range. With `lo < hi` as the condition and a floor-biased
`mid`, `mid` is always strictly less than `hi`, so the range shrinks every
iteration and it cannot spin forever.

## Dry run

`piles = [3,6,7,11]`, `h = 8`. `lo = 1`, `hi = 11`.

| lo | hi | mid | hours at mid         | <= 8? | action   |
| -- | -- | --- | -------------------- | ----- | -------- |
| 1  | 11 | 6   | 1+1+2+2 = 6          | yes   | hi = 6   |
| 1  | 6  | 3   | 1+2+3+4 = 10         | no    | lo = 4   |
| 4  | 6  | 5   | 1+2+2+3 = 8          | yes   | hi = 5   |
| 4  | 5  | 4   | 1+2+2+3 = 8          | yes   | hi = 4   |
| 4  | 4  | -   | loop ends            | -     | return 4 |

Four evaluations of `hoursNeeded` instead of 11. For a pile of a billion
bananas that is 30 evaluations instead of a billion, which is the actual point.

## The bug

My first loop was

```js
while (lo <= hi) {
  const mid = ...;
  if (feasible(mid)) { best = mid; hi = mid - 1; }
  else lo = mid + 1;
}
return best;
```

which is also fine, and is what I would write if I were nervous. The version I
actually broke was the halfway house: `lo <= hi` as the condition with
`hi = mid`. If `mid === hi` and it is feasible, `hi` does not change, `lo` does
not change, and the loop spins forever. Node just sat there. Keep the pairs
together: `lo < hi` with `hi = mid`, or `lo <= hi` with `hi = mid - 1` and a
saved `best`.

## Complexity

| | |
| - | - |
| Time  | `O(n log(max pile))` - one O(n) feasibility pass per halving |
| Space | `O(1)` |

## Pattern to remember

If I can check a candidate answer quickly, and the check is monotonic in
that candidate, I do not need to construct the answer. I can binary search
the answer space.

Three questions to ask, in order:

1. What is the answer, numerically, and what range does it live in?
2. Can I test one candidate in roughly O(n)?
3. Is that test monotonic (false...false,true...true)?

If all three are yes, it is this template. Expecting to see it again on
"split array", "minimum capacity" and similar phrasings.
