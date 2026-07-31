# Month 1 - July 2026 - Easy

| | |
|---|---|
| Dates | 2 July - 31 July 2026 |
| Problems | 30 (Day 001 - Day 030) |
| Level | Easy |
| Missed days | 0 |

## The plan I set myself

One problem a day. Not two, not ten on a Sunday. Plain JavaScript, no libraries,
and notes in the same folder as the code so I can reread them later instead of
re-solving from scratch.

Month 1 is deliberately all easy problems. The point is not difficulty, it is
building the habit and getting the vocabulary: hash map, two pointers, stack,
recursion, binary search. The plan is to come back to these same topic families
every month at a harder level.

## Topics this month

| Topic | Days |
|---|---|
| Arrays, single pass | 002, 005, 028 |
| Hashing (map / set) | 001, 003, 004, 027 |
| Two pointers | 006, 007, 008, 009, 029 |
| Counting / voting | 010 |
| Binary search | 011, 012 |
| Linked lists | 013, 014, 015 |
| Stacks and queues | 016, 017, 018 |
| DP (first taste) | 019, 020 |
| Binary trees | 021, 022, 023, 024 |
| Bit manipulation | 025, 026 |
| Strings | 030 |

## Day index

| Day | Date | Problem | Topic |
|---|---|---|---|
| 001 | Thu 2 Jul | Two Sum | Array + hash map |
| 002 | Fri 3 Jul | Best Time to Buy and Sell Stock | Single pass |
| 003 | Sat 4 Jul | Contains Duplicate | Hash set |
| 004 | Sun 5 Jul | Valid Anagram | Frequency count |
| 005 | Mon 6 Jul | Maximum Subarray | Kadane |
| 006 | Tue 7 Jul | Move Zeroes | Two pointers |
| 007 | Wed 8 Jul | Valid Palindrome | Two pointers |
| 008 | Thu 9 Jul | Merge Sorted Array | Two pointers from the back |
| 009 | Fri 10 Jul | Remove Duplicates from Sorted Array | Two pointers |
| 010 | Sat 11 Jul | Majority Element | Boyer-Moore voting |
| 011 | Sun 12 Jul | Binary Search | Binary search |
| 012 | Mon 13 Jul | Search Insert Position | Lower bound |
| 013 | Tue 14 Jul | Reverse Linked List | Pointer rewiring |
| 014 | Wed 15 Jul | Middle of the Linked List | Fast and slow |
| 015 | Thu 16 Jul | Linked List Cycle | Floyd |
| 016 | Fri 17 Jul | Valid Parentheses | Stack |
| 017 | Sat 18 Jul | Min Stack | Stack design |
| 018 | Sun 19 Jul | Implement Queue using Stacks | Queue design |
| 019 | Mon 20 Jul | Climbing Stairs | DP |
| 020 | Tue 21 Jul | Min Cost Climbing Stairs | DP |
| 021 | Wed 22 Jul | Maximum Depth of Binary Tree | Tree DFS |
| 022 | Thu 23 Jul | Invert Binary Tree | Tree recursion |
| 023 | Fri 24 Jul | Same Tree | Parallel traversal |
| 024 | Sat 25 Jul | Symmetric Tree | Mirrored traversal |
| 025 | Sun 26 Jul | Single Number | XOR |
| 026 | Mon 27 Jul | Number of 1 Bits | Bit tricks |
| 027 | Tue 28 Jul | Intersection of Two Arrays II | Hash counting |
| 028 | Wed 29 Jul | Plus One | Carry propagation |
| 029 | Thu 30 Jul | Rotate Array | Triple reversal |
| 030 | Fri 31 Jul | Longest Common Prefix | Strings |

## End of month notes

What actually stuck:

- **The map trick.** Day 001 taught me that "have I seen the thing I need?" is a
  hash lookup, not a loop. That single idea covered days 003, 004, 027 as well.
- **Two pointers has more than one shape.** Converging from both ends (007),
  slow write pointer plus fast read pointer (006, 009), and filling from the back
  to avoid overwriting (008). I kept confusing these in week 1.
- **Recursion on trees is easier than recursion on arrays.** Days 021 to 024 were
  the smoothest run of the month. The structure tells you the recursion.

What is still weak:

- **Linked lists.** Day 013 took me three tries because I kept losing the tail.
  I can do it now but I do not yet *see* it, I have to draw the boxes.
- **DP.** Days 019 and 020 worked, but I only trust them because they are small.
  I do not think I could derive a recurrence for something unfamiliar yet.
- **Bit manipulation.** XOR on day 025 felt like a magic trick rather than
  something I reasoned out.

Carrying into August: same topic families, harder versions. I want sliding
window and backtracking in there, since this month had neither.
