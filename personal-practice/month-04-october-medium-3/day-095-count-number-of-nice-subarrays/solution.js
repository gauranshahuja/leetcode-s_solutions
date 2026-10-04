'use strict';

const { test, summary } = require('../../lib/check');

function atMostKOdd(nums, k) {
  if (k < 0) return 0;

  let left = 0;
  let odd = 0;
  let total = 0;

  for (let right = 0; right < nums.length; right += 1) {
    odd += nums[right] & 1;

    while (odd > k) {
      odd -= nums[left] & 1;
      left += 1;
    }

    total += right - left + 1;
  }

  return total;
}

function numberOfSubarrays(nums, k) {
  if (k <= 0) return 0;
  return atMostKOdd(nums, k) - atMostKOdd(nums, k - 1);
}

test('example 1', numberOfSubarrays([1, 1, 2, 1, 1], 3), 2);
test('example 2 - no odd numbers at all', numberOfSubarrays([2, 4, 6], 1), 0);
test('example 3 - lots of even padding', numberOfSubarrays([2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2), 16);
test('single odd element, k = 1', numberOfSubarrays([1], 1), 1);
test('single even element, k = 1', numberOfSubarrays([2], 1), 0);
test('three odds, k = 1 - each one alone', numberOfSubarrays([1, 1, 1], 1), 3);
test('three odds, k = 2 - two overlapping pairs', numberOfSubarrays([1, 1, 1], 2), 2);
test('k larger than the total number of odds', numberOfSubarrays([1, 2, 3], 5), 0);
test('at-most helper counts every subarray when k is huge', atMostKOdd([1, 2, 3], 99), 6);

summary('Day 095 - Count Number of Nice Subarrays');

module.exports = { numberOfSubarrays, atMostKOdd };
