'use strict';

const { test, summary } = require('../../lib/check');

function canMake(bloomDay, m, k, day) {
  let bouquets = 0;
  let run = 0;

  for (let i = 0; i < bloomDay.length; i += 1) {
    if (bloomDay[i] > day) {
      run = 0;
      continue;
    }

    run += 1;
    if (run === k) {
      bouquets += 1;
      if (bouquets >= m) return true;
      run = 0;
    }
  }

  return bouquets >= m;
}

function minDays(bloomDay, m, k) {
  const n = bloomDay.length;

  if (m * k > n) return -1;

  let lo = Infinity;
  let hi = 0;
  for (const d of bloomDay) {
    if (d < lo) lo = d;
    if (d > hi) hi = d;
  }

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (canMake(bloomDay, m, k, mid)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return lo;
}

test('example 1 - k = 1 so adjacency is free', minDays([1, 10, 3, 10, 2], 3, 1), 3);
test('example 2 - not enough flowers at all', minDays([1, 10, 3, 10, 2], 3, 2), -1);
test('example 3 - must wait for the blocker', minDays([7, 7, 7, 7, 12, 7, 7], 2, 3), 12);
test('alternating days, answer is not the max', minDays([1, 10, 2, 9, 3, 8, 4, 7, 5, 6], 4, 2), 9);
test('single flower, single bouquet', minDays([1], 1, 1), 1);
test('day value at the top of the range', minDays([1000000000], 1, 1), 1000000000);
test('everything blooms on day one', minDays([1, 1, 1, 1], 2, 2), 1);
test('run of 4 only yields one bouquet of 3', minDays([5, 5, 5, 5, 10, 5, 5], 2, 3), 10);
test('feasibility check directly - day 8 is one bouquet short', canMake([1, 10, 2, 9, 3, 8, 4, 7, 5, 6], 4, 2, 8), false);

summary('Day 098 - Minimum Number of Days to Make m Bouquets');

module.exports = { minDays, canMake };
