import assert from "node:assert/strict";
import test from "node:test";

import {
  createDesktopMenuAssemblyParticles,
  getParticleAssemblyOffset,
} from "../src/desktopMenuParticles.js";

test("desktop menu assembly particles define the panel frame before its internal structure", () => {
  const particles = createDesktopMenuAssemblyParticles();
  const layerCounts = particles.reduce((counts, particle) => ({
    ...counts,
    [particle.layer]: (counts[particle.layer] || 0) + 1,
  }), {});

  assert.equal(particles.length, 112);
  assert.deepEqual(layerCounts, { frame: 64, axis: 16, grid: 32 });
  assert.deepEqual(particles[0], { id: 0, x: 5, y: 5, layer: "frame", delay: 0, size: 4 });
  assert.ok(particles.every(({ x, y }) => x >= 5 && x <= 95 && y >= 5 && y <= 95));
  assert.ok(Math.max(...particles.filter(({ layer }) => layer === "frame").map(({ delay }) => delay))
    < Math.min(...particles.filter(({ layer }) => layer === "grid").map(({ delay }) => delay)));
});

test("panel particles begin at the menu trigger and settle at their assigned structure point", () => {
  const particle = { id: 3, x: 25, y: 40, layer: "frame", delay: 9, size: 3 };

  assert.deepEqual(
    getParticleAssemblyOffset(particle, { x: 75, y: 80 }, { width: 800, height: 500 }),
    { x: 400, y: 200 },
  );
});

test("panel particle offsets stay finite while the menu has not been measured", () => {
  const particle = { id: 6, x: 65, y: 48, layer: "grid", delay: 260, size: 2 };

  assert.deepEqual(getParticleAssemblyOffset(particle, null, null), { x: 0, y: 0 });
});
