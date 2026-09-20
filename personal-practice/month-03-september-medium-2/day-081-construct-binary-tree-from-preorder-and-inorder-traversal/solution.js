'use strict';

const { test, summary } = require('../../lib/check');
const { TreeNode, buildTree, treeToArray, preorder, inorder } = require('../../lib/structures');

function buildTreeFromPreInSlice(pre, ino) {
  if (pre.length === 0) return null;

  const rootVal = pre[0];
  const mid = ino.indexOf(rootVal);

  const node = new TreeNode(rootVal);
  node.left = buildTreeFromPreInSlice(pre.slice(1, mid + 1), ino.slice(0, mid));
  node.right = buildTreeFromPreInSlice(pre.slice(mid + 1), ino.slice(mid + 1));
  return node;
}

function buildTreeFromPreIn(pre, ino) {
  const indexOfValue = new Map();
  for (let i = 0; i < ino.length; i += 1) indexOfValue.set(ino[i], i);

  let cursor = 0;

  function build(lo, hi) {
    if (lo > hi) return null;

    const rootVal = pre[cursor];
    cursor += 1;

    const node = new TreeNode(rootVal);
    const mid = indexOfValue.get(rootVal);

    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }

  return build(0, ino.length - 1);
}

const BIG = [1, 2, 3, 4, 5, 6, 7, null, null, 8, 9, null, null, 10, 11];

test(
  'example 1',
  treeToArray(buildTreeFromPreIn([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])),
  [3, 9, 20, null, null, 15, 7]
);
test('single node, negative value', treeToArray(buildTreeFromPreIn([-1], [-1])), [-1]);
test('empty traversals give an empty tree', buildTreeFromPreIn([], []), null);
test('left-skewed chain', treeToArray(buildTreeFromPreIn([3, 2, 1], [1, 2, 3])), [3, 2, null, 1]);
test('right-skewed chain', treeToArray(buildTreeFromPreIn([1, 2, 3], [1, 2, 3])), [1, null, 2, null, 3]);
test(
  'uneven subtrees - the left side is deeper',
  treeToArray(buildTreeFromPreIn([5, 3, 1, 4, 8, 9, 7], [1, 3, 4, 5, 8, 7, 9])),
  [5, 3, 8, 1, 4, null, 9, null, null, null, null, 7]
);

test('round trip on an 11-node tree', (() => {
  const original = buildTree(BIG);
  return treeToArray(buildTreeFromPreIn(preorder(original), inorder(original)));
})(), BIG);

test('rebuilt tree reproduces both input traversals', (() => {
  const original = buildTree(BIG);
  const pre = preorder(original);
  const ino = inorder(original);
  const rebuilt = buildTreeFromPreIn(pre, ino);
  return [preorder(rebuilt), inorder(rebuilt)];
})(), (() => {
  const original = buildTree(BIG);
  return [preorder(original), inorder(original)];
})());

test('the slicing version agrees on the 11-node tree', (() => {
  const original = buildTree(BIG);
  return treeToArray(buildTreeFromPreInSlice(preorder(original), inorder(original)));
})(), BIG);

summary('Day 081 - Construct Binary Tree from Preorder and Inorder Traversal');

module.exports = { buildTreeFromPreIn, buildTreeFromPreInSlice };
