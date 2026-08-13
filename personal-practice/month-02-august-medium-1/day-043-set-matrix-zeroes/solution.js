'use strict';

const { test, summary } = require('../../lib/check');

function setZeroes(matrix) {
  const m = matrix.length;
  if (m === 0 || matrix[0].length === 0) return matrix;
  const n = matrix[0].length;

  let firstRowHasZero = false;
  for (let j = 0; j < n; j += 1) {
    if (matrix[0][j] === 0) {
      firstRowHasZero = true;
      break;
    }
  }

  for (let i = 1; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  for (let i = m - 1; i >= 1; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  if (firstRowHasZero) {
    for (let j = 0; j < n; j += 1) matrix[0][j] = 0;
  }

  return matrix;
}

test('example 1', setZeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]]), [
  [1, 0, 1],
  [0, 0, 0],
  [1, 0, 1],
]);

test('example 2 - zeroes in row 0 and column 0', setZeroes([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]), [
  [0, 0, 0, 0],
  [0, 4, 5, 0],
  [0, 3, 1, 0],
]);

test('no zeroes at all, matrix untouched', setZeroes([[1, 2], [3, 4]]), [[1, 2], [3, 4]]);
test('single cell that is zero', setZeroes([[0]]), [[0]]);
test('single row', setZeroes([[1, 0, 3]]), [[0, 0, 0]]);
test('single column', setZeroes([[1], [0], [3]]), [[0], [0], [0]]);

test('zero in row 0 plus an interior zero', setZeroes([[1, 0, 3], [4, 5, 6], [7, 8, 0]]), [
  [0, 0, 0],
  [4, 0, 0],
  [0, 0, 0],
]);

test('zero at the corner', setZeroes([[0, 1, 1], [1, 1, 1], [1, 1, 1]]), [
  [0, 0, 0],
  [0, 1, 1],
  [0, 1, 1],
]);

test('empty matrix', setZeroes([]), []);

summary('Day 043 - Set Matrix Zeroes');

module.exports = { setZeroes };
