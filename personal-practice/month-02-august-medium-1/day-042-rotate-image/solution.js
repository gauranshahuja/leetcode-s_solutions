'use strict';

const { test, summary } = require('../../lib/check');

function rotateCopy(matrix) {
  const n = matrix.length;
  const out = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      out[j][n - 1 - i] = matrix[i][j];
    }
  }

  return out;
}

function rotate(matrix) {
  const n = matrix.length;

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const tmp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = tmp;
    }
  }

  for (let i = 0; i < n; i += 1) {
    matrix[i].reverse();
  }

  return matrix;
}

test('example 1 - 3x3', rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3],
]);

test('example 2 - 4x4', rotate([[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]), [
  [15, 13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7, 10, 11],
]);

test('2x2 - smallest case with an actual swap', rotate([[1, 2], [3, 4]]), [[3, 1], [4, 2]]);
test('1x1 - nothing moves', rotate([[42]]), [[42]]);
test('0x0 - loops just do not run', rotate([]), []);

const spun = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
rotate(rotate(rotate(rotate(spun))));
test('four rotations are the identity', spun, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

const target = [[1, 2], [3, 4]];
const firstRow = target[0];
const returned = rotate(target);
test('returns the same outer array object', returned === target, true);
test('rotated in the caller-owned row objects', firstRow === target[0], true);

test('copy version agrees on the 3x3', rotateCopy([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3],
]);

summary('Day 042 - Rotate Image');

module.exports = { rotate, rotateCopy };
