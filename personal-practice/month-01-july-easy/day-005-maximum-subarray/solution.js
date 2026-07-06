'use strict';

const { test, summary } = require('../../lib/check');

function maxSubArrayBrute(nums) {
  if (nums.length === 0) return 0;

  let best = -Infinity;
  for (let i = 0; i < nums.length; i += 1) {
    let sum = 0;
    for (let j = i; j < nums.length; j += 1) {
      sum += nums[j];
      if (sum > best) best = sum;
    }
  }
  return best;
}

function maxSubArray(nums) {
  if (nums.length === 0) return 0;

  let running = nums[0];
  let best = nums[0];

  for (let i = 1; i < nums.length; i += 1) {
    running = Math.max(nums[i], running + nums[i]);
    best = Math.max(best, running);
  }

  return best;
}

test('example 1 - [4,-1,2,1]', maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
test('example 2 - single element', maxSubArray([1]), 1);
test('example 3 - whole array wins', maxSubArray([5, 4, -1, 7, 8]), 23);
test('all negative, answer is the least negative', maxSubArray([-3, -1, -7, -4]), -1);
test('single negative element', maxSubArray([-1]), -1);
test('empty array', maxSubArray([]), 0);
test('dips are worth crossing', maxSubArray([2, -1, 2, -1, 2]), 4);
test('dip is too deep to cross', maxSubArray([2, -5, 3]), 3);
test('brute force agrees on example 1', maxSubArrayBrute([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);

summary('Day 005 - Maximum Subarray');

module.exports = { maxSubArray, maxSubArrayBrute };
