const SEARCH_TYPES = "address,road,place,locality,municipality,poi";
const SEARCH_LIMIT = "8";

export class PlaceSearchError extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.name = "PlaceSearchError";
    this.code = code;
  }
}

export function buildPlaceSearchUrl({
  query,
  apiKey,
  proximity,
  language = "zh",
}) {
  if (!apiKey) {
    throw new PlaceSearchError("missing-key", "MapTiler API key is missing.");
  }

  const normalizedQuery = String(query ?? "").trim();
  const url = new URL(
    "https://api.maptiler.com/geocoding/" + encodeURIComponent(normalizedQuery) + ".json",
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("types", SEARCH_TYPES);
  url.searchParams.set("limit", SEARCH_LIMIT);
  url.searchParams.set("autocomplete", "true");
  url.searchParams.set("fuzzyMatch", "true");
  url.searchParams.set("language", language);

  if (
    Array.isArray(proximity)
    && proximity.length === 2
    && proximity.every(Number.isFinite)
  ) {
    url.searchParams.set("proximity", proximity.join(","));
  }

  return url;
}

export function normalizeMapTilerFeature(feature, attribution = "© MapTiler") {
  const coordinates = feature?.center;
  if (
    !Array.isArray(coordinates)
    || coordinates.length < 2
    || !Number.isFinite(coordinates[0])
    || !Number.isFinite(coordinates[1])
  ) {
    return null;
  }

  const name = String(feature.text ?? feature.place_name ?? "未命名地點").trim();
  const fullName = String(feature.place_name ?? name).trim();
  const prefix = `${name}, `;
  const address = fullName.startsWith(prefix) ? fullName.slice(prefix.length) : fullName;
  const kind = feature.place_type_name?.[0]
    ?? feature.properties?.categories?.[0]
    ?? feature.place_type?.[0]
    ?? "地點";

  return {
    id: String(feature.id ?? `${coordinates[0]},${coordinates[1]}`),
    name,
    fullName,
    address,
    kind: String(kind),
    coordinates: [coordinates[0], coordinates[1]],
    bbox: Array.isArray(feature.bbox) && feature.bbox.length === 4
      ? [...feature.bbox]
      : null,
    attribution: String(attribution || "© MapTiler"),
  };
}

export function createPlaceSearchService({ apiKey, fetchImpl = fetch }) {
  return {
    async search(query, { proximity, language = "zh", signal } = {}) {
      if (!String(query ?? "").trim()) return [];

      const url = buildPlaceSearchUrl({ query, apiKey, proximity, language });
      let response;

      try {
        response = await fetchImpl(url, { signal });
      } catch (error) {
        if (error?.name === "AbortError") throw error;
        throw new PlaceSearchError(
          "request-failed",
          "搜尋服務暫時無法使用。",
          { cause: error },
        );
      }

      if (!response.ok) {
        throw new PlaceSearchError(
          "request-failed",
          `MapTiler search request failed (${response.status ?? "unknown"}).`,
        );
      }

      try {
        const payload = await response.json();
        const attribution = payload.attribution || "© MapTiler";
        const features = Array.isArray(payload.features) ? payload.features : [];
        return features
          .map((feature) => normalizeMapTilerFeature(feature, attribution))
          .filter(Boolean);
      } catch (error) {
        throw new PlaceSearchError(
          "request-failed",
          "搜尋服務回傳了無法讀取的資料。",
          { cause: error },
        );
      }
    },
  };
}

