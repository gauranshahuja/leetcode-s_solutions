'use strict';

const { test, summary } = require('../../lib/check');

function combinationSum(candidates, target) {
  const nums = [...candidates].sort((a, b) => a - b);
  const out = [];
  const path = [];

  function walk(start, remaining) {
    if (remaining === 0) {
      out.push(path.slice());
      return;
    }

    for (let i = start; i < nums.length; i += 1) {
      if (nums[i] > remaining) break;

      path.push(nums[i]);
      walk(i, remaining - nums[i]);
      path.pop();
    }
  }

  walk(0, target);
  return out;
}

test('example 1', combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]], { unordered: true });
test(
  'example 2',
  combinationSum([2, 3, 5], 8),
  [[2, 2, 2, 2], [2, 3, 3], [3, 5]],
  { unordered: true }
);
test('no combination fits', combinationSum([2], 1), []);
test('single candidate used twice', combinationSum([1], 2), [[1, 1]]);
test(
  'unsorted input still gives sorted combinations',
  combinationSum([8, 7, 4, 3], 11),
  [[3, 4, 4], [3, 8], [4, 7]],
  { unordered: true }
);
test('target 0 is the empty combination', combinationSum([2, 3], 0), [[]], { unordered: true });
test('count only - no permuted duplicates', combinationSum([2, 3, 5], 20).length, 11);
test('every combination really sums to the target', (() => {
  const res = combinationSum([7, 3, 2], 18);
  return res.length > 0 && res.every((c) => c.reduce((a, b) => a + b, 0) === 18);
})(), true);

summary('Day 072 - Combination Sum');

module.exports = { combinationSum };
