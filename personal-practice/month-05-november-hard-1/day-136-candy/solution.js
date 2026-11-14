'use strict';

const { test, summary } = require('../../lib/check');

function candyDistribution(ratings) {
  const n = ratings.length;
  const candies = new Array(n).fill(1);

  for (let i = 1; i < n; i += 1) {
    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
  }

  for (let i = n - 2; i >= 0; i -= 1) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }

  return candies;
}

function candy(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  return candyDistribution(ratings).reduce((sum, c) => sum + c, 0);
}

function isValidDistribution(ratings, candies) {
  const n = ratings.length;
  if (candies.length !== n) return false;

  for (let i = 0; i < n; i += 1) {
    if (!(candies[i] >= 1)) return false;
    if (i > 0 && ratings[i] > ratings[i - 1] && !(candies[i] > candies[i - 1])) return false;
    if (i + 1 < n && ratings[i] > ratings[i + 1] && !(candies[i] > candies[i + 1])) return false;
  }
  return true;
}

function isLocallyTight(ratings) {
  const candies = candyDistribution(ratings);
  if (!isValidDistribution(ratings, candies)) return false;

  for (let i = 0; i < candies.length; i += 1) {
    const shaved = candies.slice();
    shaved[i] -= 1;
    if (isValidDistribution(ratings, shaved)) return false;
  }
  return true;
}

test('example 1: [1,0,2]', candy([1, 0, 2]), 5);
test('example 2: [1,2,2]', candy([1, 2, 2]), 4);
test('single child, and an empty line of children', [candy([7]), candy([])], [1, 0]);
test('all ratings equal, nobody gets a second candy', candy([2, 2, 2, 2]), 4);
test(
  'a monotone run costs 1+2+...+n in either direction',
  [candy([1, 2, 3, 4, 5]), candy([5, 4, 3, 2, 1])],
  [15, 15]
);
test(
  'the case a single left-to-right pass gets wrong',
  candyDistribution([1, 3, 2, 2, 1]),
  [1, 2, 1, 2, 1]
);
test('...and its total', candy([1, 3, 2, 2, 1]), 7);
test('plateau between a rise and a fall', candy([1, 2, 87, 87, 87, 2, 1]), 13);
test(
  'every distribution above is legal and has no slack in it',
  [[1, 0, 2], [1, 2, 2], [1, 3, 2, 2, 1], [1, 2, 87, 87, 87, 2, 1], [5, 4, 3, 2, 1], [2, 2, 2, 2]].every(
    isLocallyTight
  ),
  true
);

summary('Day 136 - Candy');

module.exports = { candy, candyDistribution, isValidDistribution, isLocallyTight };
