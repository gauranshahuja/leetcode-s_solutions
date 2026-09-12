'use strict';

const { test, summary } = require('../../lib/check');

const PAD = {
  2: 'abc',
  3: 'def',
  4: 'ghi',
  5: 'jkl',
  6: 'mno',
  7: 'pqrs',
  8: 'tuv',
  9: 'wxyz',
};

function letterCombinations(digits) {
  if (!digits) return [];

  const out = [];
  const buf = [];

  function walk(i) {
    if (i === digits.length) {
      out.push(buf.join(''));
      return;
    }

    for (const letter of PAD[digits[i]]) {
      buf.push(letter);
      walk(i + 1);
      buf.pop();
    }
  }

  walk(0);
  return out;
}

test(
  'example - two digits',
  letterCombinations('23'),
  ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'],
  { unordered: true }
);
test('empty string gives no combinations', letterCombinations(''), []);
test('single three-letter digit', letterCombinations('2'), ['a', 'b', 'c'], { unordered: true });
test('single four-letter digit', letterCombinations('7'), ['p', 'q', 'r', 's'], {
  unordered: true,
});
test('two four-letter digits -> 4 * 4', letterCombinations('79').length, 16);
test('mixed row sizes -> 3 * 3 * 3', letterCombinations('234').length, 27);
test('all answers have one letter per digit', letterCombinations('279').every((s) => s.length === 3), true);
test('no duplicates in the output', (() => {
  const res = letterCombinations('7979');
  return new Set(res).size === res.length && res.length === 256;
})(), true);
test('natural order is row order, so 23 starts at "ad" and ends at "cf"', (() => {
  const res = letterCombinations('23');
  return [res[0], res[res.length - 1]];
})(), ['ad', 'cf']);

summary('Day 073 - Letter Combinations of a Phone Number');

module.exports = { letterCombinations, PAD };
