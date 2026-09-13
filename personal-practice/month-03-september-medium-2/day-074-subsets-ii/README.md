# Day 074 - Subsets II

LeetCode 90 · Medium · Backtracking with duplicate skipping · Sunday, 13 September 2026 · ~40 min, 3 attempts

## Problem

Power set of an array that can contain duplicates, with no duplicate subsets in
the output.

```
nums = [1,2,2]  ->  [], [1], [2], [1,2], [2,2], [1,2,2]      6, not 8
nums = [1,1,1]  ->  [], [1], [1,1], [1,1,1]                  4, not 8
nums = []       ->  [[]]
```

Plain subsets (Day 049) gives `2^n` of them. Here two of those `2^n` paths pick
"the first 2" and "the second 2" and produce the same subset, so the count
collapses to `product(count_i + 1)` over the distinct values - for `[1,2,2]`
that is `2 * 3 = 6`.

## My first idea: generate everything, dedupe with a Set

Sort the array, run the ordinary power-set backtracking, and keep a
`Set` of `JSON.stringify(path)` to filter repeats:

```js
const key = JSON.stringify(path);
if (!seen.has(key)) { seen.add(key); out.push(path.slice()); }
```

It gives the right answer and I kept it in the file as `subsetsWithDupSet`, but
it is a workaround, not a solution:

- it still explores all `2^n` paths and throws away the repeats afterwards. On
  16 identical numbers that is 65536 nodes to produce 17 subsets.
- it pays a `JSON.stringify` on every node, so the constant is bad too.
- it only works *because* I sorted. Without the sort, `[2,1]` and `[1,2]` are
  different strings and both survive, so the sort is doing the real work and
  the Set is just mopping up.

A dedupe-at-the-end approach always has that smell: the cost is driven by the
number of paths, not by the number of answers.

## What finally clicked

If the array is sorted, the duplicates sit next to each other, and I can refuse
to start the same branch twice:

```js
for (let i = start; i < arr.length; i += 1) {
  if (i > start && arr[i] === arr[i - 1]) continue;
  ...
}
```

The subset that would have been produced by picking the *second* 2 first is
byte-for-byte the subset already produced by picking the *first* 2 first. So
skip it before recursing. No Set, no stringify, and whole subtrees never get
built.

## Why `i > start` and not `i > 0`

This is the part I got wrong on attempt 2, and it is worth writing down
properly.

`start` is the smallest index this recursion level may choose. Two different
things can make `arr[i] === arr[i - 1]`:

- **`i > start`** - the equal value was tried *earlier in this same loop*, as a
  sibling branch. That branch already covered every subset that contains one
  copy of the value at this position. Repeating it is pure duplication, so skip.
- **`i === start`** - the equal value at `i - 1` was not a sibling, it was taken
  by an **ancestor** call. That is exactly the situation where I *want* to take
  the value again, because that is how `[2,2]` gets built at all.

With `i > 0` I wrote off the second case too, and lost every subset containing
a repeated element:

```js
if (i > 0 && arr[i] === arr[i - 1]) continue;   // wrong
// subsetsWithDup([1,2,2]) -> [[], [1], [1,2], [2]]
// [2,2] and [1,2,2] are gone
```

Which makes sense in hindsight: `i > 0` says "never pick a value equal to its
left neighbour", full stop. The condition I need is weaker - "never pick it
twice *at the same depth*".

## Dry run

`nums = [1,2,2]` (already sorted). `start` is the loop floor for that level.

| call        | path at entry | records | loop                                        |
| ----------- | ------------- | ------- | ------------------------------------------- |
| `walk(0)`   | `[]`          | `[]`    | i=0 take 1; i=1 take 2; i=2 **skip** (i>0=start, arr[2]==arr[1]) |
| `walk(1)` under [1] | `[1]` | `[1]` | i=1 take 2; i=2 **skip** (i>1=start)        |
| `walk(2)` under [1,2] | `[1,2]` | `[1,2]` | i=2 take 2 (i===start, allowed)       |
| `walk(3)` under [1,2,2] | `[1,2,2]` | `[1,2,2]` | loop does not run           |
| `walk(2)` under [2] | `[2]` | `[2]`  | i=2 take 2 (i===start, allowed)             |
| `walk(3)` under [2,2] | `[2,2]` | `[2,2]` | -                               |

6 records, 6 subsets. Note the two skips: one at the top level and one under
`[1]`. Those are precisely the two paths that the Set version would have
generated and then thrown away.

## Complexity

| Version          | Time                 | Space                      |
| ---------------- | -------------------- | -------------------------- |
| Set of JSON keys | `O(2^n * n)` always  | `O(2^n * n)` for the keys  |
| Skip siblings    | `O(answers * n)`     | `O(n)` + output            |

The sort is `O(n log n)` and gets lost in the noise. The second row is the
point: the work is proportional to the size of the answer, which is what I want
from a generation problem.

## Note to self

Sort, then "skip a value equal to the previous one *at the same level*" is
the standard duplicate-killer for backtracking. The condition is
`i > start`, because `i === start` is the legitimate repeat.

Same condition will show up in Combination Sum II and in Permutations II (where
the "same level" idea needs a used[] array instead, since permutations do not
have a left-to-right floor).
