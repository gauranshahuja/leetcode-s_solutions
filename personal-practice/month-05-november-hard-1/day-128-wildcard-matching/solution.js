'use strict';

const { test, summary } = require('../../lib/check');

function isMatch(s, p) {
  const m = s.length;
  const n = p.length;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;

  for (let j = 1; j <= n; j += 1) dp[0][j] = dp[0][j - 1] && p[j - 1] === '*';

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const pc = p[j - 1];

      if (pc === '*') {
        dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      } else {
        dp[i][j] = (pc === '?' || pc === s[i - 1]) && dp[i - 1][j - 1];
      }
    }
  }

  return dp[m][n];
}

function isMatchGreedy(s, p) {
  let i = 0;
  let j = 0;
  let star = -1;
  let mark = 0;

  while (i < s.length) {
    if (j < p.length && (p[j] === '?' || p[j] === s[i])) {
      i += 1;
      j += 1;
    } else if (j < p.length && p[j] === '*') {
      star = j;
      mark = i;
      j += 1;
    } else if (star !== -1) {
      j = star + 1;
      mark += 1;
      i = mark;
    } else {
      return false;
    }
  }

  while (j < p.length && p[j] === '*') j += 1;
  return j === p.length;
}

test('example 1, literal too short', isMatch('aa', 'a'), false);
test('example 2, lone star eats everything', isMatch('aa', '*'), true);
test('example 3, question mark is exactly one char', isMatch('cb', '?a'), false);
test('star on both sides', isMatch('adceb', '*a*b'), true);
test('question mark cannot stretch', isMatch('acdcb', 'a*c?b'), false);
test('star matches the empty string', isMatch('', '*'), true);
test('stars and question marks interleaved', isMatch('abcabczzzde', '*abc???de*'), true);
test('greedy agrees on the failing case', isMatchGreedy('acdcb', 'a*c?b'), false);
test('greedy drains trailing stars', isMatchGreedy('abc', 'abc**'), true);

summary('Day 128 - Wildcard Matching');

module.exports = { isMatch, isMatchGreedy };
