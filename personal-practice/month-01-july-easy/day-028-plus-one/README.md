# Day 028 - Plus One

LeetCode 66 · Easy · Array, carry propagation · Wednesday, 29 July 2026 · ~12 min, 2 attempts

## Problem

The digits of a number, most significant first. Add one.

```
[1,2,3]     -> [1,2,4]
[4,3,2,1]   -> [4,3,2,2]
[9]         -> [1,0]
[9,9,9]     -> [1,0,0,0]
```

## First instinct, and why it is wrong

Join, convert, add, split:

```js
// no
return String(Number(digits.join('')) + 1).split('').map(Number);
```

It passes the three samples and then falls apart, because the constraint says
the array can be up to 100 digits. `Number.MAX_SAFE_INTEGER` is 9007199254740991,
about 16 digits, so anything longer silently loses precision:

```js
Number('9'.repeat(20)) + 1
// 100000000000000000000   .. which happens to be right

Number('12345678901234567890') + 1
// 12345678901234567000   .. the tail is gone
```

`BigInt(digits.join('')) + 1n` would genuinely work, but that is sidestepping
the problem rather than solving it, and the problem is about carries.

## What the problem is actually about

Adding 1 is the easiest possible long addition, because there is only one
place a carry can start and it can only travel left through 9s:

- digit `< 9`: increment it, **return immediately**. Everything to the left is
  unaffected, so there is nothing more to do.
- digit `=== 9`: it becomes 0, the carry moves one step left.
- loop ran off the front: every digit was a 9, so the answer is a `1` in front
  of all the zeros the loop just wrote.

No `carry` variable needed, no `% 10`, no `Math.floor(x / 10)`. The early
return *is* the "carry is 0 now" case.

## Dry run

`[1,9,9]`

| i | digit | < 9? | action                | array       |
| - | ----- | ---- | --------------------- | ----------- |
| 2 | 9     | no   | set 0, carry left     | `[1,9,0]`   |
| 1 | 9     | no   | set 0, carry left     | `[1,0,0]`   |
| 0 | 1     | yes  | 1 -> 2, return        | `[2,0,0]` |

And `[9,9,9]`: all three become 0, the loop ends at `i = -1`, so the return is
`[1, 0, 0, 0]`.

## Attempt 1 bug

I wrote the all-nines branch as `out[0] = 1` instead of growing the array:

```js
// wrong: result is one digit too short
out[0] = 1;
return out;
```

`[9,9,9]` came back as `[1,0,0]` - the right digits, wrong length, because the
number has genuinely gained a digit. 999 + 1 is a 4 digit number. Had to
actually prepend.

I used `[1, ...out]` rather than `out.unshift(1)`. Same result; `unshift` has
to shift every element along anyway, and spreading reads more like "a new
leading digit" than "mutate the front of this array". Either is `O(n)` and it
only happens on the all-nines input.

## Complexity

| Case             | Time       |
| ---------------- | ---------- |
| Last digit < 9   | `O(1)` loop, `O(n)` for the copy |
| All nines        | `O(n)`     |

Space is `O(n)` because I copy the input. LeetCode is happy for you to mutate
`digits` in place, which makes it `O(1)` extra, but I would rather not have a
function that quietly rewrites the array it was handed - that caught me on
Day 024 as well.

## Note to self

Digits-in-an-array problems are string-free arithmetic. The moment I reach
for `Number(join())` I should check the length constraint first.

This should be the same engine as Add Binary and Add Two Numbers (the linked
list one), just with a general carry instead of a carry that is always 1.
Worth doing those next while it is fresh.
