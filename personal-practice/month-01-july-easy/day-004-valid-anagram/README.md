# Day 004 - Valid Anagram

LeetCode 242 · Easy · Strings, frequency count · Sunday, 5 July 2026 · ~22 min, 2 attempts

## Problem

Is `t` a rearrangement of `s`? Same letters, same number of each, order
irrelevant.

```
s = "anagram", t = "nagaram"  ->  true
s = "rat",     t = "car"      ->  false
```

## Two ways in

The first thing that came to mind was sorting. If both strings are anagrams
then sorting them makes them identical, so:

```js
[...s].sort().join('') === [...t].sort().join('')
```

That is genuinely correct and I kept it in the file as `isAnagramSort`. But it
is `O(n log n)` and it builds four throwaway objects (two arrays, two
strings). The thing the sort is really doing is *grouping equal letters
together*, and a counter does that without ordering anything.

## The counting version

An anagram is two equal multisets. So:

1. Bail out early if the lengths differ. Without this the whole thing is
   wrong, see below.
2. Tally every character of `s` into a `Map`.
3. Walk `t` and spend the tally. Any character that is missing or already
   down to 0 means no.

If `t` finishes without running short, and the lengths matched, then every
count must be back at exactly 0. I do not need a second pass to verify that,
which took me a minute to convince myself of.

## Walking through the example

`s = "aab"`, `t = "aba"` - counts after step 2: `{a: 2, b: 1}`

| char of t | count before | left after | verdict  |
| --------- | ------------ | ---------- | -------- |
| a         | 2            | 1          | fine     |
| b         | 1            | 0          | fine     |
| a         | 1            | 0          | fine     |

Finished `t`, never ran short, so `true`.

Now `s = "aabb"`, `t = "abbb"` - counts `{a: 2, b: 2}`

| char of t | count before | left after | verdict        |
| --------- | ------------ | ---------- | -------------- |
| a         | 2            | 1          | fine           |
| b         | 2            | 1          | fine           |
| b         | 1            | 0          | fine           |
| b         | **0**        | -          | return `false` |

## The bug

My first decrement loop checked for the wrong thing:

```js
const left = counts.get(ch);
if (left === undefined) return false;   // wrong test
counts.set(ch, left - 1);
```

That only catches a letter that `s` never contained at all. It does **not**
catch a letter that `s` had but `t` uses too many times, because by then the
count is `0`, not `undefined`. So `"aabb"` vs `"abbb"` happily walked the
count down to `-1` and returned `true`.

The fix is `if (!left) return false;`, which treats `0` and `undefined`
identically. Usually I am suspicious of falsy checks on numbers because they
swallow a real `0`, but here `0` *is* the failure case, so it works out.

I also only added the length guard after this. Without it `"a"` vs `"aa"`
would never run out of anything on the first `a` and... actually it would, on
the second. But `"ab"` vs `"a"` returns `true` without the guard, because the
loop over the shorter `t` finishes fine and leaves `b` unspent. The guard is
what makes "finished without running short" equal to "all counts are 0".

## Complexity

| Version  | Time         | Space  |
| -------- | ------------ | ------ |
| Sort     | `O(n log n)` | `O(n)` |
| Counting | `O(n)`       | `O(k)` |

`k` is the number of distinct characters. For lowercase ASCII that is at most
26, so the space is effectively constant. LeetCode's follow-up asks about
unicode inputs, and that is the point where a fixed 26-slot array stops
working and a `Map` keeps working.

## JS notes

- `[...s]` iterates by code point, `s.split('')` splits by UTF-16 code unit.
  For emoji or anything outside the basic plane, `split('')` tears characters
  in half. `for (const ch of s)` iterates by code point too, which is why I
  used it in both loops.
- `sort()` with no comparator sorts by string, which is the wrong default for
  numbers but exactly right for characters. Nice to have it work in my favour
  for once.

## Takeaway

Sorting to compare collections is usually a counter in disguise. If the only
reason to sort is "so equal things sit together", count them instead and
drop a log factor.
