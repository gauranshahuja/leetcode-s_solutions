'use strict';

const { test, summary } = require('../../lib/check');

class LFUCacheNaive {
  constructor(capacity) {
    this.capacity = capacity;
    this.entries = new Map();
    this.clock = 0;
  }

  get(key) {
    const entry = this.entries.get(key);
    if (!entry) return -1;
    entry.count += 1;
    entry.stamp = this.clock;
    this.clock += 1;
    return entry.value;
  }

  put(key, value) {
    if (this.capacity <= 0) return;

    const entry = this.entries.get(key);
    if (entry) {
      entry.value = value;
      entry.count += 1;
      entry.stamp = this.clock;
      this.clock += 1;
      return;
    }

    if (this.entries.size >= this.capacity) {
      let victim = null;
      let worst = null;
      for (const [k, e] of this.entries) {
        if (
          worst === null ||
          e.count < worst.count ||
          (e.count === worst.count && e.stamp < worst.stamp)
        ) {
          worst = e;
          victim = k;
        }
      }
      this.entries.delete(victim);
    }

    this.entries.set(key, { value, count: 1, stamp: this.clock });
    this.clock += 1;
  }
}

class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.values = new Map();
    this.useCount = new Map();
    this.buckets = new Map();
    this.minCount = 0;
  }

  get size() {
    return this.values.size;
  }

  get(key) {
    if (!this.values.has(key)) return -1;
    this.#recordUse(key);
    return this.values.get(key);
  }

  put(key, value) {
    if (this.capacity <= 0) return;

    if (this.values.has(key)) {
      this.values.set(key, value);
      this.#recordUse(key);
      return;
    }

    if (this.values.size >= this.capacity) this.#evict();

    this.values.set(key, value);
    this.useCount.set(key, 1);
    this.#bucketFor(1).add(key);
    this.minCount = 1;
  }

  #bucketFor(count) {
    let bucket = this.buckets.get(count);
    if (bucket === undefined) {
      bucket = new Set();
      this.buckets.set(count, bucket);
    }
    return bucket;
  }

  #recordUse(key) {
    const count = this.useCount.get(key);
    const bucket = this.buckets.get(count);

    bucket.delete(key);
    if (bucket.size === 0) {
      this.buckets.delete(count);
      if (this.minCount === count) this.minCount = count + 1;
    }

    this.useCount.set(key, count + 1);
    this.#bucketFor(count + 1).add(key);
  }

  #evict() {
    const bucket = this.buckets.get(this.minCount);
    const victim = bucket.values().next().value;

    bucket.delete(victim);
    if (bucket.size === 0) this.buckets.delete(this.minCount);

    this.values.delete(victim);
    this.useCount.delete(victim);
  }
}

function runOps(Cache, capacity, ops) {
  const cache = new Cache(capacity);
  const out = [];
  for (const [op, a, b] of ops) {
    if (op === 'put') cache.put(a, b);
    else out.push(cache.get(a));
  }
  return out;
}

function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };
}

const example = [
  ['put', 1, 1],
  ['put', 2, 2],
  ['get', 1],
  ['put', 3, 3],
  ['get', 2],
  ['get', 3],
  ['put', 4, 4],
  ['get', 1],
  ['get', 3],
  ['get', 4],
];
test('LeetCode example', runOps(LFUCache, 2, example), [1, -1, 3, -1, 3, 4]);

const longRun = [
  ['put', 1, 10],
  ['put', 2, 20],
  ['put', 3, 30],
  ['get', 1],
  ['get', 1],
  ['get', 2],
  ['put', 4, 40],
  ['get', 3],
  ['get', 4],
  ['put', 5, 50],
  ['get', 2],
  ['get', 5],
  ['get', 5],
  ['put', 1, 11],
  ['get', 1],
  ['put', 6, 60],
  ['get', 4],
  ['get', 6],
];
test('eighteen-call run with both kinds of eviction', runOps(LFUCache, 3, longRun), [
  10, 10, 20, -1, 40, -1, 50, 50, 11, -1, 60,
]);
test('the naive oracle agrees on that run', runOps(LFUCacheNaive, 3, longRun), [
  10, 10, 20, -1, 40, -1, 50, 50, 11, -1, 60,
]);

test(
  'tie at the same count is broken by least recently used',
  runOps(LFUCache, 2, [
    ['put', 1, 1],
    ['put', 2, 2],
    ['get', 1],
    ['get', 2],
    ['put', 3, 3],
    ['get', 1],
    ['get', 2],
    ['get', 3],
  ]),
  [1, 2, -1, 2, 3]
);

test(
  'capacity 0 accepts puts and stores nothing',
  runOps(LFUCache, 0, [
    ['put', 0, 0],
    ['get', 0],
  ]),
  [-1]
);

test(
  'capacity 1 evicts on every new key regardless of count',
  runOps(LFUCache, 1, [
    ['put', 1, 1],
    ['get', 1],
    ['get', 1],
    ['put', 2, 2],
    ['get', 1],
    ['get', 2],
  ]),
  [1, 1, -1, 2]
);

test(
  're-putting a key does not grow the cache',
  (() => {
    const cache = new LFUCache(2);
    cache.put(1, 1);
    cache.put(1, 2);
    cache.put(1, 3);
    return [cache.size, cache.get(1)];
  })(),
  [1, 3]
);

test('missing key does not disturb the counts', runOps(LFUCache, 2, [
  ['put', 1, 1],
  ['put', 2, 2],
  ['get', 9],
  ['get', 2],
  ['put', 3, 3],
  ['get', 1],
  ['get', 2],
  ['get', 3],
]), [-1, 2, -1, 2, 3]);

const rand = seeded(20261112);
const randomOps = [];
for (let i = 0; i < 3000; i += 1) {
  const key = Math.floor(rand() * 10);
  if (rand() < 0.45) randomOps.push(['put', key, key * 100 + i]);
  else randomOps.push(['get', key]);
}
test(
  '3000 random ops match the O(n) oracle exactly',
  runOps(LFUCache, 4, randomOps),
  runOps(LFUCacheNaive, 4, randomOps)
);

summary('Day 134 - LFU Cache');

module.exports = { LFUCache, LFUCacheNaive, runOps };
