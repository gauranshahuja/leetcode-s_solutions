# Day 126 - Edit Distance

LeetCode 72 · Hard · 2D DP · Wednesday, 4 November 2026 · ~50 min (the table in 20, the rolling array in 30), 2 attempts

## Problem

Minimum number of operations to turn `word1` into `word2`. Allowed operations,
all costing 1: insert a character, delete a character, replace a character.

```
"horse" -> "ros"            3   (horse -> rorse -> rose -> ros)
"intention" -> "execution"  5
"abc" -> ""                 3
```

## The approach

Standard two-string DP. The state I want is "the answer for prefixes":

```
dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1]
```

The base row and column are the part worth saying out loud, because they are
not just zero padding:

- `dp[i][0] = i` - turning an `i`-character string into the empty string means
  `i` deletes. There is no cheaper way.
- `dp[0][j] = j` - turning the empty string into a `j`-character string means
  `j` inserts.

Then the three transitions. Everything is phrased as "what happened to the last
character of each prefix":

| situation                  | cost                  | why                         |
| -------------------------- | --------------------- | --------------------------- |
| `word1[i-1] === word2[j-1]` | `dp[i-1][j-1]`       | last chars already agree, free |
| replace                    | `1 + dp[i-1][j-1]`    | both prefixes shrink by one  |
| delete `word1[i-1]`        | `1 + dp[i-1][j]`      | only `word1` shrinks         |
| insert `word2[j-1]`        | `1 + dp[i][j-1]`      | only `word2` shrinks         |

When the last characters match you take the diagonal and nothing else. You do
*not* also min against the other two: a matching pair is never worth paying for.

The direction of insert vs delete is the thing I always have to re-derive. The
phrasing that sticks: moving up a row means a character of `word1` disappeared,
moving left a column means a character of `word2` appeared.

## Walking the example

`word1 = "horse"`, `word2 = "ros"`.

|       | ""  | r   | o   | s   |
| ----- | --- | --- | --- | --- |
| **""**| 0   | 1   | 2   | 3   |
| **h** | 1   | 1   | 2   | 3   |
| **o** | 2   | 2   | 1   | 2   |
| **r** | 3   | 2   | 2   | 2   |
| **s** | 4   | 3   | 3   | 2   |
| **e** | 5   | 4   | 4   | 3 |

Two cells to read closely:

- `dp[2][2]` ("ho" vs "ro") is 1. The `o`s match, so it is the diagonal
  `dp[1][1]` = 1, which was the single replace of `h` with `r`.
- `dp[5][3]` ("horse" vs "ros") is 3. `e` vs `s` do not match, min of diagonal
  `dp[4][2]` = 3, above `dp[4][3]` = 2, left `dp[5][2]` = 3, so `1 + 2 = 3`.
  The `2` it leaned on came from deleting, matching the official path ending
  "rose" -> "ros".

The answer is 3 even though "horse" and "ros" share no characters in matching
positions. The table finds the alignment for you, which is the point of doing
it as DP rather than as a greedy walk.

## The bug: rolling array, lost diagonal

Row `i` only ever reads row `i-1`, so a single array of length `n+1` is enough.
I wrote this straight away and it was wrong:

```js
for (let j = 1; j <= n; j += 1) {
  dp[j] = word1[i - 1] === word2[j - 1]
    ? dp[j - 1]                                   // WRONG, this is not the diagonal
    : 1 + Math.min(dp[j - 1], dp[j], dp[j - 1]);
}
```

Two mistakes, both from the same misunderstanding. In a one-row array, after
the inner loop has passed position `j-1`:

- `dp[j]` is still `dp[i-1][j]`, the cell **above**
- `dp[j-1]` has already been overwritten, so it is `dp[i][j-1]`, the cell to the
  **left**
- `dp[i-1][j-1]`, the **diagonal**, no longer exists anywhere

So `dp[j-1]` is the left neighbour, not the diagonal, and the diagonal has to be
stashed before it gets overwritten:

```js
let diag = dp[0];     // dp[i-1][0] === i - 1
dp[0] = i;            // now dp[i][0]
for (let j = 1; j <= n; j += 1) {
  const above = dp[j];                 // dp[i-1][j], one step from being destroyed
  dp[j] = ... uses diag / above / dp[j-1] ...
  diag = above;                        // next j's diagonal
}
```

The ordering at the top of the row matters too: `diag` has to read the old
`dp[0]` **before** `dp[0]` is set to `i`, otherwise the first cell of every row
is off by one. I got `"horse"/"ros"` = 4 that way and spent ten minutes printing
rows before I saw it. Then I diffed the two versions on a few thousand random
short strings over `{a,b,c}` before trusting the rolling one.

## Complexity

| Version    | Time       | Space    |
| ---------- | ---------- | -------- |
| Full table | `O(m * n)` | `O(m * n)` |
| One row    | `O(m * n)` | `O(n)`   |

Swap the arguments so the shorter string drives the row length and it is
`O(min(m,n))` space. The full table is still the one to keep if you want to
reconstruct the actual edit sequence, since the rolling version throws away
every row it finishes.

## Note to self

In any 2D DP where you collapse to one row, write down which of the three
neighbours each array slot currently holds *before* writing the loop. Left is
already-new, above is still-old, and the diagonal is the one you must save.

That rule applies to the knapsack family too, where the fix is instead to
iterate `j` backwards. Here backwards does not help because I need both the
left and the above neighbour, so saving the diagonal is the only way out.
