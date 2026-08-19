'use strict';

const { test, summary } = require('../../lib/check');

function generateParenthesis(n) {
  const out = [];
  const path = [];

  function walk(open, close) {
    if (path.length === 2 * n) {
      out.push(path.join(''));
      return;
    }

    if (open < n) {
      path.push('(');
      walk(open + 1, close);
      path.pop();
    }

    if (close < open) {
      path.push(')');
      walk(open, close + 1);
      path.pop();
    }
  }

  walk(0, 0);
  return out;
}

function isBalanced(s) {
  let depth = 0;
  for (const ch of s) {
    depth += ch === '(' ? 1 : -1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

test('n = 1', generateParenthesis(1), ['()'], { unordered: true });
test('n = 2', generateParenthesis(2), ['(())', '()()'], { unordered: true });
test('n = 3', generateParenthesis(3), ['((()))', '(()())', '(())()', '()(())', '()()()'], {
  unordered: true,
});

test('n = 0 gives the empty string', generateParenthesis(0), [''], { unordered: true });

test('n = 4 produces 14 strings', generateParenthesis(4).length, 14);
test('n = 5 produces 42 strings', generateParenthesis(5).length, 42);

test('every n = 5 string is balanced', generateParenthesis(5).every(isBalanced), true);
test('every n = 5 string has length 10', generateParenthesis(5).every((s) => s.length === 10), true);
test('no duplicates at n = 5', new Set(generateParenthesis(5)).size, 42);

summary('Day 049 - Generate Parentheses');

module.exports = { generateParenthesis, isBalanced };
