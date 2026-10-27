'use strict';

const { test, summary } = require('../../lib/check');

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function updateMatrixBrute(mat) {
  const rows = mat.length;
  if (rows === 0) return [];
  const cols = mat[0].length;

  const zeros = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (mat[r][c] === 0) zeros.push([r, c]);
    }
  }

  const out = mat.map((row) => row.slice());

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (mat[r][c] === 0) continue;
      let best = Infinity;
      for (const [zr, zc] of zeros) {
        best = Math.min(best, Math.abs(r - zr) + Math.abs(c - zc));
      }
      out[r][c] = best;
    }
  }

  return out;
}

function updateMatrix(mat) {
  const rows = mat.length;
  if (rows === 0) return [];
  const cols = mat[0].length;

  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));

  const queue = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (mat[r][c] === 0) {
        dist[r][c] = 0;
        queue.push(r * cols + c);
      }
    }
  }

  let head = 0;
  while (head < queue.length) {
    const cell = queue[head];
    head += 1;

    const r = (cell / cols) | 0;
    const c = cell % cols;

    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (dist[nr][nc] !== -1) continue;

      dist[nr][nc] = dist[r][c] + 1;
      queue.push(nr * cols + nc);
    }
  }

  return dist;
}

test('example 1 - lone 1 touching zeros', updateMatrix([[0, 0, 0], [0, 1, 0], [0, 0, 0]]), [[0, 0, 0], [0, 1, 0], [0, 0, 0]]);
test('example 2 - bottom row is two steps deep in the middle', updateMatrix([[0, 0, 0], [0, 1, 0], [1, 1, 1]]), [[0, 0, 0], [0, 1, 0], [1, 2, 1]]);
test('single zero cell', updateMatrix([[0]]), [[0]]);
test('single row, zero in the middle', updateMatrix([[1, 1, 0, 1, 1]]), [[2, 1, 0, 1, 2]]);
test('single column', updateMatrix([[0], [1], [1]]), [[0], [1], [2]]);
test('all zeros', updateMatrix([[0, 0], [0, 0]]), [[0, 0], [0, 0]]);
test('one zero in the corner, distances fan out', updateMatrix([[0, 1, 1], [1, 1, 1], [1, 1, 1]]), [[0, 1, 2], [1, 2, 3], [2, 3, 4]]);
test('zero in the bottom right', updateMatrix([[1, 1], [1, 0]]), [[2, 1], [1, 0]]);
test('brute force agrees on the fan-out case', updateMatrixBrute([[0, 1, 1], [1, 1, 1], [1, 1, 1]]), [[0, 1, 2], [1, 2, 3], [2, 3, 4]]);

summary('Day 118 - 01 Matrix');

module.exports = { updateMatrix, updateMatrixBrute };
