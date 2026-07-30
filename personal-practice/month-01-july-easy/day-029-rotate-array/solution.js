'use strict';

const { test, summary } = require('../../lib/check');

function rotateCopy(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;

  const shift = k % n;
  const copy = new Array(n);

  for (let i = 0; i < n; i += 1) copy[(i + shift) % n] = nums[i];
  for (let i = 0; i < n; i += 1) nums[i] = copy[i];

  return nums;
}

function reverse(nums, lo, hi) {
  let i = lo;
  let j = hi;
  while (i < j) {
    [nums[i], nums[j]] = [nums[j], nums[i]];
    i += 1;
    j -= 1;
  }
}

function rotate(nums, k) {
  const n = nums.length;
  if (n <= 1) return nums;

  const shift = k % n;
  if (shift === 0) return nums;

  reverse(nums, 0, n - 1);
  reverse(nums, 0, shift - 1);
  reverse(nums, shift, n - 1);

  return nums;
}

const rotated = (nums, k) => rotate(nums.slice(), k);
const rotatedCopy = (nums, k) => rotateCopy(nums.slice(), k);

test('example 1', rotated([1, 2, 3, 4, 5, 6, 7], 3), [5, 6, 7, 1, 2, 3, 4]);
test('example 2 with negatives', rotated([-1, -100, 3, 99], 2), [3, 99, -1, -100]);
test('k = 0 changes nothing', rotated([1, 2, 3], 0), [1, 2, 3]);
test('k = n changes nothing', rotated([1, 2, 3], 3), [1, 2, 3]);
test('k larger than n', rotated([1, 2], 5), [2, 1]);
test('k = n - 1', rotated([1, 2, 3], 2), [2, 3, 1]);
test('single element', rotated([1], 3), [1]);
test('empty array', rotated([], 3), []);
test('extra-array version agrees', rotatedCopy([1, 2, 3, 4, 5, 6, 7], 3), [5, 6, 7, 1, 2, 3, 4]);

summary('Day 029 - Rotate Array');

module.exports = { rotate, rotateCopy, reverse };
