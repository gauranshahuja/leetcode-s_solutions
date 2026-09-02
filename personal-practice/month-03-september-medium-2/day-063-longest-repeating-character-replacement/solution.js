'use strict';

const { test, summary } = require('../../lib/check');

const A = 'A'.charCodeAt(0);

function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let left = 0;
  let maxCount = 0;

  for (let right = 0; right < s.length; right += 1) {
    const inIdx = s.charCodeAt(right) - A;
    count[inIdx] += 1;
    if (count[inIdx] > maxCount) maxCount = count[inIdx];

    if (right - left + 1 - maxCount > k) {
      count[s.charCodeAt(left) - A] -= 1;
      left += 1;
    }
  }

  return s.length - left;
}

function characterReplacementBrute(s, k) {
  let best = 0;
  for (let i = 0; i < s.length; i += 1) {
    const count = new Array(26).fill(0);
    let maxCount = 0;
    for (let j = i; j < s.length; j += 1) {
      const idx = s.charCodeAt(j) - A;
      count[idx] += 1;
      if (count[idx] > maxCount) maxCount = count[idx];
      if (j - i + 1 - maxCount <= k && j - i + 1 > best) best = j - i + 1;
    }
  }
  return best;
}

test('example 1 - ABAB with k=2', characterReplacement('ABAB', 2), 4);
test('example 2 - AABABBA with k=1', characterReplacement('AABABBA', 1), 4);
test('empty string', characterReplacement('', 2), 0);
test('single char, no budget', characterReplacement('A', 0), 1);
test('already uniform, budget unused and must not inflate the answer', characterReplacement('AAAA', 2), 4);
test('all distinct, k=1 buys one neighbour', characterReplacement('ABCDE', 1), 2);
test('k=0 falls back to longest plain run', characterReplacement('AABA', 0), 2);
test('replace both ends - BAAAB with k=2', characterReplacement('BAAAB', 2), 5);
test('brute force agrees on AABABBA', characterReplacementBrute('AABABBA', 1), 4);

summary('Day 063 - Longest Repeating Character Replacement');

module.exports = { characterReplacement, characterReplacementBrute };
