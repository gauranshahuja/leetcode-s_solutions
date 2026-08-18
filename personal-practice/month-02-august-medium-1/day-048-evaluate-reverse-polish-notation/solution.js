'use strict';

const { test, summary } = require('../../lib/check');

const OPS = new Map([
  ['+', (a, b) => a + b],
  ['-', (a, b) => a - b],
  ['*', (a, b) => a * b],
  ['/', (a, b) => Math.trunc(a / b)],
]);

function evalRPN(tokens) {
  const stack = [];

  for (const token of tokens) {
    const op = OPS.get(token);

    if (op) {
      const right = stack.pop();
      const left = stack.pop();
      stack.push(op(left, right));
    } else {
      stack.push(Number(token));
    }
  }

  return stack.pop();
}

test('example 1 - (2 + 1) * 3', evalRPN(['2', '1', '+', '3', '*']), 9);
test('example 2 - 4 + (13 / 5)', evalRPN(['4', '13', '5', '/', '+']), 6);
test('example 3 - the long one', evalRPN([
  '10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+',
]), 22);

test('a single number is its own answer', evalRPN(['42']), 42);
test('subtraction is not commutative - 2 - 3', evalRPN(['2', '3', '-']), -1);
test('negative operand token', evalRPN(['-4', '2', '*']), -8);

test('negative division truncates toward zero', evalRPN(['-7', '2', '/']), -3);
test('division that rounds to zero', evalRPN(['3', '-4', '/']), 0);

test('result can be zero', evalRPN(['5', '5', '-']), 0);

summary('Day 048 - Evaluate Reverse Polish Notation');

module.exports = { evalRPN };
