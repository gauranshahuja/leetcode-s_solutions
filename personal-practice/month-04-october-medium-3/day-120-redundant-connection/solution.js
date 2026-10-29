'use strict';

const { test, summary } = require('../../lib/check');
const { DSU } = require('../../lib/structures');

function findRedundantConnection(edges) {
  const dsu = new DSU(edges.length + 1);

  for (const [u, v] of edges) {
    if (!dsu.union(u, v)) return [u, v];
  }

  return [];
}

test('example 1 - triangle, the closing edge is last', findRedundantConnection([[1, 2], [1, 3], [2, 3]]), [2, 3]);
test('example 2 - cycle closes mid-input, tail edge is structural', findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]), [1, 4]);
test('chain then the edge that closes it', findRedundantConnection([[1, 2], [2, 3], [1, 3]]), [1, 3]);
test('cycle appears before the rest of the tree is built', findRedundantConnection([[1, 2], [2, 3], [2, 4], [3, 4], [4, 5]]), [3, 4]);
test('edges out of any sensible order', findRedundantConnection([[1, 4], [3, 4], [1, 3], [1, 2]]), [1, 3]);
test('star with one extra rim edge', findRedundantConnection([[1, 2], [1, 3], [1, 4], [2, 4]]), [2, 4]);
test('the very last edge closes a long loop', findRedundantConnection([[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]]), [1, 5]);
test('cycle not touching the lowest labels', findRedundantConnection([[1, 2], [3, 1], [2, 3], [4, 1], [5, 4]]), [2, 3]);
test('four-node loop, closing edge first seen at the end', findRedundantConnection([[2, 3], [3, 4], [4, 1], [1, 2]]), [1, 2]);

summary('Day 120 - Redundant Connection');

module.exports = { findRedundantConnection };
