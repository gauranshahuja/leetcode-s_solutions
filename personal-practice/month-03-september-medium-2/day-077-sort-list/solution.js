'use strict';

const { test, summary } = require('../../lib/check');
const { ListNode, buildList, listToArray } = require('../../lib/structures');

function splitInHalf(head) {
  let prev = null;
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    prev = slow;
    slow = slow.next;
    fast = fast.next.next;
  }

  prev.next = null;
  return slow;
}

function mergeTwo(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;

  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }

  tail.next = a || b;
  return dummy.next;
}

function sortList(head) {
  if (!head || !head.next) return head;

  const second = splitInHalf(head);
  return mergeTwo(sortList(head), sortList(second));
}

function pseudoRandom(n, seed = 7) {
  const out = [];
  let x = seed;
  for (let i = 0; i < n; i += 1) {
    x = (x * 48271) % 2147483647;
    out.push((x % 2001) - 1000);
  }
  return out;
}

test('example 1', listToArray(sortList(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
test('example 2 - negatives and a zero', listToArray(sortList(buildList([-1, 5, 3, 4, 0]))), [-1, 0, 3, 4, 5]);
test('empty list', sortList(null), null);
test('single node', listToArray(sortList(buildList([1]))), [1]);
test('two nodes out of order', listToArray(sortList(buildList([2, 1]))), [1, 2]);
test('duplicates', listToArray(sortList(buildList([3, 1, 3, 2, 1]))), [1, 1, 2, 3, 3]);
test('fully reversed', listToArray(sortList(buildList([9, 7, 5, 3, 1]))), [1, 3, 5, 7, 9]);

test('split cuts a 5-node list into 2 + 3', (() => {
  const head = buildList([1, 2, 3, 4, 5]);
  const second = splitInHalf(head);
  return [listToArray(head), listToArray(second)];
})(), [[1, 2], [3, 4, 5]]);

test('200 pseudo-random values match a numeric array sort', (() => {
  const values = pseudoRandom(200);
  const expected = [...values].sort((x, y) => x - y);
  return listToArray(sortList(buildList(values))).join() === expected.join();
})(), true);

summary('Day 077 - Sort List');

module.exports = { sortList, mergeTwo, splitInHalf, pseudoRandom };
