'use strict';

const { test, summary } = require('../../lib/check');

function robMemo(nums) {
  const memo = new Array(nums.length).fill(-1);

  const best = (i) => {
    if (i >= nums.length) return 0;
    if (memo[i] !== -1) return memo[i];

    const take = nums[i] + best(i + 2);
    const skip = best(i + 1);

    memo[i] = Math.max(take, skip);
    return memo[i];
  };

  return best(0);
}

function rob(nums) {
  let prev2 = 0;
  let prev1 = 0;

  for (const money of nums) {
    const current = Math.max(prev1, prev2 + money);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

test('example 1 - rob houses 0 and 2', rob([1, 2, 3, 1]), 4);
test('example 2 - rob houses 0, 2 and 4', rob([2, 7, 9, 3, 1]), 12);
test('empty street', rob([]), 0);
test('single house', rob([5]), 5);
test('two houses, take the bigger one', rob([2, 1]), 2);
test('equal values, every other house', rob([4, 4, 4, 4]), 8);
test('greedy-largest-first would pick wrong here', rob([2, 1, 1, 2]), 4);
test('skipping two in a row can be right', rob([1, 3, 1, 3, 100]), 103);
test('memo version agrees', robMemo([2, 7, 9, 3, 1]), 12);

summary('Day 059 - House Robber');

module.exports = { rob, robMemo };
