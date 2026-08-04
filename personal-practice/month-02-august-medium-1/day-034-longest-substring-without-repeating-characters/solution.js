'use strict';

const { test, summary } = require('../../lib/check');

function lengthOfLongestSubstringBrute(s) {
  let best = 0;

  for (let i = 0; i < s.length; i += 1) {
    const seen = new Set();
    let j = i;
    while (j < s.length && !seen.has(s[j])) {
      seen.add(s[j]);
      j += 1;
    }
    best = Math.max(best, j - i);
  }

  return best;
}

function lengthOfLongestSubstring(s) {
  const lastIndex = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    const seenAt = lastIndex.get(ch);

    if (seenAt !== undefined && seenAt >= left) {
      left = seenAt + 1;
    }

    lastIndex.set(ch, right);

    const width = right - left + 1;
    if (width > best) best = width;
  }

  return best;
}

test('example 1 - abcabcbb', lengthOfLongestSubstring('abcabcbb'), 3);
test('example 2 - all same character', lengthOfLongestSubstring('bbbbb'), 1);
test('example 3 - pwwkew, answer is wke not pwke', lengthOfLongestSubstring('pwwkew'), 3);
test('empty string', lengthOfLongestSubstring(''), 0);
test('a single space is still a character', lengthOfLongestSubstring(' '), 1);
test('dvdf - window must not restart from scratch', lengthOfLongestSubstring('dvdf'), 3);
test('tmmzuxt - stale index must not drag left back', lengthOfLongestSubstring('tmmzuxt'), 5);
test('no repeats at all', lengthOfLongestSubstring('abcdefg'), 7);
test('brute force agrees on the tricky one', lengthOfLongestSubstringBrute('tmmzuxt'), 5);

summary('Day 034 - Longest Substring Without Repeating Characters');

module.exports = { lengthOfLongestSubstring, lengthOfLongestSubstringBrute };
