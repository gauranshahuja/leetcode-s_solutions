'use strict';

const { test, summary } = require('../../lib/check');
const { PriorityQueue } = require('../../lib/structures');

class MedianFinder {
  constructor() {
    this.low = new PriorityQueue((a, b) => b - a);
    this.high = new PriorityQueue((a, b) => a - b);
  }

  get size() {
    return this.low.size + this.high.size;
  }

  halves() {
    return [this.low.size, this.high.size];
  }

  addNum(num) {
    this.low.push(num);
    this.high.push(this.low.pop());

    if (this.high.size > this.low.size) this.low.push(this.high.pop());
  }

  findMedian() {
    if (this.size === 0) return null;
    if (this.low.size > this.high.size) return this.low.peek();
    return (this.low.peek() + this.high.peek()) / 2;
  }
}

function runningMedians(nums) {
  const finder = new MedianFinder();
  return nums.map((n) => {
    finder.addNum(n);
    return finder.findMedian();
  });
}

function medianBySorting(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  if (sorted.length === 0) return null;
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };
}

test('empty finder has no median', new MedianFinder().findMedian(), null);
test('LeetCode example: 1, 2, then 3', runningMedians([1, 2, 3]), [1, 1.5, 2]);
test('already ascending', runningMedians([1, 2, 3, 4, 5, 6]), [1, 1.5, 2, 2.5, 3, 3.5]);
test('strictly descending input', runningMedians([5, 4, 3, 2, 1]), [5, 4.5, 4, 3.5, 3]);
test('all duplicates', runningMedians([2, 2, 2, 2]), [2, 2, 2, 2]);
test('negatives and a zero', runningMedians([-1, -2, 0, -3]), [-1, -1.5, -1, -1.5]);
test(
  'even count needs the mean of two different values, not a truncation',
  runningMedians([6, 10, 2, 6, 5, 0, 6, 3]),
  [6, 8, 6, 6, 6, 5.5, 6, 5.5]
);
test(
  'halves stay balanced to within one after every add',
  (() => {
    const finder = new MedianFinder();
    const ok = [];
    for (const n of [41, 35, 62, 5, 97, 97, 21, 0, -8, 13, 13]) {
      finder.addNum(n);
      const [a, b] = finder.halves();
      ok.push(a - b === 0 || a - b === 1);
    }
    return ok.every(Boolean);
  })(),
  true
);

const rand = seeded(20261113);
const stream = Array.from({ length: 2000 }, () => Math.floor(rand() * 2001) - 1000);
test(
  '2000-number stream matches the sort-based oracle at every step',
  runningMedians(stream),
  stream.map((_, i) => medianBySorting(stream.slice(0, i + 1)))
);

summary('Day 135 - Find Median from Data Stream');

module.exports = { MedianFinder, runningMedians, medianBySorting };
