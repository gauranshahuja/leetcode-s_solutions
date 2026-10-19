'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function countNodesNaive(root) {
  if (!root) return 0;
  return 1 + countNodesNaive(root.left) + countNodesNaive(root.right);
}

function leftHeight(node) {
  let h = 0;
  while (node) {
    h += 1;
    node = node.left;
  }
  return h;
}

function rightHeight(node) {
  let h = 0;
  while (node) {
    h += 1;
    node = node.right;
  }
  return h;
}

function countNodes(root) {
  if (!root) return 0;

  const lh = leftHeight(root);
  const rh = rightHeight(root);

  if (lh === rh) return 2 ** lh - 1;

  return 1 + countNodes(root.left) + countNodes(root.right);
}

function completeTree(n) {
  return buildTree(Array.from({ length: n }, (_, i) => i + 1));
}

test('example 1', countNodes(buildTree([1, 2, 3, 4, 5, 6])), 6);
test('empty tree', countNodes(buildTree([])), 0);
test('single node', countNodes(buildTree([1])), 1);
test('two nodes - left child only', countNodes(buildTree([1, 2])), 2);
test('perfect tree of 7', countNodes(completeTree(7)), 7);
test('perfect tree of 15', countNodes(completeTree(15)), 15);
test('last level holds exactly one node', countNodes(completeTree(8)), 8);
test('last level stops inside the right subtree', countNodes(completeTree(12)), 12);
test('naive agrees on the awkward one', countNodesNaive(completeTree(12)), 12);

const sizes = Array.from({ length: 41 }, (_, n) => countNodes(completeTree(n)));
test('matches n for every n in 0..40', sizes, Array.from({ length: 41 }, (_, n) => n));

summary('Day 110 - Count Complete Tree Nodes');

module.exports = { countNodes, countNodesNaive, leftHeight, rightHeight };
