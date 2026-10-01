'use strict';

const { test, summary } = require('../../lib/check');

function longestPalindromeBrute(s) {
  const isPal = (lo, hi) => {
    while (lo < hi) {
      if (s[lo] !== s[hi]) return false;
      lo += 1;
      hi -= 1;
    }
    return true;
  };

  let best = '';
  for (let i = 0; i < s.length; i += 1) {
    for (let j = i; j < s.length; j += 1) {
      if (j - i + 1 > best.length && isPal(i, j)) best = s.slice(i, j + 1);
    }
  }
  return best;
}

function longestPalindrome(s) {
  if (s.length < 2) return s;

  let bestStart = 0;
  let bestLen = 1;

  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l -= 1;
      r += 1;
    }
    const len = r - l - 1;
    if (len > bestLen) {
      bestLen = len;
      bestStart = l + 1;
    }
  };

  for (let i = 0; i < s.length; i += 1) {
    expand(i, i);
    expand(i, i + 1);
  }

  return s.slice(bestStart, bestStart + bestLen);
}

test('example 1 - bab wins before aba is reached', longestPalindrome('babad'), 'bab');
test('example 2 - even length centre', longestPalindrome('cbbd'), 'bb');
test('single character', longestPalindrome('a'), 'a');
test('empty string', longestPalindrome(''), '');
test('no palindrome longer than 1, takes the first', longestPalindrome('ac'), 'a');
test('whole string is one palindrome', longestPalindrome('aaaa'), 'aaaa');
test('palindrome buried in the middle', longestPalindrome('forgeeksskeegfor'), 'geeksskeeg');
test('two equal-length answers, first one kept', longestPalindrome('abacdfgdcaba'), 'aba');
test('brute force agrees on the awkward one', longestPalindromeBrute('abacdfgdcaba'), 'aba');

summary('Day 092 - Longest Palindromic Substring');

module.exports = { longestPalindrome, longestPalindromeBrute };
