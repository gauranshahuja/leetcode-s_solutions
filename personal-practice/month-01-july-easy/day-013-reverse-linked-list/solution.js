'use strict';

const { test, summary } = require('../../lib/check');
const { buildList, listToArray } = require('../../lib/structures');

function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}

test('example from the problem', listToArray(reverseList(buildList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);
test('two nodes', listToArray(reverseList(buildList([1, 2]))), [2, 1]);
test('single node', listToArray(reverseList(buildList([7]))), [7]);
test('empty list stays empty', reverseList(null), null);
test('duplicate values', listToArray(reverseList(buildList([2, 2, 9, 2]))), [2, 9, 2, 2]);
test('negatives', listToArray(reverseList(buildList([-1, 0, 5]))), [5, 0, -1]);
test('reversing twice gives the original back', listToArray(reverseList(reverseList(buildList([1, 2, 3])))), [1, 2, 3]);

const reversed = reverseList(buildList([1, 2, 3]));
let tail = reversed;
while (tail.next) tail = tail.next;
test('old head became a real tail', [tail.val, tail.next], [1, null]);

summary('Day 013 - Reverse Linked List');

module.exports = { reverseList };
