'use strict';

const { test, summary } = require('../../lib/check');
const { buildList, buildListWithCycle } = require('../../lib/structures');

function hasCycleSet(head) {
  const seen = new Set();
  let node = head;

  while (node !== null) {
    if (seen.has(node)) return true;
    seen.add(node);
    node = node.next;
  }

  return false;
}

function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true;
  }

  return false;
}

test('example 1, tail joins index 1', hasCycle(buildListWithCycle([3, 2, 0, -4], 1)), true);
test('example 2, two nodes joined in a loop', hasCycle(buildListWithCycle([1, 2], 0)), true);
test('single node pointing at itself', hasCycle(buildListWithCycle([1], 0)), true);
test('single node, no cycle', hasCycle(buildList([1])), false);
test('empty list', hasCycle(null), false);
test('plain list, no cycle', hasCycle(buildList([1, 2, 3, 4, 5, 6])), false);
test('repeated values but no cycle', hasCycle(buildList([1, 1, 1, 1])), false);
test('cycle back to the head of a longer list', hasCycle(buildListWithCycle([1, 2, 3, 4, 5], 0)), true);
test('set version agrees on the cyclic case', hasCycleSet(buildListWithCycle([3, 2, 0, -4], 1)), true);

summary('Day 015 - Linked List Cycle');

module.exports = { hasCycle, hasCycleSet };
