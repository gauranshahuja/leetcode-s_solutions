# Day 007 - Valid Palindrome

LeetCode 125 · Easy · Strings, two pointers · Wednesday, 8 July 2026 · ~25 min, 3 attempts

## Problem

Ignore case, ignore anything that is not a letter or a digit, then check
whether the string reads the same both ways.

```
"A man, a plan, a canal: Panama"  ->  true    cleaned: "amanaplanacanalpanama"
"race a car"                      ->  false   cleaned: "raceacar"
" "                               ->  true    cleaned: ""
```

## Where I started

The clean-then-compare version, which took two minutes:

```js
const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
return cleaned === [...cleaned].reverse().join('');
```

It passes. I would probably write this in real code. But it makes three full
copies of the string (lowercased, cleaned, reversed) so it is `O(n)` extra
space, and the follow-up on the problem asks to do it without that. Also
reversing to compare is doing twice the work: once the first half matches the
second half, the rest of the comparison is the same pairs again in the other
order.

## Two pointers instead

One index at each end, walking inwards:

1. slide `lo` right while it sits on junk
2. slide `hi` left while it sits on junk
3. compare the two characters, lowercased
4. if they match, step both inwards and repeat

The skipping happens inside the walk, so the filtered string never needs to
exist. Each pointer only ever moves one direction, so even with the inner
`while` loops the total number of steps is at most `n`. It looks nested but
it is not `O(n^2)`.

## Dry run

`s = "a,Ba"` (contrived to get a skip, a case fold and a mismatch all in four
characters)

| lo | hi | s[lo] | s[hi] | what happens                      |
| -- | -- | ----- | ----- | --------------------------------- |
| 0  | 3  | `a`   | `a`   | both alphanumeric, equal, step in |
| 1  | 2  | `,`   | `B`   | `,` is junk, `lo` becomes 2       |
| 2  | 2  | `B`   | `B`   | `lo < hi` is false, loop exits    |

Returns `true`, which is right: the cleaned string is `"aba"`.

## The bug

First working version dropped the guards from the inner loops:

```js
while (!isAlphaNumeric(s[lo])) lo += 1;      // no lo < hi guard
while (!isAlphaNumeric(s[hi])) hi -= 1;
```

On `".,!"` that runs `lo` straight off the end of the string. `s[3]` is
`undefined`, `isAlphaNumeric(undefined)` is `false` because all three
comparisons against `undefined` are false, so the loop keeps going forever
incrementing `lo`. It hung, which was at least an obvious symptom.

Adding `lo < hi` to both inner conditions fixes it. The pointers can now land
on the same index and the outer `while (lo < hi)` ends the whole thing.

## Edge case that bit me

`"0P"`. My second version lowercased using an arithmetic shift of char codes,
roughly "if it's an uppercase letter add 32", and I managed to apply the
offset to digits too. `'0'` is char code 48, plus 32 is 80, which is `'P'`.
So `"0P"` compared equal and returned `true`. The expected answer is
`false`: a digit is never the same character as a letter.

Using `.toLowerCase()` instead of hand-rolled char code maths makes the whole
problem go away, and it is also the version that stays correct for
non-English letters. I added `"0P"` as a test because it is exactly the input
that catches this family of mistakes.

## Odd and even lengths

I was worried about the middle character of an odd-length string, but it
needs no special case. With `"aba"` the pointers meet at index 1 and
`while (lo < hi)` is already false, so the middle is never compared with
itself. Nothing to do.

## Complexity

| Version          | Time   | Space  |
| ---------------- | ------ | ------ |
| Clean + reverse  | `O(n)` | `O(n)` |
| Two pointers     | `O(n)` | `O(1)` |

Same time class; the point of today was the space.

## Takeaway

Two pointers from the ends is the tool for "does this sequence mirror
itself". The filtering does not need its own pass; it can live inside the
walk as a skip.

Also: when a loop condition tests a character, remember that indexing past
the end of a JS string gives `undefined` instead of throwing. A character
predicate will quietly say "no" forever, so the bounds check has to be in the
condition.
