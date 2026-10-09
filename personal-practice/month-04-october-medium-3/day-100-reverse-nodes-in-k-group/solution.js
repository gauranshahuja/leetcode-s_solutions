'use strict';

const { test, summary } = require('../../lib/check');
const { ListNode, buildList, listToArray } = require('../../lib/structures');

function reverseKGroup(head, k) {
  if (!head || k <= 1) return head;

  const dummy = new ListNode(0, head);
  let groupPrev = dummy;

  for (;;) {
    let kth = groupPrev;
    for (let i = 0; i < k && kth; i += 1) kth = kth.next;
    if (!kth) break;

    const groupNext = kth.next;

    let prev = groupNext;
    let node = groupPrev.next;
    while (node !== groupNext) {
      const after = node.next;
      node.next = prev;
      prev = node;
      node = after;
    }

    const newGroupPrev = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = newGroupPrev;
  }

  return dummy.next;
}

test('example 1 - k = 2', listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 2)), [2, 1, 4, 3, 5]);
test('example 2 - k = 3, tail of 2 untouched', listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 3)), [3, 2, 1, 4, 5]);
test('k = 1 is a no-op', listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 1)), [1, 2, 3, 4, 5]);
test('k equals the length - full reverse', listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 5)), [5, 4, 3, 2, 1]);
test('k larger than the length - nothing moves', listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 6)), [1, 2, 3, 4, 5]);
test('empty list', listToArray(reverseKGroup(buildList([]), 3)), []);
test('single node', listToArray(reverseKGroup(buildList([1]), 1)), [1]);
test('length divides evenly, no leftover', listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5, 6]), 3)), [3, 2, 1, 6, 5, 4]);
test('two full groups of two', listToArray(reverseKGroup(buildList([1, 2, 3, 4]), 2)), [2, 1, 4, 3]);

summary('Day 100 - Reverse Nodes in k-Group');

module.exports = { reverseKGroup };
