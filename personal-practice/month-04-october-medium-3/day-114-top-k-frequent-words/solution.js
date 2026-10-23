'use strict';

const { test, summary } = require('../../lib/check');
const { PriorityQueue } = require('../../lib/structures');

function topKFrequent(words, k) {
  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

  const heap = new PriorityQueue((a, b) => {
    if (a[1] !== b[1]) return a[1] - b[1];
    if (a[0] === b[0]) return 0;
    return a[0] > b[0] ? -1 : 1;
  });

  for (const entry of freq) {
    heap.push(entry);
    if (heap.size > k) heap.pop();
  }

  const out = [];
  while (!heap.isEmpty()) out.push(heap.pop()[0]);

  return out.reverse();
}

test(
  'example 1 - k = 2',
  topKFrequent(['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2),
  ['i', 'love']
);
test(
  'example 1 - k = 3 pulls in a tie broken alphabetically',
  topKFrequent(['i', 'love', 'leetcode', 'i', 'love', 'coding'], 3),
  ['i', 'love', 'coding']
);
test(
  'example 2 - four distinct counts',
  topKFrequent(['the', 'day', 'is', 'sunny', 'the', 'the', 'the', 'sunny', 'is', 'is'], 4),
  ['the', 'is', 'sunny', 'day']
);
test('every count is 1, so it is pure alphabetical', topKFrequent(['b', 'a', 'c'], 2), ['a', 'b']);
test('smaller word arrives last and still wins the tie', topKFrequent(['zz', 'yy', 'xx', 'zz', 'yy', 'aa'], 3), ['yy', 'zz', 'aa']);
test('prefix is smaller than the longer word', topKFrequent(['ab', 'ab', 'a', 'a', 'b'], 2), ['a', 'ab']);
test('k covers every distinct word', topKFrequent(['a', 'a', 'b'], 2), ['a', 'b']);
test('single word', topKFrequent(['hello'], 1), ['hello']);
test('k = 1 out of an all-tie list', topKFrequent(['z', 'y', 'x'], 1), ['x']);

summary('Day 114 - Top K Frequent Words');

module.exports = { topKFrequent };
