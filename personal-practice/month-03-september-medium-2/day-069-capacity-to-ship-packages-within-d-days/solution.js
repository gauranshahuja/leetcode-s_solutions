'use strict';

const { test, summary } = require('../../lib/check');

function daysNeeded(weights, capacity) {
  let days = 1;
  let load = 0;

  for (const w of weights) {
    if (load + w > capacity) {
      days += 1;
      load = 0;
    }
    load += w;
  }

  return days;
}

function shipWithinDays(weights, days) {
  let lo = 0;
  let hi = 0;
  for (const w of weights) {
    if (w > lo) lo = w;
    hi += w;
  }

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);

    if (daysNeeded(weights, mid) <= days) hi = mid;
    else lo = mid + 1;
  }

  return lo;
}

test('example 1 - 1..10 in 5 days', shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5), 15);
test('example 2 - [3,2,2,4,1,4] in 3 days', shipWithinDays([3, 2, 2, 4, 1, 4], 3), 6);
test('example 3 - heaviest package sets the floor', shipWithinDays([1, 2, 3, 1, 1], 4), 3);
test('one package', shipWithinDays([5], 1), 5);
test('days === n means one package per day', shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10), 10);
test('days === 1 means the whole sum', shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1), 55);
test('descending weights, 3 days', shipWithinDays([9, 8, 7, 6, 5, 4, 3, 2, 1], 3), 17);
test('order is fixed, no repacking allowed', shipWithinDays([10, 1, 1, 1, 10], 2), 12);
test('daysNeeded counts boundaries greedily', daysNeeded([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 15), 5);

summary('Day 069 - Capacity To Ship Packages Within D Days');

module.exports = { shipWithinDays, daysNeeded };
