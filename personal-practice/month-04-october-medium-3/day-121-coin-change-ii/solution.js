'use strict';

const { test, summary } = require('../../lib/check');

function changeCountingPermutations(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (let a = 1; a <= amount; a += 1) {
    for (const coin of coins) {
      if (coin <= a) dp[a] += dp[a - coin];
    }
  }

  return dp[amount];
}

function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (const coin of coins) {
    for (let a = coin; a <= amount; a += 1) {
      dp[a] += dp[a - coin];
    }
  }

  return dp[amount];
}

test('example 1 - 5 from [1,2,5]', change(5, [1, 2, 5]), 4);
test('example 2 - impossible', change(3, [2]), 0);
test('example 3 - exact single coin', change(10, [10]), 1);
test('amount 0 has one combination, the empty one', change(0, [1, 2]), 1);
test('no coins and a positive amount', change(5, []), 0);
test('4 from [1,2,3]', change(4, [1, 2, 3]), 4);
test('coin order in the input is irrelevant', change(5, [5, 2, 1]), 4);
test('US change for a dollar', change(100, [1, 5, 10, 25]), 242);
test('amount-outer version counts permutations instead', changeCountingPermutations(5, [1, 2, 5]), 9);

summary('Day 121 - Coin Change II');

module.exports = { change, changeCountingPermutations };
