# Day 073 - Letter Combinations of a Phone Number

LeetCode 17 · Medium · Backtracking over digits · Saturday, 12 September 2026 · ~20 min, 1 attempt (plus one fix for `""`)

## Problem

Old phone keypad. `2 -> abc`, `3 -> def`, ... `7 -> pqrs`, `9 -> wxyz`. Given a
digit string, list every word you could type.

```
"23" -> ad ae af bd be bf cd ce cf      (9 = 3 * 3)
"7"  -> p q r s
""   -> []                              (not [""])
```

## The shape, compared to yesterday

Yesterday (Day 072) each recursion level had to decide *which* candidate to
take next, so it carried a `start` index. Here position `i` of the answer is
always filled by digit `i`. There is no choice of position at all, only a
choice of letter inside one row.

So the tree is a plain cartesian product:

- depth = number of digits
- branching factor = 3 or 4
- every leaf is a valid answer, nothing to prune

Which makes it the simplest backtracking I've written. Push a letter, go one
digit deeper, pop.

```js
for (const letter of PAD[digits[i]]) {
  buf.push(letter);
  walk(i + 1);
  buf.pop();
}
```

## Dry run

`digits = "23"`

| level | buf   | branching over | emits        |
| ----- | ----- | -------------- | ------------ |
| 0     | `[]`  | a, b, c        | -            |
| 1     | `[a]` | d, e, f        | ad, ae, af   |
| 1     | `[b]` | d, e, f        | bd, be, bf   |
| 1     | `[c]` | d, e, f        | cd, ce, cf   |

9 leaves, which is exactly `3 * 3`. Nice sanity check that I can do on any
input: multiply the row lengths and compare with `out.length`. I used that for
`"7979"` in the tests (`4*4*4*4 = 256`) instead of writing 256 strings out.

## The only real bug

My first version had no guard at the top, so `letterCombinations("")`
immediately hit `i === digits.length` and returned `[""]`. One empty string is
not the same as no strings - LeetCode wants `[]`. Added:

```js
if (!digits) return [];
```

Worth noting that this is the *opposite* of the convention in subsets-style
problems, where the empty selection is a legitimate answer and must be in the
output. Here the empty input means "nothing was dialled", so there is nothing
to type.

## JS note

I keyed the pad with a plain object:

```js
const PAD = { 2: 'abc', ... };
PAD[digits[i]]   // digits[i] is the string "2", object keys are strings -> fine
```

If I had reached for a `Map` out of habit I would have had to be careful:
`new Map([[2, 'abc']]).get('2')` is `undefined`, because `Map` compares keys
with SameValueZero and does not coerce `'2'` to `2`. Object property access
coerces, `Map` does not. I've already lost time to this once, keying a Map by
a number and then looking it up with a string that came out of `split('')`.

## Complexity

| | |
| ----- | ------------------------------------------- |
| Time  | `O(4^n * n)` - up to `4^n` answers, each `n` chars to join |
| Space | `O(n)` for the buffer and stack (output excluded) |

The `4^n` is unavoidable: that's the size of the answer, not the cost of
finding it.

## Alternative approach

An iterative build works and is arguably tidier for this one - keep a list of
partial strings and expand it digit by digit:

```js
let acc = [''];
for (const d of digits) acc = acc.flatMap((p) => [...PAD[d]].map((c) => p + c));
```

Same complexity, but it allocates a whole new array of partials per digit while
the backtracking version reuses a single buffer. I kept the recursive one
because it's the version I want in my fingers for the harder backtracking
problems.
