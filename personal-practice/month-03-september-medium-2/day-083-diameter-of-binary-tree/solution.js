'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function diameterOfBinaryTree(root) {
  let best = 0;

  function height(node) {
    if (!node) return 0;

    const left = height(node.left);
    const right = height(node.right);

    if (left + right > best) best = left + right;

    return 1 + Math.max(left, right);
  }

  height(root);
  return best;
}

function diameterPair(root) {
  function walk(node) {
    if (!node) return [0, 0];

    const [lh, ld] = walk(node.left);
    const [rh, rd] = walk(node.right);

    return [1 + Math.max(lh, rh), Math.max(lh + rh, ld, rd)];
  }

  return walk(root)[1];
}

test('example - path 4,2,1,3 has 3 edges', diameterOfBinaryTree(buildTree([1, 2, 3, 4, 5])), 3);
test('two nodes', diameterOfBinaryTree(buildTree([1, 2])), 1);
test('single node is 0 edges, not 1', diameterOfBinaryTree(buildTree([42])), 0);
test('empty tree', diameterOfBinaryTree(buildTree([])), 0);
test(
  'right-leaning chain of 4 nodes',
  diameterOfBinaryTree(buildTree([1, null, 2, null, 3, null, 4])),
  3
);
test(
  'longest path does not touch the root',
  diameterOfBinaryTree(buildTree([1, 2, null, 3, 4, 5, null, null, 6])),
  4
);
test(
  'perfect tree of 7 nodes bends at the root',
  diameterOfBinaryTree(buildTree([1, 2, 3, 4, 5, 6, 7])),
  4
);
test(
  'pair version agrees on the off-centre tree',
  diameterPair(buildTree([1, 2, null, 3, 4, 5, null, null, 6])),
  4
);
test('pair version agrees on a single node', diameterPair(buildTree([42])), 0);

summary('Day 083 - Diameter of Binary Tree');

module.exports = { diameterOfBinaryTree, diameterPair };
