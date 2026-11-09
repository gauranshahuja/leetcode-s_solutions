'use strict';

const { test, summary } = require('../../lib/check');

function solveNQueens(n) {
  const boards = [];
  if (n <= 0) return boards;

  const cols = new Set();
  const sums = new Set();
  const diffs = new Set();
  const queenAt = new Array(n).fill(-1);

  function place(row) {
    if (row === n) {
      boards.push(queenAt.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }

    for (let col = 0; col < n; col += 1) {
      if (cols.has(col) || sums.has(row + col) || diffs.has(row - col)) continue;

      cols.add(col);
      sums.add(row + col);
      diffs.add(row - col);
      queenAt[row] = col;

      place(row + 1);

      cols.delete(col);
      sums.delete(row + col);
      diffs.delete(row - col);
      queenAt[row] = -1;
    }
  }

  place(0);
  return boards;
}

function solveNQueensBitmask(n) {
  const boards = [];
  if (n <= 0) return boards;

  const full = (1 << n) - 1;
  const queenAt = [];

  function place(row, cols, sums, diffs) {
    if (row === n) {
      boards.push(queenAt.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }

    let free = full & ~(cols | sums | diffs);
    while (free !== 0) {
      const bit = free & -free;
      free ^= bit;

      queenAt.push(31 - Math.clz32(bit));
      place(
        row + 1,
        cols | bit,
        ((sums | bit) << 1) & full,
        (diffs | bit) >> 1
      );
      queenAt.pop();
    }
  }

  place(0, 0, 0, 0);
  return boards;
}

function isValidBoard(board) {
  const n = board.length;
  const queens = [];
  for (let r = 0; r < n; r += 1) {
    if (board[r].length !== n) return false;
    for (let c = 0; c < n; c += 1) {
      if (board[r][c] === 'Q') queens.push([r, c]);
    }
  }
  if (queens.length !== n) return false;

  for (let i = 0; i < queens.length; i += 1) {
    for (let j = i + 1; j < queens.length; j += 1) {
      const [r1, c1] = queens[i];
      const [r2, c2] = queens[j];
      if (r1 === r2 || c1 === c2) return false;
      if (Math.abs(r1 - r2) === Math.abs(c1 - c2)) return false;
    }
  }
  return true;
}

test('n = 1 is a single square', solveNQueens(1), [['Q']], { unordered: true });
test('n = 2 is impossible', solveNQueens(2), []);
test('n = 3 is impossible', solveNQueens(3), []);
test(
  'n = 4 gives the two known boards',
  solveNQueens(4),
  [
    ['.Q..', '...Q', 'Q...', '..Q.'],
    ['..Q.', 'Q...', '...Q', '.Q..'],
  ],
  { unordered: true }
);
test('n = 0 is an empty answer, not a crash', solveNQueens(0), []);
test('solution counts for n = 5..8', [5, 6, 7, 8].map((n) => solveNQueens(n).length), [10, 4, 40, 92]);
test('every n = 7 board survives an independent attack check', solveNQueens(7).every(isValidBoard), true);
test('bitmask version returns the same n = 6 boards', solveNQueensBitmask(6), solveNQueens(6), {
  unordered: true,
});
test('bitmask version agrees on the n = 9 count', solveNQueensBitmask(9).length, 352);

summary('Day 131 - N-Queens');

module.exports = { solveNQueens, solveNQueensBitmask, isValidBoard };
