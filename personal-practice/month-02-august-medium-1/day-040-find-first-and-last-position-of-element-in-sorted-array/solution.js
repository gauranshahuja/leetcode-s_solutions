'use strict';

const { test, summary } = require('../../lib/check');

function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);

    if (nums[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return lo;
}

function searchRange(nums, target) {
  const first = lowerBound(nums, target);

  if (first === nums.length || nums[first] !== target) return [-1, -1];

  const last = lowerBound(nums, target + 1) - 1;
  return [first, last];
}

test('example 1', searchRange([5, 7, 7, 8, 8, 10], 8), [3, 4]);
test('example 2 - sits between two present values', searchRange([5, 7, 7, 8, 8, 10], 6), [-1, -1]);
test('empty array', searchRange([], 0), [-1, -1]);
test('single element that matches', searchRange([1], 1), [0, 0]);
test('every element is the target', searchRange([2, 2, 2, 2], 2), [0, 3]);
test('target is the last element', searchRange([1, 2, 3], 3), [2, 2]);
test('target below everything', searchRange([1, 2, 3], 0), [-1, -1]);
test('target above everything', searchRange([1, 2, 3], 9), [-1, -1]);
test('negatives, block in the middle', searchRange([-3, -1, -1, 0], -1), [1, 2]);

summary('Day 040 - Find First and Last Position of Element in Sorted Array');

module.exports = { searchRange, lowerBound };
