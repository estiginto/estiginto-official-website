import { formatArea, formatDistance } from "../measurementGeometry.js";

function RadiusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="10" cy="12" r="6" />
      <path d="M10 12h9M16 9l3 3-3 3" />
    </svg>
  );
}

function DistanceIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="5" cy="17" r="2" />
      <circle cx="19" cy="7" r="2" />
      <path d="m7 16 10-8" />
    </svg>
  );
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "—";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return minutes < 60 ? `${minutes} 分鐘` : `${Math.floor(minutes / 60)} 小時 ${minutes % 60} 分鐘`;
}

function statusCopy(mode, circle, points, travelState) {
  if (mode === "radius" && !circle) return "點擊地圖放置範圍中心";
  if (mode === "radius") return "拖曳圓周把手可調整範圍";
  if (mode === "distance" && points.length === 0) return "點擊地圖放置 A 點";
  if (mode === "distance" && points.length === 1) return "再點擊地圖放置 B 點";
  if (travelState.status === "loading") return "正在計算道路行徑距離";
  if (travelState.status === "error") return travelState.message;
  if (points.length === 2) return "可拖曳 A、B 點重新測量";
  return "選擇一項測繪工具";
}

export default function MeasurementTools({
  mode,
  circle,
  points,
  straightDistance,
  travelState,
  onModeChange,
  onClear,
  onRetry,
}) {
  const hasMeasurement = Boolean(circle || points.length);
  const circumference = circle ? 2 * Math.PI * circle.radius : 0;
  const area = circle ? Math.PI * circle.radius ** 2 : 0;

  return (
    <section className="measurement-hud hud-interactive" aria-label="地圖測繪工具">
      <div className="measurement-tools angular-frame" role="toolbar" aria-label="選擇測繪方式">
        <button
          type="button"
          aria-pressed={mode === "radius"}
          onClick={() => onModeChange(mode === "radius" ? null : "radius")}
        >
          <RadiusIcon />
          <span>範圍</span>
        </button>
        <button
          type="button"
          aria-pressed={mode === "distance"}
          onClick={() => onModeChange(mode === "distance" ? null : "distance")}
        >
          <DistanceIcon />
          <span>距離</span>
        </button>
        <button type="button" disabled={!hasMeasurement} onClick={onClear}>
          <span>清除</span>
        </button>
      </div>

      {(mode || hasMeasurement) && (
        <div className="measurement-readout angular-frame" data-measurement-mode={mode ?? "idle"}>
          <header>
            <span>FIELD MEASURE</span>
            <strong>{mode === "radius" ? "圓形範圍" : mode === "distance" ? "兩點距離" : "測量結果"}</strong>
          </header>
          <p className="measurement-status" aria-live="polite">
            {statusCopy(mode, circle, points, travelState)}
          </p>

          {circle && (
            <dl>
              <div><dt>半徑</dt><dd>{formatDistance(circle.radius)}</dd></div>
              <div><dt>直徑</dt><dd>{formatDistance(circle.radius * 2)}</dd></div>
              <div><dt>圓周</dt><dd>{formatDistance(circumference)}</dd></div>
              <div><dt>面積</dt><dd>{formatArea(area)}</dd></div>
            </dl>
          )}

          {points.length === 2 && (
            <dl>
              <div><dt>直線最短距離</dt><dd>{formatDistance(straightDistance)}</dd></div>
              <div className="travel-emphasis">
                <dt>道路行徑距離</dt>
                <dd>{travelState.status === "ready" ? formatDistance(travelState.distance) : "—"}</dd>
              </div>
              <div><dt>預估時間</dt><dd>{travelState.status === "ready" ? formatDuration(travelState.duration) : "—"}</dd></div>
            </dl>
          )}

          {travelState.status === "error" && points.length === 2 && (
            <button className="measurement-retry" type="button" onClick={onRetry}>重試行徑距離</button>
          )}
        </div>
      )}
    </section>
  );
}
