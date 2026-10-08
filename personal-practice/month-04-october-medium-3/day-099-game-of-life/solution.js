'use strict';

const { test, summary } = require('../../lib/check');

function gameOfLife(board) {
  const rows = board.length;
  if (rows === 0) return board;
  const cols = board[0].length;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      let live = 0;

      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          live += board[nr][nc] & 1;
        }
      }

      const alive = board[r][c] & 1;
      const next = alive ? (live === 2 || live === 3 ? 1 : 0) : live === 3 ? 1 : 0;

      board[r][c] |= next << 1;
    }
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      board[r][c] >>= 1;
    }
  }

  return board;
}

test(
  'example 1',
  gameOfLife([[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]),
  [[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]]
);
test('example 2 - 2x2 block fills in', gameOfLife([[1, 1], [1, 0]]), [[1, 1], [1, 1]]);
test('single dead cell', gameOfLife([[0]]), [[0]]);
test('single live cell starves', gameOfLife([[1]]), [[0]]);
test('blinker flips to vertical', gameOfLife([[0, 0, 0], [1, 1, 1], [0, 0, 0]]), [[0, 1, 0], [0, 1, 0], [0, 1, 0]]);
test(
  'block is a still life',
  gameOfLife([[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]),
  [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
);
test('single row - only the middle survives', gameOfLife([[1, 1, 1]]), [[0, 1, 0]]);

const original = [[0, 0, 0], [1, 1, 1], [0, 0, 0]];
const returned = gameOfLife(original);
test('mutates the caller array rather than returning a copy', returned === original, true);
test('blinker returns to horizontal after a second generation', gameOfLife(original), [[0, 0, 0], [1, 1, 1], [0, 0, 0]]);

summary('Day 099 - Game of Life');

module.exports = { gameOfLife };
