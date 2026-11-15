# Day 137 - Burst Balloons

LeetCode 312 · Hard · Interval DP · Sunday, 15 November 2026 · ~3 hr, 4 attempts, and I read the editorial for the key idea

Being honest about this one: I did not get it. I spent somewhere around an hour
and forty minutes convinced that my subproblem definition just needed one more
fix, then gave up and read the editorial. The idea is one sentence long and I
would not have found it today. The rest - the padding, the loop order, the
indices - I wrote myself afterwards.

## Problem

`n` balloons in a row. Bursting balloon `i` pays `left * nums[i] * right`, where
left and right are its **current** immediate neighbours. The row closes up after
each burst, so neighbours change as you go. Off the ends, a missing neighbour
counts as 1. Burst all of them, maximising the total.

```
nums = [3, 1, 5, 8]  ->  167

burst 1:  3 * 1 * 5 = 15      row becomes [3, 5, 8]
burst 5:  3 * 5 * 8 = 120     row becomes [3, 8]
burst 3:  1 * 3 * 8 = 24      row becomes [8]
burst 8:  1 * 8 * 1 = 8       row empty
                      ------
                        167
```

## The formulation that does not work (worth recording)

My instinct, for two hours, was the one every DP is: pick the first move, recurse
on what is left.

```
dp(i, j) = best coins from bursting all of nums[i..j]
dp(i, j) = max over k in [i..j] of
           (neighbour-left * nums[k] * neighbour-right) + dp(i, k-1) + dp(k+1, j)
```

It does not decompose, and the reason is worth writing down properly. Burst `k`
**first** and the row closes up, so `nums[k-1]` and `nums[k+1]` become
neighbours of each other. From then on a burst in the left part can have a
right-neighbour that came out of the right part. The two sides are not separate
problems - they interact through the hole `k` left behind. There is no value of
`neighbour-left` and `neighbour-right` I can write down for the subcalls,
because it depends on the order chosen inside the *other* subcall.

I tried passing the boundary values down as extra parameters. That makes the
state `(i, j, leftVal, rightVal)` and the recursion still wrong, because the
boundaries drift as the halves are cleared. I tried memoising on the remaining
set of balloons, which is correct but exponential. Four attempts, all of them
variations on "first".

## The reversal

Ask which balloon is burst **last** in a range instead.

Define `dp[i][j]` = most coins obtainable by bursting every balloon **strictly
between** `i` and `j`, while `i` and `j` themselves stay standing.

If `k` is the last balloon to go inside `(i, j)`, then at the moment `k` bursts,
everything between `i` and `k` is gone and everything between `k` and `j` is
gone. So `k`'s neighbours at that moment are exactly `a[i]` and `a[j]` - known,
fixed, not order-dependent.

```
dp[i][j] = max over i < k < j of
           dp[i][k]  +  a[i] * a[k] * a[j]  +  dp[k][j]
```

And the two sub-intervals are genuinely independent, because **`k` is still
standing the whole time either of them is being cleared**. It is a wall. Nothing
on the left can ever see anything on the right. That is the sentence I was
missing.

The left/right boundaries also stay put: the sub-interval `(i, k)` is bounded by
`a[i]` and `a[k]`, both of which survive until the very end of that
sub-interval's work. Compare that with the "first" version where the boundaries
were unknowable, and the difference is the whole problem.

## Padding

With `a = [1, ...nums, 1]`, the off-the-end 1s become real array entries, so
`a[i] * a[k] * a[j]` needs no edge cases and the answer is the full open
interval `dp[0][n + 1]`. Costs two slots, deletes four branches.

Loop by interval length ascending, since `dp[i][j]` reads `dp[i][k]` and
`dp[k][j]`, both strictly shorter. `dp[i][j]` with `j - i <= 1` is 0 (nothing
strictly inside), which the zero-filled array already gives for free.

## Dry run: [3, 1, 5, 8]

Padded: `a = [1, 3, 1, 5, 8, 1]`, indices 0..5. Answer lives in `dp[0][5]`.

Span 2 (exactly one balloon inside, so no choice):

| interval | k | value             |
| -------- | - | ----------------- |
| (0,2)    | 1 | 1 * 3 * 1 = 3     |
| (1,3)    | 2 | 3 * 1 * 5 = 15    |
| (2,4)    | 3 | 1 * 5 * 8 = 40    |
| (3,5)    | 4 | 5 * 8 * 1 = 40    |

Span 3 (two candidates for "last"):

| interval | k | dp[i][k] + a[i]*a[k]*a[j] + dp[k][j] | total | best |
| -------- | - | ----------------------------------- | ----- | ---- |
| (0,3)    | 1 | 0 + 15 + 15                         | 30    | 30   |
|          | 2 | 3 + 5 + 0                           | 8     |      |
| (1,4)    | 2 | 0 + 24 + 40                         | 64    | 135  |
|          | 3 | 15 + 120 + 0                        | 135   |      |
| (2,5)    | 3 | 0 + 5 + 40                          | 45    | 48   |
|          | 4 | 40 + 8 + 0                          | 48    |      |

Final row, span 5:

| k | dp[0][k] + a[0]*a[k]*a[5] + dp[k][5] | total   |
| - | ------------------------------------ | ------- |
| 1 | 0 + 3 + 159                          | 162     |
| 2 | 3 + 1 + 48                           | 52      |
| 3 | 30 + 5 + 40                          | 75      |
| 4 | 159 + 8 + 0                          | **167** |

`k = 4` wins, meaning the `8` is the balloon burst last - which matches the
example's order, where 8 goes last for 1 * 8 * 1.

## Small bug after I had the recurrence

I wrote the k-loop as `for (let k = i; k <= j; k++)`, treating `i` and `j` as
burstable. They are not - `dp[i][j]` is the **open** interval. That gave totals
well above 167 because balloons were being counted twice. `k = i + 1; k < j` is
the correct range, and `span = 2` is the smallest interval with anything in it.

I also kept the brute-force version around and cross-checked six small arrays
against it, including `[9, 76, 64, 21, 97, 60]` and an array with zeros in the
middle. After two hours of wrong recurrences I did not trust my own reading of
the right one.

## Complexity

| version       | time     | space    | usable to |
| ------------- | -------- | -------- | --------- |
| brute force   | `O(n!)`  | `O(n^2)` | n ≈ 8     |
| interval DP   | `O(n^3)` | `O(n^2)` | n = 500   |

`O(n^2)` intervals, `O(n)` choices of "last" in each.

## Note to self

When "which one first" makes the subproblems interact, try "which one last".
The last element to be removed is the one still present during both halves,
which is exactly what keeps them independent.

Second note, less about the algorithm: when a DP state definition has needed
three patches, the definition is wrong. Stop patching and go looking for a
different question to ask about the interval. I burned over an hour refusing to
do that today.
