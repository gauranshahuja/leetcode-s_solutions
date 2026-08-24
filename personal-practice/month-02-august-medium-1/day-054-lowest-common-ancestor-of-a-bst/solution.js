'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function lowestCommonAncestor(root, p, q) {
  let node = root;

  while (node) {
    if (p.val < node.val && q.val < node.val) {
      node = node.left;
    } else if (p.val > node.val && q.val > node.val) {
      node = node.right;
    } else {
      return node;
    }
  }

  return null;
}

function findNode(root, val) {
  let node = root;
  while (node && node.val !== val) {
    node = val < node.val ? node.left : node.right;
  }
  return node;
}

function lcaValue(levels, pVal, qVal) {
  const root = buildTree(levels);
  const ancestor = lowestCommonAncestor(root, findNode(root, pVal), findNode(root, qVal));
  return ancestor === null ? null : ancestor.val;
}

const SAMPLE = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5];

test('example 1 - they split at the root', lcaValue(SAMPLE, 2, 8), 6);
test('example 2 - ancestor is one of the nodes', lcaValue(SAMPLE, 2, 4), 2);
test('both deep in the same subtree', lcaValue(SAMPLE, 3, 5), 4);
test('argument order does not matter', lcaValue(SAMPLE, 5, 3), 4);
test('right subtree only', lcaValue(SAMPLE, 7, 9), 8);
test('leftmost leaf with a deep cousin', lcaValue(SAMPLE, 0, 5), 2);
test('p === q returns that node', lcaValue(SAMPLE, 4, 4), 4);
test('single node tree', lcaValue([1], 1, 1), 1);
test('child and its parent in a two-node tree', lcaValue([2, 1], 1, 2), 2);

summary('Day 054 - Lowest Common Ancestor of a BST');

module.exports = { lowestCommonAncestor, findNode };
