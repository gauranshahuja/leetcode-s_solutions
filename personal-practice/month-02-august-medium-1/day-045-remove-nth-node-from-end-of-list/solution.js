'use strict';

const { test, summary } = require('../../lib/check');
const { ListNode, buildList, listToArray } = require('../../lib/structures');

function removeNthFromEndTwoPass(head, n) {
  let length = 0;
  for (let node = head; node; node = node.next) length += 1;

  const dummy = new ListNode(0, head);
  let before = dummy;
  for (let i = 0; i < length - n; i += 1) before = before.next;

  before.next = before.next.next;
  return dummy.next;
}

function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;

  for (let i = 0; i < n; i += 1) fast = fast.next;

  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }

  slow.next = slow.next.next;
  return dummy.next;
}

const drop = (values, n) => listToArray(removeNthFromEnd(buildList(values), n));
const dropTwoPass = (values, n) => listToArray(removeNthFromEndTwoPass(buildList(values), n));

test('example 1 - remove 2nd from end of 5', drop([1, 2, 3, 4, 5], 2), [1, 2, 3, 5]);
test('example 2 - single node, n = 1', drop([1], 1), []);
test('example 3 - remove the tail of a pair', drop([1, 2], 1), [1]);

test('remove the head (n equals length)', drop([1, 2], 2), [2]);
test('remove the head of a longer list', drop([1, 2, 3], 3), [2, 3]);
test('remove the tail of a longer list', drop([1, 2, 3, 4, 5, 6, 7], 1), [1, 2, 3, 4, 5, 6]);
test('remove from the middle', drop([1, 2, 3, 4, 5, 6, 7], 4), [1, 2, 3, 5, 6, 7]);
test('duplicate values, only one copy goes', drop([1, 2, 2, 2, 3], 3), [1, 2, 2, 3]);

test('two-pass version agrees on head removal', dropTwoPass([1, 2], 2), [2]);

summary('Day 045 - Remove Nth Node From End of List');

module.exports = { removeNthFromEnd, removeNthFromEndTwoPass };
