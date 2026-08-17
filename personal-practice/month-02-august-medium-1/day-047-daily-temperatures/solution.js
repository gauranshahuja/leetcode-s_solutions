'use strict';

const { test, summary } = require('../../lib/check');

function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = [];

  for (let i = 0; i < n; i += 1) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const waiting = stack.pop();
      answer[waiting] = i - waiting;
    }
    stack.push(i);
  }

  return answer;
}

test('example 1', dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]);
test('example 2', dailyTemperatures([30, 40, 50, 60]), [1, 1, 1, 0]);
test('example 3', dailyTemperatures([30, 60, 90]), [1, 1, 0]);

test('single day', dailyTemperatures([50]), [0]);
test('empty input', dailyTemperatures([]), []);

test('all equal temperatures', dailyTemperatures([50, 50, 50]), [0, 0, 0]);
test('plateau then a jump', dailyTemperatures([70, 70, 75]), [2, 1, 0]);

test('strictly cooling', dailyTemperatures([90, 80, 70, 60]), [0, 0, 0, 0]);

test('two waiting groups', dailyTemperatures([55, 38, 53, 81, 61, 93, 97, 32, 43, 78]), [
  3, 1, 1, 2, 1, 1, 0, 1, 1, 0,
]);

summary('Day 047 - Daily Temperatures');

module.exports = { dailyTemperatures };
