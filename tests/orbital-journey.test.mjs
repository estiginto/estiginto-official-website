import assert from 'node:assert/strict';
import test from 'node:test';
import { orbitPoint, orbitStage } from '../src/orbitalJourney.js';

test('the spacecraft reaches each station on the same fixed ellipse', () => {
  for (let i = 0; i < 5; i++) {
    const point = orbitPoint((-150 + i * 72) * Math.PI / 180);
    assert.ok(Math.abs(((point.x-50)/40)**2 + ((point.y-50)/38)**2 - 1) < 1e-10);
    assert.equal(orbitStage(i / 5), i);
    assert.equal(orbitStage(i / 5 + .04), i);
    assert.equal(orbitStage(i / 5 + .1), -1);
  }
});
test('station highlights and spacecraft positions wrap continuously', () => {
  assert.equal(orbitStage(.99), 0);
  assert.equal(orbitStage(1), 0);
  assert.equal(orbitStage(-.01), 0);
  const start = orbitPoint(0), end = orbitPoint(Math.PI * 2);
  for (const key of ['x', 'y', 'depth']) assert.ok(Math.abs(start[key]-end[key]) < 1e-10);
});
