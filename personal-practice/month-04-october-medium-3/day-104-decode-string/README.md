# Day 104 - Decode String

LeetCode 394 · Medium · Stack of pending state · Tuesday, 13 October 2026 · ~30 min, 2 attempts

## Problem

`k[encoded]` means repeat `encoded` k times. Brackets nest. Expand the whole
string.

```
"3[a]2[bc]"      ->  "aaabcbc"
"3[a2[c]]"       ->  "accaccacc"
"2[abc]3[cd]ef"  ->  "abcabccdcdcdef"
```

## First instinct, and why it was wrong

Find the innermost `k[...]` with a regex, expand it, repeat until no brackets
are left. It actually works, and for a one-off script I would do exactly that.
But each pass rescans the whole string, so deeply nested input is quadratic in
the output - and the output can already be huge.

More to the point, this is a bracket problem, and since Day 016 the reflex is:
**a stack is for remembering what you were doing before you went in.**

## What I had to get straight

My first stack attempt pushed the wrong thing. I was pushing the string *inside*
the bracket, which is backwards - at the moment I see `[` the inside does not
exist yet. What I am about to lose is the string I had built up *outside*.

So the invariant is:

`cur` is the string belonging to the bracket depth I am currently at.
`strStack` holds the half-finished strings of every depth above me.

Which gives exactly three moves:

| char      | what it means                        | code                                        |
| --------- | ------------------------------------ | ------------------------------------------- |
| digit     | still reading the count              | `k = k * 10 + digit`                        |
| `[`       | going one level deeper               | push `k`, push `cur`, reset both            |
| `]`       | this level is done, it was one copy  | `cur = strStack.pop() + cur.repeat(countStack.pop())` |
| letter    | plain content at this level          | `cur += ch`                                 |

The `]` line is the whole problem in one statement, and the order matters:
outer first, then the repeated inner.

## Dry run

`"3[a2[c]]"`

| char | k | countStack | strStack | cur    | note                        |
| ---- | - | ---------- | -------- | ------ | --------------------------- |
| `3`  | 3 | `[]`       | `[]`     | `""`   |                             |
| `[`  | 0 | `[3]`      | `[""]`   | `""`   | saved the empty outside     |
| `a`  | 0 | `[3]`      | `[""]`   | `"a"`  |                             |
| `2`  | 2 | `[3]`      | `[""]`   | `"a"`  |                             |
| `[`  | 0 | `[3,2]`    | `["","a"]` | `""` | saved `"a"`                 |
| `c`  | 0 | `[3,2]`    | `["","a"]` | `"c"` |                            |
| `]`  | 0 | `[3]`      | `[""]`   | `"acc"` | `"a" + "c".repeat(2)`      |
| `]`  | 0 | `[]`       | `[]`     | `"accaccacc"` | `"" + "acc".repeat(3)` |

## The recursive version

Worth writing because it is shorter and shows what the two stacks really were:

```js
let i = 0;                    // shared cursor, declared OUTSIDE parse
function parse() { ... }      // reads up to the matching ']'
```

`i` has to live outside the function. My first go passed it as a parameter and
then the caller had no idea how many characters the child had eaten, so after
`2[c]` the outer loop re-read `c]` and produced garbage. The alternatives are
a shared mutable cursor or returning `[string, newIndex]` from every call -
same information, and the shared cursor reads better.

The other detail: `parse()` stops *on* the `]` rather than past it, so the
caller does the `i += 1`. Pick one convention and stick to it, otherwise you get
a cursor that is off by one at every depth.

## Edge cases I checked

- `"abcd"` with no brackets -> the stacks are never touched, `cur` is the answer
- `"10[a]"` -> the multi-digit accumulate, not `1` then `0`
- `"1[x]"` -> `repeat(1)` is a no-op but the push/pop still has to happen
- `"a2[b3[c]d]e"` -> letters before, between and after groups at every depth

## Complexity

- Time: `O(L)` where `L` is the length of the decoded output. Every character
  of the answer is written once. You cannot do better, you have to produce it.
- Space: `O(L)` for the result plus `O(depth)` for the stacks.

Strictly, `cur.repeat(k)` plus concatenation makes JS rebuild strings, so the
real constant is worse than it looks. An array of chunks joined at the end
would be tighter. For the given limits it does not matter.

## Pattern to remember

Entering a nested construct = push what you are about to lose. Leaving it =
pop and merge. The stack never holds the thing you are building, it holds the
thing you will come back to.

Day 016 was "does this bracket match". This is the same scan, except the stack
carries data instead of just a bracket type. Day 048's RPN stack was the same
idea again with operands.
