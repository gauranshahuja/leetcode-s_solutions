# Month 5 - November 2026 - Hard (tier 1)

| | |
|---|---|
| Dates | 1 November 2026 - ongoing |
| Problems so far | 16 (Day 123 - Day 138) |
| Level | Hard |
| Missed days | 0 |
| Status | in progress |

## What changed from October

Hard only. No medium padding.

The honest headline: **one a day has held all month, but the sessions are longer.**
July days were 10 to 35 minutes. This month has been 45 minutes to 3 hours, and
a few days I have only had the idea by the end of the session and written the
clean version the next morning before starting the new problem.

Second honest point: **four of these needed outside help for the key idea** (days 124, 127, 134 and 137), and on day 128 I read the editorial for the greedy version. I have noted it in each file
rather than quietly pretending I derived it. The code is mine; the insight was
not.

## Topics so far

| Topic | Days |
|---|---|
| Two pointers with an invariant argument | 123 |
| Binary search on a partition | 124 |
| Stack / DP on strings | 125 |
| 2D DP | 126, 127, 128 |
| BFS on an implicit graph | 129 |
| Trie + backtracking | 130 |
| Constraint backtracking | 131, 132 |
| Tree encoding | 133 |
| Design | 134 |
| Two heaps | 135 |
| Greedy | 136 |
| Interval DP | 137 |
| Divide and conquer counting | 138 |

## Day index

| Day | Date | Problem | Topic |
|---|---|---|---|
| 123 | Sun 1 Nov | Trapping Rain Water | Two pointers |
| 124 | Mon 2 Nov | Median of Two Sorted Arrays | Binary search on partition |
| 125 | Tue 3 Nov | Longest Valid Parentheses | Stack, DP alternative |
| 126 | Wed 4 Nov | Edit Distance | 2D DP |
| 127 | Thu 5 Nov | Regular Expression Matching | 2D DP with wildcards |
| 128 | Fri 6 Nov | Wildcard Matching | DP + greedy |
| 129 | Sat 7 Nov | Word Ladder | BFS |
| 130 | Sun 8 Nov | Word Search II | Trie + backtracking |
| 131 | Mon 9 Nov | N-Queens | Diagonal sets |
| 132 | Tue 10 Nov | Sudoku Solver | Constraint sets |
| 133 | Wed 11 Nov | Serialize and Deserialize Binary Tree | Tree encoding |
| 134 | Thu 12 Nov | LFU Cache | Frequency buckets |
| 135 | Fri 13 Nov | Find Median from Data Stream | Two heaps |
| 136 | Sat 14 Nov | Candy | Greedy, two passes |
| 137 | Sun 15 Nov | Burst Balloons | Interval DP |
| 138 | Mon 16 Nov | Count of Smaller Numbers After Self | Merge sort counting |

## Running notes (month not finished)

- **Days 126 to 128 as a block was the right call.** Edit Distance, then regex,
  then wildcard. Three 2D DP problems in a row where the only thing that changes
  is what a cell is allowed to transition from. Doing them on consecutive days
  meant the third one took 65 minutes instead of three hours. I should have been
  grouping problems like this months ago.
- **On Day 137 the natural framing is wrong.**
  Thinking about which balloon to burst first leaves subproblems that depend on
  each other, so there is nothing to recurse on. Asking which balloon is burst
  *last* in a range makes the two sides independent. I did not find that myself.
- **Day 134 (LFU) was the hardest design problem so far.** Day 076's LRU was
  one ordered list. LFU is a map of frequency buckets plus a minimum-frequency
  pointer, and every operation has to keep three things in sync. Design problems
  remain my weakest area, which is annoying because they are the ones that come
  up in interviews.
- **Day 123 was a nice surprise.** Trapping Rain Water has been sitting on my
  "scary" list since July and the two-pointer version is eight lines. Most of the work is in believing the invariant, not in writing it.

## What is next

Finish November on hard problems. Then December I want to stop adding new
problems for a week and re-solve the 18 days I marked "revisit" from a blank
file, because I suspect a few of them I only pattern-matched.
