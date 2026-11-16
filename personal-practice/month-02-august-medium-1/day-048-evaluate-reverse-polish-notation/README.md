# Day 048 - Evaluate Reverse Polish Notation

LeetCode 150 · Medium · Stack · Tuesday, 18 August 2026 · ~30 min, 2 attempts

## Problem

Evaluate a postfix expression. Operands come first, then the operator that
eats them.

```
["2","1","+","3","*"]        ->  (2 + 1) * 3        = 9
["4","13","5","/","+"]       ->  4 + (13 / 5)       = 6
```

Integer division truncates toward zero. Expression is always valid, no divide
by zero.

## The approach

Postfix is *already* in evaluation order, which is the entire reason the
notation exists. When an operator appears, its two operands are guaranteed to
be the two most recent values that nothing has consumed yet. "Most recent,
unconsumed" is the definition of a stack.

So:

- number token -> push it
- operator token -> pop two, apply, push the result

One pass, no precedence rules, no parentheses, no lookahead. Easiest Medium in
a while, which was welcome after yesterday.

## Dry run

`["4","13","5","/","+"]`

| token | action | stack after |
| ----- | ------ | ----------- |
| `4`  | push | `[4]` |
| `13` | push | `[4, 13]` |
| `5`  | push | `[4, 13, 5]` |
| `/`  | pop 5, pop 13, push trunc(13/5)=2 | `[4, 2]` |
| `+`  | pop 2, pop 4, push 6 | `[6]` |

Answer 6, the last thing on the stack.

## The bug: Math.floor is not truncation

This is the one real trap. My first version had:

```js
['/', (a, b) => Math.floor(a / b)],    // wrong
```

It passes every example on the problem page, because they are all positive.
Then:

```
["-7","2","/"]     -7 / 2 = -3.5
Math.floor(-3.5) = -4      <- rounds toward negative infinity
Math.trunc(-3.5) = -3      <- drops the fraction, which is what is wanted
```

"Truncate toward zero" means throw the fractional part away, in both
directions. `Math.floor` only agrees with that for non-negative values.
`Math.trunc` is the right function. (`(a / b) | 0` also truncates, but it
silently wraps anything past 2^31, so I am staying away from it.)

A related curiosity: `["3","-4","/"]` is `Math.trunc(-0.75)`, which is
**`-0`**, not `0`. `-0 === 0` is true so arithmetic never notices, but
`Object.is(-0, 0)` is false and `JSON.stringify(-0)` is `"0"` while
`JSON.stringify([-0])` is `"[0]"`. My `check.js` normalises `-0` to `0` (I put
that in on day one for a different reason), so the test passes, but it is
worth knowing this expression can hand back a negative zero.

## The other thing I nearly got wrong

Pop order. The first pop is the **right** operand:

```js
const right = stack.pop();
const left = stack.pop();
stack.push(op(left, right));
```

`["2","3","-"]` means `2 - 3 = -1`. If the pops are swapped it gives `1`.
Invisible for `+` and `*`, wrong for `-` and `/`, which is exactly the kind of
bug that survives a quick test pass.

## A JS note on the operator lookup

I started with a plain object and `if (token in ops)`. That works for these
inputs, but `in` walks the prototype chain, so a token of `"constructor"` or
`"toString"` would be reported as an operator and then crash on the pops.
Can't happen with this problem's constraints, but a `Map` costs nothing and
has no inherited keys, so the lookup means what it looks like it means.

Same reflex as the `Map` vs object key question in the hash-map days: objects
have opinions, maps don't.

## Complexity

- Time `O(n)`, one visit per token.
- Space `O(n)` for the stack. Worst case is all the operands first, then all
  the operators.

## Takeaway

Postfix needs no parser, just a stack. The two things to be deliberate
about are the pop order and the division rounding mode.

Fifth stack day now (016 for matching brackets, 017 for Min Stack, 018 for the two-stack queue, 047 for "next greater"), and this is the plainest use yet: the stack is literally the
machine's operand stack.
