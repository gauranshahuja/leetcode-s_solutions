'use strict';

const { test, summary } = require('../../lib/check');

function exist(board, word) {
  if (word.length === 0) return true;
  if (!board || board.length === 0 || board[0].length === 0) return false;

  const rows = board.length;
  const cols = board[0].length;

  if (word.length > rows * cols) return false;

  function dfs(r, c, i) {
    if (board[r][c] !== word[i]) return false;
    if (i === word.length - 1) return true;

    const letter = board[r][c];
    board[r][c] = '#';

    const found =
      (r > 0 && dfs(r - 1, c, i + 1)) ||
      (r + 1 < rows && dfs(r + 1, c, i + 1)) ||
      (c > 0 && dfs(r, c - 1, i + 1)) ||
      (c + 1 < cols && dfs(r, c + 1, i + 1));

    board[r][c] = letter;
    return found;
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (dfs(r, c, 0)) return true;
    }
  }

  return false;
}

const board = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
];

test('example 1 - ABCCED snakes down and back', exist(board, 'ABCCED'), true);
test('example 2 - SEE', exist(board, 'SEE'), true);
test('example 3 - ABCB would reuse the B', exist(board, 'ABCB'), false);
test('needs a real backtrack - SFDA', exist(board, 'SFDA'), true);
test('board is left untouched afterwards', board[0][0], 'A');
test('single cell hit', exist([['A']], 'A'), true);
test('cannot revisit a cell - AAA on two cells', exist([['A', 'A']], 'AAA'), false);
test('but AA on two cells is fine', exist([['A', 'A']], 'AA'), true);
test('path turns a corner - ABDC', exist([['A', 'B'], ['C', 'D']], 'ABDC'), true);

summary('Day 071 - Word Search');

module.exports = { exist };
