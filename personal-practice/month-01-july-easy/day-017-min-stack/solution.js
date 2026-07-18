'use strict';

const { test, summary } = require('../../lib/check');

class MinStack {
  constructor() {
    this.entries = [];
  }

  get size() {
    return this.entries.length;
  }

  push(val) {
    const prevMin = this.entries.length === 0
      ? val
      : this.entries[this.entries.length - 1][1];

    this.entries.push([val, Math.min(val, prevMin)]);
    return this;
  }

  pop() {
    const entry = this.entries.pop();
    return entry === undefined ? undefined : entry[0];
  }

  top() {
    if (this.entries.length === 0) return undefined;
    return this.entries[this.entries.length - 1][0];
  }

  getMin() {
    if (this.entries.length === 0) return undefined;
    return this.entries[this.entries.length - 1][1];
  }
}

const st = new MinStack();
st.push(-2);
st.push(0);
st.push(-3);

test('getMin picks up the newest minimum', st.getMin(), -3);
test('pop hands back the top', st.pop(), -3);
test('top after that pop', st.top(), 0);
test('getMin rolls back to the previous minimum', st.getMin(), -2);

const dup = new MinStack();
dup.push(2);
dup.push(1);
dup.push(1);
dup.pop();
test('duplicate minimum still there after one pop', dup.getMin(), 1);
dup.pop();
test('minimum returns to 2 once both 1s are gone', dup.getMin(), 2);

const rising = new MinStack();
[3, 5, 9, 12].forEach((v) => rising.push(v));
rising.pop();
test('increasing pushes leave the minimum at the bottom', [rising.top(), rising.getMin()], [9, 3]);

const fresh = new MinStack();
test('empty stack reports nothing rather than crashing', [fresh.top(), fresh.getMin(), fresh.pop()], [undefined, undefined, undefined]);

const mixed = new MinStack();
const shadow = [];
let agrees = true;
for (const v of [5, 1, 1, -4, 7, -4, 0, 9, -1]) {
  mixed.push(v);
  shadow.push(v);
  if (mixed.getMin() !== Math.min(...shadow)) agrees = false;
}
while (shadow.length) {
  if (mixed.getMin() !== Math.min(...shadow)) agrees = false;
  mixed.pop();
  shadow.pop();
}
test('cached minimum matches a brute recompute at every step', agrees, true);

summary('Day 017 - Min Stack');

module.exports = { MinStack };
