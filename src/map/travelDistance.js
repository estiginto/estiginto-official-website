const TRAVEL_ENDPOINT = "https://router.project-osrm.org";

function validPoints(points) {
  return Array.isArray(points)
    && points.length === 2
    && points.every((point) => (
      Array.isArray(point)
      && point.length >= 2
      && point.slice(0, 2).every(Number.isFinite)
    ));
}

export function buildTravelDistanceUrl(points) {
  if (!validPoints(points)) throw new Error("行徑距離需要兩個有效座標");
  const coordinates = points.map(([longitude, latitude]) => `${longitude},${latitude}`).join(";");
  const url = new URL(`/route/v1/driving/${coordinates}`, TRAVEL_ENDPOINT);
  url.searchParams.set("overview", "full");
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("steps", "false");
  return url;
}

function normalizeTravel(payload) {
  if (payload?.code === "NoRoute") throw new Error("找不到可行駛路徑");
  const route = payload?.code === "Ok" ? payload.routes?.[0] : null;
  const coordinates = route?.geometry?.coordinates;
  const validGeometry = route?.geometry?.type === "LineString"
    && Array.isArray(coordinates)
    && coordinates.length >= 2
    && coordinates.every((point) => (
      Array.isArray(point) && point.length >= 2 && point.slice(0, 2).every(Number.isFinite)
    ));
  if (!validGeometry || !Number.isFinite(route.distance) || !Number.isFinite(route.duration)) {
    throw new Error("暫時無法取得行徑距離");
  }
  return {
    geometry: route.geometry,
    distance: route.distance,
    duration: route.duration,
  };
}

export function createTravelDistanceService({ fetchImpl = fetch, timeoutMs = 12000 } = {}) {
  return {
    async resolve(points, { signal } = {}) {
      const url = buildTravelDistanceUrl(points);
      const controller = new AbortController();
      const forwardAbort = () => controller.abort(signal.reason ?? new DOMException("aborted", "AbortError"));
      signal?.addEventListener("abort", forwardAbort, { once: true });
      if (signal?.aborted) forwardAbort();
      const timer = setTimeout(
        () => controller.abort(new DOMException("timeout", "TimeoutError")),
        timeoutMs,
      );

      try {
        const response = await fetchImpl(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("暫時無法取得行徑距離");
        return normalizeTravel(await response.json());
      } catch (error) {
        if (signal?.aborted) throw signal.reason ?? error;
        if (controller.signal.aborted && controller.signal.reason?.name === "TimeoutError") {
          throw new Error("行徑查詢逾時");
        }
        throw error instanceof Error ? error : new Error("暫時無法取得行徑距離");
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", forwardAbort);
      }
    },
  };
}
