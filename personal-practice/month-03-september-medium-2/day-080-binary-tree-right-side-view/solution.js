'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function rightSideView(root) {
  if (!root) return [];

  const out = [];
  let level = [root];

  while (level.length) {
    out.push(level[level.length - 1].val);

    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }

  return out;
}

function rightSideViewDfs(root) {
  const out = [];

  function walk(node, depth) {
    if (!node) return;
    if (depth === out.length) out.push(node.val);
    walk(node.right, depth + 1);
    walk(node.left, depth + 1);
  }

  walk(root, 0);
  return out;
}

test('example - [1,2,3,null,5,null,4]', rightSideView(buildTree([1, 2, 3, null, 5, null, 4])), [1, 3, 4]);
test('right child only', rightSideView(buildTree([1, null, 3])), [1, 3]);
test('empty tree', rightSideView(buildTree([])), []);
test('single node', rightSideView(buildTree([42])), [42]);
test('left child only - it is still the rightmost of its level', rightSideView(buildTree([1, 2])), [1, 2]);
test('left-leaning chain', rightSideView(buildTree([1, 2, null, 3])), [1, 2, 3]);
test(
  'deepest level is reachable only through a left child',
  rightSideView(buildTree([1, 2, 3, 4, null, null, null, 5])),
  [1, 3, 4, 5]
);
test('mixed tree', rightSideView(buildTree([5, 3, 8, 1, 4, null, 9, null, null, null, null, 7])), [5, 8, 9, 7]);
test(
  'DFS version agrees on the awkward tree',
  rightSideViewDfs(buildTree([1, 2, 3, 4, null, null, null, 5])),
  rightSideView(buildTree([1, 2, 3, 4, null, null, null, 5]))
);

summary('Day 080 - Binary Tree Right Side View');

module.exports = { rightSideView, rightSideViewDfs };
