# Day 017 - Min Stack

LeetCode 155 · Easy · Stack design · Saturday, 18 July 2026 · ~25 min, 2 attempts

## Problem

Build a stack with `push`, `pop`, `top` and `getMin`, all in `O(1)`.

```
push(-2); push(0); push(-3);
getMin()  -> -3
pop()         (removes -3)
top()     -> 0
getMin()  -> -2
```

First "design a thing" problem rather than "write a function", and the shape
of the question is different: nothing is hard except the one operation they
added on purpose.

## Where I started

```js
getMin() {
  return Math.min(...this.stack);
}
```

Correct, and I nearly left it. It is also the thing the problem is built to
reject:

- Scanning the stack is `O(n)` per call. A thousand `getMin` calls on a
  thousand-element stack is a million comparisons, so a realistic call
  sequence is `O(n^2)` overall instead of `O(n)`.
- JS-specific extra reason: `Math.min(...arr)` spreads the array into
  arguments, and that throws a stack overflow somewhere around a hundred
  thousand elements. Even the slow version does not scale.

So the minimum has to be **known**, not found.

## The dead end

My next thought was to keep a single `this.min` field, updated on push. That
part is easy. Then I tried to handle pop:

```js
pop() {
  const v = this.stack.pop();
  if (v === this.min) this.min = /* ...what? */;
}
```

There is nothing to put there. Once the smallest value is gone, the
second-smallest is somewhere arbitrary in the stack and the only way to find
it is a scan, which puts me right back at `O(n)`. One number cannot remember
history.

## What finally clicked

The minimum is not one fact about the stack, it is one fact **per entry**:

`getMin` only ever looks at the top. And the set of elements at or below a
given entry never changes for as long as that entry exists. So the minimum
of that prefix can be computed once, when the entry is pushed, and stored
next to it.

Each entry becomes a pair `[value, minSoFar]`:

```js
push(val) {
  const prevMin = empty ? val : topEntry[1];
  this.entries.push([val, Math.min(val, prevMin)]);
}
```

`getMin()` is then `topEntry[1]`, a single array read. And `pop` needs **no
repair at all**, which is the part that felt like getting away with something:
throwing away the top entry throws away its cached minimum too, and whatever
entry is now on top is still carrying the right answer for its own prefix.

(The alternative is a second parallel stack of minimums, pushed only when the
new value ties or beats the current one. Same idea, same complexity, fewer
numbers stored but more conditions to get wrong. I went with pairs.)

## Walking through the example

| call       | entries (value, min) bottom to top | result |
| ---------- | ---------------------------------- | ------ |
| `push(-2)` | `(-2,-2)`                          |        |
| `push(0)`  | `(-2,-2) (0,-2)`                   |        |
| `push(-3)` | `(-2,-2) (0,-2) (-3,-3)`           |        |
| `getMin()` | unchanged                          | `-3`   |
| `pop()`    | `(-2,-2) (0,-2)`                   | `-3`   |
| `top()`    | unchanged                          | `0`    |
| `getMin()` | unchanged                          | `-2` |

The `-2` was never recomputed. It was sitting in the entry under the one I
removed, from the moment it was pushed.

## Edge case that bit me

Duplicated minimums. `push(2); push(1); push(1); pop();` - there is still a
`1` in the stack, so `getMin` must still say `1`. The pair version needs no
thought here, the remaining `1` carries its own cached `1`. But it is exactly
where the "second stack, push only when strictly smaller" variant breaks: use
`<` instead of `<=` and that pop removes the only recorded `1` while a real
`1` is still in the data. I wrote the test before the variant for once.

Also made `top`, `pop` and `getMin` on an empty stack return `undefined`
instead of throwing on `entries[-1]`.

## Complexity

| operation | time   |
| --------- | ------ |
| push      | `O(1)` |
| pop       | `O(1)` |
| top       | `O(1)` |
| getMin    | `O(1)` |

Space `O(n)`, two numbers per entry rather than one. Paying constant extra
memory per element to delete a scan, same trade as the hash map on Day 001.

## Takeaway

If an operation has to be `O(1)` but the answer changes over time, store
the answer alongside the data at the moment it is cheap to know.

Also, design problems need tests that are a *sequence*, not single calls. Half
the interesting behaviour only shows up in push-push-pop-getMin order, so the
self check drives it like a real caller.
