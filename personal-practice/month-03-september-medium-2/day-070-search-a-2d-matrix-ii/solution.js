'use strict';

const { test, summary } = require('../../lib/check');

function searchMatrixPerRow(matrix, target) {
  for (const row of matrix) {
    let lo = 0;
    let hi = row.length - 1;
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (row[mid] === target) return true;
      if (row[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}

function searchMatrix(matrix, target) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return false;

  let row = 0;
  let col = matrix[0].length - 1;

  while (row < matrix.length && col >= 0) {
    const value = matrix[row][col];

    if (value === target) return true;
    if (value > target) col -= 1;
    else row += 1;
  }

  return false;
}

const grid = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30],
];

test('example 1 - target 5 present', searchMatrix(grid, 5), true);
test('example 2 - target 20 absent but inside the range', searchMatrix(grid, 20), false);
test('top-right start cell itself', searchMatrix(grid, 15), true);
test('bottom-left corner', searchMatrix(grid, 18), true);
test('larger than everything', searchMatrix(grid, 31), false);
test('single row', searchMatrix([[1, 3, 5]], 3), true);
test('single column, miss', searchMatrix([[1], [3], [5]], 4), false);
test('empty matrix', searchMatrix([], 1), false);
test('per-row binary search agrees on 20', searchMatrixPerRow(grid, 20), false);

summary('Day 070 - Search a 2D Matrix II');

module.exports = { searchMatrix, searchMatrixPerRow };
