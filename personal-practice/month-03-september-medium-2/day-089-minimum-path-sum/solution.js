'use strict';

const { test, summary } = require('../../lib/check');

function minPathSum(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const dp = new Array(cols);

  dp[0] = grid[0][0];
  for (let c = 1; c < cols; c += 1) dp[c] = dp[c - 1] + grid[0][c];

  for (let r = 1; r < rows; r += 1) {
    dp[0] += grid[r][0];

    for (let c = 1; c < cols; c += 1) {
      dp[c] = grid[r][c] + Math.min(dp[c], dp[c - 1]);
    }
  }

  return dp[cols - 1];
}

test(
  'example 1 - greedy would say 9',
  minPathSum([
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ]),
  7
);

test(
  'example 2',
  minPathSum([
    [1, 2, 3],
    [4, 5, 6],
  ]),
  12
);

test('single cell', minPathSum([[5]]), 5);
test('single row', minPathSum([[1, 2, 3, 4]]), 10);
test('single column', minPathSum([[1], [2], [3]]), 6);

test(
  'all zeros',
  minPathSum([
    [0, 0, 0],
    [0, 0, 0],
  ]),
  0
);

test(
  'a cheap detour down the left edge beats the direct route',
  minPathSum([
    [1, 99, 99],
    [1, 99, 99],
    [1, 1, 1],
  ]),
  5
);

test(
  '4x4 worked out by hand',
  minPathSum([
    [1, 4, 8, 6],
    [6, 7, 3, 2],
    [4, 4, 5, 2],
    [3, 8, 1, 1],
  ]),
  20
);

const shared = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1],
];
minPathSum(shared);
test('grid is not mutated', shared[2][2], 1);

summary('Day 089 - Minimum Path Sum');

module.exports = { minPathSum };
