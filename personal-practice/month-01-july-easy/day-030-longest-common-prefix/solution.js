'use strict';

const { test, summary } = require('../../lib/check');

function longestCommonPrefix(strs) {
  if (strs.length === 0) return '';

  let prefix = strs[0];

  for (let i = 1; i < strs.length; i += 1) {
    const word = strs[i];

    let j = 0;
    while (j < prefix.length && j < word.length && prefix[j] === word[j]) j += 1;

    prefix = prefix.slice(0, j);
    if (prefix === '') return '';
  }

  return prefix;
}

test('example 1', longestCommonPrefix(['flower', 'flow', 'flight']), 'fl');
test('example 2 - nothing shared', longestCommonPrefix(['dog', 'racecar', 'car']), '');
test('empty array', longestCommonPrefix([]), '');
test('array holding one empty string', longestCommonPrefix(['']), '');
test('single word is its own prefix', longestCommonPrefix(['alone']), 'alone');
test('long shared prefix', longestCommonPrefix(['interspecies', 'interstellar', 'interstate']), 'inters');
test('shortest word is one character and kills it', longestCommonPrefix(['c', 'acc', 'ccc']), '');
test('prefix shrinks twice', longestCommonPrefix(['abab', 'aba', 'abc']), 'ab');
test('comparison is case sensitive', longestCommonPrefix(['Flower', 'flow']), '');

summary('Day 030 - Longest Common Prefix');

module.exports = { longestCommonPrefix };
