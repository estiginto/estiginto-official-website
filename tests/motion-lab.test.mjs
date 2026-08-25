import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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
