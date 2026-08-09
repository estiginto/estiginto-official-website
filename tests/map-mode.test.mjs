import assert from "node:assert/strict";
import test from "node:test";
import {
  TAIWAN_CAMERA,
  buildingLayer,
  cameraForMode,
  findVectorSourceId,
  mapStyleUrl,
} from "../src/map/mapConfig.js";

test("Taiwan camera is the stable initial view", () => {
  assert.deepEqual(TAIWAN_CAMERA.center, [120.96, 23.7]);
  assert.equal(TAIWAN_CAMERA.zoom, 7);
  assert.equal(TAIWAN_CAMERA.pitch, 0);
});

test("map style is an OpenFreeMap keyless vector style", () => {
  assert.equal(mapStyleUrl(), "https://tiles.openfreemap.org/styles/dark");
  assert.doesNotMatch(mapStyleUrl(), /key=|maptiler/i);
});

test("mode cameras preserve center and selected target", () => {
  const camera = { center: [121, 24], zoom: 12, pitch: 0, bearing: 0 };
  const target = { coordinates: [121.5645, 25.0339] };
  const threeD = cameraForMode("3d", camera, target);
  assert.deepEqual(threeD.center, target.coordinates);
  assert.equal(threeD.pitch, 58);
  assert.equal(threeD.bearing, -18);
  assert.ok(threeD.zoom >= 15);

  const twoD = cameraForMode("2d", threeD, target);
  assert.deepEqual(twoD.center, target.coordinates);
  assert.equal(twoD.pitch, 0);
  assert.equal(twoD.bearing, 0);
});

test("building layer is a cyan-tinted extrusion and not a route layer", () => {
  const layer = buildingLayer("openmaptiles");
  assert.equal(layer.type, "fill-extrusion");
  assert.equal(layer["source-layer"], "building");
  assert.equal(layer.source, "openmaptiles");
  assert.equal(layer.paint["fill-extrusion-opacity"], 0.78);
  assert.doesNotMatch(JSON.stringify(layer), /route|direction|navigation/i);
});

test("vector source discovery ignores raster and terrain sources", () => {
  assert.equal(findVectorSourceId({ sources: {
    background: { type: "raster" },
    openmaptiles: { type: "vector" },
  } }), "openmaptiles");
  assert.equal(findVectorSourceId({ sources: {} }), null);
});
