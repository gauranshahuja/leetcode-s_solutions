'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree, treeToArray } = require('../../lib/structures');

function invertTree(root) {
  if (root === null) return null;

  const left = invertTree(root.left);
  const right = invertTree(root.right);

  root.left = right;
  root.right = left;

  return root;
}

const inv = (values) => treeToArray(invertTree(buildTree(values)));

test('example 1', inv([4, 2, 7, 1, 3, 6, 9]), [4, 7, 2, 9, 6, 3, 1]);
test('example 2', inv([2, 1, 3]), [2, 3, 1]);
test('empty tree', inv([]), []);
test('single node', inv([1]), [1]);
test('left chain becomes a right chain', inv([1, 2, null, 3]), [1, null, 2, null, 3]);
test('already mirrored tree comes back the same', inv([1, 2, 2, 3, null, null, 3]), [1, 2, 2, 3, null, null, 3]);
test('missing children stay missing', inv([1, 2, 3, null, 4]), [1, 3, 2, null, null, 4]);
test('inverting twice gives the original back', treeToArray(invertTree(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9])))), [4, 2, 7, 1, 3, 6, 9]);

summary('Day 022 - Invert Binary Tree');

module.exports = { invertTree };
