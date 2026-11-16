# Day 032 - Product of Array Except Self

LeetCode 238 · Medium · Prefix and suffix products · Sunday, 2 August 2026 · ~35 min, 3 attempts

## Problem

`answer[i]` = product of all elements except `nums[i]`. O(n) time, **no
division**, and the output array is not counted as extra space.

```
[1, 2, 3, 4]        -> [24, 12, 8, 6]
[-1, 1, 0, -3, 3]   -> [0, 0, 9, 0, 0]
```

## My first idea, which the problem specifically forbids

Multiply everything, then divide:

```js
let total = 1;
for (const n of nums) total *= n;
return nums.map((n) => total / n);
```

Two lines, O(n), done. Except division is banned, and the ban is not arbitrary:
a single zero sets `total` to 0, and then every slot computes `0 / n` (fine) or
`0 / 0` (`NaN`). You would have to special-case "exactly one zero" and
"two or more zeros" separately. I kept this version in the file as
`productExceptSelfDivision` purely as a reminder of why the rule exists.

## What finally clicked

Everything except `nums[i]` is just **two blocks**:

```
nums   = [ 1   2   3   4 ]
i = 2:    \_____/     \_/
          left=1*2     right=4      ->  2 * 4 = 8
```

So `answer[i] = prefix[i] * suffix[i]`, where `prefix[i]` is the product of
everything strictly left of `i` and `suffix[i]` everything strictly right. Both
are running products, so each takes one linear pass. That is the whole
algorithm, and no element is ever multiplied by itself.

Day 005 (Maximum Subarray) kept a running value instead of recomputing a range. This is that with two directions.

## Dry run on `[1, 2, 3, 4]`

Pass 1, left to right. Write `prefix` into `out[i]` **before** folding
`nums[i]` in:

| i | out[i] = prefix | prefix after |
| - | --------------- | ------------ |
| 0 | 1               | 1            |
| 1 | 1               | 2            |
| 2 | 2               | 6            |
| 3 | 6               | 24           |

`out = [1, 1, 2, 6]`

Pass 2, right to left, same rule mirrored:

| i | suffix before | out[i] *= suffix | suffix after |
| - | ------------- | ---------------- | ------------ |
| 3 | 1             | 6 * 1 = 6        | 4            |
| 2 | 4             | 2 * 4 = 8        | 12           |
| 1 | 12            | 1 * 12 = 12      | 24           |
| 0 | 24            | 1 * 24 = 24      | 24           |

`out = [24, 12, 8, 6]`

## Where I got stuck

Twice, both times on ordering.

**Off-by-one on the write.** I wrote this first:

```js
prefix *= nums[i];
out[i] = prefix;      // now out[i] includes nums[i] itself
```

Which gives `[1, 2, 6, 24]` from pass 1 instead of `[1, 1, 2, 6]`. The rule is
"store the state *before* this element, then update it". Exactly the same
check-then-store ordering lesson as Day 001, just with a product instead of a
map insert.

**Wanted a second array.** My next version built a real `suffix` array, then
multiplied the two together. That is `O(n)` extra space. Collapsing the suffix
into one scalar and multiplying straight into `out[i]` is what gets it to
`O(1)`, and it works because pass 2 reads `out[i]` exactly once before
overwriting it.

## Edge case that bit me: `-0`

For `[-1, 1, 0, -3, 3]` the raw output is

```
[-0, 0, 9, -0, 0]
```

`-0` and `0` behave the same under `===`, and `lib/check.js` canonicalises them
to `0`, so the tests pass. But if I ever printed these with
`Object.is(x, -0)` or sent them through something that distinguishes them, I
would see `-0` and wonder what broke. Nothing broke, IEEE floats just carry a
sign bit even on zero. Noted so I do not panic next time.

## Complexity

- Time: `O(n)`, two passes, no nesting.
- Space: `O(1)` extra. The output array is reused as scratch between pass 1 and
  pass 2.

## Note to self

"Everything except me" almost always decomposes into "everything before me"
times/plus "everything after me". Prefix + suffix, two passes.

Also worth remembering: when a problem **removes** an operator you would
naturally reach for, the removal is the hint, not an obstacle.

## Follow-up to try

LeetCode 2906 (Construct Product Matrix) is the same thing in 2D with a modulo,
and 724 (Find Pivot Index) is the additive version. Both should fall out of
this shape.
