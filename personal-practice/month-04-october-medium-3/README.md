# Month 4 - October 2026 - Medium (tier 3)

| | |
|---|---|
| Dates | 1 October - 31 October 2026 |
| Problems | 31 (Day 092 - Day 122) |
| Level | Medium, with six that are honestly Hard |
| Missed days | 0 |

## What changed from September

This is the top of the medium tier and the line gets blurry. Six of this
month's problems are tagged Hard and I left them tagged Hard rather than
pretending otherwise: days 093, 094, 100, 101, 102 and 109.

The shift this month was that I stopped reaching for a structure and started
reaching for a *reframing*. Day 095 is counting subarrays, which sounds like a
new problem until you notice `exactly(k) = atMost(k) - atMost(k-1)`. Day 097 is finding a duplicate, which becomes cycle detection the moment you read the array as a linked list, though that reframing came from the editorial's first paragraph. Day 099 is in-place only if you agree to store two
states in one integer.

## Topics this month

| Topic | Days |
|---|---|
| String centres | 092 |
| Sliding window, hard | 093, 095 |
| Monotonic deque | 094 |
| k-sum generalisation | 096 |
| Cycle detection on an array | 097 |
| Binary search on the answer | 098 |
| Matrix, in-place encoding | 099 |
| Linked list surgery | 100, 101 |
| Monotonic stack | 102 |
| Expression parsing | 103, 104 |
| Backtracking | 105, 106, 107 |
| Trees | 108, 109, 110, 111 |
| Trie | 112 |
| DP | 113, 121 |
| Heaps and greedy | 114, 115, 116 |
| Graphs | 117, 118, 119, 120 |
| Tree DP | 122 |

## Day index

| Day | Date | Problem | Level | Topic |
|---|---|---|---|---|
| 092 | Thu 1 Oct | Longest Palindromic Substring | Medium | Expand around centre |
| 093 | Fri 2 Oct | Minimum Window Substring | Hard | Sliding window |
| 094 | Sat 3 Oct | Sliding Window Maximum | Hard | Monotonic deque |
| 095 | Sun 4 Oct | Count Number of Nice Subarrays | Medium | At-most trick |
| 096 | Mon 5 Oct | 4Sum | Medium | Generalised k-sum |
| 097 | Tue 6 Oct | Find the Duplicate Number | Medium | Floyd on an array |
| 098 | Wed 7 Oct | Minimum Days to Make m Bouquets | Medium | Binary search on answer |
| 099 | Thu 8 Oct | Game of Life | Medium | In-place bit encoding |
| 100 | Fri 9 Oct | Reverse Nodes in k-Group | Hard | Linked list |
| 101 | Sat 10 Oct | Merge k Sorted Lists | Hard | Divide and conquer |
| 102 | Sun 11 Oct | Largest Rectangle in Histogram | Hard | Monotonic stack |
| 103 | Mon 12 Oct | Basic Calculator II | Medium | Expression parsing |
| 104 | Tue 13 Oct | Decode String | Medium | Stack of state |
| 105 | Wed 14 Oct | Palindrome Partitioning | Medium | Backtracking + DP |
| 106 | Thu 15 Oct | Combination Sum II | Medium | Dedup backtracking |
| 107 | Fri 16 Oct | Restore IP Addresses | Medium | Backtracking |
| 108 | Sat 17 Oct | Binary Tree Zigzag Level Order | Medium | BFS |
| 109 | Sun 18 Oct | Binary Tree Maximum Path Sum | Hard | Tree DP |
| 110 | Mon 19 Oct | Count Complete Tree Nodes | Medium | Tree + binary search |
| 111 | Tue 20 Oct | Vertical Order Traversal | Medium | BFS + sorting |
| 112 | Wed 21 Oct | Implement Trie | Medium | Trie |
| 113 | Thu 22 Oct | Word Break | Medium | DP over prefixes |
| 114 | Fri 23 Oct | Top K Frequent Words | Medium | Heap + comparator |
| 115 | Sat 24 Oct | Task Scheduler | Medium | Greedy counting |
| 116 | Sun 25 Oct | Reorganize String | Medium | Greedy + heap |
| 117 | Mon 26 Oct | Course Schedule II | Medium | Topological order |
| 118 | Tue 27 Oct | 01 Matrix | Medium | Multi-source BFS |
| 119 | Wed 28 Oct | Network Delay Time | Medium | Dijkstra |
| 120 | Thu 29 Oct | Redundant Connection | Medium | Union-Find |
| 121 | Fri 30 Oct | Coin Change II | Medium | Counting DP |
| 122 | Sat 31 Oct | House Robber III | Medium | Tree DP |

## End of month notes

The single most useful thing this month was day 121, and it is a small thing:
**in knapsack-style DP, the loop order decides what you are counting.** Coins in
the outer loop counts combinations. Amounts in the outer loop counts
permutations. Day 060 back in August is where I wrote this rule down, but the question only asked for a minimum, where order genuinely does not matter, so nothing tested it. Day 121 does not let you get away with it. Pair that with day 090's
backwards iteration and I think I finally understand what the loops in a DP are
actually doing, rather than copying a shape.

Other wins:

- **Monotonic stacks are no longer scary.** Day 047 in August needed a one-word hint. By day 102 I could reason about what the stack means (bars still waiting for a shorter neighbour), but the width calculation needed the editorial.
- **Graphs got boring, in a good way.** Days 117 to 120 were four different
  graph techniques in four days and none of them cost more than 45 minutes.
  Kahn's algorithm, multi-source BFS, Dijkstra, Union-Find. In August I could not have written Kahn's, Dijkstra or Union-Find unaided.
- **Day 109's clamp.** `Math.max(0, childContribution)` is one of those lines
  that looks like a detail and is actually the whole insight: a subtree that
  hurts you is simply not used.

Costs and sore spots:

- **Day 102 (Largest Rectangle)** is one of three I had to read about this month (097 and 109 are the others). I got the
  stack part myself and could not work out the width arithmetic. I coded it from
  scratch after understanding it, but it was not mine.
- **Day 100 (Reverse Nodes in k-Group)** took four attempts and a hand-drawn
  diagram. Pointer surgery is still my slowest skill.
- **Day 111's tie-break rule.** Lost an attempt to not reading the problem carefully. Same row, same column, smaller value first. Reading
  properly is a skill too.

November plan: hard problems only. I have been circling Trapping Rain Water,
Median of Two Sorted Arrays and Edit Distance for months. A bit nervous about
whether one a day is still realistic at this level, but that is the experiment.
