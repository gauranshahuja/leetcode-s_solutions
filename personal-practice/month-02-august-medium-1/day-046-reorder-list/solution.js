'use strict';

const { test, summary } = require('../../lib/check');
const { buildList, listToArray } = require('../../lib/structures');

function reorderList(head) {
  if (!head || !head.next) return head;

  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  let second = slow.next;
  slow.next = null;

  let prev = null;
  while (second) {
    const next = second.next;
    second.next = prev;
    prev = second;
    second = next;
  }

  let front = head;
  let back = prev;
  while (back) {
    const frontNext = front.next;
    const backNext = back.next;

    front.next = back;
    back.next = frontNext;

    front = frontNext;
    back = backNext;
  }

  return head;
}

const reorder = (values) => listToArray(reorderList(buildList(values)));

test('example 1 - even length', reorder([1, 2, 3, 4]), [1, 4, 2, 3]);
test('example 2 - odd length', reorder([1, 2, 3, 4, 5]), [1, 5, 2, 4, 3]);

test('single node', reorder([1]), [1]);
test('two nodes, already in order', reorder([1, 2]), [1, 2]);
test('three nodes', reorder([1, 2, 3]), [1, 3, 2]);
test('six nodes', reorder([1, 2, 3, 4, 5, 6]), [1, 6, 2, 5, 3, 4]);
test('seven nodes - middle element stays last', reorder([1, 2, 3, 4, 5, 6, 7]), [1, 7, 2, 6, 3, 5, 4]);
test('duplicate values', reorder([1, 1, 2, 2]), [1, 2, 1, 2]);
test('empty list', reorder([]), []);

summary('Day 046 - Reorder List');

module.exports = { reorderList };
