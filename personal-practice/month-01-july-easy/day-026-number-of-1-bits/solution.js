'use strict';

const { test, summary } = require('../../lib/check');

function hammingWeightShift(n) {
  let bits = n >>> 0;
  let count = 0;

  for (let i = 0; i < 32; i += 1) {
    count += bits & 1;
    bits >>>= 1;
  }

  return count;
}

function hammingWeight(n) {
  let bits = n >>> 0;
  let count = 0;

  while (bits !== 0) {
    bits = (bits & (bits - 1)) >>> 0;
    count += 1;
  }

  return count;
}

test('example 1 - 11 is 1011', hammingWeight(11), 3);
test('example 2 - 128 is a single bit', hammingWeight(128), 1);
test('example 3 - 2147483645', hammingWeight(2147483645), 30);
test('zero has no set bits', hammingWeight(0), 0);
test('one has exactly one', hammingWeight(1), 1);
test('all 32 bits set', hammingWeight(4294967295), 32);
test('top bit only (2^31)', hammingWeight(2147483648), 1);
test('negative input read as unsigned, -3 is 0xFFFFFFFD', hammingWeight(-3), 31);
test('shift version agrees on all bits set', hammingWeightShift(4294967295), 32);

summary('Day 026 - Number of 1 Bits');

module.exports = { hammingWeight, hammingWeightShift };
