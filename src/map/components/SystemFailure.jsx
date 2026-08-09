const failureCopy = {
  unsupported: {
    code: "WEBGL UNAVAILABLE",
    title: "此裝置無法顯示互動地圖",
    message: "請啟用瀏覽器硬體加速，或改用支援 WebGL 的裝置。",
  },
  "map-error": {
    code: "MAP SERVICE INTERRUPTED",
    title: "地圖暫時無法載入",
    message: "請檢查網路連線後再試一次。",
  },
};

export default function SystemFailure({ kind, onRetry }) {
  const copy = failureCopy[kind] ?? failureCopy["map-error"];
  return (
    <section className="system-failure angular-frame" role="alert">
      <span>{copy.code}</span>
      <h1>{copy.title}</h1>
      <p>{copy.message}</p>
      {kind === "map-error" && (
        <button type="button" onClick={onRetry}>重試載入</button>
      )}
    </section>
  );
}
