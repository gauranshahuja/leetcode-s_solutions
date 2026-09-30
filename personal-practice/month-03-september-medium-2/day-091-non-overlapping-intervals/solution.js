'use strict';

const { test, summary } = require('../../lib/check');

function eraseOverlapIntervals(intervals) {
  if (!intervals || intervals.length === 0) return 0;

  const byEnd = intervals.slice().sort((a, b) => a[1] - b[1]);

  let kept = 1;
  let lastEnd = byEnd[0][1];

  for (let i = 1; i < byEnd.length; i += 1) {
    if (byEnd[i][0] >= lastEnd) {
      kept += 1;
      lastEnd = byEnd[i][1];
    }
  }

  return byEnd.length - kept;
}

test(
  'example 1 - drop [1,3]',
  eraseOverlapIntervals([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 3],
  ]),
  1
);

test(
  'example 2 - three copies of the same interval, keep one',
  eraseOverlapIntervals([
    [1, 2],
    [1, 2],
    [1, 2],
  ]),
  2
);

test(
  'example 3 - touching endpoints are not an overlap',
  eraseOverlapIntervals([
    [1, 2],
    [2, 3],
  ]),
  0
);

test('empty input', eraseOverlapIntervals([]), 0);
test('one interval', eraseOverlapIntervals([[5, 9]]), 0);

test(
  'one long interval swallows three short ones, so it is the one to drop',
  eraseOverlapIntervals([
    [1, 10],
    [2, 3],
    [3, 4],
    [4, 5],
  ]),
  1
);

test(
  'overlapping mess from the problem set',
  eraseOverlapIntervals([
    [1, 100],
    [11, 22],
    [1, 11],
    [2, 12],
  ]),
  2
);

test(
  'negative coordinates',
  eraseOverlapIntervals([
    [-1, 1],
    [0, 2],
    [1, 3],
  ]),
  1
);

test(
  'two digit bounds, where a lexicographic sort would misorder them',
  eraseOverlapIntervals([
    [10, 11],
    [2, 9],
    [9, 10],
    [1, 3],
  ]),
  1
);

summary('Day 091 - Non-overlapping Intervals');

module.exports = { eraseOverlapIntervals };
