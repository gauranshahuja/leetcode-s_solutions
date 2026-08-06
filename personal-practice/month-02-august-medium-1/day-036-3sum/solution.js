'use strict';

const { test, summary } = require('../../lib/check');

function threeSum(nums) {
  const a = [...nums].sort((x, y) => x - y);
  const n = a.length;
  const out = [];

  for (let i = 0; i < n - 2; i += 1) {
    if (a[i] > 0) break;

    if (i > 0 && a[i] === a[i - 1]) continue;

    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const sum = a[i] + a[left] + a[right];

      if (sum < 0) {
        left += 1;
      } else if (sum > 0) {
        right -= 1;
      } else {
        out.push([a[i], a[left], a[right]]);

        left += 1;
        right -= 1;
        while (left < right && a[left] === a[left - 1]) left += 1;
        while (left < right && a[right] === a[right + 1]) right -= 1;
      }
    }
  }

  return out;
}

const raw = [-1, 0, 1, 2, -1, -4];

test('leetcode example 1', threeSum(raw), [[-1, -1, 2], [-1, 0, 1]], { unordered: true });
test('input array is left unsorted', raw, [-1, 0, 1, 2, -1, -4]);
test('no triple sums to zero', threeSum([0, 1, 1]), [], { unordered: true });
test('three zeros', threeSum([0, 0, 0]), [[0, 0, 0]], { unordered: true });
test('four zeros still gives one triple', threeSum([0, 0, 0, 0]), [[0, 0, 0]], { unordered: true });
test('fewer than three elements', threeSum([1, -1]), [], { unordered: true });
test('all positive exits early', threeSum([1, 2, 3, 4]), [], { unordered: true });
test(
  'two different triples share the same first number',
  threeSum([-2, 0, 1, 1, 2]),
  [[-2, 0, 2], [-2, 1, 1]],
  { unordered: true }
);
test(
  'heavy duplicates collapse to one triple',
  threeSum([-1, -1, -1, 2, 2]),
  [[-1, -1, 2]],
  { unordered: true }
);

summary('Day 036 - 3Sum');

module.exports = { threeSum };
