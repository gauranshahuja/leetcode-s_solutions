# Revisit list

Days I want to come back to and re-solve from a blank file.

The rule for getting on here: either I could not rewrite the solution from
scratch a week later, or I needed a hint the first time. Not "was it hard"
and not "did it take long". Day 123 took an hour and is not here, because the
eight lines are mine now. Day 137 took about the same and is near the top,
because the idea was not. 21 days out of 138.

The plan is a re-solve week in December. No new problems that week. Blank
file, problem statement only, and I do not open the old day folder until I
have either got it or properly stopped.

## High priority

Could not re-derive it, or the key idea came from outside.

| Day | Problem | Why it is here | Priority |
|---|---|---|---|
| [076](month-03-september-medium-2/day-076-lru-cache/) | LRU Cache | I wrote the doubly linked list and the map but kept them in sync by trial and error rather than by design. | High |
| [088](month-03-september-medium-2/day-088-longest-increasing-subsequence/) | Longest Increasing Subsequence | I can implement the O(n log n) tails version, I cannot defend why it is correct. | High |
| [100](month-04-october-medium-3/day-100-reverse-nodes-in-k-group/) | Reverse Nodes in k-Group | Four attempts and a hand-drawn diagram; the pointer order is not internalised. | High |
| [102](month-04-october-medium-3/day-102-largest-rectangle-in-histogram/) | Largest Rectangle in Histogram | I got the stack idea on my own and then read about the width arithmetic. | High |
| [124](month-05-november-hard-1/day-124-median-of-two-sorted-arrays/) | Median of Two Sorted Arrays | I needed the editorial for the partition framing, not for the code. | High |
| [134](month-05-november-hard-1/day-134-lfu-cache/) | LFU Cache | Three structures to keep in sync and a minFreq pointer; I got it working, I do not feel I own it. | High |
| [137](month-05-november-hard-1/day-137-burst-balloons/) | Burst Balloons | The burst-last reframing came from outside. | High |
| [138](month-05-november-hard-1/day-138-count-of-smaller-numbers-after-self/) | Count of Smaller Numbers After Self | The merge-sort counting works, but the index bookkeeping was copied more than reasoned. | High |

## Medium priority

These work. The reasoning under them is not solid.

| Day | Problem | Why it is here | Priority |
|---|---|---|---|
| [013](month-01-july-easy/day-013-reverse-linked-list/) | Reverse Linked List | I still have to draw the boxes instead of just seeing it. | Medium |
| [025](month-01-july-easy/day-025-single-number/) | Single Number | XOR still feels like a trick I was told rather than something I derived. | Medium |
| [060](month-02-august-medium-1/day-060-coin-change/) | Coin Change | Four attempts in August, mostly from not knowing what the DP state should be. | Medium |
| [063](month-03-september-medium-2/day-063-longest-repeating-character-replacement/) | Longest Repeating Character Replacement | I am not fully convinced why maxCount never needs to be decreased. | Medium |
| [074](month-03-september-medium-2/day-074-subsets-ii/) | Subsets II | The `i > start` dedup condition is memorised, not understood. | Medium |
| [084](month-03-september-medium-2/day-084-flatten-binary-tree-to-linked-list/) | Flatten Binary Tree to Linked List | The Morris-style O(1) space rewiring was followed, not derived. | Medium |
| [090](month-03-september-medium-2/day-090-partition-equal-subset-sum/) | Partition Equal Subset Sum | I wrote the 1D loop forwards first and did not understand the fix for twenty minutes. | Medium |
| [121](month-04-october-medium-3/day-121-coin-change-ii/) | Coin Change II | I understand the loop-order lesson now and want to prove it by rewriting both versions cold. | Medium |
| [127](month-05-november-hard-1/day-127-regular-expression-matching/) | Regular Expression Matching | The zero-or-more branch of `*` is the part that will break on a rewrite. | Medium |
| [130](month-05-november-hard-1/day-130-word-search-ii/) | Word Search II | The trie pruning optimisations were taken from a write-up. | Medium |

## Low priority

Small gaps, mostly details, but I do not want to leave them.

| Day | Problem | Why it is here | Priority |
|---|---|---|---|
| [043](month-02-august-medium-1/day-043-set-matrix-zeroes/) | Set Matrix Zeroes | Pure off-by-one pain the first time; I want to redo it cleanly. | Low |
| [058](month-02-august-medium-1/day-058-course-schedule/) | Course Schedule | Kahn's algorithm was followed as a recipe in August; probably fine now, worth proving. | Low |
| [111](month-04-october-medium-3/day-111-vertical-order-traversal-of-a-binary-tree/) | Vertical Order Traversal of a Binary Tree | I lost half an hour to not reading the tie-break rule; a reading failure more than a coding one. | Low |

## Patterns this list is telling me

**Design and data-structure plumbing: 076, 134, 058.** I can name the
structures a problem needs. What I cannot do is write down the invariant that
has to hold between them before I start typing, so I patch sync bugs until
the tests pass. The gap is that I treat state as something to fix rather than
something to specify.

**Pointer-heavy linked list work: 013, 084, 100.** I still simulate pointers
by drawing them instead of holding the rewiring order as a rule I can state.
Fine on day 013, falls apart on day 100. Four months apart, same weakness.

**DP where the loop structure carries the meaning: 060, 090, 121, 127, 137.**
With the recurrence written down I can read it. Without it I reach for a shape
I remember from a similar problem instead of defining the subproblem, and then
loop order and direction are guesses.

**Correctness argument subtler than the code: 063, 074, 088, 102, 124, 130,
138.** Short code I can type and cannot defend. From the outside this looks
exactly like understanding, which is the reason this list exists.

043 and 111 are not part of any of that. They were attention failures, not
knowledge gaps.

## How to run the re-solve week

One day per sitting, high priority first, no notes and no searching. Twenty
five minutes before I write down where I am stuck, and only then open the old
folder to compare. A day comes off when I have written it cold once and can
say out loud why it is correct.
