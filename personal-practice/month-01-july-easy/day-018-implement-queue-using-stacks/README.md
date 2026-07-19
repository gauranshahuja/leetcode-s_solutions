# Day 018 - Implement Queue using Stacks

LeetCode 232 · Easy · Queue design, amortised cost · Sunday, 19 July 2026 · ~28 min, 3 attempts

## Problem

Build a FIFO queue out of stacks. Allowed operations on the underlying
storage: push to the end, pop from the end, peek at the end, check if it is
empty. Nothing else, so no indexing into the middle and no `shift`.

```
push(1); push(2);
peek()  -> 1     (oldest)
pop()   -> 1
empty() -> false
```

A stack gives back the **newest** thing. A queue needs the **oldest**. So the
order has to get flipped somewhere, and the question is where.

## First instinct, and why it was wrong

Keep one stack. On `pop`, pour everything into a temporary stack, take the
bottom element (now on top), pour it all back.

That is correct, and it is `O(n)` per pop, every single pop. 100 pops on 100
elements is 20,000 moves. I wrote it, then noticed the problem says each
operation should be amortised `O(1)`, which meant the pouring could not happen
on every call.

Second idea, which was worse: pour across on every **push** instead, so the
oldest is always on top of the second stack. Also `O(n)` per operation, just
moved to the other side.

## The insight

Keep **both** stacks permanently and give them jobs:

- `inStack` - where new elements arrive
- `outStack` - where elements are served from, already in the right order

Pouring `inStack` into `outStack` reverses it, so the oldest arrival ends up on
top of `outStack`. The trick is that this pour happens **only when `outStack`
has run dry**:

```js
#refill() {
  if (this.outStack.length > 0) return;      // the load bearing line
  while (this.inStack.length > 0) this.outStack.push(this.inStack.pop());
}
```

Then `pop` is `refill(); return outStack.pop();` and `peek` is the same with a
look instead of a pop. `empty` is both stacks being empty, which is a thing I
got wrong on attempt 1 by only checking `outStack`.

## The bug

My refill had no guard at first, so it poured on every pop. Interleaving a
push with pops breaks it immediately:

```
push(1) push(2) push(3)
pop() -> 1                   out = [3,2] after the pour, 1 served
push(4)                      in = [4]
pop() -> 4    WRONG, should be 2
```

Because the second pour tipped `4` on top of the leftover `3,2`, so the newest
element ended up in front of two older ones. Guarding on `outStack` being
empty means elements already waiting in `outStack` are always served before
anything new is allowed across, and that is precisely FIFO. The interleaved
sequence is in the tests now because it is the only case that catches this.

## Why amortised O(1) is honest here

A single `pop` can genuinely cost `O(n)`, so this needs an actual argument,
not hand waving.

Follow one element through its whole life:

1. pushed onto `inStack` - one move
2. popped off `inStack` during a pour - one move
3. pushed onto `outStack` during that same pour - one move
4. popped off `outStack` when it is served - one move

Four constant-time touches, and that is the maximum. The reason it cannot be
more: an element **can never be poured twice**, because the pour only goes one
direction and once something is in `outStack` it never goes back. So `n`
operations do at most `4n` moves of work in total, which is `O(1)` per
operation averaged over the sequence.

That is what "amortised" means and I had been reading it as "usually fast,
probably". It is not probabilistic. It is a budget: the expensive pour is paid
for by the cheap pushes that filled `inStack` up, and each of those pushes
pre-paid its own element's eventual move. The self check counts the moves and
asserts they never exceed the number of pushes.

| operation | worst single call | amortised |
| --------- | ----------------- | --------- |
| push      | `O(1)`            | `O(1)`    |
| pop       | `O(n)`            | `O(1)`    |
| peek      | `O(n)`            | `O(1)`    |
| empty     | `O(1)`            | `O(1)`    |

Space `O(n)`, every element is in exactly one of the two stacks.

## JS note

The slow comparison queue in my tests uses `shift()`, which is the obvious way
to take the front of a JS array and is `O(n)` because every remaining element
gets re-indexed. Fine for a 50 element cross-check, wrong in real code. The
usual fix when a plain array is being used as a queue is to keep a head index
and move it forward instead of calling `shift`. Worth remembering for BFS,
where the queue gets hit constantly.

## Note to self

Two stacks, one for arrivals and one for departures, flip order for free.
Only pour when the departure side is empty.

The pattern of "do expensive work rarely and prove the average is fine" is new
to me and feels like it will come back for dynamic arrays and hash table
resizing.
