# Day 059 - House Robber

LeetCode 198 · Medium · 1D DP · Saturday, 29 August 2026 · ~25 min, 1 attempt

## Problem

`nums[i]` is the money in house `i`. No two adjacent houses may be robbed.
Maximise the total.

```
[1, 2, 3, 1]      -> 4     houses 0 and 2  (1 + 3)
[2, 7, 9, 3, 1]   -> 12    houses 0, 2, 4  (2 + 9 + 1)
```

## First instinct, and why I did not write it

"Take the biggest house, remove its neighbours, repeat." That is greedy and it
is wrong. `[2, 1, 1, 2]`: greedy grabs a 2, kills its neighbour, grabs the other
2 - that happens to give 4, which is right. But `[1, 3, 1, 3, 100]`: greedy
takes 100, kills index 3, then takes 3 and 1, total 104... except index 1 and
index 0 are adjacent so it can only take 3, total 103. It gets the right answer
here by luck. The reason I did not trust it is that a local "biggest first"
choice does not know whether it is blocking two medium houses, and I have no
argument for why it would. So: DP.

## This is Day 019 with a decision in it

Climbing Stairs (Day 019) was the same skeleton:

| | Day 019 Climbing Stairs | today |
| ---- | ---- | ---- |
| state | ways to reach step i | best money from houses 0..i |
| step  | `f(i) = f(i-1) + f(i-2)` | `f(i) = max(f(i-1), f(i-2) + nums[i])` |
| kept  | two rolling numbers | two rolling numbers |

Identical shape, one real difference: Day 019 **adds** the two sub-answers
because both routes to step `i` are valid and get summed, while here I
**choose** between them because I can either rob house `i` or not, never both.
Sum vs max. Day 020 (Min Cost Climbing Stairs) was the halfway point, where it
was a min over two options but the "option" was which step to come from, not
whether to take the house.

That realisation is what made this a 25 minute day instead of an hour.

## The recurrence

At house `i`, exactly two things can be true of the best plan:

- it robs house `i`: then house `i-1` is off limits, so the total is
  `nums[i] + best(i - 2)`
- it skips house `i`: then the total is `best(i - 1)`

```js
best(i) = Math.max(best(i - 1), best(i - 2) + nums[i])
```

Nothing reaches further back than two, so the whole table collapses to two
variables. `prev1 = best(i-1)`, `prev2 = best(i-2)`, both starting at 0 because
the best haul from no houses is 0.

```js
for (const money of nums) {
  const current = Math.max(prev1, prev2 + money);
  prev2 = prev1;
  prev1 = current;
}
return prev1;
```

## Dry run

`[2, 7, 9, 3, 1]`

| house | money | prev2 | prev1 | current = max(prev1, prev2 + money) |
| ----- | ----- | ----- | ----- | ----------------------------------- |
| 0     | 2     | 0     | 0     | max(0, 0 + 2) = **2**  |
| 1     | 7     | 0     | 2     | max(2, 0 + 7) = **7**  |
| 2     | 9     | 2     | 7     | max(7, 2 + 9) = **11** |
| 3     | 3     | 7     | 11    | max(11, 7 + 3) = **11** |
| 4     | 1     | 11    | 11    | max(11, 11 + 1) = **12** |

Step 3 is the nice one: robbing house 3 for 3 would mean giving up house 2's 9,
so the plan keeps 11 and waits.

## Where I nearly slipped

Updating in the wrong order:

```js
prev2 = prev1;
prev1 = Math.max(prev1, prev2 + money);   // prev2 is already prev1 here
```

That reads the new `prev2`, so the "two back" value is actually "one back" and
adjacent houses start getting robbed together. `[2, 1]` returns 3. Computing
`current` into its own variable first makes the order impossible to get wrong,
which is why I kept the extra line instead of being clever.

Also `rob([])` has to be 0 and not `undefined` - with the two-variable version
the loop just never runs and `prev1` is still 0, so it falls out for free. The
memo version needed the `i >= nums.length` guard to do the same.

## Complexity

| Version | Time | Space |
| ------- | ---- | ----- |
| Memo recursion | `O(n)` | `O(n)` memo + stack |
| Rolling pair   | `O(n)` | `O(1)` |

## Follow-up to try

House Robber II puts the houses in a circle, so house 0 and house `n-1` are
adjacent. Apparently the trick is to run this twice, once on `nums[0..n-2]` and
once on `nums[1..n-1]`, and take the max. Makes sense: the first and last house
can never both be robbed, so fix which one is excluded and the circle becomes
a line again.

## Takeaway

First DP where the transition is a *choice* rather than an accumulation. The
state is still "best answer for the first i items" and the window back is
still 2, so the table still collapses to two variables.
