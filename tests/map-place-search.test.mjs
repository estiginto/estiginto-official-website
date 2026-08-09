import assert from "node:assert/strict";
import test from "node:test";
import {
  PlaceSearchError,
  buildPlaceSearchUrl,
  createPlaceSearchService,
  normalizeMapTilerFeature,
} from "../src/map/placeSearch.js";

const feature = {
  id: "poi.101",
  text: "台北 101",
  place_name: "台北 101, 信義區, 臺北市, 臺灣",
  place_type: ["poi"],
  place_type_name: ["地標"],
  center: [121.5645, 25.0339],
  bbox: [121.563, 25.032, 121.566, 25.036],
  properties: { categories: ["attraction"] },
};

test("search URL enables POIs and biases without restricting to Taiwan", () => {
  const url = buildPlaceSearchUrl({
    query: "台北 101",
    apiKey: "public-test-key",
    proximity: [121.56, 25.03],
    language: "zh",
  });

  assert.equal(url.pathname, "/geocoding/%E5%8F%B0%E5%8C%97%20101.json");
  assert.equal(url.searchParams.get("types"), "address,road,place,locality,municipality,poi");
  assert.equal(url.searchParams.get("proximity"), "121.56,25.03");
  assert.equal(url.searchParams.get("language"), "zh");
  assert.equal(url.searchParams.get("limit"), "8");
  assert.equal(url.searchParams.has("country"), false);
});

test("feature normalization returns the stable local contract", () => {
  assert.deepEqual(normalizeMapTilerFeature(feature, "© MapTiler"), {
    id: "poi.101",
    name: "台北 101",
    fullName: "台北 101, 信義區, 臺北市, 臺灣",
    address: "信義區, 臺北市, 臺灣",
    kind: "地標",
    coordinates: [121.5645, 25.0339],
    bbox: [121.563, 25.032, 121.566, 25.036],
    attribution: "© MapTiler",
  });
});

test("normalization rejects features without finite coordinates", () => {
  assert.equal(normalizeMapTilerFeature({ ...feature, center: undefined }, "source"), null);
  assert.equal(normalizeMapTilerFeature({ ...feature, center: [NaN, 25] }, "source"), null);
});

test("search passes the AbortSignal and filters invalid features", async () => {
  const controller = new AbortController();
  let capturedOptions;
  const service = createPlaceSearchService({
    apiKey: "public-test-key",
    fetchImpl: async (_url, options) => {
      capturedOptions = options;
      return {
        ok: true,
        json: async () => ({ attribution: "© MapTiler", features: [feature, { id: "bad" }] }),
      };
    },
  });

  const results = await service.search("台北 101", { signal: controller.signal });
  assert.equal(capturedOptions.signal, controller.signal);
  assert.equal(results.length, 1);
  assert.equal(results[0].id, "poi.101");
});

test("empty feature collections return an empty result", async () => {
  const service = createPlaceSearchService({
    apiKey: "public-test-key",
    fetchImpl: async () => ({ ok: true, json: async () => ({ features: [] }) }),
  });
  assert.deepEqual(await service.search("nothing"), []);
});

test("non-success responses become typed request errors", async () => {
  const service = createPlaceSearchService({
    apiKey: "public-test-key",
    fetchImpl: async () => ({ ok: false, status: 429 }),
  });

  await assert.rejects(
    () => service.search("台北"),
    (error) => error instanceof PlaceSearchError && error.code === "request-failed",
  );
});

test("a missing API key fails before a request is built", () => {
  assert.throws(
    () => buildPlaceSearchUrl({ query: "台北", apiKey: "" }),
    (error) => error instanceof PlaceSearchError && error.code === "missing-key",
  );
});

