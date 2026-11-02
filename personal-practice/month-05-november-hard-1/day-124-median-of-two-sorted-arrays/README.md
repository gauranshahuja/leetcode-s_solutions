# Day 124 - Median of Two Sorted Arrays

LeetCode 4 · Hard · Binary search on the partition · Monday, 2 November 2026 · ~2 hr 20 min (gave up at ~55 min and read the editorial for the partition framing, then wrote it myself), 4 attempts

## Problem

Two sorted arrays. Return the median of their union. Required complexity is
`O(log(m + n))`.

```
a = [1,3], b = [2]       ->  2      union [1,2,3]
a = [1,2], b = [3,4]     ->  2.5    union [1,2,3,4]
a = [],    b = [2,3]     ->  2.5
```

## What I tried for the first hour

1. Merge the two arrays, index the middle. Right answer, `O(m + n)`, does not
   meet the bar. Kept in the file as `findMedianMerge` to diff against.
2. Binary search "the k-th smallest element of the union", dropping `k/2`
   elements from one side per step. This is a real solution but I could not keep
   the index arithmetic straight. Twenty minutes later I had four nearly
   identical off-by-ones and a recursion that went negative on `k`.
3. Binary search the *value* of the median and count elements below it. Works
   for integers but it is `O(log(range) * log n)`, and it felt wrong for a
   problem whose answer can be a `.5`.

At 55 minutes I stopped and read the editorial, specifically for the framing and
not the code. The framing is the entire problem and I would not have found it
on my own today.

## The reframe

Stop thinking about "find the k-th element". Think about **cutting both arrays**.

Draw one vertical cut through each array:

```
a:  a[0] .. a[i-1]  |  a[i] .. a[m-1]
b:  b[0] .. b[j-1]  |  b[j] .. b[n-1]
```

If I can place the two cuts so that

- the two left pieces together hold exactly half of all the elements, and
- **every** element on the left is `<=` every element on the right,

then by definition the cut is the median cut, and I never have to merge
anything. The median is read off the four values touching the cut.

The second condition looks like four comparisons but it is only two: within one
array the left piece is already `<=` the right piece because the array is
sorted, so the only cross-checks that can fail are
`aLeft <= bRight` and `bLeft <= aRight`.

And the first condition kills a whole variable: if the left side must hold
`half = (m + n + 1) >> 1` elements and I take `i` from `a`, then `j = half - i`.
One free parameter, `i`, over the range `[0, m]`. That is binary searchable, and
that is the whole solution. The `+1` in `half` puts the odd element on the
**left** side, which makes the odd case just `max(aLeft, bLeft)`.

## Two details that stop it being fiddly

**Binary search the shorter array.** If `m <= n`, then `j = half - i` is
guaranteed to land in `[0, n]` for every `i` in `[0, m]`. If you search the
longer one, `j` goes out of bounds and you need clamping. One `if (a.length > b.length)
return findMedianSortedArrays(b, a);` at the top and the problem disappears.
Median is symmetric so swapping costs nothing.

**Sentinels.** When `i === 0` there is no `aLeft`, and when `i === m` there is no
`aRight`. Instead of branching, use

```js
const aLeft  = i > 0 ? a[i - 1] : -Infinity;
const aRight = i < m ? a[i]     :  Infinity;
```

`-Infinity` is `<=` everything and `Infinity` is `>=` everything, so neither
ever blocks a valid cut. That is what makes an empty input array need zero
special handling: with `m === 0` the only candidate `i` is 0, both of `a`'s
values are sentinels, and the answer comes entirely from `b`.

## Walking the four values

`a = [1,2,3,4,5]`, `b = [6,7,8]`. First thing that happens is the swap, so
internally `a = [6,7,8]` (m=3) and `b = [1,2,3,4,5]` (n=5).
`half = (3 + 5 + 1) >> 1 = 4`. Total is even, so the answer will be an average.

| step | lo | hi | i | j = 4-i | aLeft | aRight | bLeft | bRight | valid?                |
| ---- | -- | -- | - | ------- | ----- | ------ | ----- | ------ | --------------------- |
| 1    | 0  | 3  | 1 | 3       | 6     | 7      | 3     | 4      | no, `aLeft 6 > bRight 4` |
| 2    | 0  | 0  | 0 | 4       | -Inf  | 6      | 4     | 5      | yes                |

Step 1 took too much from `a` (a 6 ended up on the left while a 4 was still on
the right), so `hi = i - 1 = 0`.

Step 2: left side is `{1,2,3,4}`, right side is `{5} + {6,7,8}`. Largest on the
left is `max(-Inf, 4) = 4`, smallest on the right is `min(6, 5) = 5`, so the
median is `(4 + 5) / 2 = 4.5`. Union is `[1..8]`, median is indeed 4.5.

The thing I kept getting wrong before this walkthrough: `max(aLeft, bLeft)` is
the **last element of the sorted left half**, and `min(aRight, bRight)` is the
**first element of the sorted right half**. Once I said that out loud the
odd/even split stopped being arbitrary.

## Where I got stuck even after knowing the shape

The loop condition. I wrote `while (lo < hi)` out of habit from Day 011, and
`[], [1]` then never enters the loop at all. Here the search space is `[0, m]`
**inclusive** and a valid `i` can be either end, including both at once when
`m === 0`. So it has to be `while (lo <= hi)`, with the exit happening via
`return` rather than via the loop condition. Different from the usual "find the
boundary" search where the loop ends and *then* you read the answer.

Also `hi = i - 1`, not `hi = i`: the cut at `i` was proven invalid so it can be
excluded, and that keeps the interval shrinking so the loop terminates.

## Complexity

| Version        | Time                  | Space    |
| -------------- | --------------------- | -------- |
| Merge          | `O(m + n)`            | `O(m+n)` |
| Partition search | `O(log(min(m, n)))` | `O(1)`   |

`log(min(m,n))` is better than the `log(m+n)` the problem asks for, which is a
nice sign the framing is the intended one.

## Takeaway

When a problem is about a *position* in a merged structure, try searching for
the cut rather than for the element. One cut forces the other, which turns two
unknowns into one.

I also want to remember the sentinel trick on its own. `-Infinity` / `+Infinity`
at array boundaries deleted about five `if` statements here.
