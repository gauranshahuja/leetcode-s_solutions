'use strict';

const { test, summary } = require('../../lib/check');

const PARTNER = { ')': '(', ']': '[', '}': '{' };

function isValid(s) {
  const stack = [];

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
      continue;
    }

    if (stack.pop() !== PARTNER[ch]) return false;
  }

  return stack.length === 0;
}

test('simple pair', isValid('()'), true);
test('three kinds side by side', isValid('()[]{}'), true);
test('wrong partner', isValid('(]'), false);
test('crossed, right counts wrong nesting', isValid('([)]'), false);
test('properly nested', isValid('{[]}'), true);
test('empty string is valid', isValid(''), true);
test('closer with nothing open', isValid(']'), false);
test('openers never closed', isValid('((('), false);
test('deep nesting', isValid('((()))'), true);

summary('Day 016 - Valid Parentheses');

module.exports = { isValid };
