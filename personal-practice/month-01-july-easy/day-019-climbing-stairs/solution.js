'use strict';

const { test, summary } = require('../../lib/check');

let bruteCalls = 0;

function climbStairsBrute(n) {
  bruteCalls += 1;
  if (n <= 1) return 1;
  return climbStairsBrute(n - 1) + climbStairsBrute(n - 2);
}

function climbStairsMemo(n, memo = new Map()) {
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);

  const ways = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  memo.set(n, ways);
  return ways;
}

function climbStairs(n) {
  if (n <= 1) return 1;

  let twoBack = 1;
  let oneBack = 1;

  for (let i = 2; i <= n; i += 1) {
    const current = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack;
}

test('one stair, one way', climbStairs(1), 1);
test('two stairs: 1+1 or 2', climbStairs(2), 2);
test('three stairs: 1+1+1, 1+2, 2+1', climbStairs(3), 3);
test('four stairs is 5, not 4 - I listed them by hand', climbStairs(4), 5);
test('ten stairs', climbStairs(10), 89);
test('brute force agrees on a small n', climbStairsBrute(10), 89);
test('memo agrees with rolling at the top of the range', climbStairsMemo(45), climbStairs(45));
test('n = 45 fits in a safe integer', [climbStairs(45), climbStairs(45) < Number.MAX_SAFE_INTEGER], [1836311903, true]);

bruteCalls = 0;
climbStairsBrute(25);
test('naive recursion needs 200k+ calls for n = 25', bruteCalls > 200000, true);

summary('Day 019 - Climbing Stairs');

module.exports = { climbStairs, climbStairsMemo, climbStairsBrute };
