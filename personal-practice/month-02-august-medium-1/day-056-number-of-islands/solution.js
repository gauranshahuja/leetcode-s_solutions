'use strict';

const { test, summary } = require('../../lib/check');

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function numIslands(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;

  const g = grid.map((row) => row.slice());

  let islands = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (g[r][c] !== '1') continue;

      islands += 1;
      g[r][c] = '0';
      const stack = [[r, c]];

      while (stack.length) {
        const [cr, cc] = stack.pop();

        for (const [dr, dc] of DIRS) {
          const nr = cr + dr;
          const nc = cc + dc;

          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (g[nr][nc] !== '1') continue;

          g[nr][nc] = '0';
          stack.push([nr, nc]);
        }
      }
    }
  }

  return islands;
}

function grid(rows) {
  return rows.map((row) => row.split(''));
}

function countLand(g) {
  return g.reduce((sum, row) => sum + row.filter((ch) => ch === '1').length, 0);
}

const EXAMPLE_1 = grid(['11110', '11010', '11000', '00000']);
const EXAMPLE_2 = grid(['11000', '11000', '00100', '00011']);

test('example 1 - one big blob', numIslands(EXAMPLE_1), 1);
test('example 2 - three separate blobs', numIslands(EXAMPLE_2), 3);
test('the input grid was not sunk', countLand(EXAMPLE_2), 7);
test('empty grid', numIslands([]), 0);
test('all water', numIslands(grid(['000', '000'])), 0);
test('all land is a single island', numIslands(grid(['111', '111', '111'])), 1);
test('diagonal touches do not connect', numIslands(grid(['10', '01'])), 2);
test('alternating single row', numIslands(grid(['1010101'])), 4);
test(
  'snake shape is one island even though it doubles back',
  numIslands(grid(['11111', '00001', '11111', '10000', '11111'])),
  1
);

summary('Day 056 - Number of Islands');

module.exports = { numIslands, DIRS };
