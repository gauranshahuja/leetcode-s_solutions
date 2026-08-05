'use strict';

const { test, summary } = require('../../lib/check');

function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const shorter = Math.min(height[left], height[right]);
    const area = shorter * (right - left);
    if (area > best) best = area;

    if (height[left] < height[right]) {
      left += 1;
    } else {
      right -= 1;
    }
  }

  return best;
}

test('leetcode example', maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
test('two walls of height 1', maxArea([1, 1]), 1);
test('one wall holds nothing', maxArea([5]), 0);
test('empty input', maxArea([]), 0);
test('strictly increasing', maxArea([1, 2, 3, 4, 5]), 6);
test('strictly decreasing', maxArea([5, 4, 3, 2, 1]), 6);
test('zero height walls', maxArea([0, 0, 0]), 0);
test('tall wall in the middle is not the answer', maxArea([2, 3, 10, 5, 7, 8, 9]), 36);
test('narrow but tall beats wide but short', maxArea([1, 2, 4, 3]), 4);

summary('Day 035 - Container With Most Water');

module.exports = { maxArea };
