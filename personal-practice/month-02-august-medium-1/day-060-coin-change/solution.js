'use strict';

const { test, summary } = require('../../lib/check');

function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a += 1) {
    for (const coin of coins) {
      if (coin > a) continue;

      const candidate = dp[a - coin] + 1;
      if (candidate < dp[a]) dp[a] = candidate;
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

test('example 1 - 11 = 5 + 5 + 1', coinChange([1, 2, 5], 11), 3);
test('example 2 - 3 is unreachable with only 2s', coinChange([2], 3), -1);
test('example 3 - amount 0 needs no coins', coinChange([1], 0), 0);
test('no coins at all', coinChange([], 7), -1);
test('coin equal to the amount', coinChange([5], 5), 1);
test('greedy largest-first would say 3 coins here', coinChange([1, 3, 4], 6), 2);
test('unsorted denominations', coinChange([2, 5, 10, 1], 27), 4);
test('many coins of one kind', coinChange([1, 2, 5], 100), 20);
test('awkward denominations, no small coin to patch with', coinChange([186, 419, 83, 408], 6249), 20);

summary('Day 060 - Coin Change');

module.exports = { coinChange };
