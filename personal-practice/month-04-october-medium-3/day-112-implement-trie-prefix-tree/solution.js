'use strict';

const { test, summary } = require('../../lib/check');

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  #walk(str) {
    let node = this.root;
    for (const ch of str) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }

  search(word) {
    const node = this.#walk(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix) {
    return this.#walk(prefix) !== null;
  }
}

function runTrie(ops) {
  const trie = new Trie();
  const out = [];

  for (const [name, arg] of ops) {
    if (name === 'insert') {
      trie.insert(arg);
      out.push(null);
    } else if (name === 'search') {
      out.push(trie.search(arg));
    } else {
      out.push(trie.startsWith(arg));
    }
  }

  return out;
}

function nodeCount(trie) {
  let total = 0;
  const stack = [trie.root];
  while (stack.length) {
    const node = stack.pop();
    total += 1;
    for (const child of node.children.values()) stack.push(child);
  }
  return total;
}

test(
  'the LeetCode call sequence',
  runTrie([
    ['insert', 'apple'],
    ['search', 'apple'],
    ['search', 'app'],
    ['startsWith', 'app'],
    ['insert', 'app'],
    ['search', 'app'],
  ]),
  [null, true, false, true, null, true]
);
test(
  'a word that is a prefix of another, inserted long-first',
  runTrie([
    ['insert', 'application'],
    ['search', 'app'],
    ['insert', 'app'],
    ['search', 'app'],
    ['search', 'application'],
    ['startsWith', 'appli'],
  ]),
  [null, false, null, true, true, true]
);
test(
  'inserting short-first does not erase the longer word',
  runTrie([
    ['insert', 'car'],
    ['insert', 'card'],
    ['search', 'car'],
    ['search', 'card'],
    ['search', 'ca'],
    ['startsWith', 'card'],
  ]),
  [null, null, true, true, false, true]
);
test(
  'a sibling branch does not create false positives',
  runTrie([
    ['insert', 'cat'],
    ['insert', 'car'],
    ['search', 'cab'],
    ['search', 'care'],
    ['startsWith', 'ca'],
    ['startsWith', 'cab'],
  ]),
  [null, null, false, false, true, false]
);
test(
  'empty trie answers everything negatively, except the empty prefix',
  runTrie([
    ['search', 'a'],
    ['startsWith', 'a'],
    ['search', ''],
    ['startsWith', ''],
  ]),
  [false, false, false, true]
);
test(
  'the empty string is insertable and then found',
  runTrie([
    ['insert', ''],
    ['search', ''],
    ['search', 'a'],
    ['startsWith', ''],
  ]),
  [null, true, false, true]
);
test(
  'prefix longer than anything stored',
  runTrie([
    ['insert', 'ab'],
    ['startsWith', 'abc'],
    ['search', 'abc'],
  ]),
  [null, false, false]
);
test(
  'case matters - App and app are different keys',
  runTrie([
    ['insert', 'App'],
    ['search', 'app'],
    ['search', 'App'],
    ['startsWith', 'Ap'],
  ]),
  [null, false, true, true]
);

const shared = new Trie();
shared.insert('cat');
shared.insert('car');
test('cat and car share two nodes, so 5 in total with the root', nodeCount(shared), 5);

summary('Day 112 - Implement Trie (Prefix Tree)');

module.exports = { Trie, TrieNode, runTrie, nodeCount };
