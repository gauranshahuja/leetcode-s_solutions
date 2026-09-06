# Day 067 - Kth Largest Element in an Array

LeetCode 215 · Medium · Quickselect · Sunday, 6 September 2026 · ~50 min, 3 attempts

## Problem

Kth largest element, by value, duplicates included.

```
[3,2,1,5,6,4],          k = 2  ->  5
[3,2,3,1,2,4,5,5,6],    k = 4  ->  4
```

The second example is the one to read carefully: sorted descending that is
`6,5,5,4,...`, so the 4th largest is 4. It is not "4th largest distinct
value".

## The two answers nobody is impressed by

`nums.sort((a,b) => b-a)[k-1]` is one line and `O(n log n)`. A min-heap of
size k is `O(n log k)` and is genuinely the right call in some situations (see
below). But 215 is the problem people ask to get Quickselect out of you, so
Quickselect is what I wrote.

## The insight

Sorting answers a question I did not ask. All I need is the value that **would
sit at index `n - k`** if the array were sorted ascending. The arrangement of
everything else is irrelevant.

Partitioning gives me that for free. Pick a pivot value, rearrange so that
smaller values sit left of it and larger ones right of it, and the pivot is
now at its true sorted index. Compare that index with my target:

- target is left of the pivot -> the answer is in the left part, **ignore the
  right part entirely**
- target is right of the pivot -> ignore the left part
- target is the pivot -> done

## Why only one side (this is the whole trick)

Quicksort has to recurse into both halves, because it is obliged to order
them. Its recurrence is

```
T(n) = 2 T(n/2) + O(n)      ->  O(n log n)
```

Quickselect discards one half untouched, so

```
T(n) = T(n/2) + O(n)        ->  n + n/2 + n/4 + ... = 2n  ->  O(n)
```

That geometric series is the thing to remember. The linear partition pass is
paid once at full size, then at half size, then a quarter, and the whole sum
never exceeds `2n`. It is average case, not worst case: pivots are random so
the halving is only expected, and an adversarial run of bad pivots is still
`O(n^2)`.

## Pivot and duplicates

Two things I got wrong before I got it right.

**Attempt 1: pivot = last element, Lomuto partition.** Works, and then I ran
it on `[1..9]` ascending with `k = 3` and realised that each partition peels
off exactly one element, so it is `O(n^2)` on sorted input - the exact input
most likely to show up in practice. Fix: pick the pivot index at random.

**Attempt 2: random pivot, still two-way partition.** Still quadratic on
`[2,2,2,2,2,...]`. With every value equal, a two-way split puts the whole
array on one side and the bounds shrink by one per round. My own test
`findKthLargest([2,2,2,2], 3)` passed because it is tiny, but 20k equal
values would crawl.

Fix: partition **three** ways, into `< pivot`, `=== pivot`, `> pivot`. That is
literally the Day 038 Sort Colors loop with the three buckets chosen by
comparison instead of by value:

```js
while (i <= gt) {
  if (a[i] < pivot)      { swap(a, i++, lt++); }
  else if (a[i] > pivot) { swap(a, i, gt--); }   // i stays: the value swapped in is unseen
  else                   { i++; }
}
```

Now an all-equal array is solved by a single partition pass, and the target
check becomes a range check against the equal block `[lt..gt]` rather than a
single index.

## Dry run

`a = [3,2,3,1,2,4,5,5,6]`, `k = 4`, so `n = 9` and `target = 9 - 4 = 5`.

| lo | hi | pivot | after partition                   | lt | gt | target 5 vs block | next     |
| -- | -- | ----- | --------------------------------- | -- | -- | ----------------- | -------- |
| 0  | 8  | 3     | `[2,1,2, 3,3, 5,4,5,6]`           | 3  | 4  | 5 > 4             | lo = 5   |
| 5  | 8  | 5     | `[..., 4, 5,5, 6]`                | 6  | 7  | 5 < 6             | hi = 5   |
| 5  | 5  | 4     | `[..., 4, ...]`                   | 5  | 5  | inside            | return 4 |

(The exact arrangement inside each block depends on the random pivot; the
block boundaries are what the algorithm actually uses.)

## When I would use the heap instead

Kept `findKthLargestHeap` in the file for this reason. The min-heap of size k
wins when:

- the data arrives as a stream and there is no array to partition
- `k` is small and `n` is enormous: `O(n log k)` with a tiny `log k` beats a
  `2n` with swapping, and it only holds `k` items in memory
- the input must not be reordered, and copying it is too expensive
- the worst case matters. `O(n log k)` is a guarantee; Quickselect's `O(n)` is
  an average.

## Complexity

| Version | Time | Space |
| ------- | ---- | ----- |
| Sort | `O(n log n)` | `O(n)` for the copy |
| Min-heap of size k | `O(n log k)` | `O(k)` |
| Quickselect | `O(n)` average, `O(n^2)` worst | `O(n)` for the copy, `O(1)` work |

## Note to self

`nums.slice()` first. Quickselect reorders the array and a function called
`findKthLargest` has no business shuffling its caller's data.
