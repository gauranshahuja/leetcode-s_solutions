'use strict';

const { test, summary } = require('../../lib/check');

function majorityElementCount(nums) {
  const counts = new Map();
  let best;
  let bestCount = 0;

  for (const n of nums) {
    const c = (counts.get(n) || 0) + 1;
    counts.set(n, c);
    if (c > bestCount) {
      bestCount = c;
      best = n;
    }
  }

  return best;
}

function majorityElement(nums) {
  let candidate = nums[0];
  let count = 0;

  for (const n of nums) {
    if (count === 0) candidate = n;
    count += n === candidate ? 1 : -1;
  }

  return candidate;
}

test('example 1', majorityElement([3, 2, 3]), 3);
test('example 2', majorityElement([2, 2, 1, 1, 1, 2, 2]), 2);
test('single element', majorityElement([1]), 1);
test('two copies of the same value', majorityElement([6, 6]), 6);
test('negative majority value', majorityElement([-1, -1, -1, 2, 2]), -1);
test('majority is split up, never adjacent', majorityElement([1, 2, 1, 2, 1]), 1);
test('candidate gets reset and then wins anyway', majorityElement([7, 7, 5, 5, 7]), 7);
test('majority sits entirely at the end', majorityElement([4, 9, 9, 9]), 9);
test('map version agrees on example 2', majorityElementCount([2, 2, 1, 1, 1, 2, 2]), 2);

summary('Day 010 - Majority Element');

module.exports = { majorityElement, majorityElementCount };
