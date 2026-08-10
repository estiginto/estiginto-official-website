const SUPPORTED_GEOMETRIES = new Set([
  "Point",
  "MultiPoint",
  "LineString",
  "MultiLineString",
  "Polygon",
  "MultiPolygon",
]);

function hasFiniteCoordinates(value) {
  if (!Array.isArray(value) || value.length === 0) return false;
  if (value.every((item) => typeof item === "number")) {
    return value.length >= 2 && value.every(Number.isFinite);
  }
  return value.every(hasFiniteCoordinates);
}

export function normalizeGeometryFeature(feature) {
  if (
    feature?.type !== "Feature"
    || !SUPPORTED_GEOMETRIES.has(feature?.geometry?.type)
    || !hasFiniteCoordinates(feature.geometry.coordinates)
  ) {
    return null;
  }
  return feature;
}

export function buildGeometryLookupUrl(place) {
  const url = new URL("https://nominatim.openstreetmap.org/lookup");
  url.searchParams.set("osm_ids", `${place?.osmType ?? ""}${place?.osmId ?? ""}`);
  url.searchParams.set("format", "geojson");
  url.searchParams.set("polygon_geojson", "1");
  return url;
}

export function createPlaceGeometryService({ fetchImpl = fetch } = {}) {
  const cache = new Map();

  return {
    async resolve(place, { signal } = {}) {
      const cacheKey = `${place?.osmType ?? ""}${place?.osmId ?? ""}`;
      if (!/^[NWR]\d+$/.test(cacheKey)) return null;
      if (cache.has(cacheKey)) return cache.get(cacheKey);

      let response;
      try {
        response = await fetchImpl(buildGeometryLookupUrl(place), {
          signal,
          headers: { Accept: "application/geo+json, application/json" },
        });
      } catch (error) {
        if (error?.name === "AbortError") throw error;
        return null;
      }
      if (!response.ok) return null;

      try {
        const payload = await response.json();
        const feature = normalizeGeometryFeature(payload?.features?.[0]);
        if (feature) cache.set(cacheKey, feature);
        return feature;
      } catch {
        return null;
      }
    },
  };
}
