# Day 047 - Daily Temperatures

LeetCode 739 · Medium · Monotonic stack · Monday, 17 August 2026 · ~50 min (stuck for 30 of them, then read a hint), 2 attempts

## Problem

For each day, how many days until a **strictly warmer** day? 0 if there never
is one.

```
temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
answer       = [ 1,  1,  4,  2,  1,  1,  0,  0]
```

Day 2 (75) waits until day 6 (76), so 4. Days 6 and 7 never get a warmer day,
so 0.

## First instinct, and why it is not enough

For every day, scan forward until I find something bigger.

```js
for (let i = 0; i < n; i += 1)
  for (let j = i + 1; j < n; j += 1)
    if (t[j] > t[i]) { answer[i] = j - i; break; }
```

Correct, and `O(n^2)`. The constraints say up to `10^5` days, which is `5e9`
comparisons in the worst case (a strictly decreasing list, where the inner
loop never breaks early). Too slow.

I spent half an hour trying to make a sliding window or a sorted structure
work before giving up and reading the hint, which was one word: stack. Then I
worked the rest out myself, which felt fair.

## What finally clicked

A stack is the right shape because of **who is waiting**. On any given day,
the days that still don't have an answer are exactly the days that have been
hotter than everything since. And they are in order: the most recent one is
the coolest.

So keep a stack of **indices of days still waiting**, with temperatures
strictly decreasing from bottom to top:

```
bottom [ 75, 71, 69 ] top
```

Now when day `i` arrives, anything on top that is cooler than `t[i]` has just
had its question answered, and the answer is `i - j`. Pop them all, then push
`i`.

The reason the decreasing order is maintained for free: I only push after
popping everything cooler, so the new top is always `>=` the thing I push.
Equal temperatures stay stacked, because the problem says *strictly* warmer.

## Dry run

`[73, 74, 75, 71, 69, 72, 76, 73]`

| i | temp | pops (index -> answer) | stack after |
| - | ---- | ---------------------- | ----------- |
| 0 | 73 | - | `[0]` |
| 1 | 74 | 0 -> 1 | `[1]` |
| 2 | 75 | 1 -> 1 | `[2]` |
| 3 | 71 | - | `[2,3]` |
| 4 | 69 | - | `[2,3,4]` |
| 5 | 72 | 4 -> 1, 3 -> 2 | `[2,5]` |
| 6 | 76 | 5 -> 1, 2 -> 4 | `[6]` |
| 7 | 73 | - | `[6,7]` |

Left on the stack: 6 and 7, both answer 0, which the `fill(0)` already
handled.

Notice `i = 5` popping two days and `i = 2` popping only one. That unevenness
is the thing that makes the complexity argument non-obvious.

## Why this is O(n) and not O(n^2)

The inner `while` loop made me suspicious, since it looks like a nested loop.
It isn't:

- every index is pushed **exactly once**
- every index is popped **at most once**
- the body of the while loop runs once per pop

So across the entire function the while body executes at most `n` times
*total*, not `n` times per outer iteration. Plus `n` pushes. `O(n)` overall.

Amortised counting like this is the same argument as the two-stack queue on Day 018. The way to see it is to stop
counting the loops and count the *total work on each element* instead.

## The bug

Attempt 1 pushed temperatures instead of indices:

```js
stack.push(temperatures[i]);   // then I cannot compute the gap
```

Which is fine for "is there a warmer day" but useless for "how many days
away", because the distance needs the position. Indices on the stack, values
looked up through them. Obvious in hindsight, and I suspect this is the
default mistake for every monotonic stack problem.

## Complexity

| Version | Time | Space |
| ------- | ---- | ----- |
| Scan forward | `O(n^2)` | `O(1)` |
| Monotonic stack | `O(n)` | `O(n)` |

## Pattern to remember

"Next greater element to the right" is a monotonic stack. Push indices,
keep the stack decreasing, and pop as soon as the current value beats the
top, because that is the exact moment the popped element's answer is known.

This feels like the stack version of what Day 001 did with a hash map: stop
searching forward, keep the right thing from the past instead. Days 016 and
017 used a stack for matching and for bookkeeping, and this is a third
purpose: a stack as a queue of unanswered questions.

## Follow-up to try

Flip the comparison and the same stack should give "previous smaller element",
which I hear is the backbone of Largest Rectangle in Histogram.
