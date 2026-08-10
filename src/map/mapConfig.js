export const TAIWAN_CAMERA = Object.freeze({
  center: [120.96, 23.7],
  zoom: 7,
  pitch: 0,
  bearing: 0,
});

export const TARGET_GEOMETRY_SOURCE_ID = "estiginto-target-geometry";

export const mapStyleUrl = () => "https://tiles.openfreemap.org/styles/dark";

export function cameraForMode(mode, camera, selectedPlace) {
  const selectedCenter = selectedPlace?.coordinates;
  const center = Array.isArray(selectedCenter) ? [...selectedCenter] : [...camera.center];
  const zoom = selectedPlace ? Math.max(camera.zoom, 15.5) : camera.zoom;

  if (mode === "3d") {
    return { center, zoom: Math.max(zoom, 15), pitch: 58, bearing: -18 };
  }

  return { center, zoom, pitch: 0, bearing: 0 };
}

export function findVectorSourceId(style) {
  const sources = style?.sources ?? {};
  return Object.entries(sources).find(([, source]) => source?.type === "vector")?.[0] ?? null;
}

export function buildingLayer(sourceId) {
  return {
    id: "estiginto-3d-buildings",
    type: "fill-extrusion",
    source: sourceId,
    "source-layer": "building",
    minzoom: 14,
    paint: {
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        ["zoom"],
        14,
        "#12323d",
        17,
        "#2b7180",
      ],
      "fill-extrusion-height": [
        "coalesce",
        ["get", "render_height"],
        ["get", "height"],
        8,
      ],
      "fill-extrusion-base": [
        "coalesce",
        ["get", "render_min_height"],
        ["get", "min_height"],
        0,
      ],
      "fill-extrusion-opacity": 0.78,
    },
  };
}

export function targetGeometryLayers() {
  const polygonFilter = ["==", ["geometry-type"], "Polygon"];
  const lineFilter = ["==", ["geometry-type"], "LineString"];

  return [
    {
      id: "estiginto-target-area-fill",
      type: "fill",
      source: TARGET_GEOMETRY_SOURCE_ID,
      filter: polygonFilter,
      paint: {
        "fill-color": "#0c9ab1",
        "fill-opacity": 0.2,
      },
    },
    {
      id: "estiginto-target-area-glow",
      type: "line",
      source: TARGET_GEOMETRY_SOURCE_ID,
      filter: polygonFilter,
      paint: {
        "line-color": "#4ce8ff",
        "line-width": 8,
        "line-blur": 6,
        "line-opacity": 0.42,
      },
    },
    {
      id: "estiginto-target-area-core",
      type: "line",
      source: TARGET_GEOMETRY_SOURCE_ID,
      filter: polygonFilter,
      paint: {
        "line-color": "#baf8ff",
        "line-width": 2,
        "line-opacity": 0.95,
      },
    },
    {
      id: "estiginto-target-road-glow",
      type: "line",
      source: TARGET_GEOMETRY_SOURCE_ID,
      filter: lineFilter,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#4ce8ff",
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 8, 17, 20],
        "line-blur": 7,
        "line-opacity": 0.48,
      },
    },
    {
      id: "estiginto-target-road-core",
      type: "line",
      source: TARGET_GEOMETRY_SOURCE_ID,
      filter: lineFilter,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#baf8ff",
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 2, 17, 5],
        "line-opacity": 0.98,
      },
    },
  ];
}

export function geometryBounds(feature) {
  const geometry = feature?.geometry;
  if (!geometry || ["Point", "MultiPoint"].includes(geometry.type)) return null;

  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;

  const visit = (coordinates) => {
    if (!Array.isArray(coordinates)) return;
    if (coordinates.length >= 2 && coordinates.every((value) => typeof value === "number")) {
      const [longitude, latitude] = coordinates;
      if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
        west = Math.min(west, longitude);
        south = Math.min(south, latitude);
        east = Math.max(east, longitude);
        north = Math.max(north, latitude);
      }
      return;
    }
    coordinates.forEach(visit);
  };

  visit(geometry.coordinates);
  return Number.isFinite(west) ? [west, south, east, north] : null;
}

export function targetFeatureCollection(feature) {
  return {
    type: "FeatureCollection",
    features: feature ? [feature] : [],
  };
}

export function geometryCameraOptions(feature, { width, reducedMotion }) {
  const bounds = geometryBounds(feature);
  if (!bounds) return null;
  const [west, south, east, north] = bounds;
  const mobile = width <= 760;

  return {
    bounds: [[west, south], [east, north]],
    options: {
      padding: mobile
        ? { top: 190, right: 24, bottom: 350, left: 24 }
        : { top: 150, right: 260, bottom: 110, left: 260 },
      duration: reducedMotion ? 0 : 900,
      maxZoom: 17,
    },
  };
}
