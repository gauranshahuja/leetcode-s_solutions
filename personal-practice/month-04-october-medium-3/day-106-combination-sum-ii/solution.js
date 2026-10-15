'use strict';

const { test, summary } = require('../../lib/check');

function combinationSum2(candidates, target) {
  const nums = [...candidates].sort((a, b) => a - b);

  const out = [];
  const path = [];

  function back(start, remain) {
    if (remain === 0) {
      out.push(path.slice());
      return;
    }

    for (let i = start; i < nums.length; i += 1) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      if (nums[i] > remain) break;

      path.push(nums[i]);
      back(i + 1, remain - nums[i]);
      path.pop();
    }
  }

  back(0, target);
  return out;
}

test(
  'example 1 - duplicate 1s in the input',
  combinationSum2([10, 1, 2, 7, 6, 1, 5], 8),
  [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]],
  { unordered: true }
);
test('example 2 - three 2s', combinationSum2([2, 5, 2, 1, 2], 5), [[1, 2, 2], [5]], {
  unordered: true,
});
test('single candidate that works', combinationSum2([1], 1), [[1]], { unordered: true });
test('single candidate that does not', combinationSum2([1], 2), [], { unordered: true });
test('target 0 is the empty combination', combinationSum2([2, 3], 0), [[]], { unordered: true });
test(
  'all duplicates, only one way to make the target',
  combinationSum2([2, 2, 2], 4),
  [[2, 2]],
  { unordered: true }
);
test('all duplicates, target unreachable', combinationSum2([2, 2, 2], 5), [], { unordered: true });
test(
  'mixed runs of duplicates',
  combinationSum2([3, 1, 3, 5, 1, 1], 8),
  [[1, 1, 1, 5], [1, 1, 3, 3], [3, 5]],
  { unordered: true }
);
test(
  'two-digit candidate is not sorted as a string',
  combinationSum2([10, 2, 10, 3], 13),
  [[3, 10]],
  { unordered: true }
);

summary('Day 106 - Combination Sum II');

module.exports = { combinationSum2 };
