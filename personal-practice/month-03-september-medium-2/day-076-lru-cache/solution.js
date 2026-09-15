'use strict';

const { test, summary } = require('../../lib/check');

class CacheNode {
  constructor(key = null, value = null) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();

    this.head = new CacheNode();
    this.tail = new CacheNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get size() {
    return this.map.size;
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;

    this.#unlink(node);
    this.#pushFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.capacity <= 0) return;

    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.#unlink(existing);
      this.#pushFront(existing);
      return;
    }

    if (this.map.size === this.capacity) {
      const lru = this.tail.prev;
      this.#unlink(lru);
      this.map.delete(lru.key);
    }

    const node = new CacheNode(key, value);
    this.map.set(key, node);
    this.#pushFront(node);
  }

  keysMostRecentFirst() {
    const out = [];
    for (let node = this.head.next; node !== this.tail; node = node.next) out.push(node.key);
    return out;
  }

  keysLeastRecentFirst() {
    const out = [];
    for (let node = this.tail.prev; node !== this.head; node = node.prev) out.push(node.key);
    return out;
  }

  #pushFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  #unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}

class LRUCacheMapOnly {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get size() {
    return this.map.size;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.capacity <= 0) return;

    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size === this.capacity) {
      this.map.delete(this.map.keys().next().value);
    }
    this.map.set(key, value);
  }
}

function runOps(CacheClass, capacity, ops) {
  const cache = new CacheClass(capacity);
  const returned = [];
  for (const [kind, key, value] of ops) {
    if (kind === 'put') cache.put(key, value);
    else returned.push(cache.get(key));
  }
  return returned;
}

const SEQUENCE = [
  ['put', 1, 1],
  ['put', 2, 2],
  ['put', 3, 3],
  ['get', 1],
  ['put', 4, 4],
  ['get', 2],
  ['get', 3],
  ['put', 1, 99],
  ['get', 1],
  ['put', 5, 5],
  ['get', 4],
  ['get', 5],
  ['get', 3],
  ['put', 6, 6],
  ['get', 1],
];

test('15-call sequence returns the right values', runOps(LRUCache, 3, SEQUENCE), [1, -1, 3, 99, -1, 5, 3, -1]);

test('recency order after the sequence', (() => {
  const cache = new LRUCache(3);
  for (const [kind, key, value] of SEQUENCE) {
    if (kind === 'put') cache.put(key, value);
    else cache.get(key);
  }
  return cache.keysMostRecentFirst();
})(), [6, 3, 5]);

test('prev chain is the exact reverse of the next chain', (() => {
  const cache = new LRUCache(3);
  for (const [kind, key, value] of SEQUENCE) {
    if (kind === 'put') cache.put(key, value);
    else cache.get(key);
  }
  return [cache.keysLeastRecentFirst(), cache.keysMostRecentFirst().slice().reverse()];
})(), [[5, 3, 6], [5, 3, 6]]);

test('never grows past capacity', (() => {
  const cache = new LRUCache(3);
  const sizes = [];
  for (const [kind, key, value] of SEQUENCE) {
    if (kind === 'put') cache.put(key, value);
    else cache.get(key);
    sizes.push(cache.size);
  }
  return Math.max(...sizes);
})(), 3);

test('LeetCode example, capacity 2', runOps(LRUCache, 2, [
  ['put', 1, 1],
  ['put', 2, 2],
  ['get', 1],
  ['put', 3, 3],
  ['get', 2],
  ['put', 4, 4],
  ['get', 1],
  ['get', 3],
  ['get', 4],
]), [1, -1, -1, 3, 4]);

test('capacity 1 evicts on every new key, capacity 0 stores nothing', [
  runOps(LRUCache, 1, [['put', 1, 1], ['get', 1], ['put', 2, 2], ['get', 1], ['get', 2]]),
  runOps(LRUCache, 0, [['put', 1, 1], ['get', 1]]),
], [[1, -1, 2], [-1]]);

test('overwriting the same key does not grow the cache', (() => {
  const cache = new LRUCache(2);
  for (let i = 0; i < 5; i += 1) cache.put(7, i);
  return [cache.size, cache.get(7)];
})(), [1, 4]);

test('a miss does not reorder anything', (() => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.get(99);
  cache.put(3, 3);
  return cache.keysMostRecentFirst();
})(), [3, 2]);

test('Map-only version returns the same values', runOps(LRUCacheMapOnly, 3, SEQUENCE), [1, -1, 3, 99, -1, 5, 3, -1]);

summary('Day 076 - LRU Cache');

module.exports = { LRUCache, LRUCacheMapOnly, CacheNode, runOps };
