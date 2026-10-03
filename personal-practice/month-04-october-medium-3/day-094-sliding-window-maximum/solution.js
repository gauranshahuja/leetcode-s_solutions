'use strict';

const { test, summary } = require('../../lib/check');

function maxSlidingWindowNaive(nums, k) {
  const out = [];
  for (let i = 0; i + k <= nums.length; i += 1) {
    let best = nums[i];
    for (let j = i + 1; j < i + k; j += 1) {
      if (nums[j] > best) best = nums[j];
    }
    out.push(best);
  }
  return out;
}

function maxSlidingWindow(nums, k) {
  const n = nums.length;
  if (n === 0 || k <= 0) return [];
  if (k === 1) return nums.slice();

  const dq = new Int32Array(n);
  let head = 0;
  let tail = 0;
  const out = [];

  for (let i = 0; i < n; i += 1) {
    while (tail > head && dq[head] <= i - k) head += 1;

    while (tail > head && nums[dq[tail - 1]] <= nums[i]) tail -= 1;

    dq[tail] = i;
    tail += 1;

    if (i >= k - 1) out.push(nums[dq[head]]);
  }

  return out;
}

test('example 1', maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
test('single element, k = 1', maxSlidingWindow([1], 1), [1]);
test('k equals the whole array', maxSlidingWindow([1, 3, 1, 2, 0, 5], 6), [5]);
test('max leaves the window immediately', maxSlidingWindow([7, 2, 4], 2), [7, 4]);
test('strictly decreasing - front evicted every step', maxSlidingWindow([5, 4, 3, 2, 1], 2), [5, 4, 3, 2]);
test('strictly increasing - back evicted every step', maxSlidingWindow([1, 2, 3, 4, 5], 2), [2, 3, 4, 5]);
test('all equal values', maxSlidingWindow([2, 2, 2, 2], 2), [2, 2, 2]);
test('negatives only', maxSlidingWindow([-7, -8, -3, -9], 2), [-7, -3, -3]);
test('naive agrees on the example', maxSlidingWindowNaive([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);

summary('Day 094 - Sliding Window Maximum');

module.exports = { maxSlidingWindow, maxSlidingWindowNaive };
