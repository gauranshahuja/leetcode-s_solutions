'use strict';

const { test, summary } = require('../../lib/check');

function merge(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let write = m + n - 1;

  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[write] = nums1[i];
      i -= 1;
    } else {
      nums1[write] = nums2[j];
      j -= 1;
    }
    write -= 1;
  }

  return nums1;
}

test('example 1', merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3), [1, 2, 2, 3, 5, 6]);
test('example 2 - nums2 is empty', merge([1], 1, [], 0), [1]);
test('example 3 - nums1 has no real values', merge([0], 0, [1], 1), [1]);
test('every nums2 value is smaller', merge([4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3), [1, 2, 3, 4, 5, 6]);
test('every nums2 value is larger', merge([1, 2, 3, 0, 0, 0], 3, [4, 5, 6], 3), [1, 2, 3, 4, 5, 6]);
test('duplicates across both arrays', merge([1, 1, 0, 0], 2, [1, 1], 2), [1, 1, 1, 1]);
test('negatives, nums1 value ends up last', merge([-1, 0, 0, 0], 1, [-3, -2, 5], 3), [-3, -2, -1, 5]);
test('single value each, nums2 smaller', merge([2, 0], 1, [1], 1), [1, 2]);
test('interleaved', merge([1, 4, 7, 0, 0, 0], 3, [2, 5, 8], 3), [1, 2, 4, 5, 7, 8]);

summary('Day 008 - Merge Sorted Array');

module.exports = { merge };
