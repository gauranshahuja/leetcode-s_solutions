'use strict';

const { test, summary } = require('../../lib/check');

function longestOnes(nums, k) {
  let left = 0;
  let zeros = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right += 1) {
    if (nums[right] === 0) zeros += 1;

    while (zeros > k) {
      if (nums[left] === 0) zeros -= 1;
      left += 1;
    }

    const length = right - left + 1;
    if (length > best) best = length;
  }

  return best;
}

test('example 1 - k=2', longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2), 6);
test('example 2 - k=3', longestOnes([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3), 10);
test('empty array', longestOnes([], 3), 0);
test('single zero with no budget', longestOnes([0], 0), 0);
test('single zero with budget', longestOnes([0], 1), 1);
test('all ones, k=0 - nothing to spend on', longestOnes([1, 1, 1, 1], 0), 4);
test('all zeros, budget smaller than array', longestOnes([0, 0, 0, 0, 0], 2), 2);
test('budget bigger than the zero count', longestOnes([1, 0, 1, 0, 1], 5), 5);
test('k=0 means longest existing run of ones', longestOnes([1, 1, 0, 1, 1, 1, 0, 1], 0), 3);

summary('Day 065 - Max Consecutive Ones III');

module.exports = { longestOnes };
