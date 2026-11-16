# Day 002 - Best Time to Buy and Sell Stock

LeetCode 121 · Easy · Arrays, single pass · Friday, 3 July 2026 · ~18 min, 3 attempts

## Problem

`prices[i]` is the price of a stock on day `i`. Buy on one day, sell on a
**later** day, one transaction only. Return the maximum profit, or `0` if
there is no profitable pair.

```
prices = [7, 1, 5, 3, 6, 4]  ->  5   buy on day 1 (price 1), sell on day 4 (price 6)
prices = [7, 6, 4, 3, 1]     ->  0   every later day is cheaper, so don't trade
```

## Where I started

Day two and I already reached for yesterday's shape: two loops, every `i`
paired with every `j > i`, keep the best difference. Correct, `O(n^2)`, and
the constraints say up to 10^5 prices, so that is 5 billion pairs. Not going
to finish.

## The wrong shortcut

Before writing the real thing I convinced myself for a minute that the answer
was just the range of the array:

```js
return Math.max(...prices) - Math.min(...prices);   // wrong
```

That reads nicely and is completely wrong, because it ignores **order**. On
`[7, 1, 5, 3, 6, 4]` it gives `7 - 1 = 6`, which would mean selling at 7 on
day 0 and buying at 1 on day 1. Time travel is not in the constraints.

(Also: `Math.max(...prices)` spreads the whole array into arguments, and with
10^5 elements that is asking for a "too many arguments" blowup. Second reason
not to do it.)

## The one variable that kills the inner loop

The fix came from flipping the question around. Instead of "which pair is
best?", ask: **if I sell today, what is my best possible buy?** It is the
cheapest price on any earlier day. And I can carry that along in one variable
as I walk forward.

```
for each price:
    if price < cheapest -> cheapest = price     (new floor, no sale today)
    else                -> best = max(best, price - cheapest)
```

`best` starts at `0`, which is not a hack here: not trading is a legal move,
so the profit genuinely cannot go below zero. (Day 005's Maximum Subarray
problem looks similar and there a `0` start **is** a bug, but that is a
different problem.)

## Dry run

`prices = [7, 1, 5, 3, 6, 4]`

| day | price | cheapest before | price - cheapest | best |
| --- | ----- | --------------- | ---------------- | ---- |
| 0   | 7     | Infinity        | new floor        | 0    |
| 1   | 1     | 7               | new floor        | 0    |
| 2   | 5     | 1               | 4                | 4    |
| 3   | 3     | 1               | 2                | 4    |
| 4   | 6     | 1               | 5                | **5** |
| 5   | 4     | 1               | 3                | 5    |

Note how day 3 and day 5 both compute a profit and both get thrown away. The
`cheapest` floor never rises, which is the whole reason one pass is enough.

## Edge cases I tested

- `[5]` - one day, can't buy and sell, so `0`.
- `[]` - loop never runs, `0` falls out of the initial value.
- `[3, 3, 3]` - flat, difference is 0, so `0`.
- `[9, 1, 2]` - the global maximum is on day 0 and is useless. This is the
  case that catches the max-minus-min idea above.

## Complexity

- Time: `O(n)`, one pass.
- Space: `O(1)`, two numbers.

## Note to self

The trick is the same **shape** as Day 001 even though the tool is different.
Day 001: don't search forward for the partner, remember what you walked past.
Today: don't search backward for the buy day, remember the cheapest one. Both
times the inner loop collapses into one remembered value.

So the question to ask when I see nested loops: *what is the one fact about
the prefix that the inner loop is actually recomputing?*
