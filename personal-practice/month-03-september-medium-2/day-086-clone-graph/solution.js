'use strict';

const { test, summary } = require('../../lib/check');

class GraphNode {
  constructor(val = 0, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

function cloneGraph(node) {
  const copies = new Map();

  function dfs(original) {
    if (!original) return null;

    const existing = copies.get(original);
    if (existing) return existing;

    const copy = new GraphNode(original.val);
    copies.set(original, copy);

    for (const neighbour of original.neighbors) {
      copy.neighbors.push(dfs(neighbour));
    }

    return copy;
  }

  return dfs(node);
}

function buildGraph(adj) {
  if (!adj || adj.length === 0) return null;

  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((neighbours, i) => {
    for (const v of neighbours) nodes[i].neighbors.push(nodes[v - 1]);
  });
  return nodes[0];
}

function allNodes(start) {
  const seen = new Set();
  const stack = start ? [start] : [];

  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const nb of cur.neighbors) if (!seen.has(nb)) stack.push(nb);
  }
  return seen;
}

function toAdjacency(start) {
  const byVal = new Map();
  for (const n of allNodes(start)) byVal.set(n.val, n);

  const vals = [...byVal.keys()].sort((a, b) => a - b);
  return vals.map((v) =>
    byVal
      .get(v)
      .neighbors.map((n) => n.val)
      .sort((a, b) => a - b)
  );
}

function sharesAnyNode(a, b) {
  const left = allNodes(a);
  for (const n of allNodes(b)) if (left.has(n)) return true;
  return false;
}

const square = [
  [2, 4],
  [1, 3],
  [2, 4],
  [1, 3],
];

const original = buildGraph(square);
const copy = cloneGraph(original);

test('clone of the 4-node square has the same shape', toAdjacency(copy), square);
test('clone has the same number of nodes', allNodes(copy).size, 4);
test('clone shares no node object with the original', sharesAnyNode(original, copy), false);
test('original is untouched by the clone', toAdjacency(original), square);

test('single node with no neighbours', toAdjacency(cloneGraph(buildGraph([[]]))), [[]]);
test('empty graph', cloneGraph(null), null);
test('self loop survives', toAdjacency(cloneGraph(buildGraph([[1]]))), [[1]]);
test('two nodes pointing at each other', toAdjacency(cloneGraph(buildGraph([[2], [1]]))), [[2], [1]]);

const pairOriginal = buildGraph([[2], [1]]);
const pairCopy = cloneGraph(pairOriginal);
pairCopy.neighbors.push(new GraphNode(99));
test('editing the clone does not change the original', toAdjacency(pairOriginal), [[2], [1]]);

summary('Day 086 - Clone Graph');

module.exports = { GraphNode, cloneGraph, buildGraph, toAdjacency, allNodes };
