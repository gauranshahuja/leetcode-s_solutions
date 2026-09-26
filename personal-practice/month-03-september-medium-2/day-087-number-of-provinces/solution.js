'use strict';

const { test, summary } = require('../../lib/check');
const { DSU } = require('../../lib/structures');

function findCircleNum(isConnected) {
  if (!isConnected || isConnected.length === 0) return 0;

  const n = isConnected.length;
  const dsu = new DSU(n);

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (isConnected[i][j] === 1) dsu.union(i, j);
    }
  }

  return dsu.count;
}

function findCircleNumDfs(isConnected) {
  if (!isConnected || isConnected.length === 0) return 0;

  const n = isConnected.length;
  const seen = new Array(n).fill(false);
  let provinces = 0;

  for (let start = 0; start < n; start += 1) {
    if (seen[start]) continue;

    provinces += 1;
    const stack = [start];
    seen[start] = true;

    while (stack.length) {
      const city = stack.pop();
      for (let j = 0; j < n; j += 1) {
        if (isConnected[city][j] === 1 && !seen[j]) {
          seen[j] = true;
          stack.push(j);
        }
      }
    }
  }

  return provinces;
}

const twoProvinces = [
  [1, 1, 0],
  [1, 1, 0],
  [0, 0, 1],
];

const allSeparate = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const chainPlusLoner = [
  [1, 1, 0, 0],
  [1, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 1],
];

test('example 1', findCircleNum(twoProvinces), 2);
test('example 2 - nothing connected', findCircleNum(allSeparate), 3);
test('one city', findCircleNum([[1]]), 1);
test('empty matrix', findCircleNum([]), 0);
test(
  'everything connected to everything',
  findCircleNum([
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ]),
  1
);
test('indirect link counts: chain of 3 plus a loner', findCircleNum(chainPlusLoner), 2);
test(
  'triangle has 3 edges for 3 cities, so one union is redundant',
  findCircleNum([
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 1],
  ]),
  2
);
test('dfs agrees on the chain', findCircleNumDfs(chainPlusLoner), 2);
test('dfs agrees on example 2', findCircleNumDfs(allSeparate), 3);

summary('Day 087 - Number of Provinces');

module.exports = { findCircleNum, findCircleNumDfs };
