'use strict';

const { test, summary } = require('../../lib/check');

function findDuplicateWithSet(nums) {
  const seen = new Set();
  for (const v of nums) {
    if (seen.has(v)) return v;
    seen.add(v);
  }
  return -1;
}

function findDuplicate(nums) {
  let slow = 0;
  let fast = 0;

  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  slow = 0;
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }

  return slow;
}

test('example 1', findDuplicate([1, 3, 4, 2, 2]), 2);
test('example 2 - duplicate is also the first element', findDuplicate([3, 1, 3, 4, 2]), 3);
test('smallest possible input, n = 1', findDuplicate([1, 1]), 1);
test('duplicate adjacent at the front', findDuplicate([1, 1, 2]), 1);
test('every entry is the same value', findDuplicate([2, 2, 2, 2, 2]), 2);
test('repeated three times, long tail', findDuplicate([2, 5, 9, 6, 9, 3, 8, 9, 7, 1]), 9);
test('duplicate is the largest value', findDuplicate([1, 4, 4, 2, 4]), 4);
test('cycle entrance is not the meeting point', findDuplicate([1, 2, 3, 4, 5, 6, 7, 8, 9, 5]), 5);
test('set version agrees', findDuplicateWithSet([2, 5, 9, 6, 9, 3, 8, 9, 7, 1]), 9);

summary('Day 097 - Find the Duplicate Number');

module.exports = { findDuplicate, findDuplicateWithSet };
