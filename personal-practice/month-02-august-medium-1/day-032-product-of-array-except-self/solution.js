'use strict';

const { test, summary } = require('../../lib/check');

function productExceptSelfDivision(nums) {
  let total = 1;
  for (const n of nums) total *= n;
  return nums.map((n) => total / n);
}

function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i += 1) {
    out[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i -= 1) {
    out[i] *= suffix;
    suffix *= nums[i];
  }

  return out;
}

test('example 1', productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]);
test('example 2 with a zero', productExceptSelf([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0]);
test('two elements just swap', productExceptSelf([2, 3]), [3, 2]);
test('single element has no neighbours', productExceptSelf([5]), [1]);
test('empty input', productExceptSelf([]), []);
test('two zeros kill everything', productExceptSelf([0, 4, 0, 2]), [0, 0, 0, 0]);
test('all negative, sign has to come out right', productExceptSelf([-2, -3, -4]), [12, 8, 6]);
test('ones do not change anything', productExceptSelf([1, 1, 1, 1]), [1, 1, 1, 1]);
test(
  'division version agrees when there is no zero',
  productExceptSelfDivision([1, 2, 3, 4]),
  [24, 12, 8, 6]
);

summary('Day 032 - Product of Array Except Self');

module.exports = { productExceptSelf, productExceptSelfDivision };
