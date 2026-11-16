# DSA practice

My daily algorithm practice. One problem a day, solved in plain JavaScript, with
my own notes sitting in the same folder as the code so that rereading a day is
cheaper than re-solving it.

Started 2 July 2026. Latest entry 16 November 2026. That is 138 consecutive
days, 138 problems, zero missed days.

The one rule is one problem a day. Not two, not a batch on Sunday to cover a day
I skipped. A short evening means an easier problem, a free morning means a hard
one, but it is one problem and it gets finished.

No dependencies. Node, CommonJS, no TypeScript, no test runner. Every solution
file runs on its own with `node`.

## Layout

```
practice/
  lib/
    check.js        my assertion helper (test, assert, summary)
    structures.js   ListNode, TreeNode, PriorityQueue, DSU, builders
    run-all.js      runs every solution.js and reports pass/fail
  month-01-july-easy/
    README.md       month notes, topic table, day index
    day-001-two-sum/
      solution.js   the solution plus its own tests
      README.md     the notes for that day
    day-002-best-time-to-buy-and-sell-stock/
    ...
  month-02-august-medium-1/
  month-03-september-medium-2/
  month-04-october-medium-3/
  month-05-november-hard-1/
  PROGRESS.md       all 138 days in one table
  REVISIT.md        the days I flagged for re-solving
  package.json
```

Every day folder is `month-NN-<month>-<level>/day-NNN-<slug>/` and holds exactly
two files: `solution.js` and `README.md`.

`lib/check.js` is the tiny assertion helper I wrote on day 1 so I would never
have to install a test framework. It gives me `test`, `assert` and `summary`,
plus an `{ unordered: true }` option for answers like subsets or group-anagrams
where the order of the output genuinely does not matter.

`lib/structures.js` holds the shared `ListNode`, `TreeNode`, `PriorityQueue` and
`DSU`, with the builders I kept retyping: `buildList`, `listToArray`,
`buildListWithCycle`, `buildTree`, `treeToArray`, `inorder`, `preorder`.

## Running things

One day on its own:

```bash
node month-01-july-easy/day-001-two-sum/solution.js
```

Everything, which is what I do before a commit:

```bash
npm test
```

Or a filter, passed straight to the runner:

```bash
node lib/run-all.js month-03
node lib/run-all.js day-04
```

## The months

| Month | Dates | Problems | Level |
|---|---|---|---|
| [Month 1](month-01-july-easy/README.md) | 2 - 31 July 2026 | 30 | Easy |
| [Month 2](month-02-august-medium-1/README.md) | August 2026 | 31 | Medium, tier 1 |
| [Month 3](month-03-september-medium-2/README.md) | September 2026 | 30 | Medium, tier 2 |
| [Month 4](month-04-october-medium-3/README.md) | October 2026 | 31 | Medium, tier 3 (six tagged Hard) |
| [Month 5](month-05-november-hard-1/README.md) | November 2026, in progress | 16 so far | Hard, tier 1 |

The full day-by-day table is in [PROGRESS.md](PROGRESS.md). The days I was not
happy with, and want to re-solve from a blank file, are listed in
[REVISIT.md](REVISIT.md).

## How I write each day

The routine has not changed much since July:

1. Read the problem properly, including the constraints. Day 111 cost me half an
   hour because I skimmed a tie-break rule, and that was not the only time.
2. Write the brute force if one exists, even when I can already see the real
   answer. It gives me something correct to compare against.
3. Get it correct first. Pass the examples, then the edge cases I can think of:
   empty input, one element, all duplicates, negatives.
4. Then improve it, and only then. Usually this means replacing a nested loop
   with a map, a sort, a window or a stack.
5. Write the notes while it is still fresh, before I close the folder. If I
   leave it until the next day the notes turn into a restatement of the
   solution, which is useless to me later.

The tests live inside `solution.js` on purpose. A day should be self-contained:
one file I can open, run and read without hunting for a matching test file
somewhere else. `lib/run-all.js` just executes all of them in turn, so the same
file serves as both the answer and its proof.

## What the five months were for

The structure is deliberate. Each month walks through the same topic families
(arrays, strings, hashing, two pointers, sliding window, binary search, linked
lists, stacks, trees, graphs, greedy, DP, bit manipulation, intervals, design)
at a higher level than the month before. July was easy problems to build the
vocabulary, August to October climbed through the medium tier, November is hard
only. Seeing the same topic for the fifth time at a harder level is what moved
things from recipe to reasoning: monotonic stacks were something I recalled in
August and something I could derive by October, and sliding window went the same
way. One pass through a topic list teaches you the names. Five passes teach you
when to reach for which one.

## Where I still am

Graphs and sliding window are comfortable now. In August I could not have
written Dijkstra or Kahn's algorithm unaided; in October four graph techniques
in four days cost me under 40 minutes each. Sliding window is the same story,
including the at-most counting trick that I used to find confusing.

Design problems are still my weakest area. Day 134 (LFU Cache) was harder for me
than any algorithm in November, because keeping three structures in sync is a
different kind of difficulty from finding one insight. Pointer-heavy linked list
work is the other sore spot: day 100 took four attempts and a hand-drawn
diagram, and I still cannot do that kind of surgery without drawing the boxes.

Those two are where the next few months go.
