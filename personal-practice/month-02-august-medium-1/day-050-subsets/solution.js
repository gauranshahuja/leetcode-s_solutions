'use strict';

const { test, summary } = require('../../lib/check');

function subsetsBitmask(nums) {
  const n = nums.length;
  const out = [];

  for (let mask = 0; mask < 1 << n; mask += 1) {
    const pick = [];
    for (let i = 0; i < n; i += 1) {
      if (mask & (1 << i)) pick.push(nums[i]);
    }
    out.push(pick);
  }

  return out;
}

function subsets(nums) {
  const out = [];
  const path = [];

  function walk(i) {
    if (i === nums.length) {
      out.push([...path]);
      return;
    }

    path.push(nums[i]);
    walk(i + 1);
    path.pop();

    walk(i + 1);
  }

  walk(0);
  return out;
}

test('example 1', subsets([1, 2, 3]), [
  [], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3],
], { unordered: true });

test('example 2 - single element', subsets([0]), [[], [0]], { unordered: true });

test('empty input still has one subset', subsets([]), [[]], { unordered: true });
test('two elements', subsets([1, 2]), [[], [1], [2], [1, 2]], { unordered: true });
test('negatives and zero', subsets([-1, 0]), [[], [-1], [0], [-1, 0]], { unordered: true });

test('five elements gives 2^5', subsets([1, 2, 3, 4, 5]).length, 32);
test('no repeated subsets at n = 4', new Set(subsets([1, 2, 3, 4]).map((s) => s.join(','))).size, 16);

test('bitmask version agrees', subsetsBitmask([1, 2, 3]), subsets([1, 2, 3]), { unordered: true });

test('repeated input value yields repeated subsets', subsets([1, 1]), [[], [1], [1], [1, 1]], {
  unordered: true,
});

summary('Day 050 - Subsets');

module.exports = { subsets, subsetsBitmask };
