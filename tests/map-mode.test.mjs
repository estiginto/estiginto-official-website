import assert from "node:assert/strict";
import test from "node:test";
import {
  TAIWAN_CAMERA,
  TARGET_GEOMETRY_SOURCE_ID,
  buildingLayer,
  cameraForMode,
  findVectorSourceId,
  geometryCameraOptions,
  geometryBounds,
  mapStyleUrl,
  targetGeometryLayers,
  targetFeatureCollection,
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

test("target geometry layers render roads and areas without becoming routes", () => {
  const layers = targetGeometryLayers();
  const roadBackdrop = layers.find((layer) => layer.id === "estiginto-target-road-backdrop");
  const roadGlow = layers.find((layer) => layer.id === "estiginto-target-road-glow");
  const roadCore = layers.find((layer) => layer.id === "estiginto-target-road-core");

  assert.equal(layers.length, 6);
  assert.deepEqual(layers.map((layer) => layer.type), ["fill", "line", "line", "line", "line", "line"]);
  assert.ok(layers.every((layer) => layer.source === TARGET_GEOMETRY_SOURCE_ID));
  assert.ok(layers.some((layer) => layer.paint?.["fill-color"] === "#0c9ab1"));
  assert.ok(layers.some((layer) => layer.paint?.["line-color"] === "#baf8ff"));
  assert.equal(roadBackdrop.paint["line-color"], "#001116");
  assert.equal(roadBackdrop.paint["line-width"].at(-1), 34);
  assert.equal(roadGlow.paint["line-opacity"], 0.78);
  assert.equal(roadGlow.paint["line-width"].at(-1), 28);
  assert.equal(roadCore.paint["line-opacity"], 1);
  assert.equal(roadCore.paint["line-width"].at(-1), 7);
  assert.doesNotMatch(JSON.stringify(layers), /route|direction|navigation/i);
});

test("geometry bounds cover line and polygon extents but leave points to the marker camera", () => {
  assert.deepEqual(geometryBounds({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[[121.52, 25.02], [121.5, 25], [121.51, 25.04], [121.52, 25.02]]],
    },
  }), [121.5, 25, 121.52, 25.04]);
  assert.deepEqual(geometryBounds({
    type: "Feature",
    geometry: { type: "MultiLineString", coordinates: [[[121, 24], [122, 25]], [[120.5, 23.5], [121.5, 24.5]]] },
  }), [120.5, 23.5, 122, 25]);
  assert.equal(geometryBounds({
    type: "Feature",
    geometry: { type: "Point", coordinates: [121, 24] },
  }), null);
});

test("target feature collections replace stale geometry with one current feature", () => {
  const feature = {
    type: "Feature",
    properties: { name: "測試區域" },
    geometry: { type: "Polygon", coordinates: [[[121, 24], [122, 24], [121, 25], [121, 24]]] },
  };

  assert.deepEqual(targetFeatureCollection(null), { type: "FeatureCollection", features: [] });
  assert.deepEqual(targetFeatureCollection(feature), { type: "FeatureCollection", features: [feature] });
});

test("geometry camera padding clears desktop panels and the mobile bottom sheet", () => {
  const feature = {
    type: "Feature",
    geometry: { type: "LineString", coordinates: [[121, 24], [122, 25]] },
  };

  assert.deepEqual(geometryCameraOptions(feature, { width: 1200, reducedMotion: false }), {
    bounds: [[121, 24], [122, 25]],
    options: { padding: { top: 150, right: 260, bottom: 110, left: 260 }, duration: 900, maxZoom: 17 },
  });
  assert.deepEqual(geometryCameraOptions(feature, { width: 390, reducedMotion: true }), {
    bounds: [[121, 24], [122, 25]],
    options: { padding: { top: 190, right: 24, bottom: 350, left: 24 }, duration: 0, maxZoom: 17 },
  });
});
