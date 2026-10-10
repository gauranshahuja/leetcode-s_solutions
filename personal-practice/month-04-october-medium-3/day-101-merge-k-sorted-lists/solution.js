'use strict';

const { test, summary } = require('../../lib/check');
const { ListNode, buildList, listToArray, PriorityQueue } = require('../../lib/structures');

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

function mergeKLists(lists) {
  const pq = new PriorityQueue((x, y) => x.val - y.val);
  for (const head of lists) if (head) pq.push(head);

  const dummy = new ListNode(0);
  let tail = dummy;

  while (!pq.isEmpty()) {
    const node = pq.pop();
    tail.next = node;
    tail = node;
    if (node.next) pq.push(node.next);
  }

  tail.next = null;
  return dummy.next;
}

function mergeKListsPairwise(lists) {
  let round = lists.filter((head) => head !== null && head !== undefined);
  if (round.length === 0) return null;

  while (round.length > 1) {
    const next = [];
    for (let i = 0; i < round.length; i += 2) {
      next.push(i + 1 < round.length ? mergeTwo(round[i], round[i + 1]) : round[i]);
    }
    round = next;
  }

  return round[0];
}

const build = (arrays) => arrays.map(buildList);

test('example 1 - heap', listToArray(mergeKLists(build([[1, 4, 5], [1, 3, 4], [2, 6]]))), [1, 1, 2, 3, 4, 4, 5, 6]);
test('example 1 - pairwise agrees', listToArray(mergeKListsPairwise(build([[1, 4, 5], [1, 3, 4], [2, 6]]))), [1, 1, 2, 3, 4, 4, 5, 6]);
test('no lists at all', listToArray(mergeKLists([])), []);
test('every list empty', listToArray(mergeKListsPairwise(build([[], [], []]))), []);
test('empty list in the middle', listToArray(mergeKLists(build([[1, 3], [], [2]]))), [1, 2, 3]);
test('odd count forces a carry-over round', listToArray(mergeKListsPairwise(build([[5], [1], [3], [2], [4]]))), [1, 2, 3, 4, 5]);
test('negatives and duplicates', listToArray(mergeKLists(build([[-10, -1, -1], [-5, 0], [-10]]))), [-10, -10, -5, -1, -1, 0]);
test('one long list, rest empty', listToArray(mergeKListsPairwise(build([[], [1, 2, 3, 4, 5], []]))), [1, 2, 3, 4, 5]);
test('disjoint ranges, no interleaving', listToArray(mergeKLists(build([[7, 8, 9], [1, 2, 3], [4, 5, 6]]))), [1, 2, 3, 4, 5, 6, 7, 8, 9]);

summary('Day 101 - Merge k Sorted Lists');

module.exports = { mergeKLists, mergeKListsPairwise, mergeTwo };
