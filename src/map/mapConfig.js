export const TAIWAN_CAMERA = Object.freeze({
  center: [120.96, 23.7],
  zoom: 7,
  pitch: 0,
  bearing: 0,
});

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
