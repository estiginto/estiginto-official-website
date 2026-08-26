import assert from "node:assert/strict";
import test from "node:test";
import { buildClientLogoLanes } from "../src/clientLogoMarquee.js";

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
