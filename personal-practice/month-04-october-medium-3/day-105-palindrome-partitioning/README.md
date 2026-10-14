# Day 105 - Palindrome Partitioning

LeetCode 131 · Medium · Backtracking plus a DP precheck · Wednesday, 14 October 2026 · ~45 min, 2 attempts

## Problem

Cut `s` into pieces so every piece is a palindrome. Return all possible
cuttings.

```
"aab"  ->  [["a","a","b"], ["aa","b"]]
"a"    ->  [["a"]]
```

The order of the answers does not matter. The order *within* one answer does -
concatenating the pieces has to give back `s`.

## Where I started

By now the backtracking skeleton writes itself. It is the Day 050 / Day 072
template with one line swapped:

```
back(start):
  if start === n: record a copy of path; return
  for end from start to n-1:
    if s[start..end] is NOT a palindrome: skip
    push the piece, back(end + 1), pop
```

`back(end + 1)` rather than `back(start + 1)` is the only structural thing to
notice: the next piece starts where this one ended, because this is a
*partition*, not a subset.

That version is in the file as `partitionNaive` and it is already accepted.

## The part worth improving

The palindrome check inside the loop is a scan. On a string like `"aaaaaa"`
almost every branch passes through almost every substring, so the same
`"aaaa"` gets verified again and again from scratch.

Since every check is "is `s[i..j]` a palindrome", and there are only `n^2`
such questions, precompute all of them:

```
isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i+1][j-1])
```

Ends match, and the inside is already known to be a palindrome. `j - i < 2`
handles both base cases in one condition: a single character (`j === i`) and
two equal characters (`j === i + 1`) have no inside to check.

**Fill order matters.** `isPal[i][j]` depends on `isPal[i+1][j-1]`, which is one
row *below*. So `i` goes from `n-1` down to `0` and `j` goes from `i` up. I
wrote the loops the obvious way first (`i` ascending) and got every
three-or-more-character palindrome reported as false, because `isPal[i+1][j-1]`
was still sitting at its initial `false`.

After that the backtracking check is `if (!isPal[start][end]) continue;` - one
lookup.

## Dry run

`s = "aab"`, table built first:

| i\j | 0 (`a`) | 1 (`a`) | 2 (`b`) |
| --- | ------- | ------- | ------- |
| 0   | true    | true    | false   |
| 1   | -       | true    | false   |
| 2   | -       | -       | true    |

Then the search:

| call       | end tried | piece | legal? | then                  |
| ---------- | --------- | ----- | ------ | --------------------- |
| `back(0)`  | 0         | `a`   | yes    | `back(1)`             |
| `back(1)`  | 1         | `a`   | yes    | `back(2)`             |
| `back(2)`  | 2         | `b`   | yes    | `back(3)` -> record `["a","a","b"]` |
| `back(1)`  | 2         | `ab`  | no     | skip                  |
| `back(0)`  | 1         | `aa`  | yes    | `back(2)` -> record `["aa","b"]` |
| `back(0)`  | 2         | `aab` | no     | skip                  |

## The bug that cost me ten minutes

Not the DP. This:

```js
if (start === n) { out.push(path); return; }   // wrong
```

`path` is one array that the whole search mutates. Pushing the reference means
every recorded answer is the same array, and by the time the search unwinds it
is empty - so the result was `[[], []]`. `path.slice()` fixes it.

I have hit this on every single backtracking day and I still typed it. Writing
`out.push(path.slice())` as one unit from now on.

## Complexity

| | |
| --- | --- |
| Table build | `O(n^2)` time, `O(n^2)` space |
| Search | `O(n * 2^n)` worst case |
| Recursion depth | `O(n)` |

The exponential term is not slack - `"aaaa...a"` of length `n` genuinely has
`2^(n-1)` valid partitions, and any correct solution has to write them all out.
What the table removes is the per-check factor, not the output size. I tested
that count directly on `"aaaa"`: 8 partitions, which is `2^3`.

## Follow-up to try

LeetCode 132 (Palindrome Partitioning II) asks for the *minimum* number of cuts.
Same `isPal` table, but then it is a 1-D DP over prefixes instead of a search,
and it drops to `O(n^2)` total because it never enumerates the partitions. Good
reminder that "count or minimise" and "list them all" are different problems
even when they share a precheck.
