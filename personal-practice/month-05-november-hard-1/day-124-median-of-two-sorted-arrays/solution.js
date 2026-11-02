'use strict';

const { test, summary } = require('../../lib/check');

function findMedianMerge(a, b) {
  const merged = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    merged.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }
  while (i < a.length) merged.push(a[i++]);
  while (j < b.length) merged.push(b[j++]);

  const n = merged.length;
  if (n === 0) return NaN;
  return n % 2 === 1 ? merged[(n - 1) / 2] : (merged[n / 2 - 1] + merged[n / 2]) / 2;
}

function findMedianSortedArrays(a, b) {
  if (a.length > b.length) return findMedianSortedArrays(b, a);

  const m = a.length;
  const n = b.length;
  if (m + n === 0) return NaN;

  const half = (m + n + 1) >> 1;
  let lo = 0;
  let hi = m;

  while (lo <= hi) {
    const i = lo + ((hi - lo) >> 1);
    const j = half - i;

    const aLeft = i > 0 ? a[i - 1] : -Infinity;
    const aRight = i < m ? a[i] : Infinity;
    const bLeft = j > 0 ? b[j - 1] : -Infinity;
    const bRight = j < n ? b[j] : Infinity;

    if (aLeft <= bRight && bLeft <= aRight) {
      if ((m + n) % 2 === 1) return Math.max(aLeft, bLeft);
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    }

    if (aLeft > bRight) hi = i - 1;
    else lo = i + 1;
  }

  return NaN;
}

test('example 1, odd total', findMedianSortedArrays([1, 3], [2]), 2);
test('example 2, even total', findMedianSortedArrays([1, 2], [3, 4]), 2.5);
test('first array empty', findMedianSortedArrays([], [1]), 1);
test('all duplicates', findMedianSortedArrays([0, 0], [0, 0]), 0);
test('fully disjoint, cut lands between them', findMedianSortedArrays([1, 2, 3], [7, 8, 9]), 5);
test('longer array passed first, gets swapped', findMedianSortedArrays([1, 2, 3, 4, 5], [6, 7, 8]), 4.5);
test('single huge value on one side', findMedianSortedArrays([100], [1, 2, 3, 4, 5]), 3.5);
test('negatives', findMedianSortedArrays([-5, -3], [-2, -1, 0]), -2);
test('merge version agrees on the disjoint case', findMedianMerge([1, 2, 3], [7, 8, 9]), 5);

summary('Day 124 - Median of Two Sorted Arrays');

module.exports = { findMedianSortedArrays, findMedianMerge };
