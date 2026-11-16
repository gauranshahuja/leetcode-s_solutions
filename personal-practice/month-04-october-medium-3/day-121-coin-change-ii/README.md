# Day 121 - Coin Change II

LeetCode 518 · Medium · DP, counting combinations · Friday, 30 October 2026 · ~40 min, and 25 of those were spent staring at two nested loops, 2 attempts

## Problem

Count the **combinations** of coins that add up to `amount`. Unlimited supply of
each coin.

```
amount = 5, coins = [1,2,5]   -> 4
    5
    2+2+1
    2+1+1+1
    1+1+1+1+1

amount = 3, coins = [2]       -> 0
amount = 10, coins = [10]     -> 1
```

`2+2+1` and `1+2+2` are the same combination. Nothing in the problem statement
is harder than that sentence, and it is still the only thing that matters.

## The wrong version, which I wrote first

Muscle memory from Day 060 (Coin Change, minimum number of coins) gave me this
in about forty seconds:

```js
for (let a = 1; a <= amount; a++) {
  for (const coin of coins) {
    if (coin <= a) dp[a] += dp[a - coin];
  }
}
```

`change(5, [1,2,5])` returned **9** instead of 4. Not a crash, not an
off-by-one - a cleanly wrong number, which is the worst kind of wrong because it
looks like a working program.

Here is what it counts, at `amount = 3` with `coins = [1,2]` where it is small
enough to list by hand:

```
dp[3] += dp[2]   // last coin was a 1, on top of every way to make 2
dp[3] += dp[1]   // last coin was a 2, on top of every way to make 1
```

`dp[2] = 2` (`1+1`, `2`) and `dp[1] = 1` (`1`), so `dp[3] = 3`: `1+1+1`, `1+2`
and `2+1`. The last two are the same combination, and both are there because
"what was the last coin I added" is a question about an **ordered sequence**.
The recurrence counts permutations. That is a real problem - LeetCode 377,
Combination Sum IV, whose name is a lie - but it is not this problem.

## Why coins in the outer loop fixes it

```js
for (const coin of coins) {
  for (let a = coin; a <= amount; a++) {
    dp[a] += dp[a - coin];
  }
}
```

Now `dp[a]` means "combinations of `a` using only the coins processed so far".
Each coin gets introduced **exactly once**, at one fixed point in the outer
loop, and after that pass the algorithm never returns to it. So a multiset like
`{1,2,2}` is only ever assembled in one order: all the 1s during the 1 pass,
all the 2s during the 2 pass. There is no second opportunity to insert a 1
"after" a 2, which is exactly the duplicate the broken version was counting.

The outer loop is a decision sequence: *how many 1s, then how many 2s, then how
many 5s*. That is a canonical form for a multiset, and canonical forms are how
you count things once.

## Dry run

`amount = 5`, `coins = [1,2,5]`. One row, updated in place.

| after coin | dp[0] | dp[1] | dp[2] | dp[3] | dp[4] | dp[5] |
| ---------- | ----- | ----- | ----- | ----- | ----- | ----- |
| start      | 1 | 0 | 0 | 0 | 0 | 0 |
| 1          | 1 | 1 | 1 | 1 | 1 | 1 |
| 2          | 1 | 1 | 2 | 2 | 3 | 3 |
| 5          | 1 | 1 | 2 | 2 | 3 | **4** |

Reading the `2` pass: `dp[4] += dp[2]` turns 1 into 3, because the two ways to
make 2 (`1+1` and `2`) each gain a `2` to become `1+1+2` and `2+2`, joining the
`1+1+1+1` already there. `dp[2]` on the right has **already** been updated on
this same pass, which is how `2+2` gets counted at all.

## The three-way comparison I want to remember

This is the third time I have written a 1D knapsack row, and all
three differ only in the loop structure.

| Day | Problem | Loops | Inner direction | Why |
| --- | ------- | ----- | --------------- | --- |
| 060 | Coin Change (fewest coins) | either order works | upwards | `dp[a] = min(dp[a], dp[a-c]+1)`; `min` does not care how many times it sees the same combination, so order is irrelevant to the result |
| 090 | Partition Equal Subset Sum | items outer | **downwards** | 0/1 knapsack: each number may be used at most once, so `dp[a-c]` must still be the value from *before* this item was introduced |
| 121 | Coin Change II (count combinations) | **coins outer** | upwards | counting, so each multiset must be reachable by exactly one path; upwards lets a coin be reused |

Day 060 is the interesting one. Its loops work in either order - Day 060 checked that and wrote down that counting needs coins outside - and I still reached for the wrong template today. Minimisation is idempotent, counting is not. The moment a DP *counts*
things, every structural choice becomes visible in the answer. Day 090 says the
same thing from the other side - iterating upwards there would have let one
number be used twice, silently. Same symptom, opposite cause.

The two knobs are independent:

```
outer loop = items   -> combinations (order within a solution ignored)
outer loop = amount  -> permutations (order within a solution counts)

inner upwards        -> item may be reused unlimited times
inner downwards      -> item used at most once
```

## Edge cases

- `amount = 0` must return **1**, not 0. The empty combination is a
  combination, and `dp[0] = 1` is the base every other count is built out of.
  Setting it to 0 makes the entire table zero.
- `coins = []` with a positive amount: the outer loop never runs and
  `dp[amount]` stays 0. No special case needed.
- The counts fit in a double, so no `BigInt` and nothing to worry about near
  `Number.MAX_SAFE_INTEGER`.

## Complexity

- Time: `O(amount * coins.length)`
- Space: `O(amount)` - the 2D table collapses to one row, because each coin pass
  only ever reads the row it is writing

`change(100, [1,5,10,25])` is 242, which I checked against the known
counting-change answer rather than trusting my own code. Worth doing on counting
problems, where the code is happy to be confidently wrong.

## Takeaway

In a counting DP, the loop order is the definition of what you are
counting. Items outer = combinations, target outer = permutations. Before
writing the loops, say out loud which one the problem wants - and if the
problem says "combination" in the title, check whether it means it.
