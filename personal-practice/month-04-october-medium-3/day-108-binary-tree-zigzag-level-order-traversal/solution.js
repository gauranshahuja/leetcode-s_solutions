'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function zigzagLevelOrder(root) {
  if (!root) return [];

  const out = [];
  let queue = [root];
  let leftToRight = true;

  while (queue.length) {
    const level = [];
    const next = [];

    for (const node of queue) {
      level.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }

    out.push(leftToRight ? level : level.reverse());
    leftToRight = !leftToRight;
    queue = next;
  }

  return out;
}

test(
  'example 1',
  zigzagLevelOrder(buildTree([3, 9, 20, null, null, 15, 7])),
  [[3], [20, 9], [15, 7]]
);
test('single node', zigzagLevelOrder(buildTree([1])), [[1]]);
test('empty tree', zigzagLevelOrder(buildTree([])), []);
test(
  'perfect tree, level 2 is back to left-to-right',
  zigzagLevelOrder(buildTree([1, 2, 3, 4, 5, 6, 7])),
  [[1], [3, 2], [4, 5, 6, 7]]
);
test(
  'four levels, so two reversed ones',
  zigzagLevelOrder(buildTree([1, 2, 3, 4, null, null, 5, 6])),
  [[1], [3, 2], [4, 5], [6]]
);
test(
  'left-skewed chain - reversing one-element levels changes nothing',
  zigzagLevelOrder(buildTree([1, 2, null, 3, null, 4])),
  [[1], [2], [3], [4]]
);
test(
  'gaps in the middle still line up',
  zigzagLevelOrder(buildTree([1, 2, 3, null, 4, null, 5])),
  [[1], [3, 2], [4, 5]]
);
test(
  'negative and duplicate values are untouched',
  zigzagLevelOrder(buildTree([0, -1, -1, 2, 2])),
  [[0], [-1, -1], [2, 2]]
);

summary('Day 108 - Binary Tree Zigzag Level Order Traversal');

module.exports = { zigzagLevelOrder };
