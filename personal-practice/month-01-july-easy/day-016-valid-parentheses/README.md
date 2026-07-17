# Day 016 - Valid Parentheses

LeetCode 20 · Easy · Stack · Friday, 17 July 2026 · ~18 min, 2 attempts

## Problem

String made only of `()[]{}`. Valid if every bracket is closed by its own kind
and the nesting is proper.

```
"()"      -> true
"()[]{}"  -> true
"(]"      -> false
"([)]"    -> false
"{[]}"    -> true
""        -> true
```

## My first (wrong) idea

Count them. Three counters, one per bracket type, increment on open, decrement
on close, never let one go negative, all zero at the end.

```js
if (open.parens !== 0 || open.square !== 0 || open.curly !== 0) return false;
```

It handles `"(("` and `"]"` fine. Then `"([)]"`:

| char | parens | square |
| ---- | ------ | ------ |
| `(`  | 1      | 0      |
| `[`  | 1      | 1      |
| `)`  | 0      | 1      |
| `]`  | 0      | 0      |

All zero, so my counter version says `true`, and it is obviously false to any
human looking at `([)]`. Counting throws away the information I need, which is
not *how many* brackets are open but **in what order**.

## The insight

Read `{[()]}` the way a person does. When I hit a closer, I am not checking it
against all open brackets, only against **the most recent one**. Last opened,
first closed. That is literally the definition of a stack, and this was the
first time a data structure felt like it was named after the thing I was
already doing in my head.

So:

- opener -> push it
- closer -> pop, and the popped character must be its partner
- end -> the stack must be empty

In JS a plain array is a fine stack: `push` and `pop` both work on the end and
are `O(1)`. (`shift`/`unshift` work on the front and are `O(n)` because
everything gets re-indexed, which matters later but not here.)

## The map trick

My first version had a nest of `if`s comparing pairs. Cleaner as a lookup from
closer to its opener:

```js
const PARTNER = { ')': '(', ']': '[', '}': '{' };
```

Then the whole closer branch is one line, `stack.pop() !== PARTNER[ch]`.

And this quietly handles the "closer with nothing open" case for free: `pop()`
on an empty array returns `undefined`, and `undefined` is never equal to `(`,
`[` or `{`, so it returns false without me writing a length check. I did write
the explicit `if (stack.length === 0) return false;` first and then deleted it
once I convinced myself `undefined` could not collide with a real opener.

## Walking through the example

`"{[]}"`

| char | action | stack after |
| ---- | ------ | ----------- |
| `{`  | push   | `{`         |
| `[`  | push   | `{ [`       |
| `]`  | pop `[`, partner of `]` | `{` |
| `}`  | pop `{`, partner of `}` | empty |

Stack empty at the end, so `true`.

Now `"([)]"`:

| char | action | stack after |
| ---- | ------ | ----------- |
| `(`  | push   | `(`         |
| `[`  | push   | `( [`       |
| `)`  | pop `[`, but `)` wants `(` | **false** |

Caught at the third character, which is the thing counting could not do.

## Edge case that bit me

`""` returns `true`. I had assumed empty would be a weird case needing a
guard, but the loop just does not run and `stack.length === 0` is already true.
Also tested the two lopsided shapes separately, since they fail in different
places: `"((("` fails at the final length check, `"]"` fails inside the loop.

The other thing I nearly got wrong was returning `true` at the end of the loop
instead of `stack.length === 0`. That passes every test with a failure in it
and quietly accepts `"((("`.

## Complexity

- Time `O(n)`, each character pushed or popped at most once.
- Space `O(n)`, a string of all openers sits on the stack.

## Pattern to remember

When the correctness of the thing I am reading depends on matching
something to the most recent unmatched thing, that is a stack.

Nesting, undo history, and "the last one still waiting" all sound like the
same shape. First time this month that the data structure was the answer
rather than the loop.
