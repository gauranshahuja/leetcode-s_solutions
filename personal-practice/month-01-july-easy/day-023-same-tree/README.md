# Day 023 - Same Tree

LeetCode 100 · Easy · Tree recursion, parallel traversal · Friday, 24 July 2026 · ~14 min, 1 attempt

## Problem

Two roots in, one boolean out. Identical means same structure and same values
in the same places.

```
p = [1,2,3]   q = [1,2,3]        -> true

p = [1,2]     q = [1,null,2]     -> false   (2 is on the left vs the right)

p = [1,2,1]   q = [1,1,2]        -> false   (shape matches, values swapped)
```

## My first (wrong) idea

Flatten both trees and compare the arrays. `preorder()` is already sitting in
`lib/structures`, so:

```js
// nope
return JSON.stringify(preorder(p)) === JSON.stringify(preorder(q));
```

This fails on example 2. `[1,2]` and `[1,null,2]` both come out as `[1,2]` in
preorder, because a plain traversal throws away the information about *which*
child was missing. Two different trees, one serialisation.

`treeToArray` would actually survive that, since it keeps the nulls in
position - but then I am comparing two full level-order arrays with `O(n)`
extra memory for something that needs none. It is also answering a different
question than the one asked, which is a habit I want to avoid.

## The approach that works

Walk both trees in lockstep. At each pair of positions `(p, q)` there are only
four possibilities, and ordering them correctly is the whole solution:

1. both `null` -> this spot agrees, return true
2. exactly one `null` -> structure differs, return false
3. `p.val !== q.val` -> return false
4. otherwise -> recurse `(p.left, q.left)` and `(p.right, q.right)`

Check 2 has to come before any `.val` access, otherwise I am reading a
property off `null` and the whole thing throws. Writing it as `p === null ||
q === null` right after the both-null case covers it in one line.

The `&&` in step 4 short circuits, which is a free bonus: a mismatch in the
leftmost branch means the right half never gets visited at all.

## Dry run

`p = [1,2,1]`, `q = [1,1,2]`

| pair          | both null? | one null? | vals        | result        |
| ------------- | ---------- | --------- | ----------- | ------------- |
| (1, 1)        | no         | no        | 1 == 1      | recurse       |
| (2, 1)        | no         | no        | 2 != 1      | **false**     |
| (1, 2)        | -          | -         | -           | never reached |

The `&&` means the right children are never compared. It already knows.

## Where this connects

Yesterday (Day 022) was one tree, swap the children, recurse on both sides.
Today is two trees, compare the nodes, recurse on both sides *in parallel*.
The scaffolding is identical:

```
base case for null
check / do something at this node
combine the results of the two recursive calls
```

What changes is only the "do something" and how the results get combined (a
swap and a return there, an `&&` here). Starting to think most easy tree
problems are this template with a different middle.

## Complexity

| Measure | Value                                                   |
| ------- | ------------------------------------------------------- |
| Time    | `O(min(n, m))` - stops at the first disagreement        |
| Space   | `O(h)` call stack, `h` = depth reached before stopping   |

## Note to self

Comparing two structures is just one traversal with two cursors. Do not
serialise things to compare them unless the serialisation is lossless.

Follow-up I want to try: Subtree of Another Tree should be this function
called at every node of the big tree.
