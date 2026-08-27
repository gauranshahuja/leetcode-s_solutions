'use strict';

const { test, summary } = require('../../lib/check');

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function orangesRotting(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const g = grid.map((row) => row.slice());

  const queue = [];
  let head = 0;
  let fresh = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (g[r][c] === 2) queue.push([r, c]);
      else if (g[r][c] === 1) fresh += 1;
    }
  }

  if (fresh === 0) return 0;

  let minutes = 0;

  while (head < queue.length && fresh > 0) {
    const levelSize = queue.length - head;

    for (let i = 0; i < levelSize; i += 1) {
      const [cr, cc] = queue[head];
      head += 1;

      for (const [dr, dc] of DIRS) {
        const nr = cr + dr;
        const nc = cc + dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (g[nr][nc] !== 1) continue;

        g[nr][nc] = 2;
        fresh -= 1;
        queue.push([nr, nc]);
      }
    }

    minutes += 1;
  }

  return fresh === 0 ? minutes : -1;
}

test('example 1', orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]), 4);
test('example 2 - bottom-left orange is walled off', orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]), -1);
test('example 3 - nothing fresh to begin with', orangesRotting([[0, 2]]), 0);
test('single empty cell', orangesRotting([[0]]), 0);
test('one fresh orange and no rot at all', orangesRotting([[1]]), -1);
test('already all rotten', orangesRotting([[2, 2], [2, 2]]), 0);
test('single row chain rots left to right', orangesRotting([[2, 1, 1, 1, 1]]), 4);
test(
  'two sources meet in the middle, so it is 2 and not 4',
  orangesRotting([[2, 1, 1], [1, 1, 1], [1, 1, 2]]),
  2
);
test(
  'fresh orange fenced in by empty cells',
  orangesRotting([[2, 0, 1], [0, 0, 0], [1, 0, 1]]),
  -1
);

summary('Day 057 - Rotting Oranges');

module.exports = { orangesRotting };
