import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8');

test('configured gateway initiates manager connection after its server starts', () => {
  assert.match(source, /const server = Bun\.serve[\s\S]*?connectManagerControl\(\);\s*console\.log\(`\[proxy\] started/);
});

test('authentication rejection schedules a delayed reconnect', () => {
  assert.match(source, /if \(evt\.code === 1008\)\s*\{[\s\S]*?scheduleManagerReconnect\(30000\)/);
});
