'use strict';

const { test, summary } = require('../../lib/check');
const { buildList, listToArray } = require('../../lib/structures');

function middleNode(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

test('odd length, example 1', listToArray(middleNode(buildList([1, 2, 3, 4, 5]))), [3, 4, 5]);
test('even length, takes the second middle', listToArray(middleNode(buildList([1, 2, 3, 4, 5, 6]))), [4, 5, 6]);
test('single node', listToArray(middleNode(buildList([1]))), [1]);
test('two nodes gives the second', listToArray(middleNode(buildList([1, 2]))), [2]);
test('three nodes gives the middle value', middleNode(buildList([7, 8, 9])).val, 8);
test('four nodes', middleNode(buildList([1, 2, 3, 4])).val, 3);
test('empty list', middleNode(null), null);
test('duplicate values, position still right', middleNode(buildList([5, 5, 5, 5, 5])).val, 5);

summary('Day 014 - Middle of the Linked List');

module.exports = { middleNode };
