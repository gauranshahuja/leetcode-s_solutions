'use strict';

const { test, summary } = require('../../lib/check');
const { buildTree } = require('../../lib/structures');

function pathSumBrute(root, targetSum) {
  if (!root) return 0;
  return (
    countStartingHere(root, targetSum) +
    pathSumBrute(root.left, targetSum) +
    pathSumBrute(root.right, targetSum)
  );
}

function countStartingHere(node, remaining) {
  if (!node) return 0;
  const rest = remaining - node.val;
  return (
    (rest === 0 ? 1 : 0) +
    countStartingHere(node.left, rest) +
    countStartingHere(node.right, rest)
  );
}

function pathSum(root, targetSum) {
  const seen = new Map([[0, 1]]);
  let count = 0;

  function walk(node, running) {
    if (!node) return;

    const sum = running + node.val;

    count += seen.get(sum - targetSum) || 0;

    seen.set(sum, (seen.get(sum) || 0) + 1);

    walk(node.left, sum);
    walk(node.right, sum);

    seen.set(sum, seen.get(sum) - 1);
  }

  walk(root, 0);
  return count;
}

const example = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1];

test('example 1, target 8', pathSum(buildTree(example), 8), 3);
test(
  'example 2, target 22',
  pathSum(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]), 22),
  3
);
test('empty tree', pathSum(buildTree([]), 0), 0);
test('single node that matches', pathSum(buildTree([7]), 7), 1);
test('single node that does not match', pathSum(buildTree([7]), 3), 0);
test('all zeros, target 0 - overlapping paths all count', pathSum(buildTree([0, 0, 0]), 0), 5);
test(
  'negatives, so a branch cannot be pruned early',
  pathSum(buildTree([1, -2, -3, 1, 3, -2, null, -1]), -1),
  4
);
test('target larger than any path', pathSum(buildTree(example), 1000), 0);
test('brute force agrees on example 1', pathSumBrute(buildTree(example), 8), 3);

summary('Day 082 - Path Sum III');

module.exports = { pathSum, pathSumBrute };
