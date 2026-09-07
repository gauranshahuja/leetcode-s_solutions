'use strict';

const { test, summary } = require('../../lib/check');

function hoursNeeded(piles, speed) {
  let hours = 0;
  for (const p of piles) hours += Math.ceil(p / speed);
  return hours;
}

function minEatingSpeed(piles, h) {
  let lo = 1;
  let hi = Math.max(...piles);

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);

    if (hoursNeeded(piles, mid) <= h) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return lo;
}

test('example 1 - [3,6,7,11] in 8 hours', minEatingSpeed([3, 6, 7, 11], 8), 4);
test('example 2 - tight deadline, h = n', minEatingSpeed([30, 11, 23, 4, 20], 5), 30);
test('example 3 - one spare hour', minEatingSpeed([30, 11, 23, 4, 20], 6), 23);
test('single pile, single hour', minEatingSpeed([1], 1), 1);
test('single big pile over two hours', minEatingSpeed([1000000000], 2), 500000000);
test('huge pile, huge deadline -> speed 1', minEatingSpeed([312884470], 968709470), 1);
test('all piles equal, two hours each', minEatingSpeed([4, 4, 4, 4], 8), 2);
test('leftover hours cannot be shared between piles', minEatingSpeed([3, 3, 3], 5), 3);
test('hoursNeeded rounds up per pile', hoursNeeded([3, 6, 7, 11], 3), 10);

summary('Day 068 - Koko Eating Bananas');

module.exports = { minEatingSpeed, hoursNeeded };
