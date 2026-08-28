'use strict';

const { test, summary } = require('../../lib/check');

function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    indegree[course] += 1;
  }

  const queue = [];
  let head = 0;

  for (let i = 0; i < numCourses; i += 1) {
    if (indegree[i] === 0) queue.push(i);
  }

  let done = 0;

  while (head < queue.length) {
    const course = queue[head];
    head += 1;
    done += 1;

    for (const next of adj[course]) {
      indegree[next] -= 1;
      if (indegree[next] === 0) queue.push(next);
    }
  }

  return done === numCourses;
}

const CHAIN = Array.from({ length: 999 }, (_, i) => [i + 1, i]);

test('example 1 - one prerequisite', canFinish(2, [[1, 0]]), true);
test('example 2 - two courses need each other', canFinish(2, [[1, 0], [0, 1]]), false);
test('no prerequisites at all', canFinish(3, []), true);
test('a course that is its own prerequisite', canFinish(2, [[0, 0]]), false);
test('diamond: 0 unlocks 1 and 2, both needed for 3', canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]), true);
test(
  'cycle hidden behind a reachable part of the graph',
  canFinish(5, [[1, 0], [2, 1], [3, 2], [1, 3], [4, 0]]),
  false
);
test('duplicate edge counts twice in the in-degree and still resolves', canFinish(2, [[1, 0], [1, 0]]), true);
test('unreachable island of courses is still finishable', canFinish(5, [[1, 0], [4, 3]]), true);
test('1000-course chain', canFinish(1000, CHAIN), true);

summary('Day 058 - Course Schedule');

module.exports = { canFinish };
