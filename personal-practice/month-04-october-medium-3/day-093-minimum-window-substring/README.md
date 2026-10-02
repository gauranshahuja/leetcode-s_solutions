# Day 093 - Minimum Window Substring

LeetCode 76 · Hard · Sliding window with counts · Friday, 2 October 2026 · ~1 hr 40 min, 4 attempts

The hardest sliding window I have done. Days 063-066 were variants of "keep one
condition true and track a max"; this keeps a *multiset* condition true and
tracks a min, and the difficulty gap is real. Four attempts, and the third was
correct but re-scanned the whole map every step.

## Problem

Shortest substring of `s` that contains every character of `t`, duplicates
included. Order inside the window is irrelevant.

```
s = "ADOBECODEBANC", t = "ABC"  ->  "BANC"
s = "a",             t = "a"    ->  "a"
s = "a",             t = "aa"   ->  ""      (only one 'a' available)
```

`"ADOBEC"` also contains A, B and C, but it is 6 long and `"BANC"` is 4.

## The shape I expected to use

Grow `right`; when the window becomes valid, shrink `left` as far as it will go
while recording the best length. Days 063-066 all look like that, so the
skeleton came out in two minutes:

```js
for (let right = 0; right < s.length; right++) {
  add(s[right]);
  while (valid()) { record(); remove(s[left++]); }
}
```

The 90 minutes went entirely into `valid()`.

## Attempt 1 - the wrong shrink condition

I wrote the inner loop as `while (!valid())`, copying the muscle memory from
"longest substring with at most K distinct". That is backwards here.

- In a **maximise** problem you shrink while the window is **broken**, to repair
  it, and measure after.
- In a **minimise** problem you shrink while the window is **valid**, to squeeze
  it, and measure before each removal.

Same loop, opposite predicate, because "longest valid" and "shortest valid"
want opposite things from the shrink.

## Attempt 2 - the surplus bug

My validity check was a count comparison that treated "more than enough" as a
problem:

```js
if (window.get(ch) === need.get(ch)) satisfied++;   // inside the check
// ...
if (window.get(ch) !== need.get(ch)) satisfied--;   // on removal, wrong
```

With `s = "bba", t = "ab"` the window picks up a second `b`, the count becomes
2 while `need` is 1, so my `!==` fired and I decremented `satisfied` even though
the window still contains a `b`. Answer came out `""`.

**A surplus is not a deficit.** The window is valid when every character has
`window[c] >= need[c]`, so going from 1 to 2 copies changes nothing.

## Attempt 3 - correct but re-scanning

Fixed the comparisons, but `valid()` looped over `need` on every single step.
Technically still linear with a fixed alphabet, but it is a constant factor I
did not need to pay.

## What finally clicked - required / formed

Two integers replace the whole comparison:

| name       | meaning                                                   |
| ---------- | --------------------------------------------------------- |
| `required` | number of **distinct** characters in `t` (`need.size`)    |
| `formed`   | how many of those currently have **enough** copies inside |

The window is valid exactly when `formed === required`. That is one integer
compare per step.

The only subtle part is when `formed` is allowed to move, and the answer is
**only on an exact crossing**:

```js
// adding: ticks up only when the count LANDS on the requirement
if (count === need.get(inCh)) formed += 1;

// removing: ticks down only when the count falls BELOW the requirement
if (count < need.get(outCh)) formed -= 1;
```

Counts above the requirement drift up and down without touching `formed`, which
is precisely the surplus case that broke attempt 2. Writing it as `===` going up
and `<` coming down is the asymmetry that makes it correct, and it took me an
embarrassingly long time to see that the two conditions are *not* mirror images.

## Dry run

`s = "ADOBECODEBANC"`, `t = "ABC"`, `required = 3`. Only the interesting steps:

| right | char | window (A,B,C) | formed | shrink does                      | best    |
| ----- | ---- | -------------- | ------ | -------------------------------- | ------- |
| 0     | A    | 1,0,0          | 1      | -                                | -       |
| 3     | B    | 1,1,0          | 2      | -                                | -       |
| 5     | C    | 1,1,1          | **3**  | record `ADOBEC` (6), drop A      | 6       |
| 10    | B    | 1,2,1          | 3      | record `ANC`... see below        |         |
| 12    | C    | 1,1,2          | **3**  | record `BANC` (4), drop B        | 4    |

The row I had to trace by hand on paper is `right = 10`: at that point the
window is `"BECODEBA"` and the shrink walks `left` past the first `B` without
breaking, because the second `B` is still inside. That is the surplus case doing
its job instead of ruining everything.

## Complexity

- Time `O(|s| + |t|)`. `right` moves forward `|s|` times, `left` moves forward
  at most `|s|` times, and neither ever goes back. The inner `while` looks
  nested but it is amortised, same argument as every two-pointer.
- Space `O(|s| + |t|)`, really `O(alphabet)` for the two maps.

## Edge cases that mattered

- Empty `t` -> `''`. Without the guard `required` is 0, `formed === required`
  fires on step zero, and it returns a 1-character window.
- Used a `Map` rather than a plain object so I never have to think about a
  character colliding with an `Object.prototype` key.

## Pattern to remember

Minimise-a-valid-window shrinks while valid. Maximise shrinks while
broken. And when validity is a multiset condition, collapse it to a single
`formed === required` counter that only moves on exact boundary crossings.

I expect the required/formed counter again on "Permutation in String".
