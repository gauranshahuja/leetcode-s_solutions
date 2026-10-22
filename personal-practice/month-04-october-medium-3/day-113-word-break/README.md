# Day 113 - Word Break

LeetCode 139 · Medium · DP over string prefixes · Thursday, 22 October 2026 · ~35 min, 2 attempts

## Problem

Can `s` be chopped into a sequence of words from `wordDict`? Words can be
reused, and the whole string must be used up.

```
s = "leetcode",      dict = ["leet","code"]                      -> true
s = "applepenapple", dict = ["apple","pen"]                       -> true
s = "catsandog",     dict = ["cats","dog","sand","and","cat"]      -> false
```

The third one is the whole lesson. `cats` + `and` eats `catsand`, and then
`og` is stranded. `cat` + `sand` eats the same 7 characters and leaves the same
`og`. Both front halves look fine locally and both are dead ends.

## Picking the template before writing anything

By now this is the part I actually spend time on. The input is a string, the
answer is yes/no, and the decision at each position is "where do I cut next".
That is `dp[i] = something about the first i characters` - the prefix table.
The moment I wrote that line down the rest was mechanical.

`dp[i]` = can the first `i` characters be segmented.

- `dp[0] = true` - the empty prefix needs zero words, so it is trivially fine.
- `dp[i] = true` if there is some `j < i` with `dp[j] === true` and
  `s.slice(j, i)` in the dictionary.

So `i` is the end of the string so far and `j` is where the *last* word
starts. The answer is `dp[s.length]`.

## Set lookup vs trying every dictionary word

There are two ways to write the inner loop and they have different costs.

```js
// A: loop over the dictionary
for (const w of wordDict) {
  if (i >= w.length && dp[i - w.length] && s.startsWith(w, i - w.length)) dp[i] = true;
}

// B: loop over split points, ask the Set
for (let j = i - 1; j >= i - maxLen; j--) {
  if (dp[j] && words.has(s.slice(j, i))) dp[i] = true;
}
```

A is `O(n * W * m)` with `W` words. B is `O(n * m)` lookups, independent of how
big the dictionary is, because the Set answers in one hash. With `W = 1000`
short words B wins easily, and B is also the version that generalises to a trie
if I ever need prefix walking (Day 112 would slot straight in here - walk the
trie from `i` backwards and you get the same thing without any `slice` at all).

I went with B plus the `maxLen` clamp, so `j` never reaches further back than
the longest word in the dictionary.

## Dry run

`s = "cars"`, `dict = ["car","ca","rs"]`, `maxLen = 3`

| i | prefix | j tried (down from i-1) | slice | in dict? | dp[j]? | dp[i] |
| - | ------ | ----------------------- | ----- | -------- | ------ | ----- |
| 0 | `""`   | -                       | -     | -        | -      | true  |
| 1 | `c`    | 0                       | `c`   | no       | true   | false |
| 2 | `ca`   | 1, 0                    | `a`, `ca` | no, **yes** | -, true | true |
| 3 | `car`  | 2, 1, 0                 | `r`, `ar`, `car` | no, no, **yes** | -, -, true | true |
| 4 | `cars` | 3, 2, 1                 | `s`, `rs`, `ars` | no, **yes** | -, true | true |

Note `i = 4` succeeds through `j = 2` (`ca` + `rs`), not through `car`. A greedy
"take the longest word you can" pass would have grabbed `car` and then choked on
`s`. DP keeps both branches alive for free, which is exactly why greedy is wrong
here.

## Where I lost ten minutes

First version had the base case wrong. I wrote:

```js
const dp = new Array(s.length + 1).fill(false);
// ... no dp[0] = true
```

and every answer came back `false`, which at least failed loudly. `dp[0]` being
true is not a special case bolted on, it *is* the statement that a word starting
at index 0 has nothing before it to justify.

Second thing: I originally sliced with `s.slice(j, i - 1)`, mixing up
"character index" with "prefix length". `dp[i]` is about a *length*, so the
characters are `s[j] .. s[i-1]`, which is `slice(j, i)` with the exclusive end.
Writing `dp[i] = first i characters` in a comment above the loop fixed the
confusion permanently.

## Complexity

| Version    | Time         | Space |
| ---------- | ------------ | ----- |
| Memo (top down) | `O(n * m^2)` | `O(n)` + stack |
| Table (bottom up) | `O(n * m^2)` | `O(n)` |

The `m^2` is honest bookkeeping: `m` split points, and each `slice` of up to
`m` characters has to be built and hashed. Most write-ups call it `O(n * m)`
and ignore the hashing.

## The two directions are the same thing

I kept `wordBreakMemo` in the file. `canBreak(start)` asks about the *suffix*,
`dp[i]` asks about the *prefix*, and they recurse on the same split. One fills
the table from the front with a loop, the other from the back with the stack.
Same recurrence upside down. Handy to notice, because the recursive one is
faster to write under pressure and converting it to a loop afterwards is
mechanical.

## Takeaway

"Prefix of a string, yes/no answer, free choice of where to cut" means
`dp[i]` over prefix lengths with `dp[0] = true`. The only real decisions are
what the second index means and how far back the inner loop has to look.

Follow-up to try: Word Break II, which wants every segmentation instead of a
boolean. Same table but storing the lists, and I should check whether that
needs the memo to hold arrays.
