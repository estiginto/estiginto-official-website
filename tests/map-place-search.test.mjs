import assert from "node:assert/strict";
import test from "node:test";
import {
  PlaceSearchError,
  buildPlaceSearchUrl,
  createPlaceSearchService,
  normalizePhotonFeature,
} from "../src/map/placeSearch.js";

const feature = {
  type: "Feature",
  geometry: { type: "Point", coordinates: [121.5645, 25.0339] },
  properties: {
    name: "台北 101",
    osm_key: "tourism",
    osm_value: "attraction",
    osm_type: "W",
    osm_id: 293782783,
    street: "市府路",
    housenumber: "45",
    district: "信義區",
    city: "臺北市",
    country: "臺灣",
    extent: [121.563, 25.036, 121.566, 25.032],
  },
};

const houseFeature = {
  type: "Feature",
  geometry: { type: "Point", coordinates: [121.441262, 24.9999432] },
  properties: {
    osm_key: "place",
    osm_value: "house",
    osm_type: "N",
    osm_id: 123456,
    street: "大觀路二段156巷",
    housenumber: "45號",
    district: "板橋區",
    city: "新北市",
    country: "臺灣",
    type: "house",
  },
};

test("Photon URL biases to the map center without restricting global search", () => {
  const url = buildPlaceSearchUrl({
    query: "台北 101",
    proximity: [121.56, 25.03],
    language: "default",
  });

  assert.equal(url.origin, "https://photon.komoot.io");
  assert.equal(url.pathname, "/api/");
  assert.equal(url.searchParams.get("q"), "台北 101");
  assert.equal(url.searchParams.get("lon"), "121.56");
  assert.equal(url.searchParams.get("lat"), "25.03");
  assert.equal(url.searchParams.get("lang"), "default");
  assert.equal(url.searchParams.get("limit"), "8");
  assert.equal(url.searchParams.has("countrycode"), false);
  assert.equal(url.searchParams.has("key"), false);
});

test("Photon normalization returns the stable local place contract", () => {
  assert.deepEqual(normalizePhotonFeature(feature), {
    id: "W.293782783",
    name: "台北 101",
    fullName: "台北 101, 市府路 45, 信義區, 臺北市, 臺灣",
    address: "市府路 45, 信義區, 臺北市, 臺灣",
    kind: "attraction",
    coordinates: [121.5645, 25.0339],
    bbox: [121.563, 25.032, 121.566, 25.036],
    osmType: "W",
    osmId: "293782783",
    osmKey: "tourism",
    street: "市府路",
    attribution: "© OpenStreetMap contributors · Photon",
  });
});

test("nameless Photon house uses its street and number as the result title", () => {
  const result = normalizePhotonFeature(houseFeature);

  assert.equal(result.name, "大觀路二段156巷 45號");
  assert.equal(result.address, "大觀路二段156巷 45號, 板橋區, 新北市, 臺灣");
});

test("numeric Photon locality metadata is omitted from the displayed address", () => {
  const result = normalizePhotonFeature({
    ...houseFeature,
    properties: { ...houseFeature.properties, locality: "015" },
  });

  assert.equal(result.address, "大觀路二段156巷 45號, 板橋區, 新北市, 臺灣");
});

test("compact Taiwan address retries with tokenized address when direct lookup is empty", async () => {
  const requestedQueries = [];
  const service = createPlaceSearchService({
    fetchImpl: async (url) => {
      requestedQueries.push(url.searchParams.get("q"));
      return {
        ok: true,
        json: async () => ({
          features: requestedQueries.length === 1
            ? []
            : [{ ...houseFeature, properties: { ...houseFeature.properties, name: "測試門牌" } }],
        }),
      };
    },
  });

  const results = await service.search("板橋大觀路二段156巷45號");

  assert.equal(results[0].name, "測試門牌");
  assert.deepEqual(requestedQueries, [
    "板橋大觀路二段156巷45號",
    "板橋 大觀路二段 156巷 45號",
  ]);
});

test("normalization rejects features without finite point coordinates", () => {
  assert.equal(normalizePhotonFeature({ ...feature, geometry: undefined }), null);
  assert.equal(normalizePhotonFeature({ ...feature, geometry: { coordinates: [NaN, 25] } }), null);
});

test("search passes AbortSignal and filters invalid features", async () => {
  const controller = new AbortController();
  let capturedOptions;
  const service = createPlaceSearchService({
    fetchImpl: async (_url, options) => {
      capturedOptions = options;
      return { ok: true, json: async () => ({ features: [feature, { type: "Feature" }] }) };
    },
  });

  const results = await service.search("台北 101", { signal: controller.signal });
  assert.equal(capturedOptions.signal, controller.signal);
  assert.equal(results.length, 1);
  assert.equal(results[0].id, "W.293782783");
});

test("empty collections return an empty result and failed requests stay typed", async () => {
  const emptyService = createPlaceSearchService({
    fetchImpl: async () => ({ ok: true, json: async () => ({ features: [] }) }),
  });
  assert.deepEqual(await emptyService.search("nothing"), []);

  const failedService = createPlaceSearchService({
    fetchImpl: async () => ({ ok: false, status: 429 }),
  });
  await assert.rejects(
    () => failedService.search("台北"),
    (error) => error instanceof PlaceSearchError && error.code === "request-failed",
  );
});
