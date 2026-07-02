'use strict';

let passed = 0;
let failed = 0;

function canon(value, deep) {
  if (Array.isArray(value)) {
    const mapped = value.map((v) => canon(v, deep));
    if (deep) {
      mapped.sort((a, b) => {
        const x = JSON.stringify(a);
        const y = JSON.stringify(b);
        return x < y ? -1 : x > y ? 1 : 0;
      });
    }
    return mapped;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = canon(value[key], deep);
    return out;
  }
  if (value === 0) return 0;
  return value;
}

function same(a, b, unordered) {
  return JSON.stringify(canon(a, unordered)) === JSON.stringify(canon(b, unordered));
}

function test(label, actual, expected, opts) {
  const unordered = !!(opts && opts.unordered);
  const ok = same(actual, expected, unordered);
  if (ok) {
    passed += 1;
    console.log(`  ok    ${label}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${label}`);
    console.log(`        expected : ${JSON.stringify(canon(expected, unordered))}`);
    console.log(`        received : ${JSON.stringify(canon(actual, unordered))}`);
  }
  return ok;
}

function assert(label, condition) {
  return test(label, !!condition, true);
}

function summary(title) {
  const total = passed + failed;
  const head = title ? `${title} -> ` : '';
  if (failed === 0) {
    console.log(`\n${head}${passed}/${total} passed\n`);
  } else {
    console.log(`\n${head}${passed}/${total} passed, ${failed} FAILED\n`);
    process.exitCode = 1;
  }
  const result = { passed, failed, total };
  passed = 0;
  failed = 0;
  return result;
}

module.exports = { test, assert, summary, same, canon };
