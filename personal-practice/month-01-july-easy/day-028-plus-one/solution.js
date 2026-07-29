'use strict';

const { test, summary } = require('../../lib/check');

function plusOne(digits) {
  const out = digits.slice();

  for (let i = out.length - 1; i >= 0; i -= 1) {
    if (out[i] < 9) {
      out[i] += 1;
      return out;
    }
    out[i] = 0;
  }

  return [1, ...out];
}

test('example 1', plusOne([1, 2, 3]), [1, 2, 4]);
test('example 2', plusOne([4, 3, 2, 1]), [4, 3, 2, 2]);
test('single nine grows a digit', plusOne([9]), [1, 0]);
test('all nines', plusOne([9, 9, 9]), [1, 0, 0, 0]);
test('carry stops partway', plusOne([1, 9, 9]), [2, 0, 0]);
test('zero', plusOne([0]), [1]);
test('two digits with one carry', plusOne([2, 9]), [3, 0]);
test('long run of nines', plusOne([1, 9, 9, 9, 9]), [2, 0, 0, 0, 0]);

const original = [9, 9];
plusOne(original);
test('input array is left alone', original, [9, 9]);

summary('Day 028 - Plus One');

module.exports = { plusOne };
