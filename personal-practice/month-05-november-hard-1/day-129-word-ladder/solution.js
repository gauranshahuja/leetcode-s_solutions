'use strict';

const { test, summary } = require('../../lib/check');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

function ladderLength(beginWord, endWord, wordList) {
  const unvisited = new Set(wordList);
  if (!unvisited.has(endWord)) return 0;

  unvisited.delete(beginWord);

  let frontier = [beginWord];
  let steps = 1;

  while (frontier.length > 0) {
    const next = [];

    for (const word of frontier) {
      if (word === endWord) return steps;

      const chars = word.split('');
      for (let i = 0; i < chars.length; i += 1) {
        const original = chars[i];

        for (const letter of ALPHABET) {
          if (letter === original) continue;
          chars[i] = letter;

          const candidate = chars.join('');
          if (unvisited.has(candidate)) {
            unvisited.delete(candidate);
            next.push(candidate);
          }
        }

        chars[i] = original;
      }
    }

    frontier = next;
    steps += 1;
  }

  return 0;
}

function ladderLengthBidirectional(beginWord, endWord, wordList) {
  const unvisited = new Set(wordList);
  if (!unvisited.has(endWord)) return 0;

  let head = new Set([beginWord]);
  let tail = new Set([endWord]);
  unvisited.delete(beginWord);
  unvisited.delete(endWord);

  let steps = 1;

  while (head.size > 0 && tail.size > 0) {
    if (head.size > tail.size) [head, tail] = [tail, head];

    const next = new Set();

    for (const word of head) {
      const chars = word.split('');
      for (let i = 0; i < chars.length; i += 1) {
        const original = chars[i];

        for (const letter of ALPHABET) {
          if (letter === original) continue;
          chars[i] = letter;

          const candidate = chars.join('');
          if (tail.has(candidate)) return steps + 1;
          if (unvisited.has(candidate)) {
            unvisited.delete(candidate);
            next.add(candidate);
          }
        }

        chars[i] = original;
      }
    }

    head = next;
    steps += 1;
  }

  return 0;
}

test('example 1', ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']), 5);
test('example 2, endWord missing from the list', ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']), 0);
test('empty word list', ladderLength('hit', 'cog', []), 0);
test('one hop, begin and end are neighbours', ladderLength('hit', 'hot', ['hot']), 2);
test('single letter words', ladderLength('a', 'c', ['a', 'b', 'c']), 2);
test('isolated island of words', ladderLength('talk', 'tail', ['talk', 'tons', 'fall', 'tail', 'gale', 'hall', 'negs']), 0);
test('beginWord also sitting in the list', ladderLength('hit', 'cog', ['hot', 'cog', 'dot', 'dog', 'hit', 'lot', 'log']), 5);
test('bidirectional agrees on example 1', ladderLengthBidirectional('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']), 5);
test('bidirectional agrees when unreachable', ladderLengthBidirectional('hot', 'dog', ['hot', 'dog']), 0);

summary('Day 129 - Word Ladder');

module.exports = { ladderLength, ladderLengthBidirectional };
