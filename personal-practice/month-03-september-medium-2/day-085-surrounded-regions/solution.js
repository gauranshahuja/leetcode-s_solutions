'use strict';

const { test, summary } = require('../../lib/check');

function solve(board) {
  if (!board || board.length === 0 || board[0].length === 0) return board;

  const rows = board.length;
  const cols = board[0].length;

  function floodFrom(startR, startC) {
    if (board[startR][startC] !== 'O') return;

    const stack = [[startR, startC]];
    board[startR][startC] = '#';

    while (stack.length) {
      const [r, c] = stack.pop();
      const neighbours = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      for (const [nr, nc] of neighbours) {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (board[nr][nc] !== 'O') continue;
        board[nr][nc] = '#';
        stack.push([nr, nc]);
      }
    }
  }

  for (let r = 0; r < rows; r += 1) {
    floodFrom(r, 0);
    floodFrom(r, cols - 1);
  }
  for (let c = 0; c < cols; c += 1) {
    floodFrom(0, c);
    floodFrom(rows - 1, c);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (board[r][c] === 'O') board[r][c] = 'X';
      else if (board[r][c] === '#') board[r][c] = 'O';
    }
  }

  return board;
}

test(
  'example from the problem',
  solve([
    ['X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'X'],
    ['X', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'X'],
  ]),
  [
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'O', 'X', 'X'],
  ]
);

test('single X', solve([['X']]), [['X']]);
test('single O is on the border, so it survives', solve([['O']]), [['O']]);

test(
  'board of all O - every cell touches the border',
  solve([
    ['O', 'O'],
    ['O', 'O'],
  ]),
  [
    ['O', 'O'],
    ['O', 'O'],
  ]
);

test(
  'one row - nothing can be enclosed',
  solve([['O', 'X', 'O', 'O']]),
  [['O', 'X', 'O', 'O']]
);

test(
  'diagonal contact does not count as connected',
  solve([
    ['X', 'O', 'X', 'X'],
    ['X', 'O', 'X', 'X'],
    ['X', 'X', 'O', 'X'],
    ['X', 'X', 'X', 'X'],
  ]),
  [
    ['X', 'O', 'X', 'X'],
    ['X', 'O', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
  ]
);

test(
  'long snake reaches the border through one gap',
  solve([
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'X'],
    ['O', 'O', 'X', 'O', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ]),
  [
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'X'],
    ['O', 'O', 'X', 'O', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ]
);

test('empty board', solve([]), []);

summary('Day 085 - Surrounded Regions');

module.exports = { solve };
