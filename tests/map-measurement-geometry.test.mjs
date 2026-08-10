import assert from "node:assert/strict";
import test from "node:test";
import {
  circleFeature,
  destinationPoint,
  formatArea,
  formatDistance,
  haversineDistance,
  measurementFeatureCollection,
} from "../src/map/measurementGeometry.js";

test("haversine distance measures the shortest surface distance", () => {
  assert.ok(Math.abs(haversineDistance([0, 0], [0, 1]) - 111195) < 1);
});

test("destination point places a radius handle at the requested bearing", () => {
  const east = destinationPoint([0, 0], 90, 1000);
  assert.ok(Math.abs(east[1]) < 0.000001);
  assert.ok(Math.abs(east[0] - 0.0089932) < 0.000001);
});

test("circle feature creates a closed polygon with stable measurement metadata", () => {
  const feature = circleFeature([121.5, 25], 500, 96);
  const ring = feature.geometry.coordinates[0];

  assert.equal(ring.length, 97);
  assert.deepEqual(ring[0], ring.at(-1));
  assert.equal(feature.properties.measurementKind, "circle");
  assert.equal(feature.properties.radius, 500);
});

test("measurement collection separates circle, straight, and travel geometry", () => {
  const collection = measurementFeatureCollection({
    circle: { center: [121.5, 25], radius: 500 },
    points: [[121.5, 25], [121.51, 25.01]],
    travelGeometry: { type: "LineString", coordinates: [[121.5, 25], [121.505, 25.006], [121.51, 25.01]] },
  });

  assert.deepEqual(collection.features.map((feature) => feature.properties.measurementKind), [
    "circle",
    "straight",
    "travel",
  ]);
});

test("measurement units remain compact across metric thresholds", () => {
  assert.equal(formatDistance(850), "850 公尺");
  assert.equal(formatDistance(1520), "1.52 公里");
  assert.equal(formatArea(980000), "980,000 平方公尺");
  assert.equal(formatArea(1250000), "1.25 平方公里");
});
