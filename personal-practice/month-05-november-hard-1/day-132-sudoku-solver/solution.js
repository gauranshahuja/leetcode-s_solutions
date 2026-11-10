'use strict';

const { test, summary } = require('../../lib/check');

function boxIndex(r, c) {
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

function solveSudoku(board) {
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());
  const empties = [];

  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      const ch = board[r][c];
      if (ch === '.') {
        empties.push([r, c]);
        continue;
      }
      const b = boxIndex(r, c);
      if (rows[r].has(ch) || cols[c].has(ch) || boxes[b].has(ch)) return false;
      rows[r].add(ch);
      cols[c].add(ch);
      boxes[b].add(ch);
    }
  }

  function fill(k) {
    if (k === empties.length) return true;

    const [r, c] = empties[k];
    const b = boxIndex(r, c);

    for (let d = 1; d <= 9; d += 1) {
      const ch = String(d);
      if (rows[r].has(ch) || cols[c].has(ch) || boxes[b].has(ch)) continue;

      board[r][c] = ch;
      rows[r].add(ch);
      cols[c].add(ch);
      boxes[b].add(ch);

      if (fill(k + 1)) return true;

      board[r][c] = '.';
      rows[r].delete(ch);
      cols[c].delete(ch);
      boxes[b].delete(ch);
    }

    return false;
  }

  return fill(0);
}

function isSolvedSudoku(board) {
  const groupOk = (cells) => {
    const seen = new Set(cells);
    if (seen.size !== 9) return false;
    for (let d = 1; d <= 9; d += 1) {
      if (!seen.has(String(d))) return false;
    }
    return true;
  };

  for (let i = 0; i < 9; i += 1) {
    const row = [];
    const col = [];
    const box = [];
    for (let j = 0; j < 9; j += 1) {
      row.push(board[i][j]);
      col.push(board[j][i]);
      box.push(board[Math.floor(i / 3) * 3 + Math.floor(j / 3)][(i % 3) * 3 + (j % 3)]);
    }
    if (!groupOk(row) || !groupOk(col) || !groupOk(box)) return false;
  }
  return true;
}

const grid = (rowStrings) => rowStrings.map((s) => s.split(''));

const puzzle = grid([
  '53..7....',
  '6..195...',
  '.98....6.',
  '8...6...3',
  '4..8.3..1',
  '7...2...6',
  '.6....28.',
  '...419..5',
  '....8..79',
]);
const published = [
  ['5', '3', '4', '6', '7', '8', '9', '1', '2'],
  ['6', '7', '2', '1', '9', '5', '3', '4', '8'],
  ['1', '9', '8', '3', '4', '2', '5', '6', '7'],
  ['8', '5', '9', '7', '6', '1', '4', '2', '3'],
  ['4', '2', '6', '8', '5', '3', '7', '9', '1'],
  ['7', '1', '3', '9', '2', '4', '8', '5', '6'],
  ['9', '6', '1', '5', '3', '7', '2', '8', '4'],
  ['2', '8', '7', '4', '1', '9', '6', '3', '5'],
  ['3', '4', '5', '2', '8', '6', '1', '7', '9'],
];

test('example puzzle reports solved', solveSudoku(puzzle), true);
test('example puzzle matches the published grid', puzzle, published);
test('all 27 groups of the result are permutations of 1-9', isSolvedSudoku(puzzle), true);

const hard = grid([
  '..9748...',
  '7........',
  '.2.1.9...',
  '..7...24.',
  '.64.1.59.',
  '.98...3..',
  '...8.3.2.',
  '........6',
  '...2759..',
]);
test('hard puzzle reports solved', solveSudoku(hard), true);
test('hard puzzle verifies', isSolvedSudoku(hard), true);

const blank = grid(Array(9).fill('.........'));
test('empty grid produces some valid board', solveSudoku(blank) && isSolvedSudoku(blank), true);

const nearlyDone = published.map((row) => row.slice());
nearlyDone[4][4] = '.';
test('single forced cell', solveSudoku(nearlyDone) && nearlyDone[4][4], '5');

const broken = grid([
  '5...5....',
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
]);
test('clashing givens are rejected instead of searched', solveSudoku(broken), false);

const tampered = published.map((row) => row.slice());
tampered[0][0] = '3';
tampered[0][1] = '5';
test('verifier catches a swapped pair inside a box', isSolvedSudoku(tampered), false);

summary('Day 132 - Sudoku Solver');

module.exports = { solveSudoku, isSolvedSudoku, boxIndex };
