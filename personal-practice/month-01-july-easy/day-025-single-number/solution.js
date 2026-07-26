'use strict';

const { test, summary } = require('../../lib/check');

function singleNumberCount(nums) {
  const counts = new Map();

  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);

  for (const [value, count] of counts) {
    if (count === 1) return value;
  }

  return -1;
}

function singleNumber(nums) {
  let lonely = 0;
  for (const n of nums) lonely ^= n;
  return lonely;
}

test('example 1', singleNumber([2, 2, 1]), 1);
test('example 2', singleNumber([4, 1, 2, 1, 2]), 4);
test('single element array', singleNumber([1]), 1);
test('the lonely value is zero', singleNumber([1, 0, 1]), 0);
test('negative numbers', singleNumber([-1, -1, -3]), -3);
test('pairs split far apart', singleNumber([7, 3, 5, 3, 7]), 5);
test('lonely value sits first', singleNumber([9, 4, 4, 8, 8]), 9);
test('map version agrees on example 2', singleNumberCount([4, 1, 2, 1, 2]), 4);
test('map version agrees on a zero answer', singleNumberCount([1, 0, 1]), 0);

summary('Day 025 - Single Number');

module.exports = { singleNumber, singleNumberCount };
