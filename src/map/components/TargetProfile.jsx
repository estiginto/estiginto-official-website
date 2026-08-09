function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function formatCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return "—";
  return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
}

export default function TargetProfile({ place, focusStatus, onClose }) {
  if (!place) {
    return (
      <div className="target-standby">
        <span aria-hidden="true" className="standby-reticle" />
        <p>等待選取地點</p>
      </div>
    );
  }

  return (
    <div className="target-profile-content" data-focus-status={focusStatus}>
      <button className="icon-button target-close" type="button" onClick={onClose} aria-label="關閉目標資料">
        <CloseIcon />
      </button>
      <span className="target-state">{focusStatus === "locked" ? "TARGET LOCKED" : "ACQUIRING TARGET"}</span>
      <h2>{place.name}</h2>
      {place.kind ? <p>{place.kind}</p> : null}
      {place.address ? <address>{place.address}</address> : null}
      <dl>
        <div>
          <dt>座標（WGS84）</dt>
          <dd><output>{formatCoordinates(place.coordinates)}</output></dd>
        </div>
        <div>
          <dt>來源</dt>
          <dd><small>{place.attribution}</small></dd>
        </div>
      </dl>
    </div>
  );
}
