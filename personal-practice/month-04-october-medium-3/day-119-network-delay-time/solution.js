'use strict';

const { test, summary } = require('../../lib/check');
const { PriorityQueue } = require('../../lib/structures');

function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;

  const heap = new PriorityQueue((a, b) => a[0] - b[0]);
  heap.push([0, k]);

  while (!heap.isEmpty()) {
    const [d, node] = heap.pop();

    if (d > dist[node]) continue;

    for (const [next, weight] of adj[node]) {
      const candidate = d + weight;
      if (candidate < dist[next]) {
        dist[next] = candidate;
        heap.push([candidate, next]);
      }
    }
  }

  let worst = 0;
  for (let node = 1; node <= n; node += 1) {
    if (dist[node] === Infinity) return -1;
    if (dist[node] > worst) worst = dist[node];
  }

  return worst;
}

test('example 1 - chain out of node 2', networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), 2);
test('example 2 - one edge, forwards', networkDelayTime([[1, 2, 1]], 2, 1), 1);
test('example 3 - node 1 cannot be reached from 2', networkDelayTime([[1, 2, 1]], 2, 2), -1);
test('single node, nothing to send', networkDelayTime([], 1, 1), 0);
test('two hops beat one expensive hop', networkDelayTime([[1, 2, 10], [1, 3, 1], [3, 2, 1]], 3, 1), 2);
test('a stale heap entry must be ignored', networkDelayTime([[1, 2, 4], [1, 3, 1], [3, 2, 1], [2, 4, 1]], 4, 1), 3);
test('parallel edges, cheaper one wins', networkDelayTime([[1, 2, 5], [1, 2, 2]], 2, 1), 2);
test('self loop changes nothing', networkDelayTime([[1, 1, 3], [1, 2, 4]], 2, 1), 4);
test('a node with no edges at all makes it impossible', networkDelayTime([[1, 2, 1], [2, 3, 1]], 4, 1), -1);

summary('Day 119 - Network Delay Time');

module.exports = { networkDelayTime };
