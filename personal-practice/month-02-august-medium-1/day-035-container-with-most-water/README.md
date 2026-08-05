# Day 035 - Container With Most Water

LeetCode 11 · Medium · Two pointers, greedy shrink · Wednesday, 5 August 2026 · ~45 min, most of it on the proof, 2 attempts

## Problem

`height[i]` is a wall at position `i`. Pick two walls, pour water between
them. Area = distance between them times the **shorter** wall. Walls in
between are transparent, they do not divide the container.

```
height = [1,8,6,2,5,4,8,3,7]   ->  49

index 1 (h=8) and index 8 (h=7):  width 7, min height 7  ->  49
```

## First instinct

All pairs. `O(n^2)`, and for `n = 10^5` that is out. I wrote it anyway on
paper to get a feel for which pairs were winning, and the pattern was that the
best answer was neither the widest pair nor the pair with the two tallest
walls. So neither extreme is a shortcut on its own.

## The approach that works

Start at the two ends (widest possible), measure, then move one pointer inward.
The whole problem is *which* pointer to move. Answer: **always the shorter
wall.**

```js
if (height[left] < height[right]) left += 1;
else right -= 1;
```

## Why moving the shorter wall cannot miss the answer

This is the part I actually had to sit and argue with myself about, because
"greedy and it works" is not a reason.

Say the current pair is `(left, right)` and `h[left] <= h[right]`. I have just
measured that pair, so it is already accounted for. Question: could any pair
that still uses `left` beat it?

Such a pair is `(left, j)` for some `j` with `left < j < right`. Compare the
two factors:

- **Width.** `j - left < right - left`. Strictly smaller, because `j < right`.
- **Height.** `min(h[left], h[j]) <= h[left]`, and `h[left] = min(h[left], h[right])`
  since `h[left]` is the shorter one. So the cap is no taller than the current
  cap.

Smaller width times a cap that is no bigger means the area cannot be bigger.
So every remaining pair using `left` is dominated by the pair I just measured.
`left` has nothing more to offer and discarding it loses nothing.

Mirror the argument if the right wall is the shorter one.

And the reason the opposite move is wrong: if I moved the **taller** wall, the
short wall stays in play as the cap, so the height cannot improve, and the
width just got smaller. Guaranteed no better, and on the way I would have
skipped candidate pairs that use the tall wall. So it is both useless and
unsafe.

When the two heights are equal, either move works. Both of them are dominated
by the current pair by the same argument, so I could even move both. I move
`right` (the `else` branch) and the other one gets discarded a step later.

## Walking through the example

`height = [1,8,6,2,5,4,8,3,7]`

| left | right | h[left] | h[right] | width | area | best | move      |
| ---- | ----- | ------- | -------- | ----- | ---- | ---- | --------- |
| 0    | 8     | 1       | 7        | 8     | 8    | 8    | left (1 < 7) |
| 1    | 8     | 8       | 7        | 7     | 49   | 49   | right     |
| 1    | 7     | 8       | 3        | 6     | 18   | 49   | right     |
| 1    | 6     | 8       | 8        | 5     | 40   | 49   | right (tie) |
| 1    | 5     | 8       | 4        | 4     | 16   | 49   | right     |
| 1    | 4     | 8       | 5        | 3     | 15   | 49   | right     |
| 1    | 3     | 8       | 2        | 2     | 4    | 49   | right     |
| 1    | 2     | 8       | 6        | 1     | 6    | 49   | right     |
| 1    | 1     | -       | -        | -     | -    | 49 | stop      |

Nine walls, nine iterations, instead of 36 pairs.

## The bug

Embarrassing one. My first draft had:

```js
const area = Math.min(height[left], height[right]) * right - left;
```

Missing parentheses, so JS did `(min * right) - left`. It gave 48 on the
example instead of 49, which is close enough to look like an off-by-one in the
width and sent me hunting in the wrong place for ten minutes. `*` binds tighter
than `-`. Width needs its own brackets: `* (right - left)`.

## Complexity

- Time: `O(n)`. Each iteration moves exactly one pointer inward, and they
  start `n - 1` apart.
- Space: `O(1)`.

## Takeaway

Two pointers from the ends works when you can prove that one side is
dominated and can be thrown away. The proof is always the same shape:
show that every remaining pair using that side is both narrower and capped no
higher.

Day 011 (Binary Search) threw away half the array per step because of sortedness.
This throws away one index per step because of domination. Different reason,
same habit: do not look at things you can prove cannot win.

## Follow-up to try

Trapping Rain Water (LeetCode 42) looks like the same picture but is not the
same problem at all, since there the middle walls matter. I think that one needs
prefix max from both sides, which is the Day 032 two-direction trick again.
