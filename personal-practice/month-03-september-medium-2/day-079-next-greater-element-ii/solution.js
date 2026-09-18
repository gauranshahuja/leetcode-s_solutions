'use strict';

const { test, summary } = require('../../lib/check');

function nextGreaterElements(nums) {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack = [];

  for (let step = 0; step < 2 * n; step += 1) {
    const i = step % n;
    const value = nums[i];

    while (stack.length && nums[stack[stack.length - 1]] < value) {
      res[stack.pop()] = value;
    }

    if (step < n) stack.push(i);
  }

  return res;
}

test('example 1 - the last 1 wraps to the 2', nextGreaterElements([1, 2, 1]), [2, -1, 2]);
test('example 2', nextGreaterElements([1, 2, 3, 4, 3]), [2, 3, 4, -1, 4]);
test('descending - everything wraps to the max', nextGreaterElements([5, 4, 3, 2, 1]), [-1, 5, 5, 5, 5]);
test('all equal - strictly greater, so no answers', nextGreaterElements([1, 1, 1]), [-1, -1, -1]);
test('empty array', nextGreaterElements([]), []);
test('single element has nothing greater, even wrapped', nextGreaterElements([7]), [-1]);
test('duplicates before the answer', nextGreaterElements([2, 2, 3]), [3, 3, -1]);
test(
  'mixed signs and a big wrap',
  nextGreaterElements([100, 1, 11, 1, 120, 111, 123, 1, -1, -100]),
  [120, 11, 120, 120, 123, 123, -1, 100, 100, 100]
);
test('only the single maximum gets -1', (() => {
  const nums = [3, 8, 4, 8, 1];
  const res = nextGreaterElements(nums);
  return res.filter((v) => v === -1).length;
})(), 2);

summary('Day 079 - Next Greater Element II');

module.exports = { nextGreaterElements };
