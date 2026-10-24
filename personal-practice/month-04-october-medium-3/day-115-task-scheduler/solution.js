'use strict';

const { test, summary } = require('../../lib/check');

function leastInterval(tasks, n) {
  const counts = new Map();
  for (const t of tasks) counts.set(t, (counts.get(t) || 0) + 1);

  let maxCount = 0;
  for (const c of counts.values()) if (c > maxCount) maxCount = c;

  let countOfMax = 0;
  for (const c of counts.values()) if (c === maxCount) countOfMax += 1;

  const frames = (maxCount - 1) * (n + 1) + countOfMax;

  return Math.max(tasks.length, frames);
}

test('example 1 - idling is forced', leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
test('example 2 - n = 0 means no cooldown at all', leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 0), 6);
test('example 3 - plenty of filler tasks', leastInterval(['A', 'C', 'A', 'B', 'D', 'B'], 1), 6);
test('one dominant task, gaps mostly idle', leastInterval(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2), 16);
test('gaps exactly filled by the ties', leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 1), 6);
test('more work than gaps, so length wins', leastInterval(['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'E'], 2), 12);
test('single task', leastInterval(['A'], 5), 1);
test('empty list', leastInterval([], 2), 0);
test('one gap that cannot be filled', leastInterval(['A', 'B', 'A'], 2), 4);

summary('Day 115 - Task Scheduler');

module.exports = { leastInterval };
