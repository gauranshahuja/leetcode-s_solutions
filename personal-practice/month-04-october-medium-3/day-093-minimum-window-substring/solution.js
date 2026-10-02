'use strict';

const { test, summary } = require('../../lib/check');

function minWindow(s, t) {
  if (t.length === 0 || s.length < t.length) return '';

  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);

  const window = new Map();
  const required = need.size;
  let formed = 0;

  let bestLen = Infinity;
  let bestStart = 0;
  let left = 0;

  for (let right = 0; right < s.length; right += 1) {
    const inCh = s[right];

    if (need.has(inCh)) {
      const count = (window.get(inCh) || 0) + 1;
      window.set(inCh, count);
      if (count === need.get(inCh)) formed += 1;
    }

    while (formed === required) {
      const len = right - left + 1;
      if (len < bestLen) {
        bestLen = len;
        bestStart = left;
      }

      const outCh = s[left];
      left += 1;

      if (need.has(outCh)) {
        const count = window.get(outCh) - 1;
        window.set(outCh, count);
        if (count < need.get(outCh)) formed -= 1;
      }
    }
  }

  return bestLen === Infinity ? '' : s.slice(bestStart, bestStart + bestLen);
}

test('example 1 - answer is at the tail', minWindow('ADOBECODEBANC', 'ABC'), 'BANC');
test('example 2 - s equals t', minWindow('a', 'a'), 'a');
test('example 3 - t needs two a but s has one', minWindow('a', 'aa'), '');
test('empty s', minWindow('', 'a'), '');
test('empty t', minWindow('abc', ''), '');
test('duplicates in t must all be matched', minWindow('aaflslflsldkalskaaa', 'aaa'), 'aaa');
test('answer sits at the very start', minWindow('abcdef', 'ab'), 'ab');
test('shrink has to walk past a surplus copy', minWindow('bba', 'ab'), 'ba');
test('window is not a prefix or suffix', minWindow('cabwefgewcwaefgcf', 'cae'), 'cwae');

summary('Day 093 - Minimum Window Substring');

module.exports = { minWindow };
