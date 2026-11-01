'use strict';

const { test, summary } = require('../../lib/check');

function trapNaive(height) {
  let total = 0;

  for (let i = 0; i < height.length; i += 1) {
    let maxLeft = 0;
    for (let l = 0; l <= i; l += 1) maxLeft = Math.max(maxLeft, height[l]);

    let maxRight = 0;
    for (let r = i; r < height.length; r += 1) maxRight = Math.max(maxRight, height[r]);

    total += Math.min(maxLeft, maxRight) - height[i];
  }

  return total;
}

function trapPrefix(height) {
  const n = height.length;
  if (n === 0) return 0;

  const maxLeft = new Array(n);
  const maxRight = new Array(n);

  maxLeft[0] = height[0];
  for (let i = 1; i < n; i += 1) maxLeft[i] = Math.max(maxLeft[i - 1], height[i]);

  maxRight[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i -= 1) maxRight[i] = Math.max(maxRight[i + 1], height[i]);

  let total = 0;
  for (let i = 0; i < n; i += 1) total += Math.min(maxLeft[i], maxRight[i]) - height[i];

  return total;
}

function trap(height) {
  let lo = 0;
  let hi = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;

  while (lo < hi) {
    if (height[lo] < height[hi]) {
      if (height[lo] > leftMax) leftMax = height[lo];
      else total += leftMax - height[lo];
      lo += 1;
    } else {
      if (height[hi] > rightMax) rightMax = height[hi];
      else total += rightMax - height[hi];
      hi -= 1;
    }
  }

  return total;
}

test('example 1', trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
test('example 2', trap([4, 2, 0, 3, 2, 5]), 9);
test('empty array', trap([]), 0);
test('single bar holds nothing', trap([7]), 0);
test('monotone descending never traps', trap([5, 4, 3, 2, 1]), 0);
test('flat bottom between two walls', trap([4, 1, 1, 1, 4]), 9);
test('smallest real dip', trap([2, 0, 2]), 2);
test('prefix/suffix version agrees', trapPrefix([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
test('naive version agrees', trapNaive([4, 2, 0, 3, 2, 5]), 9);

summary('Day 123 - Trapping Rain Water');

module.exports = { trap, trapPrefix, trapNaive };
