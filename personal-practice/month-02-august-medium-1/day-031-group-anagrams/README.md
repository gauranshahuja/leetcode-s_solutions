# Day 031 - Group Anagrams

LeetCode 49 · Medium · Hash map with a canonical key · Saturday, 1 August 2026 · ~30 min, 2 attempts

First medium of the month. Same toolbox as July, bigger problem.

## Problem

Group the strings that are anagrams of each other. Any group order, any order
inside a group.

```
["eat","tea","tan","ate","nat","bat"]
  -> [["eat","tea","ate"], ["tan","nat"], ["bat"]]

[""]  -> [[""]]
["a"] -> [["a"]]
```

## Where I started

My first instinct was Day 004 (Valid Anagram) in a loop: take word 0, compare
it against every other word with `isAnagram`, pull out the matches, repeat on
what is left. It does work. It is also `O(n^2 * k)` and the bookkeeping for
"which words have I already consumed" was getting ugly fast.

## The shift

Day 004 used the sorted string as a **comparison**. Here it needs to be an
**identity**:

```
"eat" -> "aet"
"tea" -> "aet"
"ate" -> "aet"
"tan" -> "ant"
```

Every anagram collapses to the same sorted string, so the sorted string is a
map key and the map groups everything for me. No word ever gets compared to
another word. That is the Day 001 move again (stop searching, start
remembering) only here the remembered thing is a key, not a complement.

```js
const key = word.split('').sort().join('');
if (!groups.has(key)) groups.set(key, []);
groups.get(key).push(word);
```

## Dry run

| word  | key   | map after                                  |
| ----- | ----- | ------------------------------------------ |
| eat   | aet   | `aet -> [eat]`                             |
| tea   | aet   | `aet -> [eat, tea]`                        |
| tan   | ant   | `aet -> [eat, tea]`, `ant -> [tan]`        |
| ate   | aet   | `aet -> [eat, tea, ate]`, `ant -> [tan]`   |
| nat   | ant   | `ant -> [tan, nat]`                        |
| bat   | abt   | `abt -> [bat]`                          |

Then `[...groups.values()]` and I am done.

## The bug

I used a plain object at first:

```js
const groups = {};               // not a Map
groups[key] = groups[key] || [];
```

Which looks fine, and passed my first few tests, until I remembered that plain
objects carry inherited keys. A word whose sorted key happens to be
`"constructor"` (sorted: `"cconorrsttu"` so not literally that, but the family
of collisions is real) is the kind of thing that bites later, and
`Object.keys` order rules for integer-like keys are their own mess. Switched to
`Map`, which has none of that and keeps insertion order. Same reason I used a
`Map` on Day 001.

## About the key choice

The sorted key costs `k log k` per word. Since the input is lowercase a-z I can
build the key by **counting letters** instead:

```js
const counts = new Array(26).fill(0);
// ... count ...
const key = counts.join('#');
```

That is `O(k)` per word, so `O(n * k)` overall instead of `O(n * k log k)`.

The `#` separator is not decoration. Joining with nothing turns `[1, 11, 0...]`
and `[11, 1, 0...]` into the same `"111..."` string, which silently merges two
different groups. I wrote a test with eleven `a`s specifically for that.

For LeetCode's `k <= 100` the sort version is perfectly fine and much easier to
read, so that is the one I kept as the main answer. Both are in the file.

## Complexity

| Key type    | Time             | Space      |
| ----------- | ---------------- | ---------- |
| sorted word | `O(n * k log k)` | `O(n * k)` |
| 26 counts   | `O(n * k)`       | `O(n * k)` |

## Pattern to remember

When a problem says "group things that are the same in some loose sense",
find a canonical form for that sense and use it as a map key. Grouping is
then free.

Sorted letters for anagrams, but the same move shows up as "sort the digits",
"normalise to lowercase", "divide by the GCD" for slopes, and so on.
