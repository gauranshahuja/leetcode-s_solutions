# Day 114 - Top K Frequent Words

LeetCode 692 · Medium · Heap with a custom comparator · Friday, 23 October 2026 · ~30 min, nearly all of it on four lines, 3 attempts

## Problem

Return the `k` most frequent words. Sort by count descending; words with equal
counts come out in lexicographic order.

```
words = ["i","love","leetcode","i","love","coding"], k = 2
  -> ["i","love"]

same words, k = 3
  -> ["i","love","coding"]        coding and leetcode both appear once,
                                  "coding" < "leetcode"

words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4
  -> ["the","is","sunny","day"]
```

## This is Day 033 with a tie-break

Day 033 was Top K Frequent *Elements*, which I did with a bucket by count in
`O(n)`. Numbers have no second ordering, so ties could come out any way round
and the judge was fine with it. Here the ties are specified, so bucketing is not
enough on its own - I would have to sort inside each bucket anyway. Counting map
plus a bounded heap is the right shape, at `O(d log k)` for `d` distinct words.

## The whole problem is the comparator

The ranking I want in the *output*:

```
higher count first, then smaller word first
```

A bounded heap of size `k` does not hold the output order. It holds "the best
`k` I have seen", and whenever it overflows it has to evict the **worst** one in
`O(log k)`. The only element it can reach in `O(1)` is the top. So the top must
be the worst, which means the comparator has to be the **inverse** of the
ranking:

```
lower count first, then LARGER word first
```

Written out, with `lib/structures`' convention that `compare(a, b) < 0` means
`a` pops first:

```js
(a, b) => {
  if (a[1] !== b[1]) return a[1] - b[1];       // fewer occurrences = expendable
  if (a[0] === b[0]) return 0;
  return a[0] > b[0] ? -1 : 1;                 // later in the dictionary = expendable
}
```

## The bug, which I wrote twice

First go, I wrote the comparator as the ranking itself:

```js
// WRONG for a bounded heap
const heap = new PriorityQueue((a, b) => {
  if (a[1] !== b[1]) return b[1] - a[1];
  return a[0] < b[0] ? -1 : 1;
});
```

That is a perfectly good max-heap-by-final-rank. Which means `heap.pop()` hands
back the **best** word, so the `if (heap.size > k) heap.pop()` line was deleting
the winners one at a time and leaving me with the k *least* frequent words. On
the first example with `k = 2` I got `["coding","leetcode"]`, which is such a
clean inversion that it was obvious what I had done.

Then I fixed the count half and forgot the word half:

```js
if (a[1] !== b[1]) return a[1] - b[1];
return a[0] < b[0] ? -1 : 1;     // still the wrong way round
```

This passes the first two examples (no ties at the cut line) and fails
`["zz","yy","xx","zz","yy","aa"]` with `k = 3`: it evicts `aa` instead of `xx`.
That is the test I added afterwards, because a tie *at the boundary* is the only
place the second half of the comparator can be caught. Both halves have to flip.

## Dry run

`words = ["zz","yy","xx","zz","yy","aa"]`, `k = 3`
counts: `zz:2, yy:2, xx:1, aa:1` (Map order = first-seen order)

| push | heap contents (top = most expendable) | size > k? | evicted |
| ---- | ------------------------------------- | --------- | ------- |
| zz:2 | `zz:2`                                | no        | -       |
| yy:2 | `zz:2 , yy:2`                         | no        | -       |
| xx:1 | `xx:1 , zz:2 , yy:2`                  | no        | -       |
| aa:1 | `xx:1 , aa:1 , zz:2 , yy:2`           | yes       | `xx` (count 1, and "xx" > "aa") |

Drain: `aa`, `zz`, `yy` -> reverse -> `["yy","zz","aa"]`

`yy` before `zz` because they tie on 2 and `"yy" < "zz"`. Draining a
heap-of-losers gives worst-to-best, hence the `out.reverse()` at the end.

## JS note I keep re-learning

String comparison with `<` and `>` is code-unit order, which for plain lowercase
ASCII words is exactly dictionary order. `localeCompare` is the correct tool for
real human text but it is slower and locale-dependent, and for this problem
(lowercase English letters only) `<` is right. What I must not do is
`a[0] - b[0]`, which gives `NaN` for strings, and `NaN` in a comparator means
"equal", so the heap would quietly stop tie-breaking at all.

## Complexity

- Time: `O(n + d log k)` where `n = words.length`, `d` = distinct words
- Space: `O(d)` counts + `O(k)` heap

The full-sort alternative is `O(n + d log d)`:

```js
[...freq.entries()]
  .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
  .slice(0, k)
  .map((e) => e[0]);
```

Three lines, and here the comparator *is* the ranking, because `sort` really
does want the output order. Which is exactly why I got confused: the same four
lines mean opposite things depending on whether they feed a sort or a bounded
heap.

## Note to self

Before writing a heap comparator, answer one question: does the top need to be
the thing I keep, or the thing I drop? For "top k with a size-k heap" it is
always the thing I drop, so write the ranking down and invert every clause.
