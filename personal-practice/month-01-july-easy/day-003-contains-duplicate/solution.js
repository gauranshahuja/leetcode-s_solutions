'use strict';

const { test, summary } = require('../../lib/check');

function containsDuplicate(nums) {
  const seen = new Set();

  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }

  return false;
}

test('example 1 - 1 repeats', containsDuplicate([1, 2, 3, 1]), true);
test('example 2 - all distinct', containsDuplicate([1, 2, 3, 4]), false);
test('example 3 - lots of repeats', containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]), true);
test('empty array', containsDuplicate([]), false);
test('single element', containsDuplicate([1]), false);
test('negative numbers repeat', containsDuplicate([-1, -2, -3, -1]), true);
test('repeat is right at the end', containsDuplicate([5, 6, 7, 8, 9, 5]), true);
test('0 and -0 count as the same value', containsDuplicate([0, -0]), true);

summary('Day 003 - Contains Duplicate');

module.exports = { containsDuplicate };
