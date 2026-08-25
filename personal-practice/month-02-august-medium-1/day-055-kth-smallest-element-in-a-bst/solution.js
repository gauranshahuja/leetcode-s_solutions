'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree, inorder } = require('../../lib/structures');

function kthSmallestFlatten(root, k) {
  const values = inorder(root);
  return k >= 1 && k <= values.length ? values[k - 1] : -1;
}

function kthSmallest(root, k) {
  const stack = [];
  let node = root;
  let seen = 0;

  while (node || stack.length) {
    while (node) {
      stack.push(node);
      node = node.left;
    }

    node = stack.pop();
    seen += 1;
    if (seen === k) return node.val;

    node = node.right;
  }

  return -1;
}

const BALANCED = [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15];

test('example 1', kthSmallest(buildTree([3, 1, 4, null, 2]), 1), 1);
test('example 2', kthSmallest(buildTree([5, 3, 6, 2, 4, null, null, 1]), 3), 3);
test('k = 1 on the example is the leftmost leaf', kthSmallest(buildTree([5, 3, 6, 2, 4, null, null, 1]), 1), 1);
test('k = n is the largest value', kthSmallest(buildTree([5, 3, 6, 2, 4, null, null, 1]), 6), 6);
test('single node', kthSmallest(buildTree([7]), 1), 7);
test('middle of a balanced 1..15 tree', kthSmallest(buildTree(BALANCED), 7), 7);
test('last of a balanced 1..15 tree', kthSmallest(buildTree(BALANCED), 15), 15);
test(
  'right-leaning chain 1 -> 2 -> 3, nothing ever pushed twice',
  kthSmallest(buildTree([1, null, 2, null, 3]), 3),
  3
);
test('flatten version agrees on the example', kthSmallestFlatten(buildTree([3, 1, 4, null, 2]), 4), 4);

summary('Day 055 - Kth Smallest Element in a BST');

module.exports = { kthSmallest, kthSmallestFlatten };
