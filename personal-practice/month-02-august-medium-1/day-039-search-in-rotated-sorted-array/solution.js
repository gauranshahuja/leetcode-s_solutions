'use strict';

const { test, summary } = require('../../lib/check');

function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);

    if (nums[mid] === target) return mid;

    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) {
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[hi]) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
  }

  return -1;
}

test('example 1 - target sits after the pivot', search([4, 5, 6, 7, 0, 1, 2], 0), 4);
test('example 2 - target is not present', search([4, 5, 6, 7, 0, 1, 2], 3), -1);
test('target is the peak just before the pivot', search([4, 5, 6, 7, 0, 1, 2], 7), 3);
test('target is the very last element', search([4, 5, 6, 7, 0, 1, 2], 2), 6);
test('single element, no match', search([1], 0), -1);
test('empty array', search([], 5), -1);
test('two elements, rotated', search([3, 1], 1), 1);
test('three elements, target in the sorted right half', search([5, 1, 3], 3), 2);
test('not rotated at all, plain binary search', search([1, 2, 3, 4, 5], 4), 3);

summary('Day 039 - Search in Rotated Sorted Array');

module.exports = { search };
