'use strict';

const { test, summary } = require('../../lib/check');

function longestConsecutiveSorted(nums) {
  if (nums.length === 0) return 0;

  const sorted = [...new Set(nums)].sort((a, b) => a - b);

  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    run = sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
}

function longestConsecutive(nums) {
  const pool = new Set(nums);
  let best = 0;

  for (const n of pool) {
    if (pool.has(n - 1)) continue;

    let length = 1;
    while (pool.has(n + length)) length += 1;

    if (length > best) best = length;
  }

  return best;
}

test('example 1 - [100,4,200,1,3,2] -> 1,2,3,4', longestConsecutive([100, 4, 200, 1, 3, 2]), 4);
test('example 2 - 0..8 scattered', longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
test('empty array', longestConsecutive([]), 0);
test('single value', longestConsecutive([42]), 1);
test('all duplicates count once', longestConsecutive([1, 1, 1, 1]), 1);
test('duplicates inside a real run', longestConsecutive([1, 2, 0, 1]), 3);
test('negatives bridge to positives', longestConsecutive([-3, -2, -1, 1, 2]), 3);
test('two runs, longer one is second', longestConsecutive([9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]), 7);
test('sorted version agrees on example 2', longestConsecutiveSorted([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);

summary('Day 062 - Longest Consecutive Sequence');

module.exports = { longestConsecutive, longestConsecutiveSorted };
