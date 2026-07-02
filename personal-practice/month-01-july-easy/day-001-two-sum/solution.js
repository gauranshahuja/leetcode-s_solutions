'use strict';

const { test, summary } = require('../../lib/check');

function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}

function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];

    if (seen.has(need)) {
      return [seen.get(need), i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

test('example 1', twoSum([2, 7, 11, 15], 9), [0, 1]);
test('example 2', twoSum([3, 2, 4], 6), [1, 2]);
test('duplicate values', twoSum([3, 3], 6), [0, 1]);
test('negative numbers', twoSum([-3, 4, 3, 90], 0), [0, 2]);
test('answer at the very end', twoSum([1, 5, 8, 2, 9], 11), [3, 4]);
test('target is double a value, must not reuse it', twoSum([5, 1, 10], 10), []);
test('brute force agrees', twoSumBrute([2, 7, 11, 15], 9), [0, 1]);

summary('Day 001 - Two Sum');

module.exports = { twoSum, twoSumBrute };
