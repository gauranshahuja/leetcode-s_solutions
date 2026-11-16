# Day 102 - Largest Rectangle in Histogram

LeetCode 84 · Hard · Monotonic stack · Sunday, 11 October 2026 · ~1 hr 50 min (50 of it before reading the editorial), 3 attempts

Honest about this one: I had the stack and the idea that each bar's rectangle is
bounded by the first shorter bar on each side, and still could not get the width
formula right. Gave up after about 50 minutes, read the editorial far enough to
see **where the left boundary comes from**, closed it, and wrote the rest
myself. I needed a hint on this one, as on Day 097 and Day 109.

## Problem

Each bar is 1 unit wide, `heights[i]` tall. Largest rectangle that fits inside.

```
heights = [2,1,5,6,2,3]

        6
      5 #
      # #   3
2     # #   #
# 1   # # 2 #
# #   # # # #
0 1 2 3 4 5

answer: 10   (bars 2 and 3, height 5, width 2)
```

The rectangle spanning bars `i..j` has height `min(heights[i..j])`, so brute
force is `max over all (i, j)` of `min * width`. That is `O(n^2)` with a running
min, and `n` goes to `10^5`, so no.

## The half I had on my own

**Fix the height, not the range.** For every bar `i`, the widest rectangle of
height exactly `heights[i]` extends left until it hits something shorter and
right until it hits something shorter. Every bar contributes exactly one
candidate, so there are `n` candidates, not `n^2`.

So the question becomes "where is the first shorter bar on each side", and
"first smaller element to the left/right" is a monotonic stack. That much came
from Day 047 (Daily Temperatures), the same structure looking for the next
*greater* element.

Keep indices on a stack with increasing heights. When the incoming bar `i` is
not taller than the top, the top is finished: `i` **is** its first shorter bar
on the right. Pop it and record its area.

## The half I needed the hint for

I knew the right boundary was `i`. I kept trying to track the left boundary with
a separate array of "first smaller to the left" computed in a prior pass, which
works but is clumsy, and my first merged attempt used `width = i - top` - the
distance from the popped index itself. On `[2,1,5,6,2,3]` that gives 6 instead
of 10, because the height-5 rectangle only got width 1.

What I was missing:

The bar below `top` on the stack *is* `top`'s first shorter bar on the
left.

That is the entire invariant. The stack holds increasing heights, so everything
between `stack[below]` and `top` was already popped - which means it was all at
least as tall as `top`. So the rectangle spans the open interval
`(below, i)`:

```js
const below = stack.length > 0 ? stack[stack.length - 1] : -1;
const width = i - below - 1;
```

The point of writing that down is that I now know *what* I was missing, not
just what the answer is: I was treating the stack as a list of pending items
instead of as a record of boundaries.

### The -1

When the stack empties, there is no shorter bar to the left at all, so the
rectangle runs to index 0. Using `below = -1` makes `i - (-1) - 1 = i`, the full
prefix width, with no special case. That sentinel on the left is as important as
the sentinel on the right.

## The sentinel at the end

The loop runs `i` to `n` inclusive, with `const h = i === n ? 0 : heights[i]`.
A virtual bar of height 0 is shorter than every real bar, so it flushes whatever
is left on the stack with a right boundary of `n`. The alternative is a second
drain loop with the width arithmetic copy-pasted, and I had already got that
arithmetic wrong once, so one copy of it is worth the slightly odd `i <= n`.

## Dry run

`heights = [2,1,5,6,2,3]`. Stack shown as indices.

| i | h | pops (idx, height, below, width, area) | stack after | best |
| - | - | -------------------------------------- | ----------- | ---- |
| 0 | 2 | -                                      | `[0]`       | 0    |
| 1 | 1 | 0, h=2, below=-1, w=1, **2**           | `[1]`       | 2    |
| 2 | 5 | -                                      | `[1,2]`     | 2    |
| 3 | 6 | -                                      | `[1,2,3]`   | 2    |
| 4 | 2 | 3, h=6, below=2, w=1, **6**            |             | 6    |
|   |   | 2, h=5, below=1, w=2, **10**           | `[1,4]`     | 10 |
| 5 | 3 | -                                      | `[1,4,5]`   | 10   |
| 6 | 0 | 5, h=3, below=4, w=1, 3                |             | 10   |
|   |   | 4, h=2, below=1, w=4, 8                |             | 10   |
|   |   | 1, h=1, below=-1, w=6, 6               | `[6]`       | 10   |

Row `i = 4` is the whole algorithm in one step: bar 6 pops with width 1 because
bar 5 is to its left, then bar 5 pops with width 2 because bar 6 was already
counted and is at least as tall. Row `i = 6` is the sentinel doing its job -
bar 1 finally gets its full width of 6.

## Pop on `>=` or `>`?

I used `>=`, so equal heights pop each other. A bar in a run of equal heights
can then be popped with a width that is too small - but the **last** bar of the
run is still on the stack when the run ends, and it computes the full width, so
the maximum is never missed. `[2,2,2,2]` -> 8 is in the tests for exactly this.
`>` is also correct and just leaves equal bars stacked up.

## Complexity

- Time `O(n)`. The `while` can pop many bars in one step, but each index is
  pushed exactly once and popped at most once across the whole run, so the total
  work is bounded by `2n`.
- Space `O(n)`. A strictly increasing histogram never pops until the sentinel, so
  the stack really does reach `n`.

## Pattern to remember

A monotonic stack is not a to-do list, it is a record of boundaries. When
you pop, the element below gives you one boundary and the element coming in
gives you the other. Everything between them was popped already, so it is all
on the right side of the comparison.

That sentence is worth more than the solution. Day 047 was the same structure
but I only ever needed *one* boundary, so I never had to understand what the
stack below meant.

## Follow-up to try

LeetCode 85, Maximal Rectangle in a binary matrix: treat each row as a histogram
of the consecutive 1s above it and run this function per row, `O(rows * cols)`
total. Appealingly little new code for a problem that looks much harder, and it
only works because this one is `O(n)`.
