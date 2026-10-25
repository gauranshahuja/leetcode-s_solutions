'use strict';

const { test, summary } = require('../../lib/check');
const { PriorityQueue } = require('../../lib/structures');

function reorganizeString(s) {
  const freq = new Map();
  for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);

  const limit = Math.ceil(s.length / 2);
  for (const count of freq.values()) {
    if (count > limit) return '';
  }

  const heap = new PriorityQueue((a, b) => b[1] - a[1]);
  for (const entry of freq) heap.push(entry);

  const out = [];
  while (heap.size >= 2) {
    const first = heap.pop();
    const second = heap.pop();

    out.push(first[0], second[0]);

    if (first[1] - 1 > 0) heap.push([first[0], first[1] - 1]);
    if (second[1] - 1 > 0) heap.push([second[0], second[1] - 1]);
  }

  if (heap.size === 1) {
    out.push(heap.pop()[0]);
  }

  return out.join('');
}

function inspect(input, out) {
  const result = out === undefined ? reorganizeString(input) : out;

  if (result === '' && input !== '') return 'impossible';

  const wanted = input.split('').sort().join('');
  const got = result.split('').sort().join('');
  if (wanted !== got) return `wrong letters: ${got}`;

  for (let i = 1; i < result.length; i += 1) {
    if (result[i] === result[i - 1]) return `adjacent repeat at index ${i}`;
  }
  return 'ok';
}

test('example 1 - aab has exactly one valid answer', reorganizeString('aab'), 'aba');
test('example 2 - aaab cannot be fixed', reorganizeString('aaab'), '');
test('three of one letter in five slots', inspect('vvvlo'), 'ok');
test('count sits exactly on ceil(n / 2)', inspect('aaabbc'), 'ok');
test('longest run needs every even slot', inspect('aaaabbcc'), 'ok');
test('single character', inspect('a'), 'ok');
test('two identical characters', reorganizeString('aa'), '');
test('empty input', inspect(''), 'ok');
test('the checker really does catch a repeat', inspect('aab', 'aab'), 'adjacent repeat at index 1');

summary('Day 116 - Reorganize String');

module.exports = { reorganizeString, inspect };
