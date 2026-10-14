'use strict';

const { test, summary } = require('../../lib/check');

function partitionNaive(s) {
  const out = [];
  const path = [];

  function isPalindrome(lo, hi) {
    while (lo < hi) {
      if (s[lo] !== s[hi]) return false;
      lo += 1;
      hi -= 1;
    }
    return true;
  }

  function back(start) {
    if (start === s.length) {
      out.push(path.slice());
      return;
    }
    for (let end = start; end < s.length; end += 1) {
      if (!isPalindrome(start, end)) continue;
      path.push(s.slice(start, end + 1));
      back(end + 1);
      path.pop();
    }
  }

  back(0);
  return out;
}

function partition(s) {
  const n = s.length;
  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = i; j < n; j += 1) {
      isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1]);
    }
  }

  const out = [];
  const path = [];

  function back(start) {
    if (start === n) {
      out.push(path.slice());
      return;
    }
    for (let end = start; end < n; end += 1) {
      if (!isPal[start][end]) continue;
      path.push(s.slice(start, end + 1));
      back(end + 1);
      path.pop();
    }
  }

  back(0);
  return out;
}

test('example 1', partition('aab'), [['a', 'a', 'b'], ['aa', 'b']], { unordered: true });
test('example 2 - single char', partition('a'), [['a']], { unordered: true });
test('nothing but single letters is possible', partition('abc'), [['a', 'b', 'c']], {
  unordered: true,
});
test('whole string is a palindrome too', partition('aba'), [['a', 'b', 'a'], ['aba']], {
  unordered: true,
});
test(
  'all three cuts of aaa',
  partition('aaa'),
  [['a', 'a', 'a'], ['a', 'aa'], ['aa', 'a'], ['aaa']],
  { unordered: true }
);
test(
  'even-length palindrome in the middle',
  partition('abba'),
  [['a', 'b', 'b', 'a'], ['a', 'bb', 'a'], ['abba']],
  { unordered: true }
);
test('empty string gives the empty partition', partition(''), [[]], { unordered: true });
test('all-same string hits 2^(n-1) partitions', partition('aaaa').length, 8);
test('naive version agrees on example 1', partitionNaive('aab'), [['a', 'a', 'b'], ['aa', 'b']], {
  unordered: true,
});

summary('Day 105 - Palindrome Partitioning');

module.exports = { partition, partitionNaive };
