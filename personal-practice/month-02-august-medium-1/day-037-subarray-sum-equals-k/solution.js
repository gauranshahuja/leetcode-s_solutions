'use strict';

const { test, summary } = require('../../lib/check');

function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let prefix = 0;
  let count = 0;

  for (const n of nums) {
    prefix += n;

    count += seen.get(prefix - k) || 0;

    seen.set(prefix, (seen.get(prefix) || 0) + 1);
  }

  return count;
}

test('example 1', subarraySum([1, 1, 1], 2), 2);
test('example 2', subarraySum([1, 2, 3], 3), 2);
test('negatives and a zero, three answers', subarraySum([1, -1, 0], 0), 3);
test('empty input', subarraySum([], 0), 0);
test('single element matches', subarraySum([3], 3), 1);
test('all zeros, every subarray counts', subarraySum([0, 0, 0], 0), 6);
test('overlapping windows', subarraySum([1, 2, 1, 2, 1], 3), 4);
test('negative k', subarraySum([-1, -1, 1], -2), 1);
test('only the whole array works', subarraySum([2, 2, 2], 6), 1);

summary('Day 037 - Subarray Sum Equals K');

module.exports = { subarraySum };
