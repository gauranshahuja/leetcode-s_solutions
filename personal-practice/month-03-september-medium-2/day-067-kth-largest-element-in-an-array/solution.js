'use strict';

const { test, summary } = require('../../lib/check');
const { PriorityQueue } = require('../../lib/structures');

function findKthLargestHeap(nums, k) {
  const heap = new PriorityQueue();
  for (const n of nums) {
    heap.push(n);
    if (heap.size > k) heap.pop();
  }
  return heap.peek();
}

function findKthLargest(nums, k) {
  const a = nums.slice();
  const target = a.length - k;

  let lo = 0;
  let hi = a.length - 1;

  while (lo <= hi) {
    const [lt, gt] = partition3(a, lo, hi);

    if (target < lt) hi = lt - 1;
    else if (target > gt) lo = gt + 1;
    else return a[target];
  }

  return undefined;
}

function partition3(a, lo, hi) {
  const pivot = a[lo + Math.floor(Math.random() * (hi - lo + 1))];

  let lt = lo;
  let i = lo;
  let gt = hi;

  while (i <= gt) {
    if (a[i] < pivot) {
      swap(a, i, lt);
      i += 1;
      lt += 1;
    } else if (a[i] > pivot) {
      swap(a, i, gt);
      gt -= 1;
    } else {
      i += 1;
    }
  }

  return [lt, gt];
}

function swap(a, i, j) {
  const t = a[i];
  a[i] = a[j];
  a[j] = t;
}

test('example 1 - 2nd largest', findKthLargest([3, 2, 1, 5, 6, 4], 2), 5);
test('example 2 - 4th largest with duplicates', findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4);
test('single element', findKthLargest([1], 1), 1);
test('k = n is the minimum', findKthLargest([7, 10, 4, 3, 20, 15], 6), 3);
test('every value identical', findKthLargest([2, 2, 2, 2], 3), 2);
test('negatives only', findKthLargest([-1, -1, -2, -3], 2), -1);
test('already sorted input does not break the pivot', findKthLargest([1, 2, 3, 4, 5, 6, 7, 8, 9], 3), 7);
test('shuffled 1..200, k=37 -> 164', findKthLargest(shuffled200(), 37), 164);
test('heap version agrees on example 2', findKthLargestHeap([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4);

function shuffled200() {
  const a = Array.from({ length: 200 }, (_, i) => i + 1);
  let seed = 20260906;
  for (let i = a.length - 1; i > 0; i -= 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    swap(a, i, j);
  }
  return a;
}

summary('Day 067 - Kth Largest Element in an Array');

module.exports = { findKthLargest, findKthLargestHeap, partition3 };
