# Day 010 - Majority Element

LeetCode 169 · Easy · Boyer-Moore voting · Saturday, 11 July 2026 · ~26 min (had the Map answer in 5, spent the rest on the O(1) follow-up and ended up reading about it), 2 attempts

## Problem

Return the element that appears **more than** `n / 2` times. The problem
states that this element always exists.

```
[3, 2, 3]              ->  3    appears 2 of 3 times
[2, 2, 1, 1, 1, 2, 2]  ->  2    appears 4 of 7 times
```

## Where I started

Count every value into a `Map`, tracking the running best as I go so there is
no second pass over the entries. `O(n)` time, `O(n)` space, done in five
minutes. Kept in the file as
`majorityElementCount`. The follow-up on the problem page asks for `O(1)`
space though, and I could not see how you could possibly do it with one
variable, so I went and read about the voting algorithm.

## The voting algorithm

Two variables: a `candidate` and a `count`.

```
for each n:
    if count === 0 -> candidate = n
    count += (n === candidate) ? 1 : -1
return candidate
```

That is the entire thing, and my first reaction was that it looked like it
could not possibly be correct.

The way it finally made sense: think of it as elements **cancelling each
other out**. Every `-1` is one vote for the current candidate being destroyed
by one vote against it, which removes a matched pair from consideration. Pair
off a majority element against a non-majority element, over and over.

A strict majority owns more than half the elements. There are fewer than half
left for everything else combined. So the pairing has to run out of
non-majority elements first, and at least one copy of the majority element is
left standing with nothing to cancel it. Whoever is standing at the end is
the candidate.

`count` is not a real occurrence count, which is where I kept going wrong
while tracing it. It is only how many unpaired copies of the current
candidate are left over right now.

## Why the guarantee matters

This is the part worth writing down, because the algorithm is not a general
"most frequent element" solver. It is only valid **because the problem
promises a strict majority exists.**

```
[1, 2, 3]  ->  returns 3
```

No element appears more than once, so there is no majority, and the function
still returns a confident answer: the last element, because every earlier
candidate gets cancelled and the final one has nothing after it. Garbage in,
garbage out, with no error.

Equally bad is `n / 2` exactly rather than more than:

```
[1, 1, 2, 2]  ->  returns 1
[2, 2, 1, 1]  ->  returns 2
```

Same multiset, two different answers, decided purely by the order. A tie is
not a majority, so the cancelling argument breaks: with exactly half each the
pairing finishes with nothing left over, and the leftover candidate is
whatever the last cancellation happened to leave sitting in the variable.

If I ever need this without the guarantee, the fix is a second pass counting
the candidate's real occurrences and checking it against `n / 2`. One extra
loop, still `O(1)` space.

## Dry run

`nums = [2, 2, 1, 1, 1, 2, 2]`

| n | count before | candidate before | vote | count after | candidate after |
| - | ------------ | ---------------- | ---- | ----------- | --------------- |
| 2 | 0            | -                | new candidate | 1 | 2        |
| 2 | 1            | 2                | +1   | 2           | 2               |
| 1 | 2            | 2                | -1   | 1           | 2               |
| 1 | 1            | 2                | -1   | 0           | 2               |
| 1 | 0            | 2                | new candidate | 1 | 1        |
| 2 | 1            | 1                | -1   | 0           | 1               |
| 2 | 0            | 1                | new candidate | 1 | **2** |

The candidate is wrong twice during the walk, including one point where it is
`1`, which is the minority value. That did not stop bothering me until I
accepted that only the final state is claimed to mean anything.

## Complexity

| Version | Time   | Space  |
| ------- | ------ | ------ |
| Map     | `O(n)` | `O(n)` |
| Voting  | `O(n)` | `O(1)` |

There is also a sort-and-take-the-middle version. If one value owns more than
half the slots then it must cover the midpoint once sorted, so:

```js
nums.sort((a, b) => a - b);
return nums[Math.floor(nums.length / 2)];
```

`O(n log n)` time, `O(1)` space, one line of real logic. Slower, but the
shortest of the three. The comparator is not optional: `sort()` with no
argument compares stringified values, so it would put `10` before `9`.

## Takeaway

A guarantee in the problem statement is not decoration. The majority
promise is load-bearing here, and the algorithm silently returns nonsense
without it.

First time I have met a correct algorithm that returns nonsense on inputs
outside its stated contract. New habit: ask what each constraint is buying.
