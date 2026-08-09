function MapLayersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m4 8 8-4 8 4-8 4-8-4Z" />
      <path d="m4 12 8 4 8-4M4 16l8 4 8-4" />
    </svg>
  );
}

function BuildingsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 20V9l7-4v15M11 20V3l9 4v13M7 12h1M7 16h1M14 8h2M14 12h2M14 16h2M2 20h20" />
    </svg>
  );
}

function formatCoordinate(value) {
  return Number.isFinite(value) ? value.toFixed(5) : "—";
}

export default function HudChrome({
  mode,
  onModeChange,
  camera,
  mapStatus,
  threeDUnavailable,
}) {
  const systemText = mapStatus === "loading"
    ? "SYSTEM STARTING"
    : threeDUnavailable
      ? "2D ONLINE · 3D LIMITED"
      : "SYSTEM ONLINE · TW";

  return (
    <>
      <header className="hud-top hud-interactive angular-frame">
        <div className="hud-brand">
          <strong>ESTIGINTO</strong>
          <span>// GEO INTELLIGENCE</span>
        </div>
        <div className="mode-switch" aria-label="地圖顯示模式">
          <button
            type="button"
            aria-pressed={mode === "2d"}
            onClick={() => onModeChange("2d")}
          >
            <MapLayersIcon />
            <span>2D 戰術</span>
          </button>
          <button
            type="button"
            aria-pressed={mode === "3d"}
            disabled={threeDUnavailable}
            onClick={() => onModeChange("3d")}
          >
            <BuildingsIcon />
            <span>3D 城市</span>
          </button>
        </div>
        <div className="system-status" data-status={threeDUnavailable ? "limited" : mapStatus}>
          <span>{systemText}</span>
          <i aria-hidden="true" />
        </div>
      </header>

      <footer className="hud-bottom hud-interactive angular-frame">
        <div><span>ZOOM</span><output>{camera.zoom.toFixed(1)}</output></div>
        <div>
          <span>CENTER</span>
          <output>
            {formatCoordinate(camera.center[1])}, {formatCoordinate(camera.center[0])}
          </output>
        </div>
        <div><span>MODE</span><output>{mode === "3d" ? "3D 城市" : "2D 戰術"}</output></div>
        <div className="provider-credit">
          <a href="https://openfreemap.org/" target="_blank" rel="noreferrer">
            OPENFREEMAP
          </a>
          <b>·</b>
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OPENSTREETMAP
          </a>
        </div>
      </footer>
    </>
  );
}
