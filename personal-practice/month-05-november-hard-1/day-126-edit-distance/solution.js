'use strict';

const { test, summary } = require('../../lib/check');

function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j - 1],
          dp[i - 1][j],
          dp[i][j - 1]
        );
      }
    }
  }

  return dp[m][n];
}

function minDistanceRolling(word1, word2) {
  const m = word1.length;
  const n = word2.length;

  const dp = Array.from({ length: n + 1 }, (_, j) => j);

  for (let i = 1; i <= m; i += 1) {
    let diag = dp[0];
    dp[0] = i;

    for (let j = 1; j <= n; j += 1) {
      const above = dp[j];
      dp[j] = word1[i - 1] === word2[j - 1]
        ? diag
        : 1 + Math.min(diag, above, dp[j - 1]);
      diag = above;
    }
  }

  return dp[n];
}

test('example 1', minDistance('horse', 'ros'), 3);
test('example 2', minDistance('intention', 'execution'), 5);
test('both empty', minDistance('', ''), 0);
test('empty source, all inserts', minDistance('', 'abc'), 3);
test('empty target, all deletes', minDistance('abc', ''), 3);
test('identical strings cost nothing', minDistance('abcdef', 'abcdef'), 0);
test('shared prefix only', minDistance('pneumonoultramicroscopic', 'pneumonoultra'), 11);
test('reversed string, every char differs', minDistance('abcd', 'dcba'), 4);
test('rolling version agrees on example 2', minDistanceRolling('intention', 'execution'), 5);

summary('Day 126 - Edit Distance');

module.exports = { minDistance, minDistanceRolling };
