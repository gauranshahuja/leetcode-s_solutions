'use strict';

const { test, summary } = require('../../lib/check');

function lengthOfLISDp(nums) {
  if (nums.length === 0) return 0;

  const dp = new Array(nums.length).fill(1);
  let best = 1;

  for (let i = 1; i < nums.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
    if (dp[i] > best) best = dp[i];
  }

  return best;
}

function lengthOfLIS(nums) {
  const tails = [];

  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;

    while (lo < hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }

    tails[lo] = x;
  }

  return tails.length;
}

const example = [10, 9, 2, 5, 3, 7, 101, 18];

test('example 1', lengthOfLIS(example), 4);
test('example 2 - duplicates in the middle', lengthOfLIS([0, 1, 0, 3, 2, 3]), 4);
test('all equal, strictly increasing means length 1', lengthOfLIS([7, 7, 7, 7, 7, 7, 7]), 1);
test('empty array', lengthOfLIS([]), 0);
test('single element', lengthOfLIS([3]), 1);
test('strictly decreasing', lengthOfLIS([5, 4, 3, 2, 1]), 1);
test('negatives', lengthOfLIS([-5, -3, -4, -1, 0]), 4);
test(
  'longer case where the run is interrupted twice',
  lengthOfLIS([1, 3, 6, 7, 9, 4, 10, 5, 6]),
  6
);
test('both versions agree on the long case', lengthOfLISDp([1, 3, 6, 7, 9, 4, 10, 5, 6]), 6);

summary('Day 088 - Longest Increasing Subsequence');

module.exports = { lengthOfLIS, lengthOfLISDp };
