'use strict';

const { test, summary } = require('../../lib/check');

function subsetsWithDupSet(nums) {
  const arr = [...nums].sort((a, b) => a - b);
  const seen = new Set();
  const out = [];
  const path = [];

  function walk(start) {
    const key = JSON.stringify(path);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(path.slice());
    }

    for (let i = start; i < arr.length; i += 1) {
      path.push(arr[i]);
      walk(i + 1);
      path.pop();
    }
  }

  walk(0);
  return out;
}

function subsetsWithDup(nums) {
  const arr = [...nums].sort((a, b) => a - b);
  const out = [];
  const path = [];

  function walk(start) {
    out.push(path.slice());

    for (let i = start; i < arr.length; i += 1) {
      if (i > start && arr[i] === arr[i - 1]) continue;

      path.push(arr[i]);
      walk(i + 1);
      path.pop();
    }
  }

  walk(0);
  return out;
}

test(
  'example - one duplicated value',
  subsetsWithDup([1, 2, 2]),
  [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]],
  { unordered: true }
);
test('single element', subsetsWithDup([0]), [[], [0]], { unordered: true });
test('empty input still has the empty subset', subsetsWithDup([]), [[]], { unordered: true });
test('all three equal -> n + 1 subsets', subsetsWithDup([1, 1, 1]), [[], [1], [1, 1], [1, 1, 1]], {
  unordered: true,
});
test(
  'four equal plus a loner',
  subsetsWithDup([4, 4, 4, 1, 4]),
  [[], [1], [1, 4], [1, 4, 4], [1, 4, 4, 4], [1, 4, 4, 4, 4], [4], [4, 4], [4, 4, 4], [4, 4, 4, 4]],
  { unordered: true }
);
test('negatives and a zero', subsetsWithDup([-1, 0, -1]), [[], [-1], [-1, -1], [-1, 0], [-1, -1, 0], [0]], {
  unordered: true,
});
test('counts multiply: 2 * 3 * 4 = 24', subsetsWithDup([1, 2, 2, 3, 3, 3]).length, 24);
test('16 equal numbers -> 17 subsets, no 2^16 blowup', subsetsWithDup(new Array(16).fill(7)).length, 17);
test('the Set-dedupe version agrees', subsetsWithDupSet([1, 2, 2]), subsetsWithDup([1, 2, 2]), {
  unordered: true,
});

summary('Day 074 - Subsets II');

module.exports = { subsetsWithDup, subsetsWithDupSet };
