'use strict';

const { test, summary } = require('../../lib/check');

function topKFrequent(nums, k) {
  if (k <= 0 || nums.length === 0) return [];

  const counts = new Map();
  for (const n of nums) {
    counts.set(n, (counts.get(n) || 0) + 1);
  }

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, freq] of counts) {
    buckets[freq].push(value);
  }

  const out = [];
  for (let freq = buckets.length - 1; freq >= 1 && out.length < k; freq -= 1) {
    for (const value of buckets[freq]) {
      out.push(value);
      if (out.length === k) break;
    }
  }

  return out;
}

test('leetcode example', topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2], { unordered: true });
test('single element', topKFrequent([1], 1), [1], { unordered: true });
test('k equals number of distinct values', topKFrequent([1, 1, 2, 2, 3, 3], 3), [1, 2, 3], {
  unordered: true,
});
test('negatives count the same as anything else', topKFrequent([-1, -1, -2, -2, -2, 3], 1), [-2], {
  unordered: true,
});
test('zero is a value, not a falsy miss', topKFrequent([0, 0, 0, 1, 1, 2], 2), [0, 1], {
  unordered: true,
});
test('one value fills the array, needs bucket index n', topKFrequent([5, 5, 5, 5, 5], 1), [5], {
  unordered: true,
});
test('k = 0 asks for nothing', topKFrequent([1, 2, 3], 0), [], { unordered: true });
test('empty input', topKFrequent([], 2), [], { unordered: true });
test(
  'clear three-way ranking',
  topKFrequent([7, 7, 7, 7, 8, 8, 8, 9, 9, 10], 3),
  [7, 8, 9],
  { unordered: true }
);

summary('Day 033 - Top K Frequent Elements');

module.exports = { topKFrequent };
