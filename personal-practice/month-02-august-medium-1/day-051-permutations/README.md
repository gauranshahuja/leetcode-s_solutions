# Day 051 - Permutations

LeetCode 46 · Medium · Backtracking with a used set · Friday, 21 August 2026 · ~30 min, 2 attempts

## Problem

All orderings of an array of distinct integers.

```
nums = [1,2,3]
->  [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]
```

Any order of the results. `n <= 6`, which is a hint in itself: `6! = 720`, and
the output *is* the work.

## Choose or not choose vs. choose an order

Third backtracking day and this is the distinction I want to write down,
because the two problems look identical in code and are not the same shape at
all.

| | Day 050, Subsets | Day 051, Permutations |
| --- | --- | --- |
| question at each depth | is `nums[i]` in or out? | which unused element goes next? |
| branching factor | 2, always | n, then n-1, then n-2, ... |
| depth of the tree | n | n |
| leaves | `2^n` | `n!` |
| base case | ran out of indices (`i === n`) | path is full (`path.length === n`) |
| what state is carried | the current index | which elements are still available |

Subsets walks the array once, left to right, and never looks back. Permutations
never advances an index at all: every level of the recursion considers *every*
element and skips the ones already used. That is why it needs the `used`
marker and subsets doesn't.

`2^3 = 8` and `3! = 6` for the same input, which is a reasonable quick check
that I have the right one.

## The approach

```
walk():
  if path.length === n: record a copy of path; return
  for i in 0..n-1:
    if used[i]: skip
    used[i] = true;  path.push(nums[i])
    walk()
    path.pop();      used[i] = false
```

`used` is indexed by **position**, not keyed by value. I started with
`const used = new Set()` holding values, which works for this problem since
the inputs are distinct, but it quietly collapses to half the answers when
two elements are equal. Indices are correct in both cases and cost nothing,
so that is what the file has.

## Dry run, [1,2,3]

Only following the first branch down, then the first backtrack:

| depth | path | used | choice |
| ----- | ---- | ---- | ------ |
| 0 | `[]` | `---` | take 1 |
| 1 | `[1]` | `X--` | take 2 |
| 2 | `[1,2]` | `XX-` | take 3 |
| 3 | `[1,2,3]` | `XXX` | full, record |
| 2 | `[1,2]` | `XX-` | undo 3, loop ends, return |
| 1 | `[1]` | `X--` | undo 2, take 3 |
| 2 | `[1,3]` | `X-X` | take 2 |
| 3 | `[1,3,2]` | `XXX` | full, record |

Then it unwinds all the way to depth 0, releases the 1, and does the same
again starting from 2 and from 3. Six leaves.

## The bug: the undo I forgot

Attempt 1 had only half the undo:

```js
used[i] = true;
path.push(nums[i]);
walk();
path.pop();
// used[i] = false;      <- missing
```

The symptom is sneaky. `permute([1,2,3])` returned `[[1,2,3]]`, exactly one
permutation. Once the first branch finished, every index was still marked
used, so every later iteration of every loop hit `continue` and nothing else
ever got built.

The `pop()` is the one everyone warns about, and it is genuinely easy to
leave off, but **anything** changed on the way down has to be changed back on
the way up. Here there are two pieces of state, so there are two undos. I am
going to write the push and the pop as a pair, and the flag set and unset as a
pair, in that nested order, every time:

```
set     ->  recurse  ->  unset
push    ->  recurse  ->  pop
```

The test that would have caught it immediately is "every result is a
rearrangement of the input", which I added afterwards. Counting `n!` catches
it too (1 instead of 6), and both are better than eyeballing a list of arrays.

## Complexity

- Time: `O(n! * n)`. There are `n!` leaves and each costs `O(n)` to copy out.
  The internal nodes add less than that, so the leaves dominate.
- Space: `O(n)` for `path`, `used` and the recursion depth. The output is
  `O(n! * n)` and is unavoidable.

## Alternative approach

Instead of a `used` array, swap `nums[i]` into position `depth` and recurse on
`depth + 1`, then swap back. No extra array, and the prefix of `nums` *is* the
path. It mutates the input though, and I find it much harder to read, so I am
keeping this version and noting the other one exists.

## Pattern to remember

Subsets = one binary decision per element, `2^n`. Permutations = pick an
ordering, `n!`, and that needs a record of what is still available. Both
are choose / recurse / un-choose, and the un-choose has to restore every
single thing the choose touched.
