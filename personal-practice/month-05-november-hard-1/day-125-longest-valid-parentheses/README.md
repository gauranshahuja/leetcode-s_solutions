# Day 125 - Longest Valid Parentheses

LeetCode 32 · Hard · Stack, and a DP alternative · Tuesday, 3 November 2026 · ~55 min, 3 attempts

## Problem

String of only `(` and `)`. Return the length of the longest **contiguous**
substring that is well formed.

```
"(()"      ->  2    the trailing "()"
")()())"   ->  4    the "()()" in the middle
"()(()"    ->  2    the stray '(' at index 2 cuts the string in half
""         ->  0
```

## My first (wrong) idea

Count matched pairs. Walk the string with a balance counter, add 2 every time a
`)` finds a partner, done.

Right answer for `"()()"`, wrong answer for `"()(()"`. Matched pairs there: the
leading `()` and the inner `()` at indices 3-4, so my counter says 4. But those
two pairs are not contiguous, there is an unmatched `(` between them at index 2.
The real answer is 2.

So the question is not "how many pairs matched" but "where are the barriers a
valid substring cannot cross". Every unmatched character is a barrier.

## What finally clicked

Day 016 used a stack of brackets to answer valid / not valid. Here validity is
assumed not to hold, and I need a length, so the stack should hold **indices**
instead, and the invariant changes to:

the bottom item of the stack is always the index of the most recent position
that can never belong to a valid substring.

That position is either an unmatched `)`, or the virtual index `-1` sitting just
before the string starts. Push `-1` at the beginning and that case stops being
special.

The loop is then:

- `(` -> push its index, it is a pending open bracket
- `)` -> pop. Two outcomes:
  - the stack is now empty, meaning I just popped the barrier itself, so this
    `)` is unmatched and becomes the new barrier: push `i`
  - the stack is non-empty, so the pop consumed a real `(`, and the valid run
    ending here stretches all the way back to just after the current top:
    `i - stack.top()`

The second bullet surprised me. I expected to add up the lengths of adjacent
matched groups by hand. I don't: subtracting indices does it for free, because
anything between the barrier and `i` has already been popped off, which is the
same as saying it is already matched.

## Dry run

`s = ")()())"`, answer should be 4.

| i | s[i] | stack before | action                      | stack after | best |
| - | ---- | ------------ | --------------------------- | ----------- | ---- |
| 0 | `)`  | `[-1]`       | pop -> empty, new barrier   | `[0]`       | 0    |
| 1 | `(`  | `[0]`        | push 1                      | `[0,1]`     | 0    |
| 2 | `)`  | `[0,1]`      | pop 1, `2 - 0 = 2`          | `[0]`       | 2    |
| 3 | `(`  | `[0]`        | push 3                      | `[0,3]`     | 2    |
| 4 | `)`  | `[0,3]`      | pop 3, `4 - 0 = 4`          | `[0]`       | 4    |
| 5 | `)`  | `[0]`        | pop -> empty, new barrier   | `[5]`       | 4    |

Step 4 is the one worth staring at. The run it reports is `"()()"` at indices
1-4, length 4, and I never had to know that it was made of two groups. The
barrier at index 0 did the accounting.

## The bug

First working-ish version checked emptiness **before** popping:

```js
} else if (stack.length === 1) {   // only the barrier left -> unmatched ')'
  stack[0] = i;
} else {
  stack.pop();
  best = Math.max(best, i - stack[stack.length - 1]);
}
```

That version is correct, but I wrote the branches in the wrong order the first
time and treated a legitimate `(` on top of the stack as a barrier whenever the
stack had exactly one element - which it does right at the start of `"(()"`.
Pop-then-check is less to think about: popping is unconditional, and whether I
removed a bracket or the barrier is answered by whether the stack survived.

## The DP alternative

`dp[i]` = length of the valid substring that *ends exactly at* `i`. Only a `)`
can end one, so all `(` positions stay 0.

| case            | meaning                                   | transition                      |
| --------------- | ----------------------------------------- | ------------------------------- |
| `s[i-1] === '('` | fresh `()` pair                           | `dp[i] = dp[i-2] + 2`           |
| `s[i-1] === ')'` | `s[i]` must close the `(` just before the run ending at `i-1` | `j = i - dp[i-1] - 1`; if `s[j] === '('` then `dp[i] = dp[i-1] + 2 + dp[j-1]` |

The `+ dp[j-1]` term is the same "glue on the previous run" idea as `dp[i-2]` in
the first case, and forgetting it is the classic way to get `"()(())"` wrong:
without it you report 4 instead of 6, because the outer pair does not get
credited with the `()` that sits in front of it.

It stays in the file as `longestValidParenthesesDp`, but the stack is the main
answer because `j = i - dp[i-1] - 1` is an index I had to re-derive twice.

There is also an `O(1)`-space version: sweep left to right counting opens and
closes, record the length whenever they are equal, reset when closes exceed
opens, then sweep right to left with the roles swapped to catch the runs a
leftover `(` would otherwise hide. I read about it afterwards, did not write it.

## Complexity

| Version | Time   | Space  |
| ------- | ------ | ------ |
| Stack   | `O(n)` | `O(n)` |
| DP      | `O(n)` | `O(n)` |
| Two-pass counter | `O(n)` | `O(1)` |

## Pattern to remember

If a stack-of-brackets problem asks for a length rather than a yes/no,
push indices and plant a sentinel for "position before the string". The
answer becomes a subtraction.
