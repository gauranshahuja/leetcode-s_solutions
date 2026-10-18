'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function maxPathSum(root) {
  if (!root) return 0;

  let best = -Infinity;

  function down(node) {
    if (!node) return 0;

    const left = Math.max(0, down(node.left));
    const right = Math.max(0, down(node.right));

    best = Math.max(best, node.val + left + right);

    return node.val + Math.max(left, right);
  }

  down(root);
  return best;
}

test('example 1 - path through the root', maxPathSum(buildTree([1, 2, 3])), 6);
test(
  'example 2 - best path skips the root entirely',
  maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7])),
  42
);
test('single negative node is the answer', maxPathSum(buildTree([-3])), -3);
test('all negative, best is the least bad single node', maxPathSum(buildTree([-1, -2, -3])), -1);
test('negative root, better to stop at the child', maxPathSum(buildTree([-5, 10])), 10);
test('negative children, root alone wins', maxPathSum(buildTree([2, -1, -2])), 2);
test('child is worth taking', maxPathSum(buildTree([2, -1])), 2);
test(
  'turn happens at a leaf-ish node, not the root',
  maxPathSum(buildTree([1, -2, -3, 1, 3, -2, null, -1])),
  3
);
test(
  'long path bending through the root',
  maxPathSum(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1])),
  48
);

summary('Day 109 - Binary Tree Maximum Path Sum');

module.exports = { maxPathSum };
