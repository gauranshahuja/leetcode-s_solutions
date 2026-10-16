'use strict';

const { test, summary } = require('../../lib/check');

function restoreIpAddresses(s) {
  const out = [];
  const parts = [];

  if (s.length < 4 || s.length > 12) return out;

  function back(start) {
    if (parts.length === 4) {
      if (start === s.length) out.push(parts.join('.'));
      return;
    }

    for (let len = 1; len <= 3 && start + len <= s.length; len += 1) {
      const seg = s.slice(start, start + len);

      if (seg.length > 1 && seg[0] === '0') break;
      if (Number(seg) > 255) break;

      parts.push(seg);
      back(start + len);
      parts.pop();
    }
  }

  back(0);
  return out;
}

test(
  'example 1',
  restoreIpAddresses('25525511135'),
  ['255.255.11.135', '255.255.111.35'],
  { unordered: true }
);
test('example 2 - all zeros', restoreIpAddresses('0000'), ['0.0.0.0'], { unordered: true });
test(
  'example 3',
  restoreIpAddresses('101023'),
  ['1.0.10.23', '1.0.102.3', '10.1.0.23', '10.10.2.3', '101.0.2.3'],
  { unordered: true }
);
test('exactly four digits, one way', restoreIpAddresses('1111'), ['1.1.1.1'], { unordered: true });
test(
  'leading zeros kill most of the branches',
  restoreIpAddresses('010010'),
  ['0.10.0.10', '0.100.1.0'],
  { unordered: true }
);
test('too short to split', restoreIpAddresses('1'), [], { unordered: true });
test('13 digits is too long', restoreIpAddresses('1111111111111'), [], { unordered: true });
test('the maximum address', restoreIpAddresses('255255255255'), ['255.255.255.255'], {
  unordered: true,
});
test('every segment would be 256', restoreIpAddresses('256256256256'), [], { unordered: true });

summary('Day 107 - Restore IP Addresses');

module.exports = { restoreIpAddresses };
