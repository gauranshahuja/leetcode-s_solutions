'use strict';

const { test, summary } = require('../../lib/check');

function merge(intervals) {
  if (!intervals || intervals.length <= 1) {
    return (intervals || []).map((pair) => pair.slice());
  }

  const sorted = intervals.map((pair) => pair.slice()).sort((a, b) => a[0] - b[0]);

  const out = [sorted[0]];

  for (let i = 1; i < sorted.length; i += 1) {
    const last = out[out.length - 1];
    const cur = sorted[i];

    if (cur[0] <= last[1]) {
      if (cur[1] > last[1]) last[1] = cur[1];
    } else {
      out.push(cur);
    }
  }

  return out;
}

const LEXI_TRAP = [[2, 6], [1, 3], [10, 12]];

test('example 1', merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
test('example 2 - touching at a single point still merges', merge([[1, 4], [4, 5]]), [[1, 5]]);
test('empty input', merge([]), []);
test('fully contained intervals must not shrink the end', merge([[1, 10], [2, 3], [4, 5]]), [[1, 10]]);
test('unsorted input', merge([[5, 6], [1, 3], [2, 4]]), [[1, 4], [5, 6]]);
test('two-digit start, where the default sort comparator breaks', merge(LEXI_TRAP), [[1, 6], [10, 12]]);
test('the input array was not reordered or mutated', LEXI_TRAP, [[2, 6], [1, 3], [10, 12]]);
test('zero-length intervals stay separate', merge([[1, 1], [2, 2]]), [[1, 1], [2, 2]]);
test('a chain where every pair touches collapses to one', merge([[1, 2], [2, 3], [3, 4], [4, 5]]), [[1, 5]]);

summary('Day 061 - Merge Intervals');

module.exports = { merge };
