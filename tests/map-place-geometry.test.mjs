import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGeometryLookupUrl,
  createPlaceGeometryService,
  normalizeGeometryFeature,
} from "../src/map/placeGeometry.js";

const place = {
  id: "W.293782783",
  osmType: "W",
  osmId: "293782783",
  coordinates: [121.5645, 25.0339],
};

const polygon = {
  type: "Feature",
  properties: { osm_id: 293782783 },
  geometry: {
    type: "Polygon",
    coordinates: [[[121.56, 25.03], [121.57, 25.03], [121.57, 25.04], [121.56, 25.03]]],
  },
};

test("geometry lookup requests the selected OSM object as GeoJSON", () => {
  const url = buildGeometryLookupUrl(place);

  assert.equal(url.origin, "https://nominatim.openstreetmap.org");
  assert.equal(url.pathname, "/lookup");
  assert.equal(url.searchParams.get("osm_ids"), "W293782783");
  assert.equal(url.searchParams.get("format"), "geojson");
  assert.equal(url.searchParams.get("polygon_geojson"), "1");
});

test("geometry normalization accepts real line and area geometry", () => {
  assert.deepEqual(normalizeGeometryFeature(polygon), polygon);
  assert.equal(normalizeGeometryFeature({
    ...polygon,
    geometry: { type: "LineString", coordinates: [[121.5, 25], [121.6, 25.1]] },
  })?.geometry.type, "LineString");
  assert.equal(normalizeGeometryFeature({
    ...polygon,
    geometry: { type: "MultiPolygon", coordinates: [polygon.geometry.coordinates] },
  })?.geometry.type, "MultiPolygon");
});

test("geometry normalization rejects malformed and unsupported data", () => {
  assert.equal(normalizeGeometryFeature(null), null);
  assert.equal(normalizeGeometryFeature({ ...polygon, geometry: { type: "GeometryCollection", geometries: [] } }), null);
  assert.equal(normalizeGeometryFeature({
    ...polygon,
    geometry: { type: "LineString", coordinates: [[121.5, 25], [NaN, 25.1]] },
  }), null);
});

test("geometry service caches successful lookups and passes AbortSignal", async () => {
  let requests = 0;
  let capturedSignal;
  const controller = new AbortController();
  const service = createPlaceGeometryService({
    fetchImpl: async (_url, options) => {
      requests += 1;
      capturedSignal = options.signal;
      return { ok: true, json: async () => ({ type: "FeatureCollection", features: [polygon] }) };
    },
  });

  assert.deepEqual(await service.resolve(place, { signal: controller.signal }), polygon);
  assert.deepEqual(await service.resolve(place), polygon);
  assert.equal(requests, 1);
  assert.equal(capturedSignal, controller.signal);
});

test("geometry service falls back cleanly for missing identities and failed responses", async () => {
  const service = createPlaceGeometryService({
    fetchImpl: async () => ({ ok: false, status: 429 }),
  });

  assert.equal(await service.resolve({ coordinates: [121, 25] }), null);
  assert.equal(await service.resolve(place), null);
});
