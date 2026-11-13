# Day 135 - Find Median from Data Stream

LeetCode 295 · Hard · Two heaps · Friday, 13 November 2026 · ~50 min, 3 attempts

Second design problem of the week and much friendlier than Day 134. The idea
arrives in thirty seconds; getting the rebalance right is where the three
attempts went.

## Problem

`addNum(num)` and `findMedian()`, interleaved in any order. The median is the
middle value of everything added so far, or the average of the two middle
values when the count is even.

```
addNum(1)      -> median 1
addNum(2)      -> median 1.5
addNum(3)      -> median 2
```

Resorting on every `findMedian` is O(n log n) per query. Inserting into a sorted
array keeps queries O(1) but makes inserts O(n) because of the shift. Neither is
good enough when both calls are hot.

## The insight

The median only depends on the **one or two values at the boundary** between the
smaller half and the larger half. Everything else is irrelevant. And "give me
the largest of the small half" / "give me the smallest of the large half" is
exactly what heaps are for. Same realisation as Day 067: a heap is the right
structure when you want one extreme repeatedly and do not care about the rest of
the order.

So: a **max-heap** `low` holding the smaller half, a **min-heap** `high` holding
the larger half, with two invariants kept after every add.

- **(A)** every element of `low` is `<=` every element of `high`
- **(B)** `low.size === high.size` or `low.size === high.size + 1`

I let `low` carry the odd one out, so an odd count's median is just
`low.peek()`, and an even count's is the mean of the two roots.

`PriorityQueue` from `lib/structures` is a min-heap by default; `compare(a, b) < 0`
means `a` pops first, so `(a, b) => b - a` turns it into a max-heap.

## The push-then-hand-across trick

This is the part worth copying. Do **not** decide which heap the new number
belongs in:

```js
addNum(num) {
  this.low.push(num);              // unconditionally
  this.high.push(this.low.pop());  // hand the lower half's max across
  if (this.high.size > this.low.size) this.low.push(this.high.pop());
}
```

Why invariant (A) holds for free: after pushing `num` into `low`, `low` contains
the old small half plus `num`, and `low.pop()` is the largest thing in it. That
value is `>=` everything left in `low` by definition of a max-heap, and it is
`<=` everything in `high` because it was previously in the small half (or it is
`num`, in which case `num` was larger than the whole small half and genuinely
belongs on the right). Either way it lands on the correct side without a single
comparison being written by me.

Then only one size violation is possible - `high` one too large - so the fix-up
is one directional `if`.

## Dry run

| call      | `low` (max-heap) | `high` (min-heap) | after fix-up            | median |
| --------- | ---------------- | ----------------- | ----------------------- | ------ |
| addNum(1) | `[1]`            | push 1, `low` empty | high too big -> low `[1]` | 1    |
| addNum(2) | `[1,2]` -> pop 2 | `[2]`             | sizes 1,1 - no fix       | 1.5    |
| addNum(3) | `[1,3]` -> pop 3 | `[2,3]`           | high too big -> move 2 back: low `[1,2]`, high `[3]` | 2 |

Final state after three adds: `low = {1,2}` with root 2, `high = {3}`.

## The bug (attempts 1 and 2)

My first `addNum` did the obvious thing and rebalanced in one direction only:

```js
if (this.low.size === 0 || num <= this.low.peek()) this.low.push(num);
else this.high.push(num);

if (this.low.size > this.high.size + 1) this.high.push(this.low.pop());
// nothing handles high getting ahead of low
```

Feed it `1, 2, 3`:

| step | low   | high    | findMedian                          |
| ---- | ----- | ------- | ----------------------------------- |
| 1    | `[1]` | `[]`    | 1, correct                          |
| 2    | `[1]` | `[2]`   | (1 + 2) / 2 = 1.5, correct          |
| 3    | `[1]` | `[2,3]` | sizes 1 and 2, so it averages the roots again -> 1.5, wrong |

The correct answer is 2. It fails on the *literal problem statement example*,
which was humbling. The missing branch is `high` overtaking `low`, and once I
needed two branches anyway I replaced the whole thing with the unconditional
push above.

Attempt 2's bug was smaller: I had `(a, b) => a - b` on both heaps, so `low` was
a min-heap and `low.peek()` returned the *smallest* number ever seen. Every
median was wrong by miles on the first test, which at least made it easy to find.

And in the test oracle, `[...nums].sort()` with no comparator would sort
lexicographically - `[10, 9, 100]` becoming `[10, 100, 9]`. That one has bitten
me often enough this year that I type `(a, b) => a - b` reflexively now.

## Complexity

| operation     | time       | space  |
| ------------- | ---------- | ------ |
| `addNum`      | O(log n)   | O(n)   |
| `findMedian`  | O(1)       | -      |

Three heap operations per add, each O(log n). Constant factor is higher than a
single push, which is the price for not thinking during the rebalance.

## Follow-up to try

Both are in the problem's follow-up section and both change the structure:

- **all numbers in `[0, 100]`**: forget heaps, keep a 101-slot count array and
  walk it to the middle. O(100) per query, O(1) per add.
- **numbers can be removed again** (sliding window median, LeetCode 480): heaps
  cannot delete from the middle, so you need lazy deletion - a map of
  "pending removals" plus a prune loop at both roots, with the sizes tracked
  separately from the heap arrays. That is the next one I want to do.

## Takeaway

Two heaps back to back give you O(1) access to the middle of a stream. When
the balance rule needs a case analysis, look for a formulation where the
invariant holds by construction instead - push into one side, hand its
extreme to the other, then fix the size once.
