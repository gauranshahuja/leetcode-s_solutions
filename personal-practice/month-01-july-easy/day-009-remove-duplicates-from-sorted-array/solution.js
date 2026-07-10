'use strict';

const { test, summary } = require('../../lib/check');

function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let write = 1;

  for (let read = 1; read < nums.length; read += 1) {
    if (nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write += 1;
    }
  }

  return write;
}

function dedupe(nums) {
  const k = removeDuplicates(nums);
  return [k, nums.slice(0, k)];
}

test('example 1', dedupe([1, 1, 2]), [2, [1, 2]]);
test('example 2', dedupe([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]), [5, [0, 1, 2, 3, 4]]);
test('empty array', dedupe([]), [0, []]);
test('single element', dedupe([1]), [1, [1]]);
test('every element the same, run longer than two', dedupe([2, 2, 2, 2]), [1, [2]]);
test('already distinct, nothing moves', dedupe([1, 2, 3]), [3, [1, 2, 3]]);
test('negatives and a zero', dedupe([-3, -3, -1, 0, 0]), [3, [-3, -1, 0]]);
test('only the last value repeats', dedupe([1, 2, 3, 3]), [3, [1, 2, 3]]);

summary('Day 009 - Remove Duplicates from Sorted Array');

module.exports = { removeDuplicates };
