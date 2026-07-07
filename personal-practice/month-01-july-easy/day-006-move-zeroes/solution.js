'use strict';

const { test, summary } = require('../../lib/check');

function moveZeroes(nums) {
  let write = 0;

  for (let read = 0; read < nums.length; read += 1) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write += 1;
    }
  }

  while (write < nums.length) {
    nums[write] = 0;
    write += 1;
  }

  return nums;
}

test('example 1', moveZeroes([0, 1, 0, 3, 12]), [1, 3, 12, 0, 0]);
test('example 2 - just one zero', moveZeroes([0]), [0]);
test('empty array', moveZeroes([]), []);
test('no zeroes at all, order untouched', moveZeroes([1, 2, 3]), [1, 2, 3]);
test('all zeroes', moveZeroes([0, 0, 0]), [0, 0, 0]);
test('zeroes in front', moveZeroes([0, 0, 1]), [1, 0, 0]);
test('negatives keep their relative order', moveZeroes([0, -1, 0, -2, 3]), [-1, -2, 3, 0, 0]);

const ref = [0, 7, 0, 8];
const returned = moveZeroes(ref);
test('mutates the caller array rather than a copy', ref, [7, 8, 0, 0]);
test('returns the same array object it was given', returned === ref, true);

summary('Day 006 - Move Zeroes');

module.exports = { moveZeroes };
