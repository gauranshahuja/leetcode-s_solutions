# Month 2 - August 2026 - Medium (tier 1)

| | |
|---|---|
| Dates | 1 August - 31 August 2026 |
| Problems | 31 (Day 031 - Day 061) |
| Level | Medium |
| Missed days | 0 |

## What changed from July

Same topic families, one step harder. The idea is that each month revisits
arrays, strings, linked lists, stacks, trees, graphs, DP and intervals, but
asks a harder question each time. July was "do you know what a hash map is".
August is "can you pick the right structure without being told".

Two genuinely new things this month, both of which took a few days to settle:
**sliding window** (day 034 onwards) and **backtracking** (days 049 to 051).
Graphs also showed up for the first time at day 056.

## Topics this month

| Topic | Days |
|---|---|
| Hashing with a derived key | 031 |
| Prefix / suffix products and sums | 032, 037 |
| Counting and bucketing | 033 |
| Sliding window | 034 |
| Two pointers (greedy) | 035, 036 |
| Partitioning | 038 |
| Binary search variants | 039, 040 |
| Matrix manipulation | 041, 042, 043 |
| Linked lists | 044, 045, 046 |
| Stacks, monotonic stack | 047, 048 |
| Backtracking | 049, 050, 051 |
| Trees and BSTs | 052, 053, 054, 055 |
| Grid graphs (DFS and BFS) | 056, 057 |
| Topological sort | 058 |
| DP | 059, 060 |
| Intervals | 061 |

## Day index

| Day | Date | Problem | Topic |
|---|---|---|---|
| 031 | Sat 1 Aug | Group Anagrams | Canonical hash key |
| 032 | Sun 2 Aug | Product of Array Except Self | Prefix + suffix |
| 033 | Mon 3 Aug | Top K Frequent Elements | Bucket sort |
| 034 | Tue 4 Aug | Longest Substring Without Repeating Characters | Sliding window |
| 035 | Wed 5 Aug | Container With Most Water | Two pointers |
| 036 | Thu 6 Aug | 3Sum | Sort + two pointers |
| 037 | Fri 7 Aug | Subarray Sum Equals K | Prefix sum + map |
| 038 | Sat 8 Aug | Sort Colors | Dutch national flag |
| 039 | Sun 9 Aug | Search in Rotated Sorted Array | Binary search |
| 040 | Mon 10 Aug | Find First and Last Position | Binary search bounds |
| 041 | Tue 11 Aug | Spiral Matrix | Shrinking bounds |
| 042 | Wed 12 Aug | Rotate Image | In-place matrix |
| 043 | Thu 13 Aug | Set Matrix Zeroes | O(1) space markers |
| 044 | Fri 14 Aug | Add Two Numbers | Linked list + carry |
| 045 | Sat 15 Aug | Remove Nth Node From End | Two-pointer gap |
| 046 | Sun 16 Aug | Reorder List | Three techniques combined |
| 047 | Mon 17 Aug | Daily Temperatures | Monotonic stack |
| 048 | Tue 18 Aug | Evaluate Reverse Polish Notation | Stack |
| 049 | Wed 19 Aug | Generate Parentheses | Backtracking |
| 050 | Thu 20 Aug | Subsets | Include / exclude |
| 051 | Fri 21 Aug | Permutations | Used set |
| 052 | Sat 22 Aug | Binary Tree Level Order Traversal | BFS |
| 053 | Sun 23 Aug | Validate Binary Search Tree | Bounds |
| 054 | Mon 24 Aug | Lowest Common Ancestor of a BST | BST ordering |
| 055 | Tue 25 Aug | Kth Smallest Element in a BST | Inorder |
| 056 | Wed 26 Aug | Number of Islands | Grid DFS |
| 057 | Thu 27 Aug | Rotting Oranges | Multi-source BFS |
| 058 | Fri 28 Aug | Course Schedule | Topological sort |
| 059 | Sat 29 Aug | House Robber | 1D DP |
| 060 | Sun 30 Aug | Coin Change | Unbounded knapsack |
| 061 | Mon 31 Aug | Merge Intervals | Sort + merge |

## End of month notes

The three things worth remembering from August:

1. **Sliding window is a template, not a trick.** Grow the right edge, shrink
   the left edge while the window is invalid, record the answer. Day 034 took me
   an hour. By day 037 I tried to force the same template onto a problem with
   negative numbers and it failed, which is how I learned the window needs
   monotonicity to work at all. That failure taught me more than day 034 did.
2. **Backtracking is one shape.** Choose, recurse, un-choose. Days 049 to 051
   are the same seven lines with a different constraint. Forgetting the un-choose was the bug on days 049 and 051.
3. **DFS vs BFS is not a style choice.** Day 056 works with either. Day 057
   needs BFS because the answer is a number of minutes, and DFS has no concept
   of "all at the same distance". That distinction finally landed.

Still uncomfortable:

- **Graphs.** Day 058 (topological sort) I got working but I was following a
  recipe. I could not have derived Kahn's algorithm on my own.
- **DP.** Day 060 (Coin Change) took me four attempts, two of them on how to mark unreachable amounts. Next month I want more DP, deliberately.
- **Matrix index juggling.** Day 043 was all about the order of the writes.

September plan: harder versions of these again, plus a real design problem
(something like LRU cache) because I have never built one.
