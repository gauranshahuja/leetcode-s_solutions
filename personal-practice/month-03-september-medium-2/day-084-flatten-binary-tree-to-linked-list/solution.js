'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree, preorder } = require('../../lib/structures');

function flatten(root) {
  let prev = null;

  function walk(node) {
    if (!node) return;

    walk(node.right);
    walk(node.left);

    node.right = prev;
    node.left = null;
    prev = node;
  }

  walk(root);
  return root;
}

function flattenMorris(root) {
  let cur = root;

  while (cur) {
    if (cur.left) {
      let rightmost = cur.left;
      while (rightmost.right) rightmost = rightmost.right;

      rightmost.right = cur.right;
      cur.right = cur.left;
      cur.left = null;
    }
    cur = cur.right;
  }

  return root;
}

function spine(root) {
  const out = [];
  for (let node = root; node; node = node.right) out.push(node.val);
  return out;
}

function anyLeftLeftOver(root) {
  for (let node = root; node; node = node.right) {
    if (node.left !== null) return true;
  }
  return false;
}

const example = [1, 2, 5, 3, 4, null, 6];

test('example, chain order', spine(flatten(buildTree(example))), [1, 2, 3, 4, 5, 6]);
test('example, every left cleared', anyLeftLeftOver(flatten(buildTree(example))), false);
test('empty tree stays empty', spine(flatten(buildTree([]))), []);
test('single node', spine(flatten(buildTree([7]))), [7]);
test('already a right chain is untouched', spine(flatten(buildTree([1, null, 2, null, 3]))), [1, 2, 3]);
test('left-only chain gets reversed onto the right', spine(flatten(buildTree([1, 2, null, 3]))), [1, 2, 3]);
test('morris version, example', spine(flattenMorris(buildTree(example))), [1, 2, 3, 4, 5, 6]);
test(
  'morris version on a lopsided tree',
  spine(flattenMorris(buildTree([1, 2, null, 3, 4, 5, null, null, 6]))),
  preorder(buildTree([1, 2, null, 3, 4, 5, null, null, 6]))
);
test('morris version, every left cleared', anyLeftLeftOver(flattenMorris(buildTree(example))), false);

summary('Day 084 - Flatten Binary Tree to Linked List');

module.exports = { flatten, flattenMorris, spine };
