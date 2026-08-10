import { useEffect, useMemo, useState } from "react";
import WorldMap from "./WorldMap.jsx";
import { TAIWAN_CAMERA } from "./mapConfig.js";
import { createPlaceGeometryService } from "./placeGeometry.js";
import usePlaceSearch from "./usePlaceSearch.js";
import useReducedMotion from "./useReducedMotion.js";
import HudChrome from "./components/HudChrome.jsx";
import SearchCommand from "./components/SearchCommand.jsx";
import SearchResults from "./components/SearchResults.jsx";
import SystemFailure from "./components/SystemFailure.jsx";
import TargetProfile from "./components/TargetProfile.jsx";

const placeGeometryService = createPlaceGeometryService();

function searchStatusMessage(searchState) {
  if (searchState.status === "searching") return "正在搜尋真實世界地點。";
  if (searchState.status === "success") return `找到 ${searchState.results.length} 個地點。`;
  if (searchState.status === "empty") return "找不到符合的地點。";
  if (searchState.status === "error") return searchState.errorMessage;
  return "";
}

export default function MapExperience() {
  const [mode, setMode] = useState("2d");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [focusStatus, setFocusStatus] = useState("idle");
  const [camera, setCamera] = useState(TAIWAN_CAMERA);
  const [mapStatus, setMapStatus] = useState("loading");
  const [mapNotice, setMapNotice] = useState("");
  const [mapInstanceKey, setMapInstanceKey] = useState(0);
  const [mobilePanel, setMobilePanel] = useState("closed");
  const [selectedGeometry, setSelectedGeometry] = useState(null);
  const [geometryStatus, setGeometryStatus] = useState("idle");
  const reducedMotion = useReducedMotion();
  const search = usePlaceSearch({ proximity: camera.center });
  const threeDUnavailable = mapStatus === "three-d-unavailable";
  const failureKind = mapStatus === "unsupported"
      ? "unsupported"
      : mapStatus === "map-error"
        ? "map-error"
        : null;

  const liveMessage = useMemo(() => {
    if (failureKind) return "地圖無法載入。";
    const searchMessage = searchStatusMessage(search.state);
    if (searchMessage) return searchMessage;
    if (focusStatus === "focusing") return `正在鎖定 ${selectedPlace?.name ?? "目標"}。`;
    if (focusStatus === "locked") return `已鎖定 ${selectedPlace?.name ?? "目標"}。`;
    if (mapStatus === "loading") return "正在載入地圖。";
    if (threeDUnavailable) return "2D 地圖可用，3D 模式暫時無法使用。";
    return mapNotice || "地圖已就緒。";
  }, [failureKind, focusStatus, mapNotice, mapStatus, search.state, selectedPlace, threeDUnavailable]);

  useEffect(() => {
    if (search.state.status === "success" && search.state.results.length && !selectedPlace) {
      setMobilePanel("results");
    }
  }, [search.state.results.length, search.state.status, selectedPlace]);

  useEffect(() => {
    if (!selectedPlace) {
      setSelectedGeometry(null);
      setGeometryStatus("idle");
      return undefined;
    }

    const controller = new AbortController();
    setSelectedGeometry(null);
    setGeometryStatus("loading");
    placeGeometryService.resolve(selectedPlace, { signal: controller.signal })
      .then((feature) => {
        if (controller.signal.aborted) return;
        const isRenderable = feature && !["Point", "MultiPoint"].includes(feature.geometry.type);
        setSelectedGeometry(isRenderable ? feature : null);
        setGeometryStatus(isRenderable ? "ready" : "unavailable");
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setSelectedGeometry(null);
        setGeometryStatus("unavailable");
      });

    return () => controller.abort();
  }, [selectedPlace]);

  const handleMapStatus = (status, detail = {}) => {
    if (status === "map-error" && detail.usable) {
      setMapNotice("部分圖磚暫時無法載入，地圖仍可操作。");
      return;
    }
    setMapStatus(status);
    if (status !== "map-error") setMapNotice("");
    if (status === "three-d-unavailable") setMode("2d");
  };

  const handleSelectResult = (result) => {
    search.selectResult(result);
    setSelectedPlace(result);
    setFocusStatus("focusing");
    setMobilePanel("target");
  };

  const handleSelectActive = () => {
    const result = search.selectActive();
    if (result) {
      setSelectedPlace(result);
      setFocusStatus("focusing");
      setMobilePanel("target");
    }
  };

  const handleFocusSettled = (place) => {
    if (place.id === selectedPlace?.id) setFocusStatus("locked");
  };

  const clearTarget = () => {
    setSelectedPlace(null);
    setFocusStatus("idle");
    setMobilePanel(search.state.results.length ? "results" : "closed");
  };

  const retryMap = () => {
    setMapStatus("loading");
    setMapNotice("");
    setMapInstanceKey((key) => key + 1);
  };

  const closeSearchResults = () => {
    search.closeResults();
    setMobilePanel("closed");
  };

  return (
    <main
      className="map-experience"
      data-map-mode={mode}
      data-map-status={mapStatus}
      data-search-status={search.state.status}
      data-focus-status={focusStatus}
      data-geometry-status={geometryStatus}
    >
      <div className="map-canvas">
        {failureKind ? (
          <SystemFailure kind={failureKind} onRetry={retryMap} />
        ) : (
          <WorldMap
            key={mapInstanceKey}
            mode={mode}
            selectedPlace={selectedPlace}
            selectedGeometry={selectedGeometry}
            reducedMotion={reducedMotion}
            onCameraChange={setCamera}
            onFocusSettled={handleFocusSettled}
            onStatusChange={handleMapStatus}
          />
        )}
      </div>

      <div className="hud-decoration map-vignette" aria-hidden="true" />
      <div className="hud-decoration scan-texture" aria-hidden="true" />
      <div className="hud-decoration scanning-line" aria-hidden="true" />

      <HudChrome
        mode={mode}
        onModeChange={setMode}
        camera={camera}
        mapStatus={mapStatus}
        threeDUnavailable={threeDUnavailable}
      />

      <div className="search-region hud-interactive">
        <SearchCommand
          state={search.state}
          onQueryChange={search.setQuery}
          onMoveActive={search.moveActive}
          onSelectActive={handleSelectActive}
          onCloseResults={closeSearchResults}
          onRetry={search.retry}
        />
      </div>

      <div
        className="map-panel-deck map-mobile-sheet hud-interactive"
        data-mobile-panel={mobilePanel}
      >
        <div className="mobile-sheet-handle" aria-hidden="true" />
        <div className="mobile-sheet-tabs" role="tablist" aria-label="地圖資料面板">
          <button
            type="button"
            role="tab"
            aria-selected={mobilePanel === "results"}
            onClick={() => setMobilePanel("results")}
          >搜尋結果</button>
          <button
            type="button"
            role="tab"
            aria-selected={mobilePanel === "target"}
            disabled={!selectedPlace}
            onClick={() => setMobilePanel("target")}
          >目標資料</button>
        </div>
        <button
          className="mobile-sheet-close icon-button"
          type="button"
          aria-label="關閉資料面板"
          onClick={() => setMobilePanel("closed")}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <aside className="results-panel angular-frame" aria-labelledby="search-results-heading">
          <div className="panel-heading" id="search-results-heading">
            <span>SEARCH RESULTS</span>
            <strong>搜尋結果</strong>
          </div>
          {search.state.status === "success" && search.state.results.length ? (
            <SearchResults
              results={search.state.results}
              activeIndex={search.state.activeIndex}
              selectedPlace={selectedPlace}
              onSelect={handleSelectResult}
            />
          ) : (
            <div className="panel-state">
              {search.state.status === "searching" && "正在搜尋…"}
              {search.state.status === "empty" && "沒有符合的地點"}
              {search.state.status === "error" && search.state.errorMessage}
              {search.state.status === "idle" && "輸入地名、地址或地標"}
            </div>
          )}
        </aside>

        <aside className="target-panel angular-frame" aria-labelledby="target-profile-heading">
          <div className="panel-heading" id="target-profile-heading">
            <span>TARGET PROFILE</span>
            <strong>目標資料</strong>
          </div>
          <TargetProfile place={selectedPlace} focusStatus={focusStatus} onClose={clearTarget} />
        </aside>
      </div>

      {mobilePanel === "closed" && (selectedPlace || search.state.results.length > 0) && (
        <button
          className="mobile-sheet-reopen hud-interactive"
          type="button"
          onClick={() => setMobilePanel(selectedPlace ? "target" : "results")}
        >開啟資料面板</button>
      )}

      <div className="hud-decoration target-reticle" aria-hidden="true">
        <span className="reticle-ring reticle-ring-outer" />
        <span className="reticle-ring reticle-ring-inner" />
        <span className="reticle-cross reticle-cross-x" />
        <span className="reticle-cross reticle-cross-y" />
        <i />
      </div>

      <p className="sr-only" aria-live="polite">{liveMessage}</p>
    </main>
  );
}
