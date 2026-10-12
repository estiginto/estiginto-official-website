import assert from "node:assert/strict";
import test from "node:test";
import { projectGlobe } from "../src/orbitalGlobe.js";

test("globe projection preserves the sphere and wraps without a seam", () => {
  for (const lon of [-180,-90,0,105,180]) for (const lat of [-90,-45,0,45,90]) {
    const p=projectGlobe(lon,lat,23), wrapped=projectGlobe(lon,lat,383);
    assert.ok(Math.abs(p.x*p.x+p.y*p.y+p.z*p.z-1)<1e-10);
    for(const key of ["x","y","z"]) assert.ok(Math.abs(p[key]-wrapped[key])<1e-10);
  }
});
test("front and back hemispheres remain distinct and poles do not drift", () => {
  assert.ok(projectGlobe(105,0).z>.99);
  assert.ok(projectGlobe(-75,0).z<-.99);
  for(const rotation of [0,90,180,270]) {
    const pole=projectGlobe(0,90,rotation);
    assert.ok(Math.abs(pole.x)<1e-10);
    assert.equal(pole.y,-1);
  }
});
