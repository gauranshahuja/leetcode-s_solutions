'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function verticalTraversal(root) {
  if (!root) return [];

  const byCol = new Map();
  const queue = [[root, 0, 0]];

  for (let i = 0; i < queue.length; i += 1) {
    const [node, row, col] = queue[i];

    if (!byCol.has(col)) byCol.set(col, []);
    byCol.get(col).push([row, node.val]);

    if (node.left) queue.push([node.left, row + 1, col - 1]);
    if (node.right) queue.push([node.right, row + 1, col + 1]);
  }

  const columns = [...byCol.keys()].sort((a, b) => a - b);

  return columns.map((col) =>
    byCol
      .get(col)
      .sort((a, b) => a[0] - b[0] || a[1] - b[1])
      .map(([, value]) => value)
  );
}

test(
  'example 1',
  verticalTraversal(buildTree([3, 9, 20, null, null, 15, 7])),
  [[9], [3, 15], [20], [7]]
);
test(
  'example 2 - perfect tree, 5 and 6 share column 0',
  verticalTraversal(buildTree([1, 2, 3, 4, 5, 6, 7])),
  [[4], [2], [1, 5, 6], [3], [7]]
);
test(
  'example 3 - same tree with 5 and 6 swapped, output is identical',
  verticalTraversal(buildTree([1, 2, 3, 4, 6, 5, 7])),
  [[4], [2], [1, 5, 6], [3], [7]]
);
test('single node', verticalTraversal(buildTree([1])), [[1]]);
test('empty tree', verticalTraversal(buildTree([])), []);
test(
  'column 0 collected from two different rows',
  verticalTraversal(buildTree([0, 8, 1, null, null, 3, 2])),
  [[8], [0, 3], [1], [2]]
);
test(
  'left-skewed chain, one node per column',
  verticalTraversal(buildTree([1, 2, null, 3, null, 4])),
  [[4], [3], [2], [1]]
);
test(
  'three nodes in column 0, duplicates tie-broken by value',
  verticalTraversal(buildTree([3, 1, 4, 0, 2, 2, 5])),
  [[0], [1], [3, 2, 2], [4], [5]]
);
test(
  'negative values - smaller still means more negative, so -6 before -5',
  verticalTraversal(buildTree([1, -2, -3, -4, -5, -6, -7])),
  [[-4], [-2], [1, -6, -5], [-3], [-7]]
);

summary('Day 111 - Vertical Order Traversal of a Binary Tree');

module.exports = { verticalTraversal };
