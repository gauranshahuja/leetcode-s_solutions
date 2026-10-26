'use strict';

const { test, summary } = require('../../lib/check');

function findOrder(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    indegree[course] += 1;
  }

  const queue = [];
  for (let c = 0; c < numCourses; c += 1) {
    if (indegree[c] === 0) queue.push(c);
  }

  const order = [];
  let head = 0;

  while (head < queue.length) {
    const course = queue[head];
    head += 1;
    order.push(course);

    for (const next of adj[course]) {
      indegree[next] -= 1;
      if (indegree[next] === 0) queue.push(next);
    }
  }

  return order.length === numCourses ? order : [];
}

function validateOrder(numCourses, prerequisites, order) {
  const result = order === undefined ? findOrder(numCourses, prerequisites) : order;

  if (result.length !== numCourses) {
    return `length ${result.length}, expected ${numCourses}`;
  }

  const position = new Array(numCourses).fill(-1);
  for (let i = 0; i < result.length; i += 1) {
    const course = result[i];
    if (!Number.isInteger(course) || course < 0 || course >= numCourses) {
      return `course ${course} out of range`;
    }
    if (position[course] !== -1) return `course ${course} appears twice`;
    position[course] = i;
  }

  for (const [course, pre] of prerequisites) {
    if (position[pre] > position[course]) {
      return `prerequisite ${pre} comes after ${course}`;
    }
  }

  return 'ok';
}

test('example 1 - one prerequisite forces the order', findOrder(2, [[1, 0]]), [0, 1]);
test('example 2 - diamond, several valid orders', validateOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]), 'ok');
test('straight chain has exactly one order', findOrder(4, [[1, 0], [2, 1], [3, 2]]), [0, 1, 2, 3]);
test('no prerequisites at all', validateOrder(5, []), 'ok');
test('an isolated course alongside a dependency', validateOrder(3, [[1, 0]]), 'ok');
test('single course', findOrder(1, []), [0]);
test('two-course cycle', findOrder(2, [[1, 0], [0, 1]]), []);
test('cycle sitting behind a valid first course', findOrder(4, [[1, 0], [2, 1], [3, 2], [1, 3]]), []);
test('the checker rejects a reversed order', validateOrder(2, [[1, 0]], [1, 0]), 'prerequisite 0 comes after 1');

summary('Day 117 - Course Schedule II');

module.exports = { findOrder, validateOrder };
