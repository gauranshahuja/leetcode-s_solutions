'use strict';

const { test, summary } = require('../../lib/check');

function twoSumSorted(nums, target, start) {
  const res = [];
  let lo = start;
  let hi = nums.length - 1;

  while (lo < hi) {
    const sum = nums[lo] + nums[hi];

    if (sum < target) {
      lo += 1;
    } else if (sum > target) {
      hi -= 1;
    } else {
      res.push([nums[lo], nums[hi]]);
      lo += 1;
      hi -= 1;
      while (lo < hi && nums[lo] === nums[lo - 1]) lo += 1;
      while (lo < hi && nums[hi] === nums[hi + 1]) hi -= 1;
    }
  }

  return res;
}

function kSum(nums, target, k, start) {
  const res = [];
  const n = nums.length;
  if (start >= n || k < 2) return res;

  const smallest = nums[start];
  const largest = nums[n - 1];
  if (smallest * k > target) return res;
  if (largest * k < target) return res;

  if (k === 2) return twoSumSorted(nums, target, start);

  for (let i = start; i <= n - k; i += 1) {
    if (i > start && nums[i] === nums[i - 1]) continue;

    for (const tail of kSum(nums, target - nums[i], k - 1, i + 1)) {
      res.push([nums[i], ...tail]);
    }
  }

  return res;
}

function fourSum(nums, target) {
  const sorted = nums.slice().sort((a, b) => a - b);
  return kSum(sorted, target, 4, 0);
}

function threeSum(nums) {
  const sorted = nums.slice().sort((a, b) => a - b);
  return kSum(sorted, 0, 3, 0);
}

const U = { unordered: true };

test('example 1', fourSum([1, 0, -1, 0, -2, 2], 0), [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]], U);
test('example 2 - all identical', fourSum([2, 2, 2, 2, 2], 8), [[2, 2, 2, 2]], U);
test('empty input', fourSum([], 0), [], U);
test('fewer than 4 elements', fourSum([1, 2, 3], 6), [], U);
test('four zeros', fourSum([0, 0, 0, 0], 0), [[0, 0, 0, 0]], U);
test('one answer among negatives', fourSum([-3, -1, 0, 2, 4, 5], 0), [[-3, -1, 0, 4]], U);
test('large values stay exact', fourSum([1e9, 1e9, 1e9, 1e9], 4e9), [[1e9, 1e9, 1e9, 1e9]], U);
test('same machine does 3Sum (Day 036)', threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]], U);
test('same machine does 2Sum pairs', kSum([1, 2, 3, 4], 5, 2, 0), [[1, 4], [2, 3]], U);

summary('Day 096 - 4Sum');

module.exports = { fourSum, threeSum, kSum, twoSumSorted };
