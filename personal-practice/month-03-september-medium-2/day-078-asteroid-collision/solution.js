'use strict';

const { test, summary } = require('../../lib/check');

function asteroidCollisionWrong(asteroids) {
  const stack = [];

  for (const a of asteroids) {
    if (a > 0) {
      stack.push(a);
      continue;
    }

    while (stack.length && stack[stack.length - 1] > 0 && stack[stack.length - 1] <= -a) {
      stack.pop();
    }

    if (!stack.length || stack[stack.length - 1] < 0) stack.push(a);
  }

  return stack;
}

function asteroidCollision(asteroids) {
  const stack = [];

  outer: for (const a of asteroids) {
    if (a > 0) {
      stack.push(a);
      continue;
    }

    const size = -a;
    while (stack.length && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];

      if (top > size) continue outer;
      stack.pop();
      if (top === size) continue outer;
    }

    stack.push(a);
  }

  return stack;
}

test('example 1 - small left-mover is destroyed', asteroidCollision([5, 10, -5]), [5, 10]);
test('example 2 - equal sizes, both explode', asteroidCollision([8, -8]), []);
test('example 3 - chain of one pop', asteroidCollision([10, 2, -5]), [10]);
test('moving apart, nothing collides', asteroidCollision([-2, -1, 1, 2]), [-2, -1, 1, 2]);
test('one big left-mover clears the row', asteroidCollision([5, 10, -5, -20]), [-20]);
test('left-mover survives behind another left-mover', asteroidCollision([1, -2, -2, -2]), [-2, -2, -2]);
test('tie after a win: -2 kills 1, then ties with 2', asteroidCollision([-2, 2, 1, -2]), [-2]);
test('empty row', asteroidCollision([]), []);
test('first version gets the tie wrong - kept as a reminder', asteroidCollisionWrong([8, -8]), [-8]);

summary('Day 078 - Asteroid Collision');

module.exports = { asteroidCollision, asteroidCollisionWrong };
