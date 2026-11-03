'use strict';

const { test, summary } = require('../../lib/check');

function longestValidParentheses(s) {
  const stack = [-1];
  let best = 0;

  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop();

      if (stack.length === 0) {
        stack.push(i);
      } else {
        best = Math.max(best, i - stack[stack.length - 1]);
      }
    }
  }

  return best;
}

function longestValidParenthesesDp(s) {
  const n = s.length;
  const dp = new Array(n).fill(0);
  let best = 0;

  for (let i = 1; i < n; i += 1) {
    if (s[i] !== ')') continue;

    if (s[i - 1] === '(') {
      dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
    } else {
      const j = i - dp[i - 1] - 1;
      if (j >= 0 && s[j] === '(') {
        dp[i] = dp[i - 1] + 2 + (j >= 1 ? dp[j - 1] : 0);
      }
    }

    if (dp[i] > best) best = dp[i];
  }

  return best;
}

test('example 1', longestValidParentheses('(()'), 2);
test('example 2', longestValidParentheses(')()())'), 4);
test('empty string', longestValidParentheses(''), 0);
test('single open bracket', longestValidParentheses('('), 0);
test('closed before open, nothing matches', longestValidParentheses(')('), 0);
test('two separate pairs count as one run', longestValidParentheses('()()'), 4);
test('stray open splits the string', longestValidParentheses('()(()'), 2);
test('run continues past a nested group', longestValidParentheses('()(())'), 6);
test('dp version agrees on the tricky one', longestValidParenthesesDp('()(())'), 6);

summary('Day 125 - Longest Valid Parentheses');

module.exports = { longestValidParentheses, longestValidParenthesesDp };
