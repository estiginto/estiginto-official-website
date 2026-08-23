import assert from "node:assert/strict";
import test from "node:test";

import { createDesktopMenuDataStreams } from "../src/desktopMenuParticles.js";

test("desktop menu data streams form a varied, deterministic information tunnel", () => {
  const streams = createDesktopMenuDataStreams();
  const typeCounts = streams.reduce((counts, stream) => ({
    ...counts,
    [stream.type]: (counts[stream.type] || 0) + 1,
  }), {});

  assert.equal(streams.length, 48);
  assert.deepEqual(typeCounts, { glyph: 12, streak: 24, node: 12 });
  assert.deepEqual(createDesktopMenuDataStreams(), streams);
});

test("data streams are already distributed through time when the menu opens", () => {
  const streams = createDesktopMenuDataStreams();

  assert.ok(streams.every(({ duration }) => duration >= 1800 && duration < 3200));
  assert.ok(streams.every(({ delay }) => delay <= 0));
  assert.ok(streams.every(({ delay, duration }) => delay > -duration));
  assert.ok(new Set(streams.map(({ delay }) => delay)).size > 40);
});

test("data stream lanes preserve a readable central corridor", () => {
  const streams = createDesktopMenuDataStreams();

  assert.ok(streams.every(({ laneX, laneY }) => (
    Math.abs(laneX) >= 0.25 || Math.abs(laneY) >= 0.18
  )));
  assert.ok(streams.some(({ laneX }) => laneX < 0));
  assert.ok(streams.some(({ laneX }) => laneX > 0));
  assert.ok(streams.some(({ laneY }) => laneY < 0));
  assert.ok(streams.some(({ laneY }) => laneY > 0));
});
