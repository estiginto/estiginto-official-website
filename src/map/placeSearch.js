const SEARCH_LIMIT = "8";
const PHOTON_ATTRIBUTION = "© OpenStreetMap contributors · Photon";

export class PlaceSearchError extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.name = "PlaceSearchError";
    this.code = code;
  }
}

export function buildPlaceSearchUrl({ query, proximity, language = "default" }) {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", String(query ?? "").trim());
  url.searchParams.set("limit", SEARCH_LIMIT);
  url.searchParams.set("lang", language);

  if (
    Array.isArray(proximity)
    && proximity.length === 2
    && proximity.every(Number.isFinite)
  ) {
    url.searchParams.set("lon", String(proximity[0]));
    url.searchParams.set("lat", String(proximity[1]));
    url.searchParams.set("zoom", "12");
    url.searchParams.set("location_bias_scale", "0.4");
  }

  return url;
}

function compact(values) {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}

function normalizeBbox(extent) {
  if (!Array.isArray(extent) || extent.length !== 4 || !extent.every(Number.isFinite)) {
    return null;
  }
  return [
    Math.min(extent[0], extent[2]),
    Math.min(extent[1], extent[3]),
    Math.max(extent[0], extent[2]),
    Math.max(extent[1], extent[3]),
  ];
}

function searchCandidates(query) {
  const original = String(query ?? "").trim();
  if (!original) return [];

  let tokenized = original.replace(/\s+/g, "");
  tokenized = tokenized.replace(
    /^([\u3400-\u9fff]{2,4}?)([\u3400-\u9fff]{2,}(?:路|街|大道).*)$/u,
    "$1 $2",
  );
  tokenized = tokenized
    .replace(/([縣市區鄉鎮村里])(?=\S)/gu, "$1 ")
    .replace(/(\d+(?:之\d+)?(?:巷|弄|號|樓))/gu, " $1")
    .replace(/\s+/g, " ")
    .trim();

  return tokenized === original ? [original] : [original, tokenized];
}

export function normalizePhotonFeature(feature) {
  const coordinates = feature?.geometry?.coordinates;
  if (
    feature?.geometry?.type !== "Point"
    || !Array.isArray(coordinates)
    || coordinates.length < 2
    || !Number.isFinite(coordinates[0])
    || !Number.isFinite(coordinates[1])
  ) {
    return null;
  }

  const properties = feature.properties ?? {};
  const streetAddress = compact([
    properties.street,
    properties.housenumber,
  ]).join(" ");
  const name = String(
    (properties.name ?? streetAddress) || properties.city || properties.country || "未命名地點",
  ).trim();
  const locality = String(properties.locality ?? "").trim();
  const addressParts = compact([
    streetAddress,
    properties.district,
    /^\d+$/.test(locality) ? null : locality,
    properties.city,
    properties.county,
    properties.state,
    properties.country,
  ]);
  const address = addressParts.join(", ");
  const identity = properties.osm_type && properties.osm_id
    ? `${properties.osm_type}.${properties.osm_id}`
    : `${coordinates[0]},${coordinates[1]}`;

  return {
    id: String(identity),
    name,
    fullName: compact([name, ...addressParts]).join(", "),
    address,
    kind: String(properties.type ?? properties.osm_value ?? properties.osm_key ?? "地點"),
    coordinates: [coordinates[0], coordinates[1]],
    bbox: normalizeBbox(properties.extent),
    osmType: ["N", "W", "R"].includes(properties.osm_type) ? properties.osm_type : null,
    osmId: properties.osm_id == null ? null : String(properties.osm_id),
    osmKey: properties.osm_key == null ? null : String(properties.osm_key),
    street: properties.street == null ? "" : String(properties.street).trim(),
    attribution: PHOTON_ATTRIBUTION,
  };
}

export function createPlaceSearchService({ fetchImpl = fetch } = {}) {
  return {
    async search(query, { proximity, language = "default", signal } = {}) {
      if (!String(query ?? "").trim()) return [];

      for (const candidate of searchCandidates(query)) {
        let response;
        try {
          response = await fetchImpl(
            buildPlaceSearchUrl({ query: candidate, proximity, language }),
            { signal, headers: { Accept: "application/json" } },
          );
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
            `Photon search request failed (${response.status ?? "unknown"}).`,
          );
        }

        try {
          const payload = await response.json();
          const features = Array.isArray(payload.features) ? payload.features : [];
          const results = features.map(normalizePhotonFeature).filter(Boolean);
          if (results.length) return results;
        } catch (error) {
          throw new PlaceSearchError(
            "request-failed",
            "搜尋服務回傳了無法讀取的資料。",
            { cause: error },
          );
        }
      }

      return [];
    },
  };
}
