'use strict';

const { test, summary } = require('../../lib/check');

function spiralOrder(matrix) {
  const out = [];
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return out;

  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c += 1) out.push(matrix[top][c]);
    top += 1;

    for (let r = top; r <= bottom; r += 1) out.push(matrix[r][right]);
    right -= 1;

    if (top <= bottom) {
      for (let c = right; c >= left; c -= 1) out.push(matrix[bottom][c]);
      bottom -= 1;
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r -= 1) out.push(matrix[r][left]);
      left += 1;
    }
  }

  return out;
}

test(
  'example 1 - 3x3',
  spiralOrder([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
  [1, 2, 3, 6, 9, 8, 7, 4, 5]
);
test(
  'example 2 - 3x4, wider than tall',
  spiralOrder([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
  ]),
  [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
);
test(
  '4x3, taller than wide, inner ring is a single column',
  spiralOrder([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
  ]),
  [1, 2, 3, 6, 9, 12, 11, 10, 7, 4, 5, 8]
);
test('single row', spiralOrder([[1, 2, 3]]), [1, 2, 3]);
test('single column', spiralOrder([[1], [2], [3]]), [1, 2, 3]);
test('1x1', spiralOrder([[7]]), [7]);
test('2x2', spiralOrder([[1, 2], [3, 4]]), [1, 2, 4, 3]);
test('no rows at all', spiralOrder([]), []);
test('one empty row', spiralOrder([[]]), []);

summary('Day 041 - Spiral Matrix');

module.exports = { spiralOrder };
