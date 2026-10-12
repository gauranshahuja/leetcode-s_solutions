# Day 103 - Basic Calculator II

LeetCode 227 · Medium · Stack-free expression parsing · Monday, 12 October 2026 · ~40 min, 3 attempts

## Problem

Evaluate a string expression. Non-negative integers, the operators `+ - * /`,
optional spaces anywhere. No parentheses. Integer division truncates toward
zero. No `eval`.

```
"3+2*2"      ->  7
" 3/2 "      ->  1
" 3+5 / 2 "  ->  5
```

## Where I started

I spent the first five minutes thinking this needed a real parser - tokenise,
then shunting-yard into RPN, then evaluate the RPN like Day 048. That does
work, and honestly after Day 048 I could have written it. But it is three
passes and a lot of code for an expression with exactly two precedence levels.

With only two levels there is a much shorter story: **`*` and `/` can be
resolved the instant you have both of their operands, `+` and `-` cannot.**

## The approach that works

Keep a stack of *terms to be added*.

- walk the string building up `num` digit by digit
- when I hit a non-digit, non-space character, the pending operator `op` tells
  me what to do with the `num` I just finished:
  - `+` -> push `num`
  - `-` -> push `-num`
  - `*` -> `push(pop() * num)`
  - `/` -> `push(trunc(pop() / num))`
- reset `num`, set `op` to the character I am standing on

At the end the stack is a flat list of signed values and the answer is just
their sum. Precedence never needs to be compared because subtraction got
turned into "add a negative" and the high-precedence ops already collapsed
themselves.

### Then drop the stack

The stack is only ever touched at the top, and everything below the top is
already final - nothing can reach back and multiply it. So two numbers are
enough:

- `result` - sum of all closed terms
- `prev` - the one term still open to `*` or `/`

`+`/`-` closes `prev` into `result` and opens a new one. `*`/`/` edits `prev`
in place. `O(1)` space, same single pass. That is the version I kept as
`calculate`.

## Dry run

`"3+5 / 2"` with the O(1) version:

| i | char | num | op before | action                          | result | prev |
| - | ---- | --- | --------- | ------------------------------- | ------ | ---- |
| 0 | `3`  | 3   | `+`       | keep reading digits             | 0      | 0    |
| 1 | `+`  | 3   | `+`       | close: result += prev, prev = 3 | 0      | 3    |
| 2 | `5`  | 5   | `+`       | digits                          | 0      | 3    |
| 3 | ` `  | 5   | `+`       | skip                            | 0      | 3    |
| 4 | `/`  | 5   | `+`       | close: result += 3, prev = 5    | 3      | 5    |
| 5 | ` `  | 5   | `/`       | skip                            | 3      | 5    |
| 6 | `2`  | 2   | `/`       | digits                          | 3      | 5    |
| - | end  | 2   | `/`       | prev = trunc(5/2) = 2           | 3      | 2    |

Answer `result + prev = 5`

## Three things that went wrong

**1. The last number never got applied.** My loop was `i < s.length`, so the
final `2` in `"3+5/2"` was sitting in `num` with nothing to flush it. I nearly
fixed it by duplicating the operator block after the loop. Cleaner fix: run the
loop one index past the end.

```js
for (let i = 0; i <= s.length; i += 1) {
  const ch = s[i];          // undefined on the last round
  if (ch >= '0' && ch <= '9') { ... }   // undefined fails this, good
```

`undefined >= '0'` is `false`, so the extra round falls straight into the
operator block and flushes `num`. Then `op = undefined` and the loop ends.

**2. `Math.floor` instead of `Math.trunc`.** `"1-5/2"` should be `-1`: the
term is `-5`, divided by 2, truncated toward zero gives `-2`, plus the leading
1 is `-1`. With `Math.floor` I got `1 + (-3) = -2`. Floor rounds down, which for
negatives is away from zero. The problem explicitly says truncate.

I also tried `(prev / num) | 0` because it is shorter - it truncates correctly
but it coerces through a 32-bit int, so anything above ~2.1 billion silently
wraps. Not worth it.

**3. `num * 10 + ch`.** String `+` number is string concatenation in JS, so
`0 * 10 + '3'` gave `"03"` and then `"03" * 10` coerced back to 30 and it
half-worked for a while. Using `ch.charCodeAt(0) - 48` keeps everything numeric.

## Complexity

| Version | Time   | Space  |
| ------- | ------ | ------ |
| Stack   | `O(n)` | `O(n)` |
| Running `prev` | `O(n)` | `O(1)` |

## Note to self

When there are only two precedence levels, you do not need a parser. Resolve
the tight operator eagerly, defer the loose one by pushing a signed value,
and sum at the end.

The "run the loop one past the end so the last token flushes itself" trick is
the reusable bit here. It beats copy-pasting the body after the loop every
time I parse a string.

If parentheses get added (LeetCode 224) this breaks, and then the honest answer
is a stack of saved `(result, sign)` pairs - same shape as Day 016 where the
stack remembers what to come back to.
