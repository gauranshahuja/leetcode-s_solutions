# Day 020 - Min Cost Climbing Stairs

LeetCode 746 · Easy · DP, 1D · Tuesday, 21 July 2026 · ~16 min, 2 attempts

## Problem

`cost[i]` is the price of stepping off stair `i`. From any stair you climb one
or two. You may start on stair 0 or stair 1. Reach the top, which is the floor
**past** the last stair, as cheaply as possible.

```
cost = [10, 15, 20]                      -> 15
cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1] -> 6
```

## Follow-up to Day 019

Yesterday was the same staircase, counting routes. Today it is the same
staircase, pricing them. The recurrence barely changes shape:

| | Day 019 (count) | Day 020 (cost) |
| ------- | --------------- | -------------- |
| recurrence | `dp[i] = dp[i-1] + dp[i-2]` | `dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])` |
| base    | `dp[0] = dp[1] = 1` | `dp[0] = dp[1] = 0` |
| combine | add both options | take the better option |
| answer  | `dp[n]`         | `dp[n]`        |

Counting means adding up every option. Optimising means picking one. That is
the only structural difference, and spotting it is what made today 16 minutes
instead of 30.

The base case flips meaning too. Yesterday `dp[0] = 1` meant "one way to be
standing here, the empty one". Today `dp[0] = 0` means "standing here is
free", and it encodes the "you may start on stair 0 or 1" rule without a
special case: both starting points cost nothing to arrive at.

## The part I got wrong first

I wrote `dp[i]` as "cheapest cost to **leave** step i" and then could not work
out what to return. My loop produced the right numbers for the middle of the
array and then I returned `Math.min(dp[n-1], dp[n-2])` and got 15 for example
1 by luck and 7 for example 2.

The fix was to be strict about the definition:

`dp[i]` = cheapest cost to arrive at step `i`, having paid for every
step I left on the way.

With arrive-at, the costs attach to the *predecessor*, which is why the
recurrence reads `dp[i-1] + cost[i-1]` and not `dp[i-1] + cost[i]`. And the
answer is `dp[n]`, with `n = cost.length`, because the top is one index past
the last stair and arriving there is the goal. The dp array is length `n + 1`,
not `n`. That off-by-one is the actual difficulty of this problem.

Writing the definition out as a sentence before coding would have saved the
second attempt. Noting that down.

## Walking through example 1

`cost = [10, 15, 20]`, so `n = 3` and I want `dp[3]`.

| i | from i-1                | from i-2               | dp[i] |
| - | ----------------------- | ---------------------- | ----- |
| 0 | -                       | -                      | 0     |
| 1 | -                       | -                      | 0     |
| 2 | `dp[1] + cost[1]` = 15  | `dp[0] + cost[0]` = 10 | **10** |
| 3 | `dp[2] + cost[2]` = 30  | `dp[1] + cost[1]` = 15 | **15** |

The route: start on stair 1, pay 15, climb two stairs, land on the floor.
Stair 2 with its cost of 20 is never touched. Worth noticing that `dp[2] = 10`
is on the cheapest path to stair 2 and still not on the cheapest path to the
top, which is the thing that makes DP work: each cell is only responsible for
its own subproblem.

## Example 2, briefly

`[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]` comes out as 6. Reading the choices
back out of the table, the path is stairs 0, 2, 4, 6, 7, 9: six 1s paid, and
all three 100s jumped over. Good test case because a greedy "always step to
the cheaper neighbour" rule hits a tie between stairs 3 and 4 early on, and
the wrong side of that tie costs it an extra step and gives 7.

## Edge cases

- `cost.length === 2`: loop runs once, answer is `min(cost[0], cost[1])`,
  since either start reaches the top in one hop. Tested both orders.
- All zeros -> 0.
- A single stair is outside the stated constraints (`n >= 2`) but I made it
  return 0 rather than reading `cost[-1]` and producing `NaN`, because an
  accidental `NaN` propagating silently is worse than a wrong number.
- The long cross-check builds the full `dp` table and compares it against the
  two-variable version over 1000 stairs, to prove the roll is not losing
  anything.

## Complexity

- Time `O(n)`, one pass.
- Space `O(1)`. The full table is `O(n)` and I never needed it, because the
  recurrence looks exactly two steps back. Same reduction as Day 019.

## Pattern to remember

Define `dp[i]` as a sentence before writing the loop, and make
"arrive at" vs "leave from" explicit. The recurrence falls out of the
definition, and so does what to return.

Also: count -> sum the options, optimise -> min/max the options. Same skeleton.
