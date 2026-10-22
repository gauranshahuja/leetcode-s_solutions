'use strict';

const { test, summary } = require('../../lib/check');

function wordBreakMemo(s, wordDict) {
  const words = new Set(wordDict);
  let maxLen = 0;
  for (const w of wordDict) maxLen = Math.max(maxLen, w.length);

  const memo = new Map();

  function canBreak(start) {
    if (start === s.length) return true;
    if (memo.has(start)) return memo.get(start);

    let answer = false;
    const stop = Math.min(s.length, start + maxLen);
    for (let end = start + 1; end <= stop; end += 1) {
      if (words.has(s.slice(start, end)) && canBreak(end)) {
        answer = true;
        break;
      }
    }

    memo.set(start, answer);
    return answer;
  }

  return canBreak(0);
}

function wordBreak(s, wordDict) {
  const words = new Set(wordDict);

  let maxLen = 0;
  for (const w of wordDict) maxLen = Math.max(maxLen, w.length);

  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i += 1) {
    const earliest = Math.max(0, i - maxLen);
    for (let j = i - 1; j >= earliest; j -= 1) {
      if (dp[j] && words.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}

test('example 1 - leetcode', wordBreak('leetcode', ['leet', 'code']), true);
test('example 2 - word reused', wordBreak('applepenapple', ['apple', 'pen']), true);
test('example 3 - tail left over', wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']), false);
test('empty string is always breakable', wordBreak('', ['a']), true);
test('single char, present', wordBreak('a', ['a']), true);
test('single char, absent', wordBreak('a', ['b']), false);
test('greedy-longest-first would fail this', wordBreak('cars', ['car', 'ca', 'rs']), true);
test('overlapping lengths of the same letter', wordBreak('aaaaaaa', ['aaa', 'aaaa']), true);
test('memo version agrees on the false case', wordBreakMemo('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']), false);

summary('Day 113 - Word Break');

module.exports = { wordBreak, wordBreakMemo };
