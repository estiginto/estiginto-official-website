import assert from "node:assert/strict";
import test from "node:test";

import {
  createHeroVortexBackground,
  createPageVortexTransition,
} from "../src/pageVortexTransition.js";

function createCanvas() {
  const calls = [];
  const gradient = {
    addColorStop(...args) {
      calls.push(["addColorStop", ...args]);
    },
  };
  const context = new Proxy({
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    fillRect(...args) {
      calls.push(["fillRect", ...args, this.fillStyle]);
    },
    stroke() {
      calls.push(["stroke", this.strokeStyle]);
    },
  }, {
    get(target, property) {
      if (property in target) return target[property];
      return (...args) => calls.push([property, ...args]);
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    },
  });
  const canvas = {
    clientWidth: 800,
    clientHeight: 450,
    width: 0,
    height: 0,
    getContext: () => context,
  };
  return { canvas, calls };
}

test("homepage vortex renders the selected dense tunnel and cancels its active frame", () => {
  const { canvas, calls } = createCanvas();
  const frames = new Map();
  const cancelled = [];
  let nextFrame = 0;
  const transition = createPageVortexTransition({
    canvas,
    now: () => 100,
    requestFrame(callback) {
      nextFrame += 1;
      frames.set(nextFrame, callback);
      return nextFrame;
    },
    cancelFrame(id) {
      cancelled.push(id);
      frames.delete(id);
    },
  });

  transition.start();
  frames.get(1)(2400);

  assert.equal(canvas.width, 800);
  assert.equal(canvas.height, 450);
  assert.ok(calls.filter(([method]) => method === "ellipse").length >= 30);
  assert.ok(calls.some(([method]) => method === "lineTo"));

  transition.stop();
  assert.deepEqual(cancelled, [2]);
});

test("reduced motion paints one final frame without scheduling animation", () => {
  const { canvas, calls } = createCanvas();
  let scheduled = 0;
  const transition = createPageVortexTransition({
    canvas,
    reducedMotion: true,
    requestFrame() {
      scheduled += 1;
      return scheduled;
    },
  });

  transition.start();

  assert.equal(scheduled, 0);
  assert.ok(calls.some(([method]) => method === "ellipse"));
  transition.stop();
});

test("hero vortex keeps the shared tunnel rendering beyond the entry duration", () => {
  const { canvas, calls } = createCanvas();
  const frames = new Map();
  const cancelled = [];
  let nextFrame = 0;
  const background = createHeroVortexBackground({
    canvas,
    now: () => 100,
    requestFrame(callback) {
      nextFrame += 1;
      frames.set(nextFrame, callback);
      return nextFrame;
    },
    cancelFrame(id) {
      cancelled.push(id);
      frames.delete(id);
    },
  });

  background.start();
  frames.get(1)(100);
  frames.get(2)(6000);

  assert.ok(frames.has(3));
  assert.ok(calls.filter(([method]) => method === "ellipse").length >= 60);
  assert.ok(calls.some(([method]) => method === "lineTo"));

  background.stop();
  assert.deepEqual(cancelled, [3]);
});

test("hero vortex leaves the paper background visible while the entry vortex stays black", () => {
  const entry = createCanvas();
  const hero = createCanvas();
  const entryTransition = createPageVortexTransition({
    canvas: entry.canvas,
    reducedMotion: true,
  });
  const heroBackground = createHeroVortexBackground({
    canvas: hero.canvas,
    reducedMotion: true,
  });

  entryTransition.start();
  heroBackground.start();

  assert.ok(entry.calls.some(([method, , , , , fillStyle]) => method === "fillRect" && fillStyle === "#020405"));
  assert.ok(hero.calls.every(([method, , , , , fillStyle]) => method !== "fillRect" || fillStyle !== "#020405"));
  assert.ok(hero.calls.some(([method, , color]) => method === "addColorStop" && color === "rgba(177,129,71,.18)"));

  entryTransition.stop();
  heroBackground.stop();
});

test("hero vortex uses dark ink for every orbit and streak", () => {
  const { canvas, calls } = createCanvas();
  const background = createHeroVortexBackground({
    canvas,
    reducedMotion: true,
  });

  background.start();

  const strokes = calls.filter(([method]) => method === "stroke").map(([, color]) => color);
  assert.ok(strokes.length > 70);
  assert.ok(strokes.every((color) => color.startsWith("rgba(36,32,27,") || color.startsWith("rgba(54,49,42,") || color.startsWith("rgba(82,69,54,")));

  background.stop();
});

test("hero vortex keeps one continuous counterclockwise rotation", () => {
  const { canvas, calls } = createCanvas();
  const frames = new Map();
  let nextFrame = 0;
  const background = createHeroVortexBackground({
    canvas,
    now: () => 0,
    requestFrame(callback) {
      nextFrame += 1;
      frames.set(nextFrame, callback);
      return nextFrame;
    },
    cancelFrame(id) {
      frames.delete(id);
    },
  });

  background.start();
  frames.get(1)(1000);
  frames.get(2)(30000);

  const rotations = calls.filter(([method]) => method === "rotate").map(([, angle]) => angle);
  assert.ok(rotations[0] < 0);
  assert.ok(rotations[1] < rotations[0]);

  background.stop();
});

test("hero vortex replaces particle dots with sparse directional ticks", () => {
  const { canvas, calls } = createCanvas();
  const background = createHeroVortexBackground({
    canvas,
    reducedMotion: true,
  });

  background.start();

  const points = calls.filter(([method]) => method === "moveTo" || method === "lineTo");
  const lengths = [];
  for (let index = 0; index < points.length; index += 2) {
    const [, fromX, fromY] = points[index];
    const [, toX, toY] = points[index + 1];
    lengths.push(Math.hypot(toX - fromX, toY - fromY));
  }
  assert.ok(lengths.length <= 56);
  assert.ok(lengths.every((length) => length >= 4));

  background.stop();
});

test("reduced motion hero vortex paints one ambient frame without a loop", () => {
  const { canvas, calls } = createCanvas();
  let scheduled = 0;
  const background = createHeroVortexBackground({
    canvas,
    reducedMotion: true,
    requestFrame() {
      scheduled += 1;
      return scheduled;
    },
  });

  background.start();

  assert.equal(scheduled, 0);
  assert.ok(calls.some(([method]) => method === "ellipse"));
  background.stop();
});

test("hero vortex energy boost lengthens the shared light streaks", () => {
  const { canvas, calls } = createCanvas();
  const frames = new Map();
  let nextFrame = 0;
  const background = createHeroVortexBackground({
    canvas,
    now: () => 100,
    requestFrame(callback) {
      nextFrame += 1;
      frames.set(nextFrame, callback);
      return nextFrame;
    },
    cancelFrame(id) {
      frames.delete(id);
    },
  });
  const totalStreakLength = () => {
    const points = calls.filter(([method]) => method === "moveTo" || method === "lineTo");
    let total = 0;
    for (let index = 0; index < points.length; index += 2) {
      const [, fromX, fromY] = points[index];
      const [, toX, toY] = points[index + 1];
      total += Math.hypot(toX - fromX, toY - fromY);
    }
    return total;
  };

  background.start();
  frames.get(1)(100);
  const calmLength = totalStreakLength();
  calls.length = 0;

  background.setEnergy(1);
  frames.get(2)(100);

  assert.ok(totalStreakLength() > calmLength * 1.4);
  background.stop();
});
