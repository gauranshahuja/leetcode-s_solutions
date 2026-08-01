'use strict';

const { test, summary } = require('../../lib/check');

function groupAnagrams(words) {
  const groups = new Map();

  for (const word of words) {
    const key = word.split('').sort().join('');

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }

  return [...groups.values()];
}

function groupAnagramsByCount(words) {
  const groups = new Map();
  const A = 'a'.charCodeAt(0);

  for (const word of words) {
    const counts = new Array(26).fill(0);
    for (let i = 0; i < word.length; i += 1) {
      counts[word.charCodeAt(i) - A] += 1;
    }

    const key = counts.join('#');

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }

  return [...groups.values()];
}

test(
  'leetcode example',
  groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']),
  [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
  { unordered: true }
);
test('single empty string', groupAnagrams(['']), [['']], { unordered: true });
test('one letter', groupAnagrams(['a']), [['a']], { unordered: true });
test('empty input', groupAnagrams([]), [], { unordered: true });
test(
  'nothing groups',
  groupAnagrams(['abc', 'def', 'ghi']),
  [['abc'], ['def'], ['ghi']],
  { unordered: true }
);
test(
  'exact duplicates stay together',
  groupAnagrams(['ab', 'ab', 'ba']),
  [['ab', 'ab', 'ba']],
  { unordered: true }
);
test(
  'repeated letters, same multiset different arrangement',
  groupAnagrams(['aab', 'aba', 'baa', 'abb']),
  [['aab', 'aba', 'baa'], ['abb']],
  { unordered: true }
);
test(
  'count key agrees with sort key',
  groupAnagramsByCount(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']),
  [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
  { unordered: true }
);
test(
  'count key separator survives double-digit counts',
  groupAnagramsByCount(['aaaaaaaaaaab', 'baaaaaaaaaaa', 'ab']),
  [['aaaaaaaaaaab', 'baaaaaaaaaaa'], ['ab']],
  { unordered: true }
);

summary('Day 031 - Group Anagrams');

module.exports = { groupAnagrams, groupAnagramsByCount };
