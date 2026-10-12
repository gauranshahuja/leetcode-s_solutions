'use strict';

const { test, summary } = require('../../lib/check');

function calculateStack(s) {
  const terms = [];
  let num = 0;
  let op = '+';

  for (let i = 0; i <= s.length; i += 1) {
    const ch = s[i];

    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
      continue;
    }
    if (ch === ' ') continue;

    if (op === '+') terms.push(num);
    else if (op === '-') terms.push(-num);
    else if (op === '*') terms.push(terms.pop() * num);
    else terms.push(Math.trunc(terms.pop() / num));

    num = 0;
    op = ch;
  }

  return terms.reduce((a, b) => a + b, 0);
}

function calculate(s) {
  let result = 0;
  let prev = 0;
  let num = 0;
  let op = '+';

  for (let i = 0; i <= s.length; i += 1) {
    const ch = s[i];

    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
      continue;
    }
    if (ch === ' ') continue;

    if (op === '+') {
      result += prev;
      prev = num;
    } else if (op === '-') {
      result += prev;
      prev = -num;
    } else if (op === '*') {
      prev *= num;
    } else {
      prev = Math.trunc(prev / num);
    }

    num = 0;
    op = ch;
  }

  return result + prev;
}

test('example 1 - precedence', calculate('3+2*2'), 7);
test('example 2 - truncating division', calculate(' 3/2 '), 1);
test('example 3 - mixed with spaces', calculate(' 3+5 / 2 '), 5);
test('single number, no operator', calculate('42'), 42);
test('multi-digit everywhere', calculate('100/10*10'), 100);
test('minus in front of a product', calculate('1-1*2'), -1);
test('division of a negative term truncates toward zero', calculate('1-5/2'), -1);
test('left-to-right for equal precedence', calculate('14-3-2'), 9);
test('stack version agrees on the nasty one', calculateStack('1-5/2'), -1);

summary('Day 103 - Basic Calculator II');

module.exports = { calculate, calculateStack };
