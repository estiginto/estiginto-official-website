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

function escapeOverpassString(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function roadNameForPlace(place) {
  if (place?.osmKey === "highway") return String(place.name ?? place.street ?? "").trim();
  if (place?.osmType === "N" && place?.street) return String(place.street).trim();
  return "";
}

export function buildRoadGeometryUrl(place) {
  const [longitude, latitude] = place?.coordinates ?? [];
  const roadName = roadNameForPlace(place);
  const query = [
    "[out:json][timeout:15];",
    `way(around:1800,${latitude},${longitude})["highway"]["name"="${escapeOverpassString(roadName)}"];`,
    "out geom;",
  ].join("");
  const url = new URL("https://overpass-api.de/api/interpreter");
  url.searchParams.set("data", query);
  return url;
}

export function normalizeRoadGeometry(payload, roadName) {
  const lines = (Array.isArray(payload?.elements) ? payload.elements : [])
    .filter((element) => element?.type === "way" && Array.isArray(element.geometry))
    .map((element) => element.geometry
      .map((coordinate) => [coordinate?.lon, coordinate?.lat])
      .filter((coordinate) => coordinate.every(Number.isFinite)))
    .filter((coordinates) => coordinates.length >= 2);
  if (!lines.length) return null;

  return {
    type: "Feature",
    properties: { name: roadName, targetKind: "road" },
    geometry: lines.length === 1
      ? { type: "LineString", coordinates: lines[0] }
      : { type: "MultiLineString", coordinates: lines },
  };
}

export function createPlaceGeometryService({ fetchImpl = fetch } = {}) {
  const cache = new Map();

  return {
    async resolve(place, { signal } = {}) {
      const osmKey = `${place?.osmType ?? ""}${place?.osmId ?? ""}`;
      const roadName = roadNameForPlace(place);
      const cacheKey = roadName
        ? `road:${roadName}:${place?.coordinates?.join(",") ?? ""}`
        : osmKey;
      if (!roadName && !/^[NWR]\d+$/.test(osmKey)) return null;
      if (cache.has(cacheKey)) return cache.get(cacheKey);

      let response;
      try {
        response = await fetchImpl(
          roadName ? buildRoadGeometryUrl(place) : buildGeometryLookupUrl(place),
          {
          signal,
          headers: { Accept: "application/geo+json, application/json" },
          },
        );
      } catch (error) {
        if (error?.name === "AbortError") throw error;
        return null;
      }
      if (!response.ok) return null;

      try {
        const payload = await response.json();
        const feature = roadName
          ? normalizeRoadGeometry(payload, roadName)
          : normalizeGeometryFeature(payload?.features?.[0]);
        if (feature) cache.set(cacheKey, feature);
        return feature;
      } catch {
        return null;
      }
    },
  };
}
