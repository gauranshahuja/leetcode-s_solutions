'use strict';

const { test, summary } = require('../../lib/check');

const A = 'a'.charCodeAt(0);

function checkInclusion(s1, s2) {
  const m = s1.length;
  if (m === 0) return true;
  if (m > s2.length) return false;

  const need = new Array(26).fill(0);
  const win = new Array(26).fill(0);

  for (let i = 0; i < m; i += 1) need[s1.charCodeAt(i) - A] += 1;

  for (let r = 0; r < s2.length; r += 1) {
    win[s2.charCodeAt(r) - A] += 1;

    if (r >= m) win[s2.charCodeAt(r - m) - A] -= 1;

    if (r >= m - 1 && sameCounts(win, need)) return true;
  }

  return false;
}

function sameCounts(a, b) {
  for (let i = 0; i < 26; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

test('example 1 - "ab" inside "eidbaooo"', checkInclusion('ab', 'eidbaooo'), true);
test('example 2 - "ab" not in "eidboaoo"', checkInclusion('ab', 'eidboaoo'), false);
test('match at the very start', checkInclusion('adc', 'dcda'), true);
test('match at the very end', checkInclusion('abc', 'xxxxbca'), true);
test('s1 longer than s2', checkInclusion('abcd', 'abc'), false);
test('equal length, reversed', checkInclusion('abc', 'cba'), true);
test('single character present', checkInclusion('a', 'a'), true);
test('right letters, never together', checkInclusion('abc', 'ccccbbbbaaaa'), false);
test('repeated letters must match counts - "hello"', checkInclusion('hello', 'ooolleoooleh'), false);

summary('Day 064 - Permutation in String');

module.exports = { checkInclusion };
