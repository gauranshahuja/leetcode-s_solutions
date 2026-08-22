'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function levelOrder(root) {
  if (!root) return [];

  const out = [];
  const queue = [root];
  let head = 0;

  while (head < queue.length) {
    const levelSize = queue.length - head;
    const level = [];

    for (let i = 0; i < levelSize; i += 1) {
      const node = queue[head];
      head += 1;

      level.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    out.push(level);
  }

  return out;
}

test('example 1', levelOrder(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]]);
test('single node', levelOrder(buildTree([1])), [[1]]);
test('empty tree', levelOrder(buildTree([])), []);
test(
  'left-skewed chain is four levels of one',
  levelOrder(buildTree([1, 2, null, 3, null, 4])),
  [[1], [2], [3], [4]]
);
test(
  'holes in the middle still pack left to right',
  levelOrder(buildTree([1, 2, 3, 4, null, null, 5])),
  [[1], [2, 3], [4, 5]]
);
test(
  'full tree of depth 3',
  levelOrder(buildTree([1, 2, 3, 4, 5, 6, 7])),
  [[1], [2, 3], [4, 5, 6, 7]]
);
test('negative values survive', levelOrder(buildTree([-1, -2, 0])), [[-1], [-2, 0]]);
test('a zero node is not treated as missing', levelOrder(buildTree([0, 0, 0])), [[0], [0, 0]]);

summary('Day 052 - Binary Tree Level Order Traversal');

module.exports = { levelOrder };
