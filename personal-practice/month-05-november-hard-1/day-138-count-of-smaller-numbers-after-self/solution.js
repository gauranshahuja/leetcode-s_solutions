'use strict';

const { test, summary } = require('../../lib/check');

function countSmallerBrute(nums) {
  return nums.map((v, i) => {
    let c = 0;
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[j] < v) c += 1;
    }
    return c;
  });
}

function countSmaller(nums) {
  const n = nums.length;
  const counts = new Array(n).fill(0);
  if (n <= 1) return counts;

  const idx = nums.map((_, i) => i);
  const buffer = new Array(n);

  function sortRange(lo, hi) {
    if (hi - lo <= 1) return;

    const mid = lo + ((hi - lo) >> 1);
    sortRange(lo, mid);
    sortRange(mid, hi);

    let i = lo;
    let j = mid;
    let out = lo;
    let fromRight = 0;

    while (i < mid || j < hi) {
      const takeLeft = j >= hi || (i < mid && nums[idx[i]] <= nums[idx[j]]);
      if (takeLeft) {
        counts[idx[i]] += fromRight;
        buffer[out] = idx[i];
        i += 1;
      } else {
        fromRight += 1;
        buffer[out] = idx[j];
        j += 1;
      }
      out += 1;
    }

    for (let t = lo; t < hi; t += 1) idx[t] = buffer[t];
  }

  sortRange(0, n);
  return counts;
}

function countSmallerBIT(nums) {
  const n = nums.length;
  const counts = new Array(n).fill(0);
  if (n === 0) return counts;

  const distinct = [...new Set(nums)].sort((a, b) => a - b);
  const rankOf = new Map();
  distinct.forEach((v, i) => rankOf.set(v, i + 1));

  const tree = new Array(distinct.length + 1).fill(0);

  const bump = (i) => {
    for (let k = i; k < tree.length; k += k & -k) tree[k] += 1;
  };
  const prefix = (i) => {
    let total = 0;
    for (let k = i; k > 0; k -= k & -k) total += tree[k];
    return total;
  };

  for (let i = n - 1; i >= 0; i -= 1) {
    const r = rankOf.get(nums[i]);
    counts[i] = prefix(r - 1);
    bump(r);
  }

  return counts;
}

function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };
}

test('example: [5,2,6,1]', countSmaller([5, 2, 6, 1]), [2, 1, 1, 0]);
test('single element, and an empty array', [countSmaller([-1]), countSmaller([])], [[0], []]);
test('two equal values: neither is smaller than the other', countSmaller([-1, -1]), [0, 0]);
test(
  'monotone inputs',
  [countSmaller([5, 4, 3, 2, 1]), countSmaller([1, 2, 3, 4, 5])],
  [
    [4, 3, 2, 1, 0],
    [0, 0, 0, 0, 0],
  ]
);
test('negatives and duplicates mixed together', countSmaller([2, 0, 1, -1, 0, 2]), [4, 1, 2, 0, 0, 0]);
test('all duplicates', countSmaller([7, 7, 7, 7]), [0, 0, 0, 0]);
test(
  'Fenwick version agrees on all of the above',
  [[5, 2, 6, 1], [-1, -1], [5, 4, 3, 2, 1], [2, 0, 1, -1, 0, 2], [7, 7, 7, 7], []].map(countSmallerBIT),
  [[5, 2, 6, 1], [-1, -1], [5, 4, 3, 2, 1], [2, 0, 1, -1, 0, 2], [7, 7, 7, 7], []].map(countSmaller)
);

const rand = seeded(20261116);
const big = Array.from({ length: 2000 }, () => Math.floor(rand() * 120) - 60);
test('2000 values: merge sort matches the O(n^2) oracle', countSmaller(big), countSmallerBrute(big));
test('2000 values: Fenwick matches the merge sort', countSmallerBIT(big), countSmaller(big));

summary('Day 138 - Count of Smaller Numbers After Self');

module.exports = { countSmaller, countSmallerBIT, countSmallerBrute };
