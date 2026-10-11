'use strict';

const { test, summary } = require('../../lib/check');

function largestRectangleArea(heights) {
  const n = heights.length;
  const stack = [];
  let best = 0;

  for (let i = 0; i <= n; i += 1) {
    const h = i === n ? 0 : heights[i];

    while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
      const top = stack.pop();
      const height = heights[top];

      const below = stack.length > 0 ? stack[stack.length - 1] : -1;
      const width = i - below - 1;

      const area = height * width;
      if (area > best) best = area;
    }

    stack.push(i);
  }

  return best;
}

test('example 1', largestRectangleArea([2, 1, 5, 6, 2, 3]), 10);
test('example 2 - two bars, wider wins', largestRectangleArea([2, 4]), 4);
test('empty histogram', largestRectangleArea([]), 0);
test('a single bar of height zero', largestRectangleArea([0]), 0);
test('strictly decreasing - answer is in the middle', largestRectangleArea([5, 4, 3, 2, 1]), 9);
test('strictly increasing - mirror of the above', largestRectangleArea([1, 2, 3, 4, 5]), 9);
test('all equal - full width', largestRectangleArea([2, 2, 2, 2]), 8);
test('dip in the middle spans the whole width', largestRectangleArea([2, 1, 2]), 3);
test('short bar beats tall ones on width', largestRectangleArea([6, 7, 5, 2, 4, 5, 9, 3]), 16);

summary('Day 102 - Largest Rectangle in Histogram');

module.exports = { largestRectangleArea };
