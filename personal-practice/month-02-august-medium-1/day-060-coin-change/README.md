# Day 060 - Coin Change

LeetCode 322 · Medium · DP, unbounded knapsack · Sunday, 30 August 2026 · ~60 min, 4 attempts

## Problem

Fewest coins from `coins` that sum to exactly `amount`. Unlimited supply of
each denomination. Return `-1` if it cannot be done.

```
coins = [1, 2, 5], amount = 11   ->  3    (5 + 5 + 1)
coins = [2],       amount = 3    ->  -1
coins = [1],       amount = 0    ->  0
```

## My first idea, and why it is wrong

Greedy: take the largest coin that fits, repeat. It is what a cashier does and
it works for real currency, because real denominations are chosen so that it
does. It does not work in general.

`coins = [1, 3, 4]`, `amount = 6`:

- greedy: 4, then 1, then 1 -> **3 coins**
- actual best: 3 + 3 -> **2 coins**

Taking the 4 forces a remainder of 2, which has to be patched with two 1s. The
big coin was a trap. There is no local rule that spots this, so the choice has
to be made with knowledge of what the remainder costs - which means DP.

## Setting up the table

`dp[a]` = fewest coins that make exactly `a`.

- `dp[0] = 0`. Zero coins make zero. This is the base case the entire table
  grows from, and it is also the only genuinely free value.
- for `a >= 1`: whatever the best plan for `a` is, it ends with *some* coin.
  If that last coin is `c`, the rest of the plan makes `a - c` as cheaply as
  possible, so this plan costs `dp[a - c] + 1`. I do not know which coin is
  last, so try all of them:

```
dp[a] = 1 + min over all coins c <= a of dp[a - c]
```

Every `a - c` is strictly smaller than `a`, so filling `a` from 1 upwards means
every value I read is already finished. Unlimited reuse needs no extra state at
all: `dp[a - c]` is allowed to contain `c` already, which is exactly the
unbounded behaviour.

## Infinity as the unreachable marker

This is the bit that took me two of the four attempts. Amounts like 3 with only
2s have no answer, and that has to propagate without poisoning everything.

What I tried first:

```js
const dp = new Array(amount + 1).fill(-1);   // -1 = unreachable
...
if (dp[a - coin] !== -1) dp[a] = Math.min(dp[a] === -1 ? big : dp[a], dp[a - coin] + 1);
```

Three separate `-1` checks in one line and I got one of them wrong, so
unreachable amounts started reporting `0` coins. Then I tried
`Number.MAX_SAFE_INTEGER` as the marker, which is worse in a sneaky way:
`MAX_SAFE_INTEGER + 1` is a perfectly ordinary-looking number that compares as
*smaller* than nothing and silently becomes a candidate.

`Infinity` fixes it because `Infinity + 1 === Infinity`. An unreachable
sub-amount stays unreachable through any amount of arithmetic, every comparison
against it does the right thing, and the only special case left is the single
check at the end:

```js
return dp[amount] === Infinity ? -1 : dp[amount];
```

No guards inside the loop. (`amount + 1` as a sentinel also works since no valid
answer can exceed `amount`, but then you have to remember *why* it works.)

## Dry run

`coins = [1, 3, 4]`, `amount = 6`

| a | candidates `dp[a-c] + 1`                        | dp[a] |
| - | ----------------------------------------------- | ----- |
| 0 | base                                            | 0     |
| 1 | c=1: dp[0]+1 = 1                                | 1     |
| 2 | c=1: dp[1]+1 = 2                                | 2     |
| 3 | c=1: dp[2]+1 = 3, c=3: dp[0]+1 = 1              | 1     |
| 4 | c=1: dp[3]+1 = 2, c=3: dp[1]+1 = 2, c=4: dp[0]+1 = 1 | 1 |
| 5 | c=1: dp[4]+1 = 2, c=3: dp[2]+1 = 3, c=4: dp[1]+1 = 2 | 2 |
| 6 | c=1: dp[5]+1 = 3, c=3: dp[3]+1 = **2**, c=4: dp[2]+1 = 3 | **2** |

Row 6 is the greedy trap in table form: the 4 branch gives 3 and the 3 branch
gives 2, and the table just picks the smaller one without any cleverness.

## Which loop goes outside

I wrote the amount loop outside and the coin loop inside. Swapping them gives
the same answers here, and I wanted to know why, because I had read that the
order matters. It matters for **counting**, not for **minimising**.

- Here the update is a `min` over candidates. Both orders visit every
  `(coin, amount)` pair and `min` does not care about order, so both work.
- In the counting version (how many *combinations* make the amount), the two
  orders count different things. Coins outside counts each multiset once, so
  `1+2` and `2+1` are one combination. Amounts outside counts ordered
  sequences, so those are two. Same table, same update line, different meaning.

Rule I am writing down: with `min`/`max` either order is fine; with `+=`
counting, coins on the outside unless you actually want permutations.

## Complexity

- Time `O(amount * coins.length)`: `6249 * 4` for the ugly test case, nothing.
- Space `O(amount)`: one array of `amount + 1` numbers.

BFS over amounts is the same thing in disguise (each coin is an edge of that
length, shortest path from 0 to `amount`) and the same complexity - a nice
echo of Day 057, where the answer was also a number of rounds.

## Note to self

Unbounded knapsack = fill the table in increasing order and read from the
*same* row. Bounded (each item once) is the one that needs a different loop
direction. Use `Infinity` for "impossible" so the arithmetic takes care of
itself.
