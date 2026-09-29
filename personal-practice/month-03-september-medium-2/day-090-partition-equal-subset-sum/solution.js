'use strict';

const { test, summary } = require('../../lib/check');

function canPartition(nums) {
  let total = 0;
  for (const n of nums) total += n;

  if (total % 2 !== 0) return false;

  const half = total / 2;
  const reach = new Array(half + 1).fill(false);
  reach[0] = true;

  for (const n of nums) {
    for (let s = half; s >= n; s -= 1) {
      if (reach[s - n]) reach[s] = true;
    }
    if (reach[half]) return true;
  }

  return reach[half];
}

test('example 1 - [1,5,5] and [11]', canPartition([1, 5, 11, 5]), true);
test('example 2 - sum 11 is odd', canPartition([1, 2, 3, 5]), false);
test('two equal numbers', canPartition([1, 1]), true);
test('single number cannot be split', canPartition([1]), false);
test('even total but no subset reaches half', canPartition([1, 2, 5]), false);
test('odd count of numbers, halves are {3,3,3} and {4,5}', canPartition([3, 3, 3, 4, 5]), true);
test('a single zero splits into {0} and {}', canPartition([0]), true);
test('wide range of sizes, half = 18', canPartition([2, 2, 3, 5, 10, 14]), true);
test('no reuse allowed - [3,9] cannot make 6', canPartition([3, 9]), false);

summary('Day 090 - Partition Equal Subset Sum');

module.exports = { canPartition };
