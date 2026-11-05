'use strict';

const { test, summary } = require('../../lib/check');

function isMatchRecursive(s, p) {
  if (p.length === 0) return s.length === 0;

  const firstMatches = s.length > 0 && (p[0] === '.' || p[0] === s[0]);

  if (p.length >= 2 && p[1] === '*') {
    return isMatchRecursive(s, p.slice(2)) || (firstMatches && isMatchRecursive(s.slice(1), p));
  }

  return firstMatches && isMatchRecursive(s.slice(1), p.slice(1));
}

function isMatch(s, p) {
  const m = s.length;
  const n = p.length;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  for (let j = 1; j <= n; j += 1) {
    if (p[j - 1] === '*') dp[0][j] = j >= 2 ? dp[0][j - 2] : false;
  }

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const pc = p[j - 1];

      if (pc === '*') {
        const repeated = p[j - 2];
        dp[i][j] = j >= 2 ? dp[i][j - 2] : false;

        if (!dp[i][j] && (repeated === '.' || repeated === s[i - 1])) {
          dp[i][j] = dp[i - 1][j];
        }
      } else if (pc === '.' || pc === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }

  return dp[m][n];
}

test('example 1, literal too short', isMatch('aa', 'a'), false);
test('example 2, star repeats the a', isMatch('aa', 'a*'), true);
test('example 3, dot-star matches anything', isMatch('ab', '.*'), true);
test('star with zero occurrences', isMatch('aab', 'c*a*b'), true);
test('empty string against a*b*c*', isMatch('', 'a*b*c*'), true);
test('star group must not leak past its own letter', isMatch('abcd', 'd*'), false);
test('match has to cover the whole string', isMatch('ab', '.*c'), false);
test('the mississippi one', isMatch('mississippi', 'mis*is*p*.'), false);
test('recursive version agrees', isMatchRecursive('aab', 'c*a*b'), true);

summary('Day 127 - Regular Expression Matching');

module.exports = { isMatch, isMatchRecursive };
