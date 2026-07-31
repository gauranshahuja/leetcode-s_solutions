# Day 030 - Longest Common Prefix

LeetCode 14 · Easy · Strings · Friday, 31 July 2026 · ~20 min, 2 attempts

## Problem

Longest string that every word in the array begins with.

```
["flower","flow","flight"]                      -> "fl"
["dog","racecar","car"]                         -> ""
["interspecies","interstellar","interstate"]    -> "inters"
```

## Where I started

A candidate prefix that only ever gets shorter, trimmed one character at a
time with `startsWith`:

```js
let prefix = strs[0];
for (const word of strs) {
  while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
}
```

This is correct, and I nearly kept it. What I did not like: every failed check
builds a whole new string, so a word like `"aaaaab"` against `"aaaaac"` makes
five intermediate strings before settling. Comparing character by character
and slicing **once** per word does the same job with one allocation.

## The bug

`strs[0]` on an empty array is `undefined`, so `prefix.length` threw:

```
TypeError: Cannot read properties of undefined (reading 'length')
```

The constraint on LeetCode says `1 <= strs.length`, so it never shows up
there, which is exactly why I want the guard - my own test file passes `[]`
and I would rather the function answer `''` than explode. One line at the top.

Note that `['']` is a *different* case: the array is not empty, the string is.
That one works out on its own because the candidate starts as `''` and the
while loop never runs.

## How it works

Carry a candidate, shrink it against each word:

1. candidate = first word (the answer can never be longer than it)
2. for each later word, walk `j` forward while
   - `j` is inside the candidate, and
   - `j` is inside the word, and
   - the characters match
3. cut the candidate to `slice(0, j)`
4. if the candidate is empty, return immediately

The middle condition `j < word.length` is the one that handles "the prefix can
be at most as long as the shortest word" without ever having to look for the
shortest word.

## Dry run

`["abab","aba","abc"]`

| step              | candidate | word  | j stops at | why                     |
| ----------------- | --------- | ----- | ---------- | ----------------------- |
| start             | `"abab"`  | -     | -          | first word              |
| compare           | `"abab"`  | `aba` | 3          | word ran out            |
| cut               | `"aba"`   | -     | -          | -                       |
| compare           | `"aba"`   | `abc` | 2          | `a` vs `c`              |
| cut               | `"ab"`    | -     | -          | answer               |

## Alternative approaches

- **Vertical scan**: fix a character index, check that column across all the
  words, stop at the first column that disagrees. Same complexity, and it is
  better when one word is tiny and sits at the end of the array, because it
  never reads past the shortest word.
- **Sort the array, compare only the first and last string.** This one is
  cute: in lexicographic order the two extremes are the most dissimilar pair,
  so their common prefix is the answer for everyone. Costs `O(m n log n)` for
  the sort, but here the default `sort()` comparator is the *right* one for
  once, since it compares strings - unlike every numeric sort this month where
  I had to pass `(a, b) => a - b`.
- Trie, if there were many queries against the same word list. Overkill for
  one call.

## Complexity

- Time: `O(S)` where `S` is the total number of characters, worst case when
  every word is identical. Early exit makes the typical case much smaller.
- Space: `O(length of the answer)`.

## End of month 1

Thirty days, thirty easy problems, and the main thing that changed is that I
now recognise shapes instead of reading each problem as brand new:

- hash map for lookups and counts (Day 001, Day 004, Day 027 and most of the
  array days)
- two pointers / an index that walks instead of a `shift()`
- the recursion template for trees: null base case, recurse both sides,
  combine (Day 022, Day 023, Day 024, and they really are one function with
  three different middles)
- bit tricks as arithmetic identities rather than loops (Day 025, Day 026)

Weakest area, clearly: **bit manipulation**. XOR and `n & (n - 1)` both worked
once I was told the identity, but I did not derive either of them and I would
not spot the next one. I also still need to be careful with JS specifically -
signed 32-bit coercion, `>>` vs `>>>`, `sort()` comparing as strings,
`MAX_SAFE_INTEGER` on digit problems. Four separate bugs this month came from
the language and not the algorithm.

Second place for weakest: recursion where I have to return two things at once.
It was fine today, but Day 024 took three attempts for what is a five line
function.

Next month is mediums. Expecting the easy-problem reflex of "there is one
trick and I either know it or I don't" to stop being enough.
