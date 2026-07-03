'use strict';

const { test, summary } = require('../../lib/check');

function maxProfit(prices) {
  let cheapest = Infinity;
  let best = 0;

  for (const price of prices) {
    if (price < cheapest) {
      cheapest = price;
    } else if (price - cheapest > best) {
      best = price - cheapest;
    }
  }

  return best;
}

test('example 1 - buy at 1, sell at 6', maxProfit([7, 1, 5, 3, 6, 4]), 5);
test('example 2 - falling every day, no trade', maxProfit([7, 6, 4, 3, 1]), 0);
test('single day, cannot sell', maxProfit([5]), 0);
test('empty input', maxProfit([]), 0);
test('two days, up', maxProfit([1, 2]), 1);
test('flat prices', maxProfit([3, 3, 3]), 0);
test('best buy comes after the global max', maxProfit([9, 1, 2]), 1);
test('cheapest day is in the middle', maxProfit([2, 1, 2, 1, 0, 1, 2]), 2);

summary('Day 002 - Best Time to Buy and Sell Stock');

module.exports = { maxProfit };
