import assert from "node:assert/strict";
import test from "node:test";

import { createHeroSoulRibbon } from "../src/heroSoulRibbon.js";

function createCanvas() {
  const calls = [];
  const gradient = {
    addColorStop(...args) {
      calls.push(["addColorStop", ...args]);
    },
  };
  const context = new Proxy({
    createLinearGradient: (...args) => {
      calls.push(["createLinearGradient", ...args]);
      return gradient;
    },
    createRadialGradient: (...args) => {
      calls.push(["createRadialGradient", ...args]);
      return gradient;
    },
    stroke() {
      calls.push(["stroke", this.strokeStyle, this.lineWidth]);
    },
    fill() {
      calls.push(["fill", this.fillStyle]);
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

test("hero soul ribbon crosses the full field from lower-left to upper-right", () => {
  const { canvas, calls } = createCanvas();
  const ribbon = createHeroSoulRibbon({ canvas, reducedMotion: true });

  ribbon.start();

  const moves = calls.filter(([method]) => method === "moveTo");
  const lines = calls.filter(([method]) => method === "lineTo");
  const [, startX, startY] = moves[0];
  const [, endX, endY] = lines.at(-1);
  assert.ok(startX < 0, `expected start beyond left edge, got ${startX}`);
  assert.ok(startY > canvas.clientHeight * 0.85, `expected low origin, got ${startY}`);
  assert.ok(endX > canvas.clientWidth, `expected end beyond right edge, got ${endX}`);
  assert.ok(endY < canvas.clientHeight * 0.15, `expected high destination, got ${endY}`);

  ribbon.stop();
});

test("hero soul ribbon carries its visual weight through the lower half of center", () => {
  const { canvas, calls } = createCanvas();
  const ribbon = createHeroSoulRibbon({ canvas, reducedMotion: true });

  ribbon.start();

  const firstStrokeIndex = calls.findIndex(([method]) => method === "stroke");
  const glowPath = calls
    .slice(0, firstStrokeIndex)
    .filter(([method]) => method === "moveTo" || method === "lineTo");
  const centerPoint = glowPath.reduce((nearest, point) => (
    Math.abs(point[1] - canvas.clientWidth / 2) < Math.abs(nearest[1] - canvas.clientWidth / 2)
      ? point
      : nearest
  ));

  assert.ok(
    centerPoint[2] >= canvas.clientHeight * 0.56,
    `expected the ribbon to stay below center before ascending, got y=${centerPoint[2]}`,
  );

  ribbon.stop();
});

test("hero soul ribbon uses continuous paths and only three travelling energy pulses", () => {
  const { canvas, calls } = createCanvas();
  const ribbon = createHeroSoulRibbon({ canvas, reducedMotion: true });

  ribbon.start();

  assert.ok(calls.filter(([method]) => method === "stroke").length >= 18);
  assert.equal(calls.filter(([method]) => method === "arc").length, 3);
  assert.equal(calls.filter(([method]) => method === "ellipse").length, 0);

  ribbon.stop();
});

test("hero soul ribbon loops while active and reduced motion paints once", () => {
  const animated = createCanvas();
  const frames = new Map();
  const cancelled = [];
  let nextFrame = 0;
  const ribbon = createHeroSoulRibbon({
    canvas: animated.canvas,
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

  ribbon.start();
  frames.get(1)(100);
  frames.get(2)(1000);
  assert.ok(frames.has(3));
  ribbon.stop();
  assert.deepEqual(cancelled, [3]);

  const staticCanvas = createCanvas();
  let scheduled = 0;
  const staticRibbon = createHeroSoulRibbon({
    canvas: staticCanvas.canvas,
    reducedMotion: true,
    requestFrame() {
      scheduled += 1;
      return scheduled;
    },
  });
  staticRibbon.start();
  assert.equal(scheduled, 0);
  assert.ok(staticCanvas.calls.some(([method]) => method === "stroke"));
  staticRibbon.stop();
});
