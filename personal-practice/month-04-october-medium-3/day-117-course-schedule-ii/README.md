# Day 117 - Course Schedule II

LeetCode 210 · Medium · Topological ordering · Monday, 26 October 2026 · ~25 min for the solution, another 20 writing a real test, 1 attempt

## Problem

`prerequisites[i] = [a, b]` means **b before a**. Return any valid order to
take all `numCourses` courses, or `[]` if there is no such order.

```
numCourses = 2, prerequisites = [[1,0]]
  -> [0,1]

numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
  -> [0,1,2,3]  or  [0,2,1,3]      both correct

numCourses = 2, prerequisites = [[1,0],[0,1]]
  -> []                            cycle
```

## This is Day 058 with the order kept

Day 058 (Course Schedule) was the same graph with a boolean answer: "is there a
cycle?". I solved it with Kahn's algorithm and counted how many courses came
out of the queue. The count was the answer, and I threw the courses away.

Today I just push them into an array instead of counting them, and the cycle
test becomes

```js
return order.length === numCourses ? order : [];
```

That is the whole diff. A course inside a cycle never reaches indegree 0, so it
never enters the queue, so the order comes back short. Nothing extra to detect.

Edge direction still needs care: `[a, b]` is "b before a", so the edge runs
`pre -> course`, and the indegree I count is on `course`. I wrote
`adj[pre].push(course)` deliberately slowly, because reversing that gives an
order that is exactly backwards and still passes a length check.

## Kahn's, in four lines of English

1. count prerequisites per course (indegree)
2. queue every course with indegree 0
3. pop one, append it to the order, and decrement each dependent's indegree
4. anything that hits 0 joins the queue

## Dry run

`numCourses = 4`, `prerequisites = [[1,0],[2,0],[3,1],[3,2]]`

```
indegree: 0 -> 0,  1 -> 1,  2 -> 1,  3 -> 2
adj:      0 -> [1,2],  1 -> [3],  2 -> [3]
```

| step | queue (head marked) | taken | indegree after | order |
| ---- | ------------------- | ----- | -------------- | ----- |
| init | `[0]`               | -     | `0,1,1,2`      | `[]` |
| 1    | `[*0]`              | 0     | `-,0,0,2`      | `[0]` |
| 2    | `[0,*1,2]`          | 1     | `-,-,0,1`      | `[0,1]` |
| 3    | `[0,1,*2]`          | 2     | `-,-,-,0`      | `[0,1,2]` |
| 4    | `[0,1,2,*3]`        | 3     | -              | `[0,1,2,3]` |

Length 4 of 4, so no cycle.

## Why `{ unordered: true }` is wrong here

My first thought for the tests was to pass `{ unordered: true }` to `test` and
be done with it. That is wrong, and in a way worth writing down: `unordered`
sorts both sides before comparing, so it would accept **any permutation** of
`[0,1,2,3]`, including `[3,2,1,0]`. It would turn "is this a valid schedule"
into "does it contain all four courses", and the one property that actually
matters would stop being checked.

The output here is a sequence whose order is the entire point. It just is not
*unique*.

So there are two honest options:

1. **Make the input force a unique order** and compare literally. A straight
   chain `[[1,0],[2,1],[3,2]]` has exactly one topological order, `[0,1,2,3]`,
   and so does `(2, [[1,0]])`. Those two tests compare directly.
2. **Validate the order** instead of comparing it. That is `validateOrder`:
   - the length equals `numCourses`
   - every course appears exactly once and is in range
   - for every `[a, b]`, `position[b] < position[a]`

I used both. The diamond and the no-prerequisite cases go through the validator
because they have several right answers; the chain cases compare literally
because they have one.

And there is a test whose only job is to prove the validator is not a rubber
stamp:

```js
test('the checker rejects a reversed order',
     validateOrder(2, [[1, 0]], [1, 0]),
     'prerequisite 0 comes after 1');
```

Without that, a validator with a typo in the comparison would return `'ok'` for
everything and all the other tests would still pass. I have been burned by
that shape of mistake before on the group-anagrams day.

## One implementation note

`queue.shift()` re-indexes the array in V8, so a queue of `V` courses would cost
`O(V^2)`. I keep a `head` index and never remove anything.

## Complexity

| | |
| - | - |
| Time | `O(V + E)` - each course leaves the queue once, each edge is relaxed once |
| Space | `O(V + E)` adjacency lists + `O(V)` indegree |

## Note to self

If a problem asks for "any valid X", the test has to check the *property*, not
one blessed answer. `unordered: true` is for outputs where order is genuinely
meaningless (subsets, group anagrams). A topological order is ordered, just not
unique, and those two things are easy to confuse at 11pm.

## Follow-up to try

Alien Dictionary is the same algorithm with the graph hidden inside the input,
plus a lexicographic tie-break that wants a heap for the queue instead of a
plain array. That would combine this with Day 114.
