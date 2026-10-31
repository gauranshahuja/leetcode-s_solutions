'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function rob(root) {
  const [robbed, skipped] = best(root);
  return Math.max(robbed, skipped);
}

function best(node) {
  if (node === null) return [0, 0];

  const left = best(node.left);
  const right = best(node.right);

  const robbed = node.val + left[1] + right[1];

  const skipped = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

  return [robbed, skipped];
}

test('example 1 - root plus both grandchildren', rob(buildTree([3, 2, 3, null, 3, null, 1])), 7);
test('example 2 - skipping the root wins', rob(buildTree([3, 4, 5, 1, 3, null, 1])), 9);
test('empty tree', rob(buildTree([])), 0);
test('single node', rob(buildTree([1])), 1);
test('two children beat the root', rob(buildTree([1, 2, 3])), 5);
test('root beats both children', rob(buildTree([4, 1, 2])), 4);
test('grandchild on one side only', rob(buildTree([2, 1, 3, null, 4])), 7);
test('left-skewed chain, take every other node', rob(buildTree([4, 1, null, 2, null, 3])), 7);
test('root plus two grandchildren across both sides', rob(buildTree([3, 2, 3, 3, null, null, 3])), 9);

summary('Day 122 - House Robber III');

module.exports = { rob, best };
