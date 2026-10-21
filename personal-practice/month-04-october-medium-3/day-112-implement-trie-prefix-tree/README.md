# Day 112 - Implement Trie (Prefix Tree)

LeetCode 208 · Medium · Trie · Wednesday, 21 October 2026 · ~30 min, 1 attempt

## Problem

Implement `insert(word)`, `search(word)` and `startsWith(prefix)`.

```
insert("apple")
search("apple")      ->  true
search("app")        ->  false     <- "app" was never inserted
startsWith("app")    ->  true      <- but it is a prefix of "apple"
insert("app")
search("app")        ->  true
```

Those two middle lines are the entire specification of the data structure.

## The one design decision

`search` and `startsWith` walk the identical path and differ only in what they
do when they arrive. So a node needs to record **"a word ends here"**
independently of **"this node exists"**:

```js
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}
```

- `startsWith(p)` - the path for `p` exists. `isEnd` is irrelevant.
- `search(w)` - the path exists **and** `node.isEnd` is true.

Without `isEnd`, the only available end-of-word signal is "has no children",
and that is wrong: after inserting `"apple"` and `"app"`, the second `p` has a
child and is still a word, so childlessness would report it as a mere prefix.

Since both methods descend the same way, I pulled the descent into one private
`#walk(str)` that returns the landing node or `null`. The two public methods are
then one line each, and there is only one place the traversal can be wrong.

## Why a Map and not an object

```js
this.children = new Map();      // not {}
```

A plain object inherits from `Object.prototype`, so `children['constructor']`
and `children['__proto__']` return something truthy for a child that was never
inserted. Single characters make that unlikely in this problem, but it is free
to avoid. `Object.create(null)` would also fix it.

The classic competitive alternative is `new Array(26)` indexed by
`ch.charCodeAt(0) - 97`. Faster and tighter, but it hard-codes lowercase ASCII
and allocates 26 slots for a node with one child. The Map version works for any
alphabet, which is what I want if this ever gets reused.

## Walking through the example

`insert("apple")` then `insert("app")`:

```
root
 └ a ── p ── p* ── l ── e*
```

`*` marks `isEnd`. Five nodes plus the root, and the second insert allocated
nothing - it only walked to the existing second `p` and set its flag.

| call                | path exists? | isEnd at the end? | result |
| ------------------- | ------------ | ----------------- | ------ |
| `search("apple")`   | yes          | yes               | true   |
| `search("app")` (before the 2nd insert) | yes | no  | false  |
| `startsWith("app")` | yes          | not checked       | true   |
| `search("app")` (after) | yes      | yes               | true   |
| `startsWith("apz")` | no, breaks at `z` | -            | false  |

## Complexity

| operation | time | space |
| --------- | ---- | ----- |
| `insert`  | `O(L)` | `O(L)` new nodes worst case |
| `search`  | `O(L)` | `O(1)` |
| `startsWith` | `O(L)` | `O(1)` |

`L` is the length of the word or prefix. What matters is that **none of these
depend on how many words are stored** - that is the whole reason to use a trie instead of a
`Set` of strings plus a scan for prefix queries, which would be `O(n * L)`.

Total space is `O(total characters inserted)`, less wherever prefixes overlap.
I put a test on that: inserting `"cat"` and `"car"` gives 5 nodes, not 7,
because the `c` and `a` are shared.

## Testing a design problem

Single calls prove nothing here - the bugs are in the *interaction* between
operations. So the tests drive a sequence against one instance and compare the
whole list of return values, the way the judge does:

```js
runTrie([
  ['insert', 'car'],
  ['insert', 'card'],
  ['search', 'car'],    // true - the longer insert must not clear isEnd
  ['search', 'ca'],     // false - prefix, never inserted
])
```

The sequences I made sure to cover:

- a word inserted **after** a longer word that contains it (`application`, then `app`)
- a word inserted **before** a longer one (`car`, then `card`) - this is where a
  careless `insert` that resets `isEnd` along the path would break
- a sibling branch (`cat` + `car`) and then querying `cab`, which shares `ca`
  but not the last character
- the empty string, which is a legal word: `insert("")` sets `isEnd` on the
  root, and `startsWith("")` is true even on an empty trie

## Pattern to remember

A trie moves the cost of prefix questions from "number of words" to "length of
query". The flag that separates "a word ends here" from "a path passes
through here" is not a detail, it is the structure.

Next ones to build on this: Word Search II (trie plus backtracking on a grid)
and Design Add and Search Words with `.` wildcards, where `#walk` turns into a
branching DFS over all children.
