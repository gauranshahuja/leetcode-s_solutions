'use strict';

const { test, summary } = require('../../lib/check');
const { TreeNode, buildTree } = require('../../lib/structures');

function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

function maxDepthBFS(root) {
  if (root === null) return 0;

  const queue = [root];
  let head = 0;
  let depth = 0;

  while (head < queue.length) {
    const levelSize = queue.length - head;

    for (let i = 0; i < levelSize; i += 1) {
      const node = queue[head];
      head += 1;
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    depth += 1;
  }

  return depth;
}

test('example from the problem', maxDepth(buildTree([3, 9, 20, null, null, 15, 7])), 3);
test('root with only a right child', maxDepth(buildTree([1, null, 2])), 2);
test('empty tree', maxDepth(buildTree([])), 0);
test('single node', maxDepth(buildTree([0])), 1);
test('one long left-leaning chain', maxDepth(buildTree([1, 2, null, 3, null, 4])), 4);
test('lopsided, deeper branch wins', maxDepth(buildTree([1, 2, 3, 4, null, null, 5])), 3);

const byHand = new TreeNode(1, new TreeNode(2, new TreeNode(3)), null);
test('hand-built chain of three', maxDepth(byHand), 3);

test('BFS agrees on the example', maxDepthBFS(buildTree([3, 9, 20, null, null, 15, 7])), 3);
test('BFS agrees on the chain and on empty', [maxDepthBFS(buildTree([1, 2, null, 3, null, 4])), maxDepthBFS(null)], [4, 0]);

summary('Day 021 - Maximum Depth of Binary Tree');

module.exports = { maxDepth, maxDepthBFS };
