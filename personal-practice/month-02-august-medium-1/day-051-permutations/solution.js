'use strict';

const { test, summary } = require('../../lib/check');

function permute(nums) {
  const n = nums.length;
  const out = [];
  const path = [];
  const used = new Array(n).fill(false);

  function walk() {
    if (path.length === n) {
      out.push([...path]);
      return;
    }

    for (let i = 0; i < n; i += 1) {
      if (used[i]) continue;

      used[i] = true;
      path.push(nums[i]);

      walk();

      path.pop();
      used[i] = false;
    }
  }

  walk();
  return out;
}

test('example 1', permute([1, 2, 3]), [
  [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1],
], { unordered: true });

test('example 2 - two elements', permute([0, 1]), [[0, 1], [1, 0]], { unordered: true });
test('example 3 - single element', permute([1]), [[1]], { unordered: true });

test('empty input has one permutation', permute([]), [[]], { unordered: true });
test('negatives', permute([-1, 0]), [[-1, 0], [0, -1]], { unordered: true });

test('four elements gives 4!', permute([1, 2, 3, 4]).length, 24);
test('all 24 are distinct', new Set(permute([1, 2, 3, 4]).map((p) => p.join(','))).size, 24);

test('every result is a rearrangement of the input', permute([1, 2, 3, 4]).every(
  (p) => p.slice().sort((a, b) => a - b).join(',') === '1,2,3,4'
), true);

test('repeated input value yields repeated orderings', permute([1, 1]), [[1, 1], [1, 1]], {
  unordered: true,
});

summary('Day 051 - Permutations');

module.exports = { permute };
