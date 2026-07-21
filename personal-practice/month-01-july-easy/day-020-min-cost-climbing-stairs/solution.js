'use strict';

const { test, summary } = require('../../lib/check');

function minCostClimbingStairs(cost) {
  const n = cost.length;
  if (n <= 1) return 0;

  let twoBack = 0;
  let oneBack = 0;

  for (let i = 2; i <= n; i += 1) {
    const current = Math.min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack;
}

test('example 1, start at index 1 and jump', minCostClimbingStairs([10, 15, 20]), 15);
test('example 2, weave around the 100s', minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]), 6);
test('two stairs, take the cheaper start', minCostClimbingStairs([5, 10]), 5);
test('two stairs, cheaper one is second', minCostClimbingStairs([10, 5]), 5);
test('all zeros cost nothing', minCostClimbingStairs([0, 0, 0, 0]), 0);
test('equal costs, every other stair', minCostClimbingStairs([2, 2, 2, 2, 2]), 4);
test('expensive first stair forces starting at index 1', minCostClimbingStairs([100, 1, 1, 1]), 2);
test('single stair, top is one hop away, pay nothing', minCostClimbingStairs([7]), 0);

const big = Array.from({ length: 1000 }, (_, i) => (i * 37) % 13);
const dp = new Array(big.length + 1).fill(0);
for (let i = 2; i <= big.length; i += 1) {
  dp[i] = Math.min(dp[i - 1] + big[i - 1], dp[i - 2] + big[i - 2]);
}
test('rolling pair matches a full dp table over 1000 stairs', minCostClimbingStairs(big), dp[big.length]);

summary('Day 020 - Min Cost Climbing Stairs');

module.exports = { minCostClimbingStairs };
