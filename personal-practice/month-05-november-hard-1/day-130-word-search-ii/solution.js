'use strict';

const { test, summary } = require('../../lib/check');

class TrieNode {
  constructor() {
    this.children = new Map();
    this.word = null;
  }
}

function buildTrie(words) {
  const root = new TrieNode();

  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.word = word;
  }

  return root;
}

function findWords(board, words) {
  if (!board || board.length === 0 || board[0].length === 0) return [];

  const rows = board.length;
  const cols = board[0].length;
  const root = buildTrie(words);
  const found = [];

  function dfs(r, c, parent) {
    const ch = board[r][c];
    const node = parent.children.get(ch);
    if (node === undefined) return;

    if (node.word !== null) {
      found.push(node.word);
      node.word = null;
    }

    board[r][c] = '#';

    if (r > 0) dfs(r - 1, c, node);
    if (r + 1 < rows) dfs(r + 1, c, node);
    if (c > 0) dfs(r, c - 1, node);
    if (c + 1 < cols) dfs(r, c + 1, node);

    board[r][c] = ch;

    if (node.children.size === 0 && node.word === null) parent.children.delete(ch);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      dfs(r, c, root);
    }
  }

  return found;
}

const board1 = [
  ['o', 'a', 'a', 'n'],
  ['e', 't', 'a', 'e'],
  ['i', 'h', 'k', 'r'],
  ['i', 'f', 'l', 'v'],
];

test('example 1', findWords(board1, ['oath', 'pea', 'eat', 'rain']), ['oath', 'eat'], { unordered: true });
test('example 2, letters present but not adjacent', findWords([['a', 'b'], ['c', 'd']], ['abcb']), []);
test('single cell, one of two words', findWords([['a']], ['a', 'b']), ['a'], { unordered: true });
test('cannot reuse a cell', findWords([['a', 'a']], ['aa', 'aaa']), ['aa'], { unordered: true });
test(
  'overlapping prefixes on a 2x2',
  findWords([['a', 'b'], ['c', 'd']], ['ab', 'cd', 'ac', 'bd', 'abcd', 'abdc']),
  ['ab', 'cd', 'ac', 'bd', 'abdc'],
  { unordered: true }
);
test('word longer than the whole board', findWords([['a', 'b'], ['c', 'd']], ['abcdabcd']), []);
test('empty word list', findWords(board1, []), []);
test(
  'repeated letters force real backtracking',
  findWords([['a', 'a', 'a'], ['a', 'a', 'a'], ['a', 'a', 'b']], ['aaaaaaab', 'aaab', 'bbb']),
  ['aaaaaaab', 'aaab'],
  { unordered: true }
);
test('board is left unmodified afterwards', board1[0], ['o', 'a', 'a', 'n']);

summary('Day 130 - Word Search II');

module.exports = { findWords, buildTrie, TrieNode };
