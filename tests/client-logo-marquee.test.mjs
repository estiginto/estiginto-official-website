import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { buildClientLogoLanes, clientLogos } from "../src/clientLogoMarquee.js";

test("client logo inventory contains every normalized PDF logo", () => {
  assert.equal(clientLogos.length, 43);
  assert.equal(new Set(clientLogos.map((client) => client.id)).size, 43);
  assert.equal(new Set(clientLogos.map((client) => client.src)).size, 43);
  assert.equal(clientLogos.every((client) => client.alt.length > 0), true);
  assert.equal(clientLogos.every((client) => existsSync(`.${client.src}`)), true);
});

test("the complete client inventory fills three lanes without reserved slots", () => {
  const lanes = buildClientLogoLanes(clientLogos);

  assert.deepEqual(lanes.map((lane) => lane.length), [15, 14, 14]);
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
