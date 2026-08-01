'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const filter = process.argv[2] || '';

const months = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith('month-'))
  .map((d) => d.name)
  .sort();

let ok = 0;
let bad = 0;
const failures = [];

for (const month of months) {
  const monthDir = path.join(root, month);
  const days = fs
    .readdirSync(monthDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith('day-'))
    .map((d) => d.name)
    .sort();

  let printedHeader = false;

  for (const day of days) {
    const rel = path.join(month, day);
    if (filter && !rel.includes(filter)) continue;

    const file = path.join(monthDir, day, 'solution.js');
    if (!fs.existsSync(file)) {
      bad += 1;
      failures.push(`${rel} (no solution.js)`);
      continue;
    }

    if (!printedHeader) {
      console.log(`\n${month}`);
      printedHeader = true;
    }

    try {
      execFileSync(process.execPath, [file], { stdio: 'pipe', timeout: 20000 });
      ok += 1;
      console.log(`  pass  ${day}`);
    } catch (err) {
      bad += 1;
      failures.push(rel);
      console.log(`  FAIL  ${day}`);
      const out = `${err.stdout || ''}${err.stderr || ''}`.trim();
      if (out) {
        console.log(
          out
            .split('\n')
            .slice(-12)
            .map((l) => `        ${l}`)
            .join('\n')
        );
      }
    }
  }
}

console.log(`\n================================`);
console.log(`passed : ${ok}`);
console.log(`failed : ${bad}`);
if (failures.length) {
  console.log(`\nneeds a look:`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exitCode = 1;
}
