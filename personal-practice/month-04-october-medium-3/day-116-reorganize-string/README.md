# Day 116 - Reorganize String

LeetCode 767 · Medium · Greedy plus a heap · Sunday, 25 October 2026 · ~40 min, 2 attempts

## Problem

Rearrange the letters of `s` so no two neighbours are equal. Return `''` if it
cannot be done.

```
s = "aab"   -> "aba"
s = "aaab"  -> ""
s = "vvvlo" -> "vlvov"   (not unique, "vovlv" is just as good)
```

Any valid arrangement is accepted, which changes how I have to test it. More on
that below.

## When is it impossible?

This is the part worth getting exactly right. Put the most frequent letter down
first, as spread out as it can possibly be: positions 0, 2, 4, ... Those are the
only mutually non-adjacent positions, and there are `ceil(n / 2)` of them.

```
n = 5     slots:  0 _ 2 _ 4        ceil(5/2) = 3 usable
n = 6     slots:  0 _ 2 _ 4 _      ceil(6/2) = 3 usable
```

So the condition is

```js
maxCount > Math.ceil(n / 2)   ->  impossible
```

and it is tight in both directions: if some count exceeds that, two copies must
touch no matter what; if no count exceeds it, the greedy below always finds an
arrangement.

### The bug I actually hit

I first wrote the check as

```js
if (count > s.length / 2) return '';     // WRONG for odd n
```

For `"vvvlo"` that is `3 > 2.5`, so it bailed out with `''` on a string that
rearranges perfectly well as `v l v o v`. Odd-length strings get one extra even
slot and plain division throws it away. `Math.ceil` is not a rounding
preference here, it is the actual count of usable positions.

## The greedy step

Max-heap keyed by remaining count. Repeatedly:

1. pop the two most frequent letters (guaranteed different, they are separate
   heap entries)
2. append both to the output
3. push each back with its count minus one, skipping any that hit zero

Why pairs and not one at a time? Because the letter I just wrote must not be
eligible for the very next position, and taking its sibling immediately is the
simplest way to enforce that. Spending the *two* biggest also means the most
dangerous letter never gets to accumulate while smaller ones are used up - the
thing that would otherwise leave me with `"...aaa"` at the end.

When the heap is down to one entry, its count must be exactly 1 (the
feasibility check guarantees it), so appending it is safe.

## Dry run

`s = "aaabb"`, counts `a:3, b:2`, `n = 5`, `ceil(5/2) = 3` so `a:3` is legal.

| step | heap (by count) | popped | output so far | pushed back |
| ---- | --------------- | ------ | ------------- | ----------- |
| 1 | `a:3, b:2` | `a`, `b` | `ab`     | `a:2, b:1` |
| 2 | `a:2, b:1` | `a`, `b` | `abab`   | `a:1` (b hit 0) |
| 3 | `a:1`      | tail     | `ababa` | - |

Three `a`s landed on indices 0, 2, 4 without me ever telling them to.

## Testing something with many right answers

My heap's behaviour on ties depends on sift order, so `reorganizeString("vvvlo")`
could legitimately return `"vlvov"` or `"vovlv"`. Hard-coding one of them would
mean my test breaks the day I change the comparator, and it would be checking
the wrong thing anyway.

So the tests call an `inspect()` helper that returns `'ok'` only when

- the output is a permutation of the input (sorted letters match), and
- no two adjacent characters are equal

Two cases still get compared literally, because they genuinely have one answer:
`"aab" -> "aba"` and anything impossible `-> ''`. And one test feeds a
deliberately bad string into `inspect`, to confirm the checker is not just
returning `'ok'` for everything - the mistake that makes property tests useless.

## The O(n) alternative, no heap

Sort the distinct letters by count descending, then fill **even indices first,
then odd indices**:

```js
const res = new Array(n);
let i = 0;
for (const [ch, cnt] of lettersSortedByCountDesc) {
  for (let c = 0; c < cnt; c++) {
    if (i >= n) i = 1;   // even slots exhausted, start the odd ones
    res[i] = ch;
    i += 2;
  }
}
```

Since `maxCount <= ceil(n / 2)`, the biggest letter fits entirely inside the
even slots, and because the letters go in descending order a later letter can
never both straddle the even/odd boundary *and* land next to its own copy.

I went with the heap anyway: the pair-at-a-time version is the one I can
re-derive from scratch without trusting a boundary argument I only half
remember. The even/odd fill is faster and I would use it on a huge string.

## Complexity

| | Time | Space |
| - | ---- | ----- |
| Heap greedy | `O(n + k log k)` | `O(k)` + output |
| Even/odd fill | `O(n + k log k)` sort on k <= 26 | `O(n)` output |

With `k` capped at 26 both are effectively linear in `n`.

## Takeaway

"Spread out the most frequent thing" problems have the same two parts: a
counting *feasibility* bound, and a greedy that always spends from the top.
Day 115 derived the schedule length from `maxCount` and never built the
schedule; here I need the actual arrangement, so the heap earns its keep.
`ceil(n / 2)` versus `n / 2` is the kind of detail that decides whether the
bound is right.
