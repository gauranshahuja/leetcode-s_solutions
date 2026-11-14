# Day 136 - Candy

LeetCode 135 · Hard · Greedy, two passes · Saturday, 14 November 2026 · ~45 min, 2 attempts

Labelled hard, and it is hard in the sense that the wrong approach looks right
for a long time. The code is nine lines.

## Problem

`n` children in a row with ratings. Every child gets at least one candy, and a
child rated **higher** than an immediate neighbour must get **strictly more**
candy than that neighbour. Minimise the total.

```
ratings = [1, 0, 2]   ->  5     candies [2, 1, 2]
ratings = [1, 2, 2]   ->  4     candies [1, 2, 1]
```

Equal neighbouring ratings impose nothing at all. In `[1, 2, 2]` the second and
third child are tied, so the third is free to drop back to 1.

## My first idea, and the array that kills it

One pass, left to right: start everyone at 1, and bump whenever the rating goes
up.

```js
for (let i = 1; i < n; i++)
  if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
```

Take `ratings = [1, 3, 2, 2, 1]`. That pass produces:

| i          | 0 | 1 | 2 | 3 | 4 |
| ---------- | - | - | - | - | - |
| rating     | 1 | 3 | 2 | 2 | 1 |
| after pass | 1 | 2 | 1 | 1 | 1 |

Total 6, and it is **not a valid distribution**. Child 3 is rated 2, child 4 is
rated 1, and they both hold one candy - a higher rating with equal candy breaks
the rule. The real answer is `[1, 2, 1, 2, 1]`, total 7.

This is not a patchable off-by-one. A left-to-right pass at position `i` has not
read `ratings[i + 1]` yet, so it fundamentally cannot know whether `i` needs to
outrank the child on its right. The information arrives after the decision.

## What works

Each child is under exactly two constraints, one per neighbour. So run one pass
per direction and take the stronger demand at each position.

```js
// pass 1, left to right: satisfy the left neighbour
if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;

// pass 2, right to left: satisfy the right neighbour, without undoing pass 1
if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);
```

`Math.max` is doing real work there. Plain assignment in pass 2 would clobber
the left-hand requirement on any peak. And `max` is safe in the other direction
too: it can only **raise** `candies[i]`, and raising it cannot break
`candies[i] > candies[i - 1]`, which was already true. So after pass 2 both
families of constraints hold at once.

## Why it is also minimal

Valid is not the same as minimal, and this is the part I had to convince myself
of rather than just trust.

After both passes, `candies[i]` is

```
max( length of the ascending run of ratings ending at i,
     length of the descending run of ratings starting at i )
```

Any valid assignment must give child `i` at least both of those numbers: an
ascending run of length `k` ending at `i` forces at least `1, 2, ..., k`, and
symmetrically for a descending run starting at `i`. So the two-pass answer is
the **pointwise** minimum over all valid assignments, which makes its sum the
minimum too. Nothing clever about the sum - it is minimal because every single
term is.

Same flavour of argument as Day 091: show that the greedy choice is forced, not
merely good, and minimality comes along for free.

## Dry run: [1, 2, 87, 87, 87, 2, 1]

| i                | 0 | 1 | 2  | 3  | 4  | 5 | 6 |
| ---------------- | - | - | -- | -- | -- | - | - |
| rating           | 1 | 2 | 87 | 87 | 87 | 2 | 1 |
| start            | 1 | 1 | 1  | 1  | 1  | 1 | 1 |
| after L -> R     | 1 | 2 | 3  | 1  | 1  | 1 | 1 |
| after R -> L     | 1 | 2 | 3  | 1  | 3  | 2 | 1 |

Total 13.

The plateau at indices 2, 3, 4 is the interesting bit. Index 3 is sandwiched
between two equal ratings, so it has no constraint in either direction and stays
at 1. Index 4 has to beat the descending tail `87 > 2 > 1`, so it needs 3. Index
2 earned its 3 from the ascending run on the left. Both passes contribute, at
different positions, in the same array.

## Edge case that bit me

`[2, 2, 2, 2]` - I expected 4 and my first instinct said "surely a run of equals
needs increasing candy". It does not. Equal ratings mean **no** constraint, not
an equality constraint. Four children, four candies.

The other one worth testing is the empty array. `candyDistribution([])` returns
`[]`, `reduce` over an empty array with an initial value of 0 is fine - but
`[].reduce((a, b) => a + b)` with no initial value throws `TypeError: Reduce of
empty array with no initial value`. I supply the `0`, and I also short-circuit
on empty input before touching the array at all.

## Complexity

- Time: `O(n)`. Two linear passes and a sum.
- Space: `O(n)` for the candies array. There is a known `O(1)`-space version
  that tracks the length of the current up-run and down-run and adds a
  correction term for the peak, but it is fiddly and I would get it wrong under
  pressure. Not writing it today.

## Pattern to remember

When each element is constrained by both neighbours, one pass cannot work -
at the moment of the decision, half the information is still in the future.
Sweep once per direction and combine with `max`. This is the same skeleton as
"product of array except self" and "trapping rain water".
