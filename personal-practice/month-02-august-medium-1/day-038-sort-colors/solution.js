'use strict';

const { test, summary } = require('../../lib/check');

function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low += 1;
      mid += 1;
    } else if (nums[mid] === 1) {
      mid += 1;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high -= 1;
    }
  }

  return nums;
}

test('leetcode example', sortColors([2, 0, 2, 1, 1, 0]), [0, 0, 1, 1, 2, 2]);
test('three elements one of each', sortColors([2, 0, 1]), [0, 1, 2]);
test('the case that caught my mid++ bug', sortColors([1, 2, 0]), [0, 1, 2]);
test('empty array', sortColors([]), []);
test('all the same colour', sortColors([2, 2, 2]), [2, 2, 2]);
test('fully reversed', sortColors([2, 2, 1, 1, 0, 0]), [0, 0, 1, 1, 2, 2]);
test('no 1s at all', sortColors([2, 0, 2, 0]), [0, 0, 2, 2]);

const target = [1, 0, 2, 1, 0];
const returned = sortColors(target);
test('sorted in place, same array object back', returned === target, true);
test("the caller's array really was mutated", target, [0, 0, 1, 1, 2]);

summary('Day 038 - Sort Colors');

module.exports = { sortColors };
