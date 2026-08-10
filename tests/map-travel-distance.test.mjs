import assert from "node:assert/strict";
import test from "node:test";
import {
  buildTravelDistanceUrl,
  createTravelDistanceService,
} from "../src/map/travelDistance.js";

const points = [[121.5, 25], [121.52, 25.02]];
const validPayload = {
  code: "Ok",
  routes: [{
    distance: 3456.7,
    duration: 512.4,
    geometry: {
      type: "LineString",
      coordinates: [[121.5, 25], [121.51, 25.012], [121.52, 25.02]],
    },
  }],
  waypoints: [],
};

test("travel URL requests a full driving GeoJSON path without directions", () => {
  const url = buildTravelDistanceUrl(points);

  assert.equal(url.origin, "https://router.project-osrm.org");
  assert.equal(url.pathname, "/route/v1/driving/121.5,25;121.52,25.02");
  assert.equal(url.searchParams.get("overview"), "full");
  assert.equal(url.searchParams.get("geometries"), "geojson");
  assert.equal(url.searchParams.get("steps"), "false");
});

test("travel service returns validated geometry, distance, and duration", async () => {
  const service = createTravelDistanceService({
    fetchImpl: async () => ({ ok: true, json: async () => validPayload }),
  });

  assert.deepEqual(await service.resolve(points), {
    geometry: validPayload.routes[0].geometry,
    distance: 3456.7,
    duration: 512.4,
  });
});

test("travel service rejects failed and malformed responses", async () => {
  const unavailable = createTravelDistanceService({
    fetchImpl: async () => ({ ok: false, status: 503 }),
  });
  const malformed = createTravelDistanceService({
    fetchImpl: async () => ({ ok: true, json: async () => ({ code: "NoRoute", routes: [] }) }),
  });

  await assert.rejects(unavailable.resolve(points), /暫時無法取得行徑距離/);
  await assert.rejects(malformed.resolve(points), /找不到可行駛路徑/);
  await assert.rejects(unavailable.resolve([[121, 25]]), /需要兩個有效座標/);
});

test("travel service times out without hanging the map", async () => {
  const service = createTravelDistanceService({
    timeoutMs: 5,
    fetchImpl: async (_url, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    }),
  });

  await assert.rejects(service.resolve(points), /行徑查詢逾時/);
});

test("travel service preserves an external AbortError", async () => {
  const controller = new AbortController();
  const service = createTravelDistanceService({
    fetchImpl: async (_url, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    }),
  });
  const request = service.resolve(points, { signal: controller.signal });
  controller.abort(new DOMException("superseded", "AbortError"));

  await assert.rejects(request, (error) => error.name === "AbortError");
});
