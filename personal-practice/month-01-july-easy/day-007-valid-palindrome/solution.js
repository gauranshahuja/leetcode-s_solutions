'use strict';

const { test, summary } = require('../../lib/check');

function isAlphaNumeric(ch) {
  return (
    (ch >= 'a' && ch <= 'z') ||
    (ch >= 'A' && ch <= 'Z') ||
    (ch >= '0' && ch <= '9')
  );
}

function isPalindrome(s) {
  let lo = 0;
  let hi = s.length - 1;

  while (lo < hi) {
    while (lo < hi && !isAlphaNumeric(s[lo])) lo += 1;
    while (lo < hi && !isAlphaNumeric(s[hi])) hi -= 1;

    if (s[lo].toLowerCase() !== s[hi].toLowerCase()) return false;

    lo += 1;
    hi -= 1;
  }

  return true;
}

test('example 1', isPalindrome('A man, a plan, a canal: Panama'), true);
test('example 2 - not a palindrome', isPalindrome('race a car'), false);
test('example 3 - a single space', isPalindrome(' '), true);
test('empty string', isPalindrome(''), true);
test('punctuation only', isPalindrome('.,!'), true);
test('digit against a letter, case folding must not merge them', isPalindrome('0P'), false);
test('digits are part of the comparison', isPalindrome('1a2a1'), true);
test('mixed case with punctuation in the middle', isPalindrome('Was it a car or a cat I saw?'), true);
test('odd length, middle character is ignored', isPalindrome('ab_ba'), true);

summary('Day 007 - Valid Palindrome');

module.exports = { isPalindrome, isAlphaNumeric };
