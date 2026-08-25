import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createAudioEngine } from "../prototypes/motion-lab/audio.js";
import { createPlaybackController } from "../prototypes/motion-lab/motion-core.js";

const labRoot = new URL("../prototypes/motion-lab/", import.meta.url);

test("motion lab exposes three scene choices and accessible playback controls", async () => {
  const html = await readFile(new URL("index.html", labRoot), "utf8");
  const sceneChoices = html.match(/data-scene="(?:dune|vortex|hybrid)"/g) ?? [];

  assert.deepEqual(sceneChoices, [
    'data-scene="dune"',
    'data-scene="vortex"',
    'data-scene="hybrid"',
  ]);
  assert.match(html, /id="motion-canvas"/);
  assert.match(html, /id="motion-overlay"/);
  assert.match(html, /data-action="previous"/);
  assert.match(html, /data-action="replay"/);
  assert.match(html, /data-action="next"/);
  assert.match(html, /data-action="sound"[^>]*aria-pressed="false"/);
  assert.match(html, /aria-live="polite"/);
});

test("motion lab stays outside the production entry list", async () => {
  const vite = await readFile(new URL("../vite.config.js", import.meta.url), "utf8");
  assert.doesNotMatch(vite, /motion-lab/);
});

test("starting another scene stops the previous scene and advances real progress", () => {
  const frames = new Map();
  let nextFrame = 0;
  const events = [];
  const scene = (id, duration) => ({
    duration,
    start: () => events.push(`${id}:start`),
    render: (progress) => events.push(`${id}:render:${progress.toFixed(2)}`),
    stop: () => events.push(`${id}:stop`),
  });
  const audio = {
    playCue: (id) => events.push(`audio:${id}`),
    stop: () => events.push("audio:stop"),
  };
  const controller = createPlaybackController({
    scenes: { dune: scene("dune", 1000), vortex: scene("vortex", 2000) },
    sceneOrder: ["dune", "vortex"],
    audio,
    now: () => 100,
    requestFrame: (callback) => {
      nextFrame += 1;
      frames.set(nextFrame, callback);
      return nextFrame;
    },
    cancelFrame: (id) => frames.delete(id),
  });

  controller.play("dune");
  controller.play("vortex");
  frames.get(2)(1100);

  assert.deepEqual(events, [
    "audio:stop",
    "dune:start",
    "audio:dune",
    "dune:stop",
    "audio:stop",
    "vortex:start",
    "audio:vortex",
    "vortex:render:0.50",
  ]);
  assert.equal(controller.currentId, "vortex");
});

test("scene selection wraps and replay restarts the active scene", () => {
  const events = [];
  const makeScene = (id) => ({
    duration: 1000,
    start: () => events.push(`${id}:start`),
    render: () => {},
    stop: () => events.push(`${id}:stop`),
  });
  const controller = createPlaybackController({
    scenes: { dune: makeScene("dune"), vortex: makeScene("vortex"), hybrid: makeScene("hybrid") },
    sceneOrder: ["dune", "vortex", "hybrid"],
    audio: { playCue: () => {}, stop: () => {} },
    now: () => 0,
    requestFrame: () => 1,
    cancelFrame: () => {},
  });

  controller.play("dune");
  controller.selectRelative(-1);
  controller.replay();

  assert.equal(controller.currentId, "hybrid");
  assert.deepEqual(events, [
    "dune:start",
    "dune:stop",
    "hybrid:start",
    "hybrid:stop",
    "hybrid:start",
  ]);
});

test("audio remains dormant until enabled and stops every active source", async () => {
  let contextCreations = 0;
  const sources = [];
  const param = () => ({
    value: 0,
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {},
    setTargetAtTime() {},
  });
  const contextFactory = () => {
    contextCreations += 1;
    return {
      currentTime: 0,
      state: "running",
      destination: {},
      resume: async () => {},
      createOscillator() {
        const node = { frequency: param(), detune: param(), connect() {}, start() { node.started = true; }, stop() { node.stopped = true; }, disconnect() {} };
        sources.push(node);
        return node;
      },
      createGain() { return { gain: param(), connect() {}, disconnect() {} }; },
      createBiquadFilter() { return { frequency: param(), Q: param(), connect() {}, disconnect() {} }; },
    };
  };
  const audio = createAudioEngine({ contextFactory });

  audio.playCue("dune");
  assert.equal(audio.enabled, false);
  assert.equal(contextCreations, 0);

  await audio.setEnabled(true);
  audio.playCue("hybrid");
  assert.equal(contextCreations, 1);
  assert.ok(sources.length >= 2);
  assert.ok(sources.every((source) => source.started));

  audio.stop();
  assert.ok(sources.every((source) => source.stopped));
});
