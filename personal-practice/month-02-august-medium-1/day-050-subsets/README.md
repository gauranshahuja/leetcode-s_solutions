# Day 050 - Subsets

LeetCode 78 · Medium · Backtracking, include/exclude · Thursday, 20 August 2026 · ~35 min, 2 attempts

Day 50. Halfway through a hundred, and the second backtracking problem in two
days, which was the plan.

## Problem

Return the power set of an array of **distinct** integers.

```
nums = [1,2,3]
->  [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]
```

Any order, both of the subsets and inside them. `1 <= n <= 10`, so `2^n` is at
most 1024 and the size of the output is not a problem.

## Two ways in

**Bitmasks.** There are `2^n` subsets and `2^n` integers below `2^n`, and that
is not a coincidence: bit `i` of the counter means "nums[i] is in". So one
loop from 0 to `2^n - 1`, one inner loop to read the bits, done. No recursion.
This was my first version and it is in the file as `subsetsBitmask`.

`[1,2,3]`:

| mask | bits | subset |
| ---- | ---- | ------ |
| 0 | 000 | `[]` |
| 1 | 001 | `[1]` |
| 2 | 010 | `[2]` |
| 3 | 011 | `[1,2]` |
| 4 | 100 | `[3]` |
| 5 | 101 | `[1,3]` |
| 6 | 110 | `[2,3]` |
| 7 | 111 | `[1,2,3]` |

Clean, but it has a JS-shaped landmine: `<<` is a **32-bit signed** shift, so
`1 << 31` is `-2147483648` and `1 << 32` is `1`. For `n` past 30 the loop
bound is nonsense. Constraints here say `n <= 10` so it is safe, but I do not
want the habit, and the bitmask form also does not extend to the variants
where a subset has to satisfy a rule.

**Backtracking**, which is what I kept as the main answer.

## The include/exclude decision

At index `i`, one question: is `nums[i]` in this subset?

```
walk(i):
  if i === n: record a copy of path
  else:
    path.push(nums[i]);  walk(i+1);  path.pop()    // include
    walk(i+1)                                      // exclude
```

The recursion tree is a perfect binary tree of depth `n`, so `2^n` leaves,
each a distinct subset. Unlike Day 049 there is nothing to prune: both moves
are always legal, and the recursion ends because it runs out of elements
rather than because a guard refuses. So this is backtracking used for pure
enumeration, which made it a good second problem - the skeleton is the same
and only the rules changed.

Note the asymmetry in the code: the include branch needs the `pop()` and the
exclude branch needs nothing, because excluding is not a change to `path`.

## Dry run, [1,2]

```
walk(0) path=[]
  include 1 -> path=[1]
    walk(1)
      include 2 -> path=[1,2]  -> walk(2) records [1,2]
      pop       -> path=[1]
      exclude 2 -> walk(2) records [1]
  pop          -> path=[]
  exclude 1 -> walk(1)
      include 2 -> path=[2]    -> walk(2) records [2]
      pop       -> path=[]
      exclude 2 -> walk(2) records []
```

`[[1,2],[1],[2],[]]`. All four, in the order the tree happens to produce
them.

## The bug

```js
if (i === nums.length) {
  out.push(path);     // wrong
  return;
}
```

`path` is **one array** that lives for the whole recursion. Pushing it stores
a reference, so all 8 entries in `out` are the same object, and since `path`
is empty again by the time `walk(0)` returns, the answer came back as eight
empty arrays. Reproduced exactly, which at least made it easy to diagnose.

`out.push([...path])` fixes it. This is the same shallow-reference lesson as
Day 042, where `[...matrix]` only copied row pointers. Spreading copies one
level, and one level is sometimes enough and sometimes not: here `path` holds
numbers, so one level is enough.

## Complexity

| | Time | Space (excl. output) |
| --- | --- | --- |
| Bitmask | `O(2^n * n)` | `O(1)` |
| Backtracking | `O(2^n * n)` | `O(n)` |

`2^n` subsets and `O(n)` to materialise each one. The output itself is
`O(2^n * n)` either way, and nothing can beat that since it is the answer.

## Takeaway

"Choose or don't choose, for each element" is a binary tree of depth n.
`2^n` leaves, which is the right count for subsets.

For tomorrow: permutations are not this. There the question is not *whether*
to take an element but *in what order*, so the tree branches `n` ways at the
top instead of 2, and the count is `n!` rather than `2^n`.

Also noting `subsets([])` is `[[]]` and not `[]`. The empty array has exactly
one subset. Got that right first time, which pleased me more than it should.
