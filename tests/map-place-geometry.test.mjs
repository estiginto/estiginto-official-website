import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGeometryLookupUrl,
  buildRoadGeometryUrl,
  createPlaceGeometryService,
  normalizeGeometryFeature,
  normalizeRoadGeometry,
  ROAD_GEOMETRY_ENDPOINTS,
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

test("road lookup collects nearby segments with the selected street name", () => {
  const roadPlace = {
    osmType: "N",
    osmId: "123",
    osmKey: "place",
    street: "大觀路二段156巷",
    coordinates: [121.443, 25.001],
  };
  const url = buildRoadGeometryUrl(roadPlace);
  const query = url.searchParams.get("data");

  assert.equal(url.origin, "https://overpass-api.de");
  assert.match(query, /timeout:8/);
  assert.match(query, /around:1800,25\.001,121\.443/);
  assert.match(query, /\["name"="大觀路二段156巷"\]/);
});

test("road lookup supports a second free Overpass endpoint", () => {
  const roadPlace = {
    osmType: "N",
    osmId: "123",
    street: "大觀路二段156巷",
    coordinates: [121.443, 25.001],
  };
  const url = buildRoadGeometryUrl(roadPlace, ROAD_GEOMETRY_ENDPOINTS[1]);

  assert.equal(url.origin, "https://overpass.private.coffee");
  assert.equal(url.pathname, "/api/interpreter");
});

test("road geometry joins valid OSM ways into one highlighted feature", () => {
  const feature = normalizeRoadGeometry({
    elements: [
      { type: "way", id: 1, geometry: [{ lat: 25, lon: 121 }, { lat: 25.01, lon: 121.01 }] },
      { type: "way", id: 2, geometry: [{ lat: 25.01, lon: 121.01 }, { lat: 25.02, lon: 121.02 }] },
      { type: "node", id: 3, lat: 25, lon: 121 },
    ],
  }, "大觀路二段156巷");

  assert.equal(feature.geometry.type, "MultiLineString");
  assert.deepEqual(feature.geometry.coordinates[1][1], [121.02, 25.02]);
  assert.equal(feature.properties.name, "大觀路二段156巷");
});

test("address nodes prefer their named road geometry and cache it", async () => {
  let requests = 0;
  const roadPlace = {
    osmType: "N",
    osmId: "123",
    osmKey: "place",
    street: "大觀路二段156巷",
    coordinates: [121.443, 25.001],
  };
  const service = createPlaceGeometryService({
    fetchImpl: async (url) => {
      requests += 1;
      assert.equal(url.origin, "https://overpass-api.de");
      return {
        ok: true,
        json: async () => ({
          elements: [{ type: "way", id: 1, geometry: [{ lat: 25, lon: 121 }, { lat: 25.01, lon: 121.01 }] }],
        }),
      };
    },
  });

  assert.equal((await service.resolve(roadPlace)).geometry.type, "LineString");
  assert.equal((await service.resolve(roadPlace)).geometry.type, "LineString");
  assert.equal(requests, 1);
});

test("road geometry retries the free fallback endpoint after a failed primary", async () => {
  const origins = [];
  const roadPlace = {
    osmType: "N",
    osmId: "123",
    osmKey: "place",
    street: "大觀路二段156巷",
    coordinates: [121.443, 25.001],
  };
  const service = createPlaceGeometryService({
    fetchImpl: async (url) => {
      origins.push(url.origin);
      if (url.origin === "https://overpass-api.de") return { ok: false, status: 504 };
      return {
        ok: true,
        json: async () => ({
          elements: [{ type: "way", id: 1, geometry: [{ lat: 25, lon: 121 }, { lat: 25.01, lon: 121.01 }] }],
        }),
      };
    },
  });

  assert.equal((await service.resolve(roadPlace)).geometry.type, "LineString");
  assert.deepEqual(origins, ["https://overpass-api.de", "https://overpass.private.coffee"]);
});
