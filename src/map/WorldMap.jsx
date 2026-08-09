import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import {
  TAIWAN_CAMERA,
  buildingLayer,
  cameraForMode,
  findVectorSourceId,
  mapStyleUrl,
} from "./mapConfig.js";

const BUILDING_LAYER_ID = "estiginto-3d-buildings";

function readCamera(map) {
  const center = map.getCenter();
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    pitch: map.getPitch(),
    bearing: map.getBearing(),
  };
}

function createTargetElement() {
  const element = document.createElement("div");
  element.className = "target-anchor";
  element.setAttribute("aria-hidden", "true");
  const core = document.createElement("span");
  core.className = "target-anchor-core";
  element.append(core);
  return element;
}

export default function WorldMap({
  mode,
  selectedPlace,
  reducedMotion,
  onCameraChange,
  onFocusSettled,
  onStatusChange,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const loadedRef = useRef(false);
  const usableRef = useRef(false);
  const threeDReadyRef = useRef(false);
  const focusListenerRef = useRef(null);
  const callbacksRef = useRef({ onCameraChange, onFocusSettled, onStatusChange });
  const modeRef = useRef(mode);
  const selectedPlaceRef = useRef(selectedPlace);
  const reducedMotionRef = useRef(reducedMotion);
  callbacksRef.current = { onCameraChange, onFocusSettled, onStatusChange };
  modeRef.current = mode;
  selectedPlaceRef.current = selectedPlace;
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    if (!containerRef.current) return undefined;

    callbacksRef.current.onStatusChange?.("loading");
    let map;

    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: mapStyleUrl(),
        ...TAIWAN_CAMERA,
        antialias: true,
        attributionControl: true,
        maxPitch: 70,
      });
      mapRef.current = map;
    } catch (error) {
      callbacksRef.current.onStatusChange?.("unsupported", { error });
      return undefined;
    }

    const reportCamera = () => {
      callbacksRef.current.onCameraChange?.(readCamera(map));
    };

    const handleError = (event) => {
      callbacksRef.current.onStatusChange?.("map-error", {
        error: event.error,
        usable: usableRef.current,
      });
    };

    map.on("moveend", reportCamera);
    map.on("error", handleError);
    map.on("load", () => {
      loadedRef.current = true;
      usableRef.current = true;
      reportCamera();

      try {
        const sourceId = findVectorSourceId(map.getStyle());
        if (!sourceId) throw new Error("Map style has no vector source for buildings.");
        const firstSymbol = map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id;
        if (!map.getLayer(BUILDING_LAYER_ID)) {
          map.addLayer(buildingLayer(sourceId), firstSymbol);
        }
        map.setLayoutProperty(BUILDING_LAYER_ID, "visibility", "none");
        threeDReadyRef.current = true;
        callbacksRef.current.onStatusChange?.("ready");
        if (modeRef.current === "3d") {
          map.setLayoutProperty(BUILDING_LAYER_ID, "visibility", "visible");
          map.easeTo({
            ...cameraForMode("3d", readCamera(map), selectedPlaceRef.current),
            duration: reducedMotionRef.current ? 0 : 700,
            essential: false,
          });
        }
      } catch (error) {
        threeDReadyRef.current = false;
        callbacksRef.current.onStatusChange?.("three-d-unavailable", { error, usable: true });
      }
    });

    return () => {
      if (focusListenerRef.current) {
        map.off("moveend", focusListenerRef.current);
        focusListenerRef.current = null;
      }
      markerRef.current?.remove();
      markerRef.current = null;
      map.off("moveend", reportCamera);
      map.off("error", handleError);
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
      usableRef.current = false;
      threeDReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;

    if (mode === "3d" && threeDReadyRef.current) {
      map.setLayoutProperty(BUILDING_LAYER_ID, "visibility", "visible");
    } else {
      if (map.getLayer(BUILDING_LAYER_ID)) {
        map.setLayoutProperty(BUILDING_LAYER_ID, "visibility", "none");
      }
    }

    const camera = cameraForMode(mode, readCamera(map), selectedPlaceRef.current);
    map.easeTo({ ...camera, duration: reducedMotion ? 0 : 700, essential: false });
  }, [mode, reducedMotion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return undefined;

    if (!selectedPlace) {
      markerRef.current?.remove();
      markerRef.current = null;
      if (focusListenerRef.current) {
        map.off("moveend", focusListenerRef.current);
        focusListenerRef.current = null;
      }
      return undefined;
    }

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({
        element: createTargetElement(),
        anchor: "center",
      });
    }
    markerRef.current.setLngLat(selectedPlace.coordinates).addTo(map);

    if (focusListenerRef.current) map.off("moveend", focusListenerRef.current);
    const focusedPlace = selectedPlace;
    const handleFocusSettled = () => {
      focusListenerRef.current = null;
      callbacksRef.current.onFocusSettled?.(focusedPlace);
    };
    focusListenerRef.current = handleFocusSettled;
    map.once("moveend", handleFocusSettled);

    const current = readCamera(map);
    const camera = cameraForMode(mode, current, selectedPlace);
    map.flyTo({
      ...camera,
      zoom: Math.max(camera.zoom, 15.5),
      duration: reducedMotion ? 0 : mode === "3d" ? 1400 : 900,
      essential: false,
    });

    return () => {
      if (focusListenerRef.current) {
        map.off("moveend", focusListenerRef.current);
        focusListenerRef.current = null;
      }
    };
  }, [mode, reducedMotion, selectedPlace]);

  return <div ref={containerRef} className="world-map" aria-label="可搜尋真實世界地點的互動地圖" />;
}
