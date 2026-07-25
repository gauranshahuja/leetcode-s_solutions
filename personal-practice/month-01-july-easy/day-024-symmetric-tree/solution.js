'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function isMirror(a, b) {
  if (a === null && b === null) return true;

  if (a === null || b === null) return false;

  if (a.val !== b.val) return false;

  return isMirror(a.left, b.right) && isMirror(a.right, b.left);
}

function isSymmetric(root) {
  if (root === null) return true;
  return isMirror(root.left, root.right);
}

const sym = (values) => isSymmetric(buildTree(values));

test('example 1 - symmetric', sym([1, 2, 2, 3, 4, 4, 3]), true);
test('example 2 - both 3s hang right', sym([1, 2, 2, null, 3, null, 3]), false);
test('empty tree', sym([]), true);
test('single node', sym([1]), true);
test('two matching leaves', sym([1, 2, 2]), true);
test('inner children only, correctly mirrored', sym([1, 2, 2, null, 3, 3, null]), true);
test('outer children only, correctly mirrored', sym([1, 2, 2, 3, null, null, 3]), true);
test('shape mirrors but a leaf value does not', sym([1, 2, 2, 3, 4, 4, 5]), false);
test('repeated values that still reflect', sym([1, 2, 2, 2, 3, 3, 2]), true);

summary('Day 024 - Symmetric Tree');

module.exports = { isSymmetric, isMirror };
