'use strict';

const { test, summary } = require('../../lib/check');
const { ListNode, buildList, listToArray } = require('../../lib/structures');

function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;

  let a = l1;
  let b = l2;

  while (a || b || carry) {
    const sum = (a ? a.val : 0) + (b ? b.val : 0) + carry;

    carry = Math.floor(sum / 10);
    tail.next = new ListNode(sum % 10);
    tail = tail.next;

    if (a) a = a.next;
    if (b) b = b.next;
  }

  return dummy.next;
}

function add(xs, ys) {
  return listToArray(addTwoNumbers(buildList(xs), buildList(ys)));
}

test('example 1 - 342 + 465 = 807', add([2, 4, 3], [5, 6, 4]), [7, 0, 8]);
test('example 2 - 0 + 0', add([0], [0]), [0]);
test('example 3 - 9999999 + 9999', add([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]), [8, 9, 9, 9, 0, 0, 0, 1]);

test('no carry anywhere - 21 + 43', add([1, 2], [3, 4]), [4, 6]);
test('carry falls off the end - 5 + 5', add([5], [5]), [0, 1]);
test('shorter list runs out first - 99 + 1', add([9, 9], [1]), [0, 0, 1]);
test('longer list runs out first - 1 + 99', add([1], [9, 9]), [0, 0, 1]);

const nineteenNines = new Array(19).fill(9);
const tenToThe19 = new Array(19).fill(0).concat([1]);
test('past MAX_SAFE_INTEGER - 19 nines + 1', add(nineteenNines, [1]), tenToThe19);

test('one empty list behaves like zero', add([], [7]), [7]);

summary('Day 044 - Add Two Numbers');

module.exports = { addTwoNumbers };
