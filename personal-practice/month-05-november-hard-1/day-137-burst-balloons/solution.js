'use strict';

const { test, summary } = require('../../lib/check');

function maxCoinsBrute(nums) {
  function best(arr) {
    if (arr.length === 0) return 0;

    let top = 0;
    for (let i = 0; i < arr.length; i += 1) {
      const left = i > 0 ? arr[i - 1] : 1;
      const right = i < arr.length - 1 ? arr[i + 1] : 1;
      const rest = arr.slice(0, i).concat(arr.slice(i + 1));
      top = Math.max(top, left * arr[i] * right + best(rest));
    }
    return top;
  }

  return best(nums);
}

function maxCoins(nums) {
  if (!nums || nums.length === 0) return 0;

  const a = [1, ...nums, 1];
  const m = a.length;

  const dp = Array.from({ length: m }, () => new Array(m).fill(0));

  for (let span = 2; span < m; span += 1) {
    for (let i = 0; i + span < m; i += 1) {
      const j = i + span;
      let best = 0;
      for (let k = i + 1; k < j; k += 1) {
        const total = dp[i][k] + a[i] * a[k] * a[j] + dp[k][j];
        if (total > best) best = total;
      }
      dp[i][j] = best;
    }
  }

  return dp[0][m - 1];
}

test('example: [3,1,5,8]', maxCoins([3, 1, 5, 8]), 167);
test('two balloons: [1,5]', maxCoins([1, 5]), 10);
test('one balloon, and none at all', [maxCoins([7]), maxCoins([])], [7, 0]);
test('[2,4,6] - the one I worked out on paper first', maxCoins([2, 4, 6]), 66);
test('a lone zero pays nothing, a lone 100 pays 100', [maxCoins([0]), maxCoins([100])], [0, 100]);
test(
  'zeros in the middle do not break the recurrence',
  maxCoins([3, 0, 5, 0, 8]),
  maxCoinsBrute([3, 0, 5, 0, 8])
);
test(
  'brute force agrees on six small inputs',
  [[3, 1, 5, 8], [2, 4, 6], [8, 5, 1, 3], [1, 2, 3, 4, 5], [9, 76, 64, 21, 97, 60], [5, 5, 5, 5]].map(
    maxCoins
  ),
  [[3, 1, 5, 8], [2, 4, 6], [8, 5, 1, 3], [1, 2, 3, 4, 5], [9, 76, 64, 21, 97, 60], [5, 5, 5, 5]].map(
    maxCoinsBrute
  )
);
test('a hundred 1s pay exactly 100, and the O(n^3) loop handles it', maxCoins(new Array(100).fill(1)), 100);

summary('Day 137 - Burst Balloons');

module.exports = { maxCoins, maxCoinsBrute };
