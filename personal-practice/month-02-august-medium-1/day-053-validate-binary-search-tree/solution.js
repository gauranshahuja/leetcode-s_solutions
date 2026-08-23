'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function isValidBstLocal(root) {
  if (!root) return true;
  if (root.left && root.left.val >= root.val) return false;
  if (root.right && root.right.val <= root.val) return false;
  return isValidBstLocal(root.left) && isValidBstLocal(root.right);
}

function isValidBST(root) {
  const walk = (node, low, high) => {
    if (!node) return true;
    if (node.val <= low || node.val >= high) return false;

    return walk(node.left, low, node.val) && walk(node.right, node.val, high);
  };

  return walk(root, -Infinity, Infinity);
}

test('example 1 - valid', isValidBST(buildTree([2, 1, 3])), true);
test('example 2 - 3 is in the wrong subtree', isValidBST(buildTree([5, 1, 4, null, null, 3, 6])), false);
test(
  'the tree that broke my first idea',
  isValidBST(buildTree([5, 1, 6, null, null, 4, 7])),
  false
);
test('local-children check wrongly accepts that same tree', isValidBstLocal(buildTree([5, 1, 6, null, null, 4, 7])), true);
test('single node', isValidBST(buildTree([42])), true);
test('empty tree', isValidBST(buildTree([])), true);
test('equal values are not allowed', isValidBST(buildTree([2, 2, 3])), false);
test('int32 extremes do not confuse the bounds', isValidBST(buildTree([-2147483648, null, 2147483647])), true);
test('deeper valid tree', isValidBST(buildTree([10, 5, 15, 1, 8, null, 20])), true);

summary('Day 053 - Validate Binary Search Tree');

module.exports = { isValidBST, isValidBstLocal };
