# Day 019 - Climbing Stairs

LeetCode 70 · Easy · DP, first taste · Monday, 20 July 2026 · ~30 min (last 10 of it reading about memoisation), 2 attempts

## Problem

`n` stairs. Each move goes up 1 step or 2 steps. How many different orders of
moves reach the top?

```
n = 2  ->  2     (1+1, 2)
n = 3  ->  3     (1+1+1, 1+2, 2+1)
n = 4  ->  5     (1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2)
```

`n` goes up to 45. I thought "45, that's nothing" until I saw that the answer
for 45 is 1,836,311,903. The moves cannot be generated, only counted.

## Where I started

I wrote out `n = 4` by hand, got 5, and stared at it until the recursion fell
out. The question is not "where do I go from here", it is **"where did I
arrive from"**. To be standing on step `n`, my last move was either

- a 1-step from step `n - 1`, or
- a 2-step from step `n - 2`

and the two sets of routes cannot overlap, because they end differently. So:

```
ways(n) = ways(n-1) + ways(n-2)
ways(0) = 1      <- "already at the top, make no moves" counts as one way
ways(1) = 1
```

`ways(0) = 1` bothered me for a minute: it is not zero ways, it is one empty
way. Set it to 0 and `ways(2)` comes out as 1 instead of 2.

## The brute force blowing up

Straight translation:

```js
function climbStairsBrute(n) {
  if (n <= 1) return 1;
  return climbStairsBrute(n - 1) + climbStairsBrute(n - 2);
}
```

Right answer, and it crawls - `climbStairsBrute(40)` never came back while I
waited. The call tree for `n = 5`:

```
          5
       4     3
     3  2   2  1
   2 1 1 0 1 0
```

`ways(3)` is computed twice, `ways(2)` three times. Each level roughly doubles
the call count, so this is `O(2^n)`. A test in the file counts them: `n = 25`
needs over 200,000 calls to produce 25 distinct answers.

The waste is **not** the branching, it is that the branches **overlap**.

## Memo

Write each answer down the first time and read it afterwards:

```js
if (memo.has(n)) return memo.get(n);
```

Only `n` distinct subproblems exist, each computed once. `O(n)` time, `O(n)`
space, and `n = 45` went from "never finishes" to instant.

I knew the word "memoisation" but had never written one, so I spent ten
minutes reading about where the cache belongs. `memo = new Map()` as a
*parameter* gives an outside caller a fresh map and every recursive call the
same one. `const memo = new Map()` inside the body would hand every call an
empty cache: the brute force again, with extra steps.

## Rolling two variables

Turn it upside down: compute `ways(2)`, `ways(3)` and so on upward instead of
recursing downward. Going upward, `ways(i)` only ever reads the previous two
and never reaches further back, so the table is pointless and two numbers do:

```js
let twoBack = 1, oneBack = 1;
for (let i = 2; i <= n; i += 1) {
  const current = oneBack + twoBack;
  twoBack = oneBack;
  oneBack = current;
}
return oneBack;
```

`O(n)` time, `O(1)` space, no recursion stack at all.

## Dry run

`n = 5`:

| i | twoBack | oneBack | current |
| - | ------- | ------- | ------- |
| - | 1       | 1       | -       |
| 2 | 1       | 2       | 2       |
| 3 | 2       | 3       | 3       |
| 4 | 3       | 5       | 5       |
| 5 | 5       | 8       | 8       |

Answer 8. And look at that column: 1, 1, 2, 3, 5, 8. **It is Fibonacci**,
shifted one place. `ways(n) = Fib(n+1)`, so the stairs were a disguise. Useful
sanity check as well: 45 stairs gives Fib(46) = 1,836,311,903, safely under
`Number.MAX_SAFE_INTEGER`. At n = 100 it would not be, and I would need BigInt.

## Complexity

| version         | time     | space        |
| --------------- | -------- | ------------ |
| plain recursion | `O(2^n)` | `O(n)` stack |
| memo            | `O(n)`   | `O(n)`       |
| rolling pair    | `O(n)`   | `O(1)`       |

## Note to self

The sequence that seems to be "doing DP":

1. write the recurrence from "where could I have come from"
2. get the base cases right (`ways(0) = 1` is a real answer, not a hack)
3. notice overlapping subproblems -> memoise
4. notice how far back it actually looks -> keep only that many values

Step 4 only works because the recurrence looks back a fixed, tiny distance.
Plenty of problems must need the whole table. Tomorrow is stairs again with
costs attached, so I will find out fast whether this shape transfers.
