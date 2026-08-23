import assert from "node:assert/strict";
import test from "node:test";

import { createDesktopMenuFiberTracks } from "../src/desktopMenuParticles.js";

test("fiber tracks travel from one vanishing point toward the panel edges", () => {
  const tracks = createDesktopMenuFiberTracks();

  assert.equal(tracks.length, 12);
  assert.ok(tracks.every(({ path }) => path.startsWith("M 50 47 C ")));
  assert.ok(tracks.every(({ endX, endY }) => (
    endX <= 0 || endX >= 100 || endY <= 0 || endY >= 100
  )));
  assert.deepEqual(createDesktopMenuFiberTracks(), tracks);
});

test("fiber pulses are continuously staggered instead of launching together", () => {
  const tracks = createDesktopMenuFiberTracks();

  assert.ok(tracks.every(({ duration }) => duration >= 2600 && duration <= 4200));
  assert.ok(tracks.every(({ delay }) => delay < 0));
  assert.ok(tracks.every(({ delay, duration }) => delay > -duration));
  assert.equal(new Set(tracks.map(({ delay }) => delay)).size, tracks.length);
});

test("fiber tracks spread symmetrically around the reading area", () => {
  const tracks = createDesktopMenuFiberTracks();

  for (let index = 0; index < tracks.length / 2; index += 1) {
    const left = tracks[index];
    const right = tracks[tracks.length - 1 - index];
    assert.equal(left.endX + right.endX, 100);
    assert.equal(left.endY, right.endY);
  }
});
