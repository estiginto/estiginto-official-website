import assert from "node:assert/strict";
import test from "node:test";

import {
  createDesktopMenuParticles,
  projectParticleTowardTarget,
} from "../src/desktopMenuParticles.js";

test("desktop menu particles originate from restrained grid intersections", () => {
  const particles = createDesktopMenuParticles();

  assert.equal(particles.length, 28);
  assert.deepEqual(particles[0], { id: 0, x: 5, y: 8, pull: 0.34, delay: 0 });
  assert.ok(particles.every(({ x, y }) => x >= 5 && x <= 95 && y >= 8 && y <= 92));
});

test("active particles move toward the hovered menu item without collapsing into it", () => {
  const particle = { id: 3, x: 20, y: 80, pull: 0.42, delay: 36 };

  assert.deepEqual(
    projectParticleTowardTarget(particle, { x: 70, y: 30 }),
    { x: 41, y: 59 },
  );
});

test("particles remain at their grid origin while no menu item is targeted", () => {
  const particle = { id: 6, x: 65, y: 48, pull: 0.38, delay: 72 };

  assert.deepEqual(projectParticleTowardTarget(particle, null), { x: 65, y: 48 });
});
