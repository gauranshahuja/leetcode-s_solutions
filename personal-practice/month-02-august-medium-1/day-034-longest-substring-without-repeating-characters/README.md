# Day 034 - Longest Substring Without Repeating Characters

LeetCode 3 · Medium · Sliding window · Tuesday, 4 August 2026 · ~55 min, 4 attempts

First sliding window problem in this repo. Writing the notes out properly
because I want to be able to come back to this page, not re-derive it.

## Problem

Longest run of characters with no repeat inside it. Contiguous.

```
"abcabcbb" -> 3    ("abc")
"bbbbb"    -> 1    ("b")
"pwwkew"   -> 3    ("wke")   note: "pwke" is a subsequence, not a substring
```

## Where I started

Nested loops. For each start `i`, walk forward with a `Set` until I hit a
character already in it, record the length, move `i` up by one, build a fresh
`Set`, repeat.

It is correct. It is also `O(n^2)`, and the waste is obvious once you look at
it: when `i` moves from 0 to 1, almost all the characters it is about to scan
are ones `i = 0` already scanned. I threw away all that work and rebuilt the
`Set` for nothing.

## What a sliding window actually is

I had heard the phrase and sort of nodded at it. The thing that made it
concrete was writing down the **invariant** and refusing to break it:

`s[left .. right]` always contains no repeated character.

That is it. Two indices, `left` and `right`, and one promise about what sits
between them. Then the loop body is only ever answering one question: *`right`
just moved forward, is the promise still true, and if not what is the smallest
`left` that makes it true again?*

Note that **both pointers only move forward**. `right` advances once per
iteration. `left` only ever increases. So across the whole run each index is
touched at most twice, once by each pointer. That is why this is `O(n)` and not
`O(n^2)`, even though the code has the shape of two pointers chasing each other.

## Why jump `left` instead of shrinking one at a time

The common version uses a `Set` and shrinks:

```js
while (set.has(s[right])) {
  set.delete(s[left]);
  left += 1;
}
set.add(s[right]);
```

That is correct and still `O(n)` amortised. But think about what it is doing:
it removes characters one by one until the duplicate falls out. I already know
*exactly where* that duplicate is if I store indices instead of membership:

```js
const seenAt = lastIndex.get(ch);   // where did I last see this char?
left = seenAt + 1;                  // one assignment, no loop
```

If `s[right]` duplicates the character at index `seenAt`, then **no** valid
window can start at or before `seenAt`, because any such window would contain
both copies. So the smallest legal start is `seenAt + 1` and I can go straight
there. Same complexity, but one line instead of an inner loop, and no deletes.

## The bug that cost me three attempts

My first jump version was this:

```js
if (lastIndex.has(ch)) {
  left = lastIndex.get(ch) + 1;     // no guard
}
```

It passes `"abcabcbb"`, `"bbbbb"` and `"pwwkew"`. It fails `"tmmzuxt"`, which
returns 6 instead of 5.

The problem is **stale entries**. The map remembers every character I have ever
seen, including ones that have already fallen out of the window to the left of
`left`. Those entries are history, not current state. Assigning from one of
them can move `left` *backwards*, which instantly breaks the invariant.

Trace `"tmmzuxt"` with the broken version:

| right | ch | seenAt | left before | left after (buggy) | width |
| ----- | -- | ------ | ----------- | ------------------ | ----- |
| 0     | t  | -      | 0           | 0                  | 1     |
| 1     | m  | -      | 0           | 0                  | 2     |
| 2     | m  | 1      | 0           | 2                  | 1     |
| 3     | z  | -      | 2           | 2                  | 2     |
| 4     | u  | -      | 2           | 2                  | 3     |
| 5     | x  | -      | 2           | 2                  | 4     |
| 6     | t  | **0**  | 2           | **1** (!)          | 6     |

At `right = 6` it claims a window of `s[1..6]` = `"mmzuxt"`, which has two
`m`s in it. The `t` at index 0 was long gone.

Two ways to fix it, pick either:

```js
if (seenAt !== undefined && seenAt >= left) left = seenAt + 1;   // guard
left = Math.max(left, (seenAt ?? -1) + 1);                       // clamp
```

I went with the explicit guard because it says out loud what the condition
means: *only react to a duplicate that is still inside the window.* The
`Math.max` form is shorter but hides the reason.

## Correct dry run

`"tmmzuxt"`, guard in place:

| right | ch | seenAt | in window? | left | window     | best |
| ----- | -- | ------ | ---------- | ---- | ---------- | ---- |
| 0     | t  | -      | -          | 0    | `t`        | 1    |
| 1     | m  | -      | -          | 0    | `tm`       | 2    |
| 2     | m  | 1      | yes        | 2    | `m`        | 2    |
| 3     | z  | -      | -          | 2    | `mz`       | 2    |
| 4     | u  | -      | -          | 2    | `mzu`      | 3    |
| 5     | x  | -      | -          | 2    | `mzux`     | 4    |
| 6     | t  | 0      | no (0 < 2) | 2    | `mzuxt`    | 5 |

The other case worth tracing is `"dvdf"`: at `right = 2` the `d` at index 0 is
still in the window so `left` jumps to 1, then `"vdf"` gives 3. If I had reset
`left = right` or cleared the map on a duplicate I would have got 2.

## Complexity

| Version | Time     | Space                      |
| ------- | -------- | -------------------------- |
| brute   | `O(n^2)` | `O(min(n, alphabet))`      |
| window  | `O(n)`   | `O(min(n, alphabet))`      |

Space is bounded by the alphabet, not the string: the map holds at most one
entry per distinct character.

## Pattern to remember

Sliding window = one invariant about `s[left..right]` + both pointers only
moving forward. Write the invariant down first, then the loop body is just
"restore the invariant".

And the companion warning, which I expect to re-learn at least twice more:

A "last seen" map keeps entries that have already left the window. Always
check that what you found is still inside `[left, right]` before acting on it.
