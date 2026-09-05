'use strict';

const { test, summary } = require('../../lib/check');

const A = 'a'.charCodeAt(0);

function findAnagrams(s, p) {
  const out = [];
  const m = p.length;
  if (m === 0 || m > s.length) return out;

  const need = new Array(26).fill(0);
  const win = new Array(26).fill(0);
  for (let i = 0; i < m; i += 1) need[p.charCodeAt(i) - A] += 1;

  let matches = 0;
  for (let i = 0; i < 26; i += 1) {
    if (need[i] === 0) matches += 1;
  }

  for (let r = 0; r < s.length; r += 1) {
    const inIdx = s.charCodeAt(r) - A;
    win[inIdx] += 1;
    if (win[inIdx] === need[inIdx]) matches += 1;
    else if (win[inIdx] === need[inIdx] + 1) matches -= 1;

    if (r >= m) {
      const outIdx = s.charCodeAt(r - m) - A;
      win[outIdx] -= 1;
      if (win[outIdx] === need[outIdx]) matches += 1;
      else if (win[outIdx] === need[outIdx] - 1) matches -= 1;
    }

    if (r >= m - 1 && matches === 26) out.push(r - m + 1);
  }

  return out;
}

test('example 1 - "abc" in "cbaebabacd"', findAnagrams('cbaebabacd', 'abc'), [0, 6]);
test('example 2 - overlapping windows', findAnagrams('abab', 'ab'), [0, 1, 2]);
test('p longer than s', findAnagrams('aa', 'aaaaa'), []);
test('single letter, every position', findAnagrams('aaa', 'a'), [0, 1, 2]);
test('no letters in common', findAnagrams('aa', 'bb'), []);
test('counts must match, not just membership', findAnagrams('baa', 'aa'), [1]);
test('four hits, one near miss in the middle', findAnagrams('abacbabc', 'abc'), [1, 2, 3, 5]);
test('whole string is the only anagram', findAnagrams('cba', 'abc'), [0]);

summary('Day 066 - Find All Anagrams in a String');

module.exports = { findAnagrams };
