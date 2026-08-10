import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import {
  TAIWAN_CAMERA,
  TARGET_GEOMETRY_SOURCE_ID,
  buildingLayer,
  cameraForMode,
  findVectorSourceId,
  geometryCameraOptions,
  mapStyleUrl,
  targetFeatureCollection,
  targetGeometryLayers,
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
  selectedGeometry,
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
  const geometryReadyRef = useRef(false);
  const geometryPulseRef = useRef(0);
  const focusListenerRef = useRef(null);
  const callbacksRef = useRef({ onCameraChange, onFocusSettled, onStatusChange });
  const modeRef = useRef(mode);
  const selectedPlaceRef = useRef(selectedPlace);
  const selectedGeometryRef = useRef(selectedGeometry);
  const reducedMotionRef = useRef(reducedMotion);
  callbacksRef.current = { onCameraChange, onFocusSettled, onStatusChange };
  modeRef.current = mode;
  selectedPlaceRef.current = selectedPlace;
  selectedGeometryRef.current = selectedGeometry;
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
      map.addControl(new maplibregl.NavigationControl({
        showZoom: false,
        showCompass: true,
        visualizePitch: false,
      }), "top-right");
      const compassButton = containerRef.current.querySelector(".maplibregl-ctrl-compass");
      compassButton?.setAttribute("aria-label", "將地圖轉回正北");
      compassButton?.setAttribute("title", "將地圖轉回正北");
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
        if (!map.getSource(TARGET_GEOMETRY_SOURCE_ID)) {
          map.addSource(TARGET_GEOMETRY_SOURCE_ID, {
            type: "geojson",
            data: targetFeatureCollection(null),
          });
        }
        map.getSource(TARGET_GEOMETRY_SOURCE_ID)?.setData(
          targetFeatureCollection(selectedGeometryRef.current),
        );
        targetGeometryLayers().forEach((layer) => {
          if (!map.getLayer(layer.id)) map.addLayer(layer, firstSymbol);
        });
        geometryReadyRef.current = true;
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
      if (geometryPulseRef.current) cancelAnimationFrame(geometryPulseRef.current);
      markerRef.current = null;
      map.off("moveend", reportCamera);
      map.off("error", handleError);
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
      usableRef.current = false;
      threeDReadyRef.current = false;
      geometryReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current || !geometryReadyRef.current) return undefined;

    const source = map.getSource(TARGET_GEOMETRY_SOURCE_ID);
    source?.setData(targetFeatureCollection(selectedGeometry));
    if (geometryPulseRef.current) cancelAnimationFrame(geometryPulseRef.current);

    if (!selectedGeometry) return undefined;

    const camera = geometryCameraOptions(selectedGeometry, {
      width: containerRef.current?.clientWidth ?? window.innerWidth,
      reducedMotion,
    });
    if (camera) map.fitBounds(camera.bounds, camera.options);

    if (reducedMotion) return undefined;
    const pulseLayers = {
      "estiginto-target-area-glow": 0.42,
      "estiginto-target-area-core": 0.95,
      "estiginto-target-road-glow": 0.78,
      "estiginto-target-road-core": 1,
    };
    const restorePulse = () => {
      Object.entries(pulseLayers).forEach(([layerId, opacity]) => {
        if (map.getLayer(layerId)) map.setPaintProperty(layerId, "line-opacity", opacity);
      });
    };
    const startedAt = performance.now();
    const animatePulse = (now) => {
      if (!mapRef.current) return;
      const progress = Math.min((now - startedAt) / 900, 1);
      const pulse = 0.88 + Math.sin(progress * Math.PI) * 0.12;
      Object.entries(pulseLayers).forEach(([layerId, opacity]) => {
        if (map.getLayer(layerId)) map.setPaintProperty(layerId, "line-opacity", opacity * pulse);
      });
      if (progress < 1) geometryPulseRef.current = requestAnimationFrame(animatePulse);
      else {
        restorePulse();
        geometryPulseRef.current = 0;
      }
    };
    geometryPulseRef.current = requestAnimationFrame(animatePulse);

    return () => {
      if (geometryPulseRef.current) cancelAnimationFrame(geometryPulseRef.current);
      restorePulse();
      geometryPulseRef.current = 0;
    };
  }, [reducedMotion, selectedGeometry]);

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
