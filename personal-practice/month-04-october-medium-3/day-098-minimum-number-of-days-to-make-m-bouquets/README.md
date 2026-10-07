# Day 098 - Minimum Number of Days to Make m Bouquets

LeetCode 1482 · Medium · Binary search on the answer · Wednesday, 7 October 2026 · ~25 min, 1 attempt

First one-attempt day in a while, and only because the template was already in
my head from Days 068-069. The search itself took four minutes. All the real
thinking went into `canMake`.

## Problem

`bloomDay[i]` is the day flower `i` opens. A bouquet needs `k` **adjacent**
flowers, all bloomed, and each flower belongs to at most one bouquet. Earliest
day you can have `m` bouquets, or `-1`.

```
bloomDay = [1,10,3,10,2], m = 3, k = 1  ->  3
bloomDay = [1,10,3,10,2], m = 3, k = 2  -> -1
bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3  ->  12
```

The third one is the instructive example. On day 7 the garden looks like
`[x x x x _ x x]`: a run of 4 and a run of 2. The run of 4 gives one bouquet of
3 and one leftover flower, the run of 2 gives nothing. So one bouquet, not
enough. You have to wait for flower 4 to open on day 12.

## Why it is a binary search

The template fires on two signals, same as Days 068-069:

1. The answer is a **number in a known range** (`min(bloomDay)` to
   `max(bloomDay)`), not something you construct.
2. "Is day `d` good enough?" is **monotone**: flowers never un-bloom, so if `d`
   works then every later day works too.

That makes the predicate look like `F F F F T T T T` over the day axis, and the
answer is the first `T`. Standard lower-bound search:

```js
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (canMake(mid)) hi = mid;      // keep mid, it may be the answer
  else lo = mid + 1;               // mid is too early, throw it away
}
return lo;
```

I no longer write `lo <= hi` with a separate `ans` variable for these. The
`lo < hi` / `hi = mid` form has no off-by-one to get wrong, and it cannot loop
forever because `hi = mid` only happens when `mid < hi`.

## The impossible case

```js
if (m * k > n) return -1;
```

`m` bouquets of `k` flowers consume `m * k` **distinct** flowers, and waiting
longer does not create flowers. So this is decidable before any search.

Without the guard the code still works - the search runs to `max(bloomDay)`,
`canMake` fails there, and... actually no, it does not work, because
`lo < hi` terminates and returns `lo = max` unconditionally. There is no "and
if even the top of the range fails, return -1" branch. So the guard is doing
real work, not just saving time. The constraints allow `m <= 10^6` and
`k <= 10^5`, so `m * k` can reach `10^11` - comfortably inside
`Number.MAX_SAFE_INTEGER` (~`9 * 10^15`), so no overflow concern in JS.

## The feasibility check is where the problem lives

One greedy pass:

```js
run += 1;
if (run === k) { bouquets += 1; run = 0; }   // the reset is the point
```

Two things I had to be careful about:

- **Reset `run` to 0, not to `run - k`.** Those `k` flowers are consumed and
  cannot be shared with the next bouquet. `run - k` would be right if bouquets
  could overlap, which they cannot.
- **An unbloomed flower sets `run = 0`**, because a bouquet needs adjacency and
  nothing can span a gap.

The greedy is optimal, and the reason is worth writing down: a maximal bloomed
run of length `L` yields `floor(L / k)` bouquets however you cut it, and no
bouquet can cross a gap, so the runs are independent. There is no choice to
make, hence nothing to optimise over.

I also added an early `return true` the moment `bouquets >= m`. Not needed for
correctness, but with `m = 1` on a huge garden it turns the inner pass from
`O(n)` into "a few steps".

## Dry run

`bloomDay = [1,10,2,9,3,8,4,7,5,6]`, `m = 4`, `k = 2`. `lo = 1`, `hi = 10`.

| lo | hi | mid | bloomed on `mid`        | runs      | bouquets | canMake |
| -- | -- | --- | ----------------------- | --------- | -------- | ------- |
| 1  | 10 | 5   | `x _ x _ x _ x _ x _`   | 1,1,1,1,1 | 0        | no      |
| 6  | 10 | 8   | `x _ x _ x x x x x x`   | 1,1,6     | 3        | no      |
| 9  | 10 | 9   | `x _ x x x x x x x x`   | 1,8       | 4        | **yes** |
| 9  | 9  | -   | loop ends               |           |          |         |

Answer `9`.

The `mid = 8` row is the one I checked by hand twice: run of 6 gives 3 bouquets,
plus two runs of 1 giving nothing, total 3, one short. Day 9 opens index 3 and
merges the tail into a run of 8, which gives 4.

## Complexity

- `canMake` is `O(n)`.
- The search does `O(log(maxDay - minDay))` rounds. With days up to `10^9`
  that is at most ~30 rounds.
- Total `O(n log maxDay)`, `O(1)` extra space.

## Two JS details

- `Math.min(...bloomDay)` on a `10^5` element array spreads it into function
  arguments and can throw a stack overflow. Wrote the min/max as one plain loop
  instead. Same bug class as using `shift()` for a queue head.
- `lo + ((hi - lo) >> 1)` rather than `(lo + hi) >> 1`. Day values go to `10^9`,
  and `>>` coerces to a signed 32-bit int, so `lo + hi` can hit `2 * 10^9` and
  wrap negative. The subtraction form never exceeds the larger endpoint.

## Pattern to remember

"Minimum X such that a property holds", property monotone in X, X from a
bounded numeric range -> binary search the answer and spend your effort on
the `can(X)` predicate. The search is boilerplate; the predicate is the
problem.

Third time I have written this exact loop (068, 069, now 098) and the predicate
has been completely different each time. That is the point of it.
