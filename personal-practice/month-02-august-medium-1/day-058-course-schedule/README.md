# Day 058 - Course Schedule

LeetCode 207 · Medium · Topological sort, cycle detection · Friday, 28 August 2026 · ~55 min (gave up around 35 and read about Kahn's algorithm, then wrote it myself), 3 attempts

## Problem

`numCourses` courses numbered `0..n-1`, plus pairs `[a, b]` meaning **b must be
taken before a**. Can all courses be finished?

```
numCourses = 2, prerequisites = [[1, 0]]
  take 0, then 1  ->  true

numCourses = 2, prerequisites = [[1, 0], [0, 1]]
  1 needs 0, 0 needs 1  ->  false
```

## Restating it until it was a graph problem

Prerequisites are a directed graph. `[a, b]` is an arrow `b -> a`: finishing b
unlocks a. A valid study order is an ordering where every arrow points forwards,
which is exactly a **topological order**. Those exist if and only if the graph
has no directed cycle. So the whole problem is "is this DAG?".

I knew that much. What I did not know was how to actually *do* it, and I spent
a while trying to detect cycles with the tools I had (a plain visited set, like
Day 056) before admitting it does not work: a diamond
`0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3` revisits node 3 twice with no cycle anywhere.
Revisiting is not the same as looping. That was the point where I looked up the
standard method rather than keep guessing.

## Kahn's algorithm

Count, for every course, **how many of its prerequisites are still
unfinished** - its in-degree.

1. every course with in-degree 0 can be taken immediately, so queue them all
2. take one off the queue, count it as done
3. for each course it unlocks, drop that course's in-degree by one; if it hits
   0, queue it
4. repeat until the queue is empty

Then compare `done` with `numCourses`. If they match, I just produced a valid
order. If `done` is short, every leftover course still has an unfinished
prerequisite, and with finitely many courses the only way that survives is if
they are waiting on each other. **So `done === numCourses` is the cycle test.**
There is no separate cycle search anywhere in the code, which I find quietly
satisfying.

## The bug (twice)

First version I built the adjacency list in the direction the input is written:

```js
for (const [course, prereq] of prerequisites) {
  adj[course].push(prereq);      // wrong way round
  indegree[prereq] += 1;
}
```

This solves the mirrored problem. For `[[1, 0]]` it says course 0 depends on
course 1. Example 1 still returned `true` (a reversed DAG is still a DAG) so the
bug survived my first test and only showed up on the diamond case, where the
answer came out wrong for the wrong reason. The pair `[a, b]` reads
**backwards** compared to how you draw the arrow, and I now destructure it as
`[course, prereq]` so the names stop me re-making the mistake.

Second, smaller one: I decremented and tested in the same expression,
`if (--indegree[next] === 0)`, which is fine, but I had also written
`indegree[next] -= 1` on the line above, so everything got decremented twice and
courses were queued before they were unlocked. Split into two plain lines.

## Dry run

`numCourses = 4`, `prerequisites = [[1,0],[2,0],[3,1],[3,2]]`

adjacency: `0 -> [1, 2]`, `1 -> [3]`, `2 -> [3]`, in-degrees `[0, 1, 1, 2]`

| step | queue    | taken | in-degrees after | done |
| ---- | -------- | ----- | ---------------- | ---- |
| init | `[0]`    | -     | `[0,1,1,2]`      | 0    |
| 1    | `[0]`    | 0     | `[0,0,0,2]`      | 1    |
| 2    | `[1,2]`  | 1     | `[0,0,0,1]`      | 2    |
| 3    | `[2]`    | 2     | `[0,0,0,0]`      | 3    |
| 4    | `[3]`    | 3     | `[0,0,0,0]`      | 4    |

`done === 4` -> `true`. Note 3 is only queued once, on the step that takes
its *last* prerequisite away. That is the part a plain visited set cannot
express.

## The case I deliberately kept

`canFinish(2, [[1, 0], [1, 0]])` - the same prerequisite listed twice. In-degree
counting handles it for free: course 1 starts at 2, gets decremented twice while
0 is processed, reaches 0, gets queued. An implementation that stored edges in a
`Set` or that marked "prerequisite satisfied" as a boolean would also work, but
one that queued a course as soon as it saw *any* satisfied edge would be wrong.

## Alternative: DFS with three colours

The other standard way is a DFS where every node is white (untouched), grey (on
the current recursion path) or black (fully explored). Walking from a node, if
you reach a grey node you have found a back edge, which is a cycle; black nodes
are safe to skip because their whole subgraph was already cleared. It is the
same `O(V + E)` and gives a topological order by pushing nodes onto a list as
they turn black. I went with Kahn's because it is iterative - the 1000-course
chain in my tests would be a 1000-deep recursion the other way, and after the
stack-depth worry on Day 056 I would rather not.

## Complexity

- Time `O(V + E)`: each course is dequeued once, each edge relaxed once.
- Space `O(V + E)`: adjacency lists plus the in-degree array and queue.

## Note to self

"Can this be ordered?" and "is there a cycle?" are the same question. Count
in-degrees, peel off the zeros, and if you run out of zeros before you run
out of nodes, the rest is a cycle.
