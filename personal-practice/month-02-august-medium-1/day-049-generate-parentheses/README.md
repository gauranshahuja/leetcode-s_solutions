# Day 049 - Generate Parentheses

LeetCode 22 · Medium · Backtracking · Wednesday, 19 August 2026 · ~55 min (read about the pruning rule after 35), 3 attempts

## Problem

Generate all well-formed strings of `n` pairs of parentheses. Any order.

```
n = 1  ->  ["()"]
n = 2  ->  ["(())", "()()"]
n = 3  ->  ["((()))", "(()())", "(())()", "()(())", "()()()"]
```

## Where I started

Brute force: build every string of length `2n` over the alphabet `(` and `)`,
then keep the balanced ones with the Day 016 checker.

That is `2^(2n)` candidates. For `n = 3` it is 64 strings to get 5 answers,
for `n = 7` it is 16384 to get 429. It does work, and it was my attempt 1, but
it is doing almost all of its work on prefixes that were already hopeless.

The part I could not see for half an hour was how to make the generator refuse
the bad branches instead of producing and discarding them. I went and read
about it, got the rule `close < open`, and wrote the rest myself.

## The two counters

Track how many of each character I have already written:

- `open` = number of `(` placed so far
- `close` = number of `)` placed so far

Then there are exactly two rules about what may come next:

| character | allowed when | why |
| --------- | ------------ | --- |
| `(` | `open < n` | there are only `n` pairs available |
| `)` | `close < open` | cannot close a group that was never opened |

And the base case is `open + close === 2n`, i.e. the path is full. I check
`path.length === 2 * n`, which is the same thing.

Those two conditions are not just filters, they are *complete*: any string
built while obeying them is balanced, and every balanced string can be built
by obeying them. So there is no final validity check at the leaves at all. The
leaf just records the answer.

## Why pruning beats generate-and-filter

If a prefix ever has more `)` than `(`, nothing I append later can rescue it.
The depth went negative and it stays negative. So that entire subtree is dead,
and `close < open` refuses to enter it.

| n | balanced strings (Catalan) | all strings `2^(2n)` | fraction kept |
| - | -------------------------- | -------------------- | ------------- |
| 3 | 5  | 64    | 7.8%  |
| 4 | 14 | 256   | 5.5%  |
| 7 | 429 | 16384 | 2.6%  |

The pruned search visits only nodes that lead to at least one answer, so the
work is proportional to the number of answers rather than to the whole space.
The counts being Catalan numbers (1, 1, 2, 5, 14, 42) is a nice sanity check,
and I used it in the tests instead of writing out 14 strings by hand.

## Dry run, n = 2

Indenting by depth. `x` marks a branch the rules refuse to take.

```
""            open=0 close=0    ')' x  (close < open fails)
 "("          open=1 close=0
  "(("        open=2 close=0    '(' x  (open < n fails)
   "(()"      open=2 close=1
    "(())"    full  -> record
  "()"        open=1 close=1
   "()("      open=2 close=1
    "()()"    full  -> record
```

Two answers, and the tree never built a single invalid string.

## The bug

Attempt 2 forgot to undo:

```js
if (open < n) {
  path.push('(');
  walk(open + 1, close);
  // path.pop();     <- missing
}
```

Without the pop, `path` keeps growing across sibling branches, so the second
branch starts from whatever the first branch left behind. I got strings longer
than `2n`, and then `path.length === 2 * n` stopped being true at the right
moment so some recursions ran away entirely.

The fix is one line, and the thing to internalise is the shape:

```
choose  ->  recurse  ->  un-choose
```

The un-choose is not cleanup, it is what makes the shared `path` legal in the
first place. If I ever want to skip it I have to pass a fresh copy down
instead, which costs a copy per node.

Attempt 3 was smaller: I had the base case after the two if-blocks instead of
before them, so it never fired. Base case goes first.

## Complexity

- Time: `O(C(n) * n)` where `C(n)` is the nth Catalan number. Every node in
  the pruned tree sits on a path to at least one answer, and each completed
  answer costs `O(n)` to `join('')`.
- Space: `O(n)` for the recursion stack and the path, not counting the output
  list itself.

## Note to self

Backtracking is: a path I mutate, a base case that records a copy, and a
set of "is this move still legal" guards. The guards are the algorithm.
Writing the guard instead of filtering at the end is what makes it fast.

First one of these I have written. The structure looks reusable, so I expect
subsets and permutations to be the same skeleton with different rules.
