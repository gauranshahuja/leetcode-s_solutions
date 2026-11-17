# Day 024 - Symmetric Tree

LeetCode 101 · Easy · Tree recursion, mirrored traversal · Saturday, 25 July 2026 · ~25 min, 4 attempts

## Problem

Is the tree a mirror image of itself across the root?

```
symmetric                 not symmetric
      1                        1
    /   \                    /   \
   2     2                  2     2
  / \   / \                  \     \
 3   4 4   3                  3     3
[1,2,2,3,4,4,3] true      [1,2,2,null,3,null,3] false
```

The second one is the whole trap. Both 2s have exactly one child holding a 3,
so the two subtrees are *identical*. But identical is not mirrored: for a
reflection the left 2's child must sit on the opposite side from the right 2's
child.

## Attempt 1, which was wrong for an interesting reason

I had Day 023 open in the other tab, so I wrote:

```js
return isSameTree(root.left, root.right);   // wrong
```

That passes example 1 (which is symmetric *and* has identical halves) and
cheerfully returns `true` for example 2. Identical halves and mirrored halves
are two different properties, and the test case is built to separate them.

## Attempt 2

Then I tried to be clever: invert the left subtree (Day 022 is right there)
and compare with `isSameTree`:

```js
return isSameTree(invertTree(root.left), root.right);
```

This actually gives the right answer, which confused me for a minute. The
reason I threw it out: `invertTree` **mutates** the tree it is handed, so this
destroys half of the caller's input just to answer a yes/no question. Fine for
my own test file, nasty in anything real.

## What finally clicked

Symmetric Tree *is* Same Tree with one side's children swapped. I do not need
to physically swap anything, I just need to pair the nodes up differently when
I recurse:

| Same Tree (Day 023)       | Symmetric Tree (today)      |
| ------------------------- | --------------------------- |
| `(p.left,  q.left)`       | `(a.left,  b.right)`        |
| `(p.right, q.right)`      | `(a.right, b.left)`         |

Everything else is character for character the same: both-null is true, one
null is false, differing values are false.

The helper takes two nodes, not one, which is why `isSymmetric` has to exist
separately: the root is on the axis of the mirror and has nothing to be
compared against, so it immediately delegates to `isMirror(root.left,
root.right)`.

Outside-with-outside, inside-with-inside. That phrase is the whole problem.

## Dry run

`[1,2,2,null,3,null,3]` - the false one.

| call                              | what it compares            | result |
| --------------------------------- | --------------------------- | ------ |
| `isMirror(2L, 2R)`                | values 2 and 2              | ok, recurse |
| `isMirror(2L.left, 2R.right)`     | `null` vs node 3            | **false** |
| `isMirror(2L.right, 2R.left)`     | node 3 vs `null`            | short circuited away |

And the true one, `[1,2,2,3,4,4,3]`:

| call                          | compares   | result |
| ----------------------------- | ---------- | ------ |
| `isMirror(2L, 2R)`            | 2 vs 2     | recurse |
| `isMirror(3, 3)`              | outer pair | true |
| `isMirror(4, 4)`              | inner pair | true |

## Attempt 3 was a typo, honestly

I wrote `isMirror(a.left, b.right) && isMirror(a.left, b.right)` - same pair
twice. It returned `true` for anything whose outer edges matched. Took me
longer to spot than it should have because the line is almost palindromic to
look at.

## Complexity

- Time `O(n)`: every node is in exactly one compared pair.
- Space `O(h)` for the stack.

## Pattern to remember

When a problem says "mirror", do not build the mirror. Change which pairs
you compare.

Three tree problems in a row now and it is the same skeleton every time. The
difference between Day 022, Day 023 and today is purely *what the recursive
call is applied to*: one node, two nodes side by side, two nodes crossed over.
