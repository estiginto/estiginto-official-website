import assert from "node:assert/strict";
import { test } from "node:test";
import { createHomeParticleCurrent } from "../src/homeParticleCurrent.js";

function setup(width = 1280, height = 800, palette) {
  const frames = new Map();
  let time = 0;
  let id = 0;
  let path;
  let paintCount = 0;
  let particles = [];
  let threads = 0;
  let transform;
  const context = {
    setTransform(...value) { transform = value; },
    clearRect() { paintCount += 1; particles = []; threads = 0; },
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() { threads += 1; },
    arc(x, y, radius) { path = { x, y, radius }; },
    fill() { particles.push({ ...path, color: this.fillStyle, opacity: this.globalAlpha }); },
  };
  const canvas = { getContext: () => context };
  const current = createHomeParticleCurrent({
    canvas,
    requestFrame(callback) { frames.set(id, callback); return id++; },
    cancelFrame(frameId) { frames.delete(frameId); },
    now: () => time,
    palette,
  });
  current.resize(width, height, 1);
  current.setScene({ progress: 0, heroTop: 0, heroHeight: height, textBounds: [] });
  return {
    current,
    canvas,
    get queued() { return frames.size; },
    get paintCount() { return paintCount; },
    get particles() { return particles; },
    get threads() { return threads; },
    get transform() { return transform; },
    advance(ms = 16) {
      time += ms;
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(time);
    },
  };
}

test("the particle current ascends across the hero on desktop and mobile, with fewer dots on mobile", () => {
  const desktop = setup();
  const mobile = setup(390, 780);
  assert.ok(desktop.particles.length > mobile.particles.length * 2);
  assert.ok(desktop.threads > 0);
  for (const [surface, width] of [[desktop, 1280], [mobile, 390]]) {
    const left = surface.particles.filter(({ x }) => x < width * 0.25);
    const right = surface.particles.filter(({ x }) => x > width * 0.75);
    const sparseEntry = surface.particles.filter(({ x }) => x > width * 0.10 && x < width * 0.33);
    const denseExit = surface.particles.filter(({ x }) => x > width * 0.67 && x < width * 0.90);
    const averageHeight = (points) => points.reduce((sum, point) => sum + point.y, 0) / points.length;
    assert.ok(left.length && right.length);
    assert.ok(averageHeight(left) > averageHeight(right) + 240);
    assert.ok(denseExit.length > sparseEntry.length * 2);
  }
});

test("the pointer pushes nearby dots outward, then they return to the moving current", () => {
  const baseline = setup();
  const interactive = setup();
  const origin = baseline.particles.find(({ x, opacity }) => x > 640 && x < 720 && opacity > 0.4);
  assert.ok(origin);
  const point = { x: origin.x, y: origin.y + 18 };
  interactive.current.setPointer(point);
  baseline.current.start();
  interactive.current.start();
  const advance = (stepCount) => {
    for (let step = 0; step < stepCount; step += 1) {
      baseline.advance();
      interactive.advance();
    }
  };
  advance(13);
  const distance = ({ x, y }) => Math.hypot(x - point.x, y - point.y);
  const nearbyIndices = baseline.particles.flatMap((particle, index) => distance(particle) < 75 ? [index] : []);
  assert.ok(nearbyIndices.length > 10);
  const shift = (index) => {
    const a = baseline.particles[index];
    const b = interactive.particles[index];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  assert.ok(nearbyIndices.every((index) => distance(interactive.particles[index]) > distance(baseline.particles[index])));
  assert.ok(nearbyIndices.every((index) => shift(index) > 2 && shift(index) <= 32));
  const displaced = shift(nearbyIndices[0]);
  interactive.current.setPointer(null);
  advance(1);
  assert.ok(shift(nearbyIndices[0]) > 0 && shift(nearbyIndices[0]) < displaced);
  advance(55);
  assert.ok(nearbyIndices.every((index) => shift(index) < 0.1));
});

test("the text box stays clear and nearby dots fade instead of ending at a hard edge", () => {
  const surface = setup();
  const point = surface.particles.find(({ x }) => x > 580);
  const bounds = { left: point.x - 1, top: point.y - 1, right: point.x + 1, bottom: point.y + 1 };
  const initial = surface.particles;
  surface.current.setScene({ textBounds: [bounds] });
  assert.ok(!surface.particles.some(({ x, y }) => x === point.x && y === point.y));
  assert.ok(surface.particles.some((after) => {
    const before = initial.find(({ x, y }) => x === after.x && y === after.y);
    return before && after.opacity < before.opacity;
  }));
  assert.deepEqual(surface.particles.slice(0, 10), initial.slice(0, 10));
});

test("below the hero only a small and faint current remains along both edges", () => {
  for (const width of [1280, 390]) {
    const surface = setup(width);
    const heroCount = surface.particles.length;
    const heroMax = Math.max(...surface.particles.map(({ opacity }) => opacity));
    surface.current.setScene({ progress: 1, heroTop: -800 });
    assert.equal(surface.threads, 0);
    assert.ok(surface.particles.length < heroCount * 0.32);
    assert.ok(surface.particles.some(({ x }) => x < width * 0.15));
    assert.ok(surface.particles.some(({ x }) => x > width * 0.85));
    assert.ok(surface.particles.every(({ x, opacity }) => (x < width * 0.15 || x > width * 0.85) && opacity < heroMax * 0.17));
  }
});

test("reduced motion cancels animation, ignores the pointer, and still repaints after scene changes and resize", () => {
  const surface = setup(1280, 800, ["#11223a", "#426aaa", "#1e2b3d"]);
  surface.current.start();
  assert.equal(surface.queued, 1);
  surface.current.setReducedMotion(true);
  assert.equal(surface.queued, 0);
  const initial = surface.particles;
  const paintCount = surface.paintCount;
  surface.current.setPointer({ x: 640, y: 410 });
  surface.advance(1000);
  assert.equal(surface.paintCount, paintCount);
  surface.current.setScene({ progress: 0 });
  assert.deepEqual(surface.particles, initial);
  assert.ok(surface.particles.some(({ color }) => color === "#426aaa"));
  surface.current.resize(400, 720, 2);
  assert.equal(surface.canvas.width, 800);
  assert.equal(surface.canvas.height, 1440);
  assert.deepEqual(surface.transform, [2, 0, 0, 2, 0, 0]);
  assert.ok(surface.particles.length < initial.length);
  assert.equal(surface.queued, 0);
  surface.current.setReducedMotion(false);
  assert.equal(surface.queued, 1);
});

test("start and stop keep a single frame and do not jump after a pause or a delayed frame", () => {
  const surface = setup();
  const steady = setup();
  surface.current.start();
  surface.current.start();
  steady.current.start();
  assert.equal(surface.queued, 1);
  surface.advance();
  steady.advance();
  const beforePause = surface.particles;
  surface.current.stop();
  surface.current.stop();
  surface.advance(30_000);
  assert.equal(surface.queued, 0);
  assert.equal(surface.particles, beforePause);
  surface.current.start();
  surface.advance();
  steady.advance();
  assert.deepEqual(surface.particles, steady.particles);
  surface.advance(30_000);
  steady.advance(50);
  assert.deepEqual(surface.particles, steady.particles);
  surface.current.destroy();
  surface.current.start();
  assert.equal(surface.queued, 0);
});

test("the renderer can be used when the browser has no canvas context", () => {
  const current = createHomeParticleCurrent({
    canvas: { getContext: () => null },
    requestFrame() { assert.fail("unavailable canvas requested an animation frame"); },
  });
  current.resize(1280, 800, 2);
  current.setScene({ progress: 1 });
  current.setPointer({ x: 20, y: 20 });
  current.setReducedMotion(true);
  current.start();
  current.stop();
  current.destroy();
});
