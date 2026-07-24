'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function isSameTree(p, q) {
  if (p === null && q === null) return true;

  if (p === null || q === null) return false;

  if (p.val !== q.val) return false;

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

const same = (a, b) => isSameTree(buildTree(a), buildTree(b));

test('identical trees', same([1, 2, 3], [1, 2, 3]), true);
test('same values, mirrored shape', same([1, 2], [1, null, 2]), false);
test('same shape, one value off', same([1, 2, 1], [1, 1, 2]), false);
test('both empty', same([], []), true);
test('one empty, one not', same([], [1]), false);
test('single nodes with different values', same([1], [2]), false);
test('duplicate values everywhere', same([2, 2, 2, 2], [2, 2, 2, 2]), true);
test('one extra leaf at the bottom', same([1, 2, 3, 4], [1, 2, 3]), false);
test('mismatch hides three levels down', same([5, 4, 7, 3, null, 2], [5, 4, 7, 3, null, 9]), false);

summary('Day 023 - Same Tree');

module.exports = { isSameTree };
