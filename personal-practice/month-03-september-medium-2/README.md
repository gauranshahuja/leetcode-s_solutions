# Month 3 - September 2026 - Medium (tier 2)

| | |
|---|---|
| Dates | 1 September - 30 September 2026 |
| Problems | 30 (Day 062 - Day 091) |
| Level | Medium |
| Missed days | 0 |

## What changed from August

Third pass over the same topic families. August was "pick the right structure".
September is "pick the right structure when the obvious one is a trap".

Most of this month's problems have a tempting answer with the wrong complexity:
sort it (day 062), BFS from every cell (day 085 style thinking), compare 26
counters every step (day 066), `indexOf` inside a recursion (day 081). The
lesson of the month is that getting the right *answer* stopped being the bar.

New this month: **binary search on the answer** (days 068, 069), **Union-Find**
(day 087), and the first real **design** problem (day 076, LRU cache).

## Topics this month

| Topic | Days |
|---|---|
| Hash set reasoning | 062 |
| Sliding window, variable size | 063, 065 |
| Sliding window, fixed size | 064, 066 |
| Quickselect | 067 |
| Binary search on the answer | 068, 069 |
| Matrix search | 070 |
| Backtracking | 071, 072, 073, 074 |
| Linked lists | 075, 077 |
| Design | 076 |
| Stacks, monotonic stack | 078, 079 |
| Trees | 080, 081, 082, 083, 084 |
| Grid and graph traversal | 085, 086 |
| Union-Find | 087 |
| DP | 088, 089, 090 |
| Greedy intervals | 091 |

## Day index

| Day | Date | Problem | Topic |
|---|---|---|---|
| 062 | Tue 1 Sep | Longest Consecutive Sequence | Hash set |
| 063 | Wed 2 Sep | Longest Repeating Character Replacement | Sliding window |
| 064 | Thu 3 Sep | Permutation in String | Fixed window |
| 065 | Fri 4 Sep | Max Consecutive Ones III | Window with a budget |
| 066 | Sat 5 Sep | Find All Anagrams in a String | Fixed window |
| 067 | Sun 6 Sep | Kth Largest Element in an Array | Quickselect |
| 068 | Mon 7 Sep | Koko Eating Bananas | Binary search on answer |
| 069 | Tue 8 Sep | Capacity To Ship Packages Within D Days | Binary search on answer |
| 070 | Wed 9 Sep | Search a 2D Matrix II | Staircase search |
| 071 | Thu 10 Sep | Word Search | Grid backtracking |
| 072 | Fri 11 Sep | Combination Sum | Backtracking with reuse |
| 073 | Sat 12 Sep | Letter Combinations of a Phone Number | Backtracking |
| 074 | Sun 13 Sep | Subsets II | Duplicate skipping |
| 075 | Mon 14 Sep | Copy List with Random Pointer | Deep copy |
| 076 | Tue 15 Sep | LRU Cache | Map + doubly linked list |
| 077 | Wed 16 Sep | Sort List | Merge sort on a list |
| 078 | Thu 17 Sep | Asteroid Collision | Stack simulation |
| 079 | Fri 18 Sep | Next Greater Element II | Circular monotonic stack |
| 080 | Sat 19 Sep | Binary Tree Right Side View | BFS |
| 081 | Sun 20 Sep | Construct Binary Tree from Preorder and Inorder | Tree construction |
| 082 | Mon 21 Sep | Path Sum III | Tree + prefix sum |
| 083 | Tue 22 Sep | Diameter of Binary Tree | Two quantities per node |
| 084 | Wed 23 Sep | Flatten Binary Tree to Linked List | Pointer rewiring |
| 085 | Thu 24 Sep | Surrounded Regions | DFS from the border |
| 086 | Fri 25 Sep | Clone Graph | DFS + map |
| 087 | Sat 26 Sep | Number of Provinces | Union-Find |
| 088 | Sun 27 Sep | Longest Increasing Subsequence | DP, then patience |
| 089 | Mon 28 Sep | Minimum Path Sum | Grid DP |
| 090 | Tue 29 Sep | Partition Equal Subset Sum | Subset-sum DP |
| 091 | Wed 30 Sep | Non-overlapping Intervals | Greedy |

## End of month notes

Best thing I learned all month: **binary search does not need a sorted array,
it needs a monotonic predicate.** Day 068 reframed an entire category of
problems for me. "Can Koko finish at speed k?" is false, false, false, true,
true, true as k grows, and that is all binary search ever needed. Day 069 then took about 25 minutes because it is the same thing wearing a different hat.

Other things that landed:

- **Invert the problem.** Day 085 is the clearest example. Finding enclosed
  regions directly is awkward; flooding inward from the border and keeping
  whatever you did not reach is easy. Day 082 is the same move in a different
  costume (carry a prefix-sum map down the tree instead of restarting a DFS at
  every node).
- **"Return one thing, record another".** Day 083's DFS returns the height and
  updates a diameter held outside the recursion. That shape reappeared enough
  that I now look for it whenever a tree answer is not simply the root's value.
- **Loop direction is load-bearing.** Day 090's 1D subset-sum has to run
  backwards or each number gets reused. I wrote it forwards first, got a wrong
  answer, and did not understand why for twenty minutes.

Still shaky:

- **Day 076 (LRU)** took me about 1 hr 10 min over two sittings. Writing my own doubly linked list
  while keeping a map in sync was more fiddly than any algorithm this month.
  Design problems are clearly a separate skill.
- **Day 088's O(n log n) LIS.** I can implement it, but I read the idea rather than finding it, and it took me about half an hour to trust it.
- Dedup in backtracking (074) took me three attempts to get right.

October plan: push into the hard end of medium. Minimum Window Substring,
Largest Rectangle, Reverse Nodes in k-Group. Things I have been avoiding.
