'use strict';

const { test, summary } = require('../../lib/check');

function decodeString(s) {
  const countStack = [];
  const strStack = [];
  let cur = '';
  let k = 0;

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      k = k * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === '[') {
      countStack.push(k);
      strStack.push(cur);
      k = 0;
      cur = '';
    } else if (ch === ']') {
      const times = countStack.pop();
      cur = strStack.pop() + cur.repeat(times);
    } else {
      cur += ch;
    }
  }

  return cur;
}

function decodeStringRecursive(s) {
  let i = 0;

  function parse() {
    let out = '';

    while (i < s.length && s[i] !== ']') {
      if (s[i] >= '0' && s[i] <= '9') {
        let k = 0;
        while (s[i] >= '0' && s[i] <= '9') {
          k = k * 10 + (s.charCodeAt(i) - 48);
          i += 1;
        }
        i += 1;
        const inner = parse();
        i += 1;
        out += inner.repeat(k);
      } else {
        out += s[i];
        i += 1;
      }
    }

    return out;
  }

  return parse();
}

test('example 1', decodeString('3[a]2[bc]'), 'aaabcbc');
test('example 2 - nested', decodeString('3[a2[c]]'), 'accaccacc');
test('example 3 - literals around groups', decodeString('2[abc]3[cd]ef'), 'abcabccdcdcdef');
test('no brackets at all', decodeString('abcd'), 'abcd');
test('multi-digit count', decodeString('10[a]'), 'aaaaaaaaaa');
test('count of 1 still expands', decodeString('1[x]'), 'x');
test('three levels deep', decodeString('2[b2[c2[d]]]'), 'bcddcddbcddcdd');
test('letters before and inside a nested group', decodeString('a2[b3[c]d]e'), 'abcccdbcccde');
test('recursive version agrees on the nested one', decodeStringRecursive('3[a2[c]]'), 'accaccacc');
test('recursive version agrees on three levels', decodeStringRecursive('2[b2[c2[d]]]'), 'bcddcddbcddcdd');

summary('Day 104 - Decode String');

module.exports = { decodeString, decodeStringRecursive };
