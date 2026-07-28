# Day 027 - Intersection of Two Arrays II

LeetCode 350 · Easy · Hash map counting · Tuesday, 28 July 2026 · ~16 min, 2 attempts

## Problem

Return the values both arrays contain, **keeping duplicates**. If a value
appears twice in one and three times in the other, it appears twice in the
answer. Output order is free.

```
[1,2,2,1] and [2,2]        -> [2,2]
[4,9,5]   and [9,4,9,8,4]  -> [4,9]   (or [9,4], either is accepted)
```

## The trap is in the title

My first version was a Set, because that is what "intersection" means in my
head:

```js
// wrong for the "II" version
const a = new Set(nums1);
return nums2.filter((n) => a.has(n));
```

`intersect([1,2,2,1], [2,2])` gives `[2,2]` here, which fooled me for a
second. But `intersect([2,2], [1,2,2,1])` gives `[2,2]` as well, and so does
`intersect([2], [2,2,2])` -> `[2,2,2]`, which is wrong: there is only one 2
available in the first array, so only one 2 can be in the answer.

A Set stores *whether*. This problem asks *how many*. That is the difference
between this and Day 003, where I only had to know if a value showed up again
and a Set was exactly the right size of memory.

## The approach that works

Replace the Set with a Map of `value -> copies still unmatched`:

1. count every value of the first array into the map
2. walk the second array; if the value has a remaining count, push it to the
   answer and **decrement** the count
3. a count of 0 means that value is used up, so later copies do not match

This is the same Map-of-counts I used for Valid Anagram on Day 004, except the
counts get spent across two arrays instead of compared at the end.

Step 2's decrement is the entire fix. Without it the count is never spent and
I am back to Set behaviour with extra steps.

Which array to count? The shorter one, so the map stays small. Since the
output order is free I can just swap the arguments and recurse once:

```js
if (nums1.length > nums2.length) return intersect(nums2, nums1);
```

That also answers the follow-up in the problem about one array being much
bigger than the other.

## Dry run

`nums1 = [4,9,5]`, `nums2 = [9,4,9,8,4]` (nums1 is shorter, so no swap)

map after counting: `{4:1, 9:1, 5:1}`

| n | remaining | match? | out       | map after     |
| - | --------- | ------ | --------- | ------------- |
| 9 | 1         | yes    | `[9]`     | `{4:1,9:0,5:1}` |
| 4 | 1         | yes    | `[9,4]`   | `{4:0,9:0,5:1}` |
| 9 | 0         | no     | `[9,4]`   | unchanged     |
| 8 | 0         | no     | `[9,4]`   | unchanged     |
| 4 | 0         | no     | `[9,4]`   | unchanged  |

Output `[9,4]`, which is why those tests pass `{ unordered: true }`.

## Small thing I nearly got wrong

`remaining.get(n)` returns `undefined` for a value that was never in `nums1`,
and `undefined > 0` is `false`, so it would have worked by accident. I still
wrote `remaining.get(n) || 0` because `undefined - 1` is `NaN` and I did not
want a `NaN` sitting in the map if I ever reordered those lines.

Also kept to `Map` rather than a plain object: object keys get coerced to
strings, so `0` and `"0"` would collide, and `-0` would become `"0"`. With
numeric input it would not bite today, but `Map` keeps number keys as numbers
and there is no reason to use the weaker tool.

## Complexity

- Time `O(n + m)`: one pass to count, one pass to match.
- Space `O(min(n, m))` for the map, plus the output.

## Alternative approaches

- **Sort both, then two pointers.** `O(n log n + m log m)` time but `O(1)`
  extra space, and it is the better answer if the inputs are already sorted or
  are too big to fit in memory, which is the other follow-up the problem asks
  about. Remember to sort with `(a, b) => a - b`, because the default
  comparator sorts lexicographically and would put `10` before `9`.
- Counting sort style array instead of a Map, if the value range were small
  and known.

## Pattern to remember

Set for presence, Map-of-counts for multiplicity. If the expected answer can
contain the same value twice, a Set is already the wrong data structure.

Fourth week and the pattern repeats again: the hash map is the same tool as
Day 001, only what I store in it changes (an index there, a count here).
