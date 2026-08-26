import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { buildClientLogoLanes, clientLogos } from "../src/clientLogoMarquee.js";

const css = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("client logos render at the approved larger marquee size", () => {
  const itemRule = css.match(/\.client-logo-marquee-item\s*\{([^}]*)\}/)?.[1] || "";
  const imageRule = css.match(/\.client-logo-marquee-item img\s*\{([^}]*)\}/)?.[1] || "";

  assert.match(itemRule, /flex:\s*1 0 clamp\(184px,\s*17vw,\s*252px\)/);
  assert.match(itemRule, /min-height:\s*clamp\(92px,\s*8vw,\s*118px\)/);
  assert.match(imageRule, /width:\s*min\(96%,\s*220px\)/);
  assert.match(imageRule, /height:\s*80px/);
  assert.match(imageRule, /max-height:\s*none/);
});

test("client logo inventory contains every normalized source logo", () => {
  assert.equal(clientLogos.length, 43);
  assert.equal(new Set(clientLogos.map((client) => client.id)).size, 43);
  assert.equal(new Set(clientLogos.map((client) => client.src)).size, 43);
  assert.equal(clientLogos.every((client) => client.alt.length > 0), true);
  assert.equal(clientLogos.every((client) => existsSync(`.${client.src}`)), true);
  assert.equal(clientLogos.some((client) => client.id === "fable"), false);
  assert.equal(clientLogos.some((client) => client.id === "tainan-airport"), false);
});

test("client inventory is explicitly grouped by recognition, government, and other clients", () => {
  const lanes = buildClientLogoLanes(clientLogos);

  assert.deepEqual(lanes.map((lane) => lane.length), [12, 2, 29]);
  assert.deepEqual(lanes[1].map((client) => client.id), [
    "bureau-foreign-trade",
    "trade-negotiations",
  ]);
  assert.equal(lanes[0].some((client) => client.id === "yang-ming"), true);
  assert.equal(lanes[0].some((client) => client.id === "taiwan-stock-exchange"), true);
  assert.equal(lanes.flat().every((item) => item.src !== null), true);
});

test("client logo marquee reserves three populated lanes without inventing brands", () => {
  const lanes = buildClientLogoLanes();

  assert.equal(lanes.length, 3);
  assert.deepEqual(lanes.map((lane) => lane.length), [8, 8, 8]);
  assert.equal(lanes.flat().every((item) => item.src === null && item.alt === ""), true);
  assert.equal(new Set(lanes.flat().map((item) => item.id)).size, 24);
});

test("client logos are distributed across all three lanes without truncation", () => {
  const clients = Array.from({ length: 29 }, (_, index) => ({
    id: `client-${index + 1}`,
    src: `/img/clients/client-${index + 1}.svg`,
    alt: `Client ${index + 1}`,
  }));

  const lanes = buildClientLogoLanes(clients);

  assert.deepEqual(lanes.map((lane) => lane.length), [10, 10, 9]);
  assert.deepEqual(lanes.flatMap((lane) => lane).map((item) => item.id).sort(), clients.map((item) => item.id).sort());
});
