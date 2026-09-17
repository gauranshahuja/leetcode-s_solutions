# Day 078 - Asteroid Collision

LeetCode 735 · Medium · Stack simulation · Thursday, 17 September 2026 · ~35 min, 3 attempts

## Problem

A row of asteroids, same speed. Sign is direction (`+` right, `-` left), size
is the absolute value. Smaller one explodes in a collision, both explode on a
tie. Return the row once nothing can collide any more.

```
[5, 10, -5]      -> [5, 10]      -5 hits 10 and loses
[8, -8]          -> []           tie, both gone
[10, 2, -5]      -> [10]         -5 eats 2, then loses to 10
[-2, -1, 1, 2]   -> [-2, -1, 1, 2]   nothing ever meets
```

## The only collision that exists

I spent the first five minutes drawing arrows before spotting the rule:
**a collision happens only when a right-mover is to the left of a left-mover.**
`+ +` and `- -` move in the same direction, `- +` move apart, so `+ -` is the
only pair that ever meets.

That means a surviving row always looks like "some left-movers, then some
right-movers", and the only decision to make is what happens when a negative
arrives on top of a pile of positives. Which is a stack.

## Three outcomes, not two

This is where my first two attempts died. An incoming left-mover of size `s`
fights the top of the stack, and there are **three** ways the fight can end:

| comparison   | who dies            | what happens next            |
| ------------ | ------------------- | ---------------------------- |
| `top > s`    | the newcomer        | move to the next input       |
| `top < s`    | the top             | pop, and fight again         |
| `top === s`  | **both**            | pop, and move to next input  |

Only one of those three continues the loop. The other two abandon the current
input entirely, so the inner loop needs a way out that skips the final push.

### Attempt 1, the wrong one

I folded the tie into the "top loses" case:

```js
while (stack.length && stack.at(-1) > 0 && stack.at(-1) <= -a) stack.pop();
if (!stack.length || stack.at(-1) < 0) stack.push(a);
```

Those two lines contradict each other on a tie: the `<=` pops the equal-size
right-mover (correct, it exploded) and then the push puts the left-mover back
in the row (wrong, it exploded too).

```
asteroidCollisionWrong([8, -8])  ->  [-8]            should be []
asteroidCollisionWrong([-2, 2, 1, -2]) -> [-2, -2]   should be [-2]
```

Kept in the file as `asteroidCollisionWrong`, with a test pinning the wrong
output, because the mistake is not a typo - it's what happens when three cases
get squashed into one boolean.

### Attempt 3, the structure that works

```js
outer: for (const a of asteroids) {
  if (a > 0) { stack.push(a); continue; }

  const size = -a;
  while (stack.length && stack[stack.length - 1] > 0) {
    const top = stack[stack.length - 1];
    if (top > size) continue outer;      // newcomer dies
    stack.pop();
    if (top === size) continue outer;    // both died
  }
  stack.push(a);                          // survived every fight
}
```

The labelled `continue outer` is what lets the push sit plainly at the end of
the loop body: reaching it *means* "this asteroid beat everything in front of
it". First time I've had a real use for a label in JS.

The flag version is the same thing, and maybe easier to read:

```js
let alive = true;
while (alive && stack.length && stack[stack.length - 1] > 0) {
  const top = stack[stack.length - 1];
  if (top >= size) alive = false;        // it dies either way
  if (top <= size) stack.pop();          // and the top dies if it isn't bigger
}
if (alive) stack.push(a);
```

Note how the tie falls out of that one for free: `>=` and `<=` are *both* true
when they are equal, so both die. That is the cleaner statement of the rule and
I wish I'd seen it first.

## Dry run

`[-2, 2, 1, -2]`

| input | stack before | what happens                                  | stack after |
| ----- | ------------ | --------------------------------------------- | ----------- |
| -2    | `[]`         | nothing right-moving to fight, push           | `[-2]`      |
| 2     | `[-2]`       | right-mover, always push                      | `[-2, 2]`   |
| 1     | `[-2, 2]`    | right-mover, always push                      | `[-2, 2, 1]`|
| -2    | `[-2, 2, 1]` | top 1 < 2 -> pop. top 2 === 2 -> pop, both die | `[-2]`      |

Final `[-2]`. The leading `-2` is never touched: it moves left forever with
nothing to its left.

## Edge case that bit me

`[1, -2, -2, -2]` -> `[-2, -2, -2]`. The second and third `-2` get pushed
without any fight, because the thing on top of the stack is already moving
left. The `stack[stack.length - 1] > 0` in my loop condition handles that; the
version where I checked only `stack.length` popped left-movers too and returned
`[-2]`.

## Complexity

- Time: `O(n)`. Each asteroid is pushed at most once and popped at most once,
  so the inner loop's total work is bounded by `n`. Looks quadratic, isn't -
  same amortised argument as Day 047.
- Space: `O(n)`, and the stack *is* the answer.

## Note to self

When a simulation has three outcomes, write three branches. Clever `<=`
tricks that merge "I die" with "you die" are where the tie case gets lost.

The stack was the easy part by now - same shape as Day 047, the content is just
a fight instead of a comparison.
