'use strict';

const { test, summary } = require('../../lib/check');

function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);

    if (nums[mid] === target) return mid;

    if (nums[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return -1;
}

test('example 1 - target exists', search([-1, 0, 3, 5, 9, 12], 9), 4);
test('example 2 - target missing', search([-1, 0, 3, 5, 9, 12], 2), -1);
test('empty array', search([], 5), -1);
test('single element, match', search([5], 5), 0);
test('single element, no match', search([5], -5), -1);
test('first element', search([1, 3, 5, 7], 1), 0);
test('last element', search([1, 3, 5, 7], 7), 3);
test('two elements, target is the second', search([1, 2], 2), 1);
test('target larger than everything', search([2, 4, 6], 7), -1);

summary('Day 011 - Binary Search');

module.exports = { search };
