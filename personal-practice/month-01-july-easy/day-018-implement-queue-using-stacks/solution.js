'use strict';

const { test, summary } = require('../../lib/check');

class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
    this.moves = 0;
  }

  push(x) {
    this.inStack.push(x);
    return this;
  }

  pop() {
    this.#refill();
    return this.outStack.pop();
  }

  peek() {
    this.#refill();
    return this.outStack[this.outStack.length - 1];
  }

  empty() {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }

  #refill() {
    if (this.outStack.length > 0) return;
    while (this.inStack.length > 0) {
      this.outStack.push(this.inStack.pop());
      this.moves += 1;
    }
  }
}

const q = new MyQueue();
q.push(1);
q.push(2);
test('peek gives the oldest, not the newest', q.peek(), 1);
test('pop gives the oldest', q.pop(), 1);
test('not empty, 2 is still waiting', q.empty(), false);
test('next pop gives 2', q.pop(), 2);
test('empty once both are gone', q.empty(), true);

const mix = new MyQueue();
mix.push(1);
mix.push(2);
mix.push(3);
const order = [mix.pop()];
mix.push(4);
order.push(mix.pop(), mix.pop(), mix.pop());
test('interleaved pushes keep FIFO order', order, [1, 2, 3, 4]);

const blank = new MyQueue();
test('empty queue is quiet about it', [blank.empty(), blank.peek(), blank.pop()], [true, undefined, undefined]);

const mine = new MyQueue();
const shadow = [];
let agrees = true;
let pushed = 0;
for (let i = 1; i <= 50; i += 1) {
  mine.push(i);
  shadow.push(i);
  pushed += 1;
  if (i % 3 === 0) {
    if (mine.pop() !== shadow.shift()) agrees = false;
  }
}
while (!mine.empty()) {
  if (mine.pop() !== shadow.shift()) agrees = false;
}
test('matches a plain array queue over 50 pushes', agrees, true);
test('each element was poured across at most once', mine.moves <= pushed, true);

summary('Day 018 - Implement Queue using Stacks');

module.exports = { MyQueue };
