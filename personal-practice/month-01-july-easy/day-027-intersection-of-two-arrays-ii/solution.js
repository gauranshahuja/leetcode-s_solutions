'use strict';

const { test, summary } = require('../../lib/check');

function intersect(nums1, nums2) {
  if (nums1.length > nums2.length) return intersect(nums2, nums1);

  const remaining = new Map();
  for (const n of nums1) remaining.set(n, (remaining.get(n) || 0) + 1);

  const out = [];
  for (const n of nums2) {
    const left = remaining.get(n) || 0;
    if (left > 0) {
      out.push(n);
      remaining.set(n, left - 1);
    }
  }

  return out;
}

test('example 1', intersect([1, 2, 2, 1], [2, 2]), [2, 2]);
test('example 2', intersect([4, 9, 5], [9, 4, 9, 8, 4]), [4, 9], { unordered: true });
test('nothing in common', intersect([1, 2], [3, 4]), []);
test('one side empty', intersect([], [1, 2]), []);
test('duplicates capped by the smaller count', intersect([1, 1, 1], [1, 1]), [1, 1]);
test('zeros and negatives', intersect([0, -1, -1], [-1, 0, 0]), [-1, 0], { unordered: true });
test('arguments swapped, same multiset', intersect([9, 4, 9, 8, 4], [4, 9, 5]), [4, 9], { unordered: true });
test('one element against many copies', intersect([3], [3, 3, 3]), [3]);
test('identical contents, different order', intersect([1, 2, 3], [3, 2, 1]), [1, 2, 3], { unordered: true });

summary('Day 027 - Intersection of Two Arrays II');

module.exports = { intersect };
