# Revisit list

Days I want to come back to and re-solve from a blank file.

The rule for getting on here: the day note says I read something from outside
(an editorial, a hint, a write-up) before the solution was done. This list is
built from the day notes, so it only has what they record. 18 days out of 138.

The plan is a re-solve week in December. No new problems that week. Blank
file, problem statement only, and I do not open the old day folder until I
have either got it or properly stopped.

## The main idea came from outside

Day 138's note names this month's five help days (124, 127, 128, 134 and 137) as the next to re-solve.

| Day | Problem | What the day note says |
|---|---|---|
| [005](month-01-july-easy/day-005-maximum-subarray/) | Maximum Subarray | Stuck for 15 minutes, then read the editorial for the one-line idea and coded it myself. |
| [047](month-02-august-medium-1/day-047-daily-temperatures/) | Daily Temperatures | Stuck for 30 minutes, then read the hint. It was one word: stack. |
| [049](month-02-august-medium-1/day-049-generate-parentheses/) | Generate Parentheses | Read about the pruning rule after 35 minutes. |
| [058](month-02-august-medium-1/day-058-course-schedule/) | Course Schedule | Gave up around 35 minutes and read about Kahn's algorithm, then wrote it myself. |
| [097](month-04-october-medium-3/day-097-find-the-duplicate-number/) | Find the Duplicate Number | Read the editorial's first paragraph for "the array as a linked list". The reframing was the whole difficulty. |
| [102](month-04-october-medium-3/day-102-largest-rectangle-in-histogram/) | Largest Rectangle in Histogram | Had the stack idea, could not get the width formula. Read the editorial for where the left boundary comes from. |
| [109](month-04-october-medium-3/day-109-binary-tree-maximum-path-sum/) | Binary Tree Maximum Path Sum | Went in circles for twenty minutes, then read the editorial's two sentences on why the clamp applies to children only. |
| [124](month-05-november-hard-1/day-124-median-of-two-sorted-arrays/) | Median of Two Sorted Arrays | Stopped at 55 minutes and read the editorial for the partition framing, not the code. |
| [127](month-05-november-hard-1/day-127-regular-expression-matching/) | Regular Expression Matching | Read a hint for the two-branch star rule at the hour mark. |
| [134](month-05-november-hard-1/day-134-lfu-cache/) | LFU Cache | Got to frequency buckets on my own, then after about fifty minutes read the hint for the piece that makes it O(1). |
| [137](month-05-november-hard-1/day-137-burst-balloons/) | Burst Balloons | About an hour and forty minutes on the wrong subproblem, then read the editorial for the key idea. |

## Only a follow-up or a faster version came from outside

The first working version was mine on these.

| Day | Problem | What the day note says |
|---|---|---|
| [010](month-01-july-easy/day-010-majority-element/) | Majority Element | Map version in five minutes. Read about the voting algorithm for the O(1) follow-up. |
| [019](month-01-july-easy/day-019-climbing-stairs/) | Climbing Stairs | Had never written memoisation, so spent ten minutes reading about where the cache belongs. |
| [026](month-01-july-easy/day-026-number-of-1-bits/) | Number of 1 Bits | The shift version was mine. Looked up the `n & (n - 1)` loop afterwards, because 32 iterations to count one bit felt wasteful. |
| [029](month-01-july-easy/day-029-rotate-array/) | Rotate Array | Extra-array version in 10 minutes. For the O(1) follow-up I read that triple reversal is the usual approach, then worked out why on paper. |
| [063](month-03-september-medium-2/day-063-longest-repeating-character-replacement/) | Longest Repeating Character Replacement | The O(26n) version passed. Went looking for the never-decrease version because the editorial comments were arguing about it. |
| [088](month-03-september-medium-2/day-088-longest-increasing-subsequence/) | Longest Increasing Subsequence | The O(n^2) DP was mine. Read the idea for the O(n log n) follow-up and did not trust it for about half an hour. |
| [128](month-05-november-hard-1/day-128-wildcard-matching/) | Wildcard Matching | DP in 15 minutes. Read the editorial's argument for why only the last star matters in the greedy version. |

## How to run the re-solve week

One day per sitting, the first table first, no notes and no searching. Twenty
five minutes before I write down where I am stuck, and only then open the old
folder to compare. A day comes off when I have written it cold once and can
say out loud why it is correct.
