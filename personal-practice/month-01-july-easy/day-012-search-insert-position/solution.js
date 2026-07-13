'use strict';

const { test, summary } = require('../../lib/check');

function searchInsertScan(nums, target) {
  for (let i = 0; i < nums.length; i += 1) {
    if (nums[i] >= target) return i;
  }
  return nums.length;
}

function searchInsert(nums, target) {
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

test('target present in the middle', searchInsert([1, 3, 5, 6], 5), 2);
test('target missing, lands between', searchInsert([1, 3, 5, 6], 2), 1);
test('target bigger than everything', searchInsert([1, 3, 5, 6], 7), 4);
test('target smaller than everything', searchInsert([1, 3, 5, 6], 0), 0);
test('empty array', searchInsert([], 5), 0);
test('single element, target below', searchInsert([1], 0), 0);
test('single element, target above', searchInsert([1], 2), 1);
test('repeats, should give the first slot', searchInsert([1, 1, 1, 3], 1), 0);
test('scan version agrees', searchInsertScan([1, 3, 5, 6], 2), 1);

summary('Day 012 - Search Insert Position');

module.exports = { searchInsert, searchInsertScan };
