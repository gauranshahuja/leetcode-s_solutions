# Day 133 - Serialize and Deserialize Binary Tree

LeetCode 297 · Hard · Tree encoding and decoding · Wednesday, 11 November 2026 · ~45 min, 2 attempts

One of the gentler hard problems, mostly because the real work is picking a
format and then not fighting it.

## Problem

Write `serialize(root)` producing a string, and `deserialize(data)` producing
the identical tree back. The format is up to me. Node values can be negative
and multi-digit; the tree can be any shape.

```
      1
     / \
    2   3
       / \
      4   5

serialize   ->  "1,2,#,#,3,4,#,#,5,#,#"
deserialize ->  the same tree
```

## Why one traversal is enough here (and was not on Day 081)

Day 081 needed **two** traversals (preorder + inorder) to rebuild a tree,
because a bare preorder list is ambiguous: `1,2,3` could be a left chain, a
right chain, or a root with two kids. There is no way to tell where a subtree
ends.

Writing out the missing children removes exactly that ambiguity. `1,2,#,#,3,...`
says "2's left is nothing, 2's right is nothing, so 2 is done". Once every
child slot is written down, the string is a complete description of the shape,
and a single traversal suffices. That was the thing worth understanding today.

## Preorder vs level order

My first instinct was level order, because that is the format `buildTree` in
`lib/structures` uses and the one I had been reading all month since Day 052.
I wrote it, it worked, and then I threw it away. Reasons:

**1. The decoder needs a queue and a half-finished-parent rule.** Level order
decoding looks like this:

```js
const queue = [root];
while (queue.length && i < tokens.length) {
  const parent = queue.shift();
  const l = tokens[i++]; if (l !== '#') { parent.left  = new TreeNode(+l); queue.push(parent.left); }
  const r = tokens[i++]; if (r !== '#') { parent.right = new TreeNode(+r); queue.push(parent.right); }
}
```

Two token reads per iteration, a `shift()` (O(n) on a JS array unless I swap in
an index pointer, which is a third thing to get right), and a bounds check in
the loop condition because the token stream can end mid-level.

**2. The encoder has to remember not to expand nulls.** If you push the children
of a null node, a deep skinny tree explodes into the full `2^h` array. So the
encoder needs an explicit "don't recurse into a marker" rule. The preorder
version gets that for free, because a null just emits one token and returns.

**3. Preorder is symmetric.** Encoder and decoder are the same six lines in
opposite directions, and the decoder needs one piece of state: a cursor. After
`build()` finishes the left subtree, the cursor is already parked on the first
token of the right subtree, because the left subtree consumed precisely its own
tokens. Nothing to compute.

Token count is `2n + 1` either way, so this is not a size argument. It is a
"how many ways can I get this wrong" argument.

## The delimiter is not cosmetic

I briefly considered one character per node with no separator, which collapses
for two separate reasons:

- negative values: `-5` is two characters, and `-` is not a digit
- multi-digit values: `1,2` and `12` become the same string

So: comma separated, `#` for null. Tested with `[-5, -1000, 15, null, null, -7, 2000]`
on purpose, and that case fails immediately under a no-delimiter scheme.

## Dry run of the decode

`"1,2,#,#,3,4,#,#,5,#,#"` ->

| i  | token | what `build()` does                     | returns      |
| -- | ----- | --------------------------------------- | ------------ |
| 0  | `1`   | make node 1, recurse left               |              |
| 1  | `2`   | make node 2, recurse left               |              |
| 2  | `#`   | nothing                                 | `null`       |
| 3  | `#`   | nothing                                 | `null`       |
|    |       | node 2 complete                         | node 2       |
| 4  | `3`   | node 1's right: make node 3, recurse    |              |
| 5  | `4`   | make node 4                             |              |
| 6,7| `#,#` | both children empty                     | node 4       |
| 8  | `5`   | node 3's right                          |              |
| 9,10| `#,#`| both children empty                     | node 5       |
|    |       | node 3 complete, then node 1 complete | node 1       |

## The bug

Attempt 1 guarded the recursion instead of emitting markers:

```js
function walk(node) {
  out.push(String(node.val));
  if (node.left) walk(node.left);     // wrong
  if (node.right) walk(node.right);
}
```

That gives `"1,2,3,4,5"` for the example tree - no markers at all, because a
missing child produces no call and therefore no token. `deserialize` then
rebuilt it as a left chain `1 -> 2 -> 3 -> 4 -> 5`. Which is the Day 081
ambiguity back again, self-inflicted. The null branch has to be a case that
*writes something*, not a case that is skipped.

Second thing I nearly shipped: pushing `node.val` instead of `String(node.val)`.
`join(',')` stringifies anyway so the output string was correct, but the token
array held mixed types and my exact-encoding test made me doubt the format for
ten minutes. One type in the array, decided at the push site.

The case I deliberately added a test for afterwards: a tree of all zeros,
`[0, 0, 0, null, 0]`. Any marker scheme that leans on falsiness (`''`, `null`,
`0` itself) breaks there. `'#'` cannot collide with a stringified number, which
is the only property the marker actually needs.

## Complexity

| operation   | time   | space                    |
| ----------- | ------ | ------------------------ |
| serialize   | `O(n)` | `O(n)` tokens, `O(h)` stack |
| deserialize | `O(n)` | `O(n)` tokens, `O(h)` stack |

`h` is `O(n)` for a chain, which is why I tested a 6-deep right chain - on a
10^5-node chain this would blow the stack and need an explicit stack instead.

## Pattern to remember

A traversal plus explicit empty-slot markers is a complete description of a
tree. Without the markers you need two traversals. That is the entire content
of this problem.
