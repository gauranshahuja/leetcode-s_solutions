'use strict';

const { test, summary } = require('../../lib/check');

class RandomNode {
  constructor(val = 0, next = null, random = null) {
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

function buildRandomList(pairs) {
  const nodes = pairs.map(([val]) => new RandomNode(val));
  for (let i = 0; i < nodes.length; i += 1) {
    nodes[i].next = i + 1 < nodes.length ? nodes[i + 1] : null;
    const r = pairs[i][1];
    nodes[i].random = r === null || r === undefined ? null : nodes[r];
  }
  return nodes.length ? nodes[0] : null;
}

function randomListToArray(head) {
  const indexOf = new Map();
  let i = 0;
  for (let node = head; node; node = node.next) {
    indexOf.set(node, i);
    i += 1;
  }

  const out = [];
  for (let node = head; node; node = node.next) {
    out.push([node.val, node.random ? indexOf.get(node.random) : null]);
  }
  return out;
}

function shareAnyNode(origHead, copyHead) {
  const originals = new Set();
  for (let node = origHead; node; node = node.next) originals.add(node);

  for (let node = copyHead; node; node = node.next) {
    if (originals.has(node)) return true;
    if (node.random && originals.has(node.random)) return true;
  }
  return false;
}

function copyRandomListMap(head) {
  if (!head) return null;

  const clone = new Map();
  for (let node = head; node; node = node.next) {
    clone.set(node, new RandomNode(node.val));
  }

  for (let node = head; node; node = node.next) {
    const copy = clone.get(node);
    copy.next = node.next ? clone.get(node.next) : null;
    copy.random = node.random ? clone.get(node.random) : null;
  }

  return clone.get(head);
}

function copyRandomList(head) {
  if (!head) return null;

  for (let node = head; node; node = node.next.next) {
    node.next = new RandomNode(node.val, node.next);
  }

  for (let node = head; node; node = node.next.next) {
    node.next.random = node.random ? node.random.next : null;
  }

  const copyHead = head.next;
  for (let node = head; node; ) {
    const copy = node.next;
    node.next = copy.next;
    copy.next = node.next ? node.next.next : null;
    node = node.next;
  }

  return copyHead;
}

const EX1 = [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]];

test('example 1 - mixed forward and backward randoms', randomListToArray(copyRandomList(buildRandomList(EX1))), EX1);
test('example 2 - both nodes point at index 1', randomListToArray(copyRandomList(buildRandomList([[1, 1], [2, 1]]))), [
  [1, 1],
  [2, 1],
]);
test('example 3 - equal values, different randoms', randomListToArray(copyRandomList(buildRandomList([[3, null], [3, 0], [3, null]]))), [
  [3, null],
  [3, 0],
  [3, null],
]);
test('empty list', copyRandomList(null), null);
test('single node whose random points at itself', randomListToArray(copyRandomList(buildRandomList([[1, 0]]))), [[1, 0]]);

test('copy shares no node with the original', (() => {
  const original = buildRandomList(EX1);
  const copy = copyRandomList(original);
  return shareAnyNode(original, copy);
})(), false);

test('weaving leaves the original exactly as it was', (() => {
  const original = buildRandomList(EX1);
  const before = randomListToArray(original);
  copyRandomList(original);
  return [before, randomListToArray(original)];
})(), [EX1, EX1]);

test('map version gives the same wiring', randomListToArray(copyRandomListMap(buildRandomList(EX1))), EX1);
test('map version is also a real deep copy', (() => {
  const original = buildRandomList([[1, 2], [2, 0], [3, 1]]);
  const copy = copyRandomListMap(original);
  return shareAnyNode(original, copy);
})(), false);

summary('Day 075 - Copy List with Random Pointer');

module.exports = {
  RandomNode,
  buildRandomList,
  randomListToArray,
  copyRandomList,
  copyRandomListMap,
  shareAnyNode,
};
