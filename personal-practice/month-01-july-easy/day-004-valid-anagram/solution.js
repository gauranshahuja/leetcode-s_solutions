'use strict';

const { test, summary } = require('../../lib/check');

function isAnagramSort(s, t) {
  if (s.length !== t.length) return false;
  const a = [...s].sort().join('');
  const b = [...t].sort().join('');
  return a === b;
}

function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const counts = new Map();
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }

  for (const ch of t) {
    const left = counts.get(ch);
    if (!left) return false;
    counts.set(ch, left - 1);
  }

  return true;
}

test('example 1', isAnagram('anagram', 'nagaram'), true);
test('example 2', isAnagram('rat', 'car'), false);
test('two empty strings', isAnagram('', ''), true);
test('different lengths', isAnagram('a', 'ab'), false);
test('same length, same letters, wrong counts', isAnagram('aabb', 'abbb'), false);
test('simple swap', isAnagram('ab', 'ba'), true);
test('repeated letters spread out', isAnagram('aabbcc', 'abcabc'), true);
test('t has a letter s never had', isAnagram('abc', 'abd'), false);
test('sort version agrees on the tricky count case', isAnagramSort('aabb', 'abbb'), false);

summary('Day 004 - Valid Anagram');

module.exports = { isAnagram, isAnagramSort };
