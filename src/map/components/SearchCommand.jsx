function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export default function SearchCommand({
  state,
  onQueryChange,
  onMoveActive,
  onSelectActive,
  onCloseResults,
  onRetry,
}) {
  const hasResults = state.status === "success" && state.results.length > 0;
  const statusText = state.status === "searching"
    ? "正在搜尋真實地點"
    : state.status === "empty"
      ? "找不到符合的地點"
      : state.status === "error"
        ? state.errorMessage
        : "";

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      onMoveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      onMoveActive(-1);
    } else if (event.key === "Enter" && state.activeIndex >= 0) {
      event.preventDefault();
      onSelectActive();
    } else if (event.key === "Escape") {
      onCloseResults();
    }
  };

  return (
    <div className="search-command">
      <label className="sr-only" htmlFor="map-place-search">搜尋真實世界地點</label>
      <SearchIcon />
      <input
        id="map-place-search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={hasResults}
        aria-controls="map-search-results"
        aria-activedescendant={
          state.activeIndex >= 0 ? "map-result-" + state.activeIndex : undefined
        }
        value={state.query}
        placeholder="搜尋地點、地址或地標"
        autoComplete="off"
        spellCheck="false"
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      {state.status === "searching" && <span className="search-spinner" aria-hidden="true" />}
      {state.query && state.status !== "searching" && (
        <button
          className="icon-button search-clear"
          type="button"
          aria-label="清除搜尋"
          onClick={() => onQueryChange("")}
        >
          <ClearIcon />
        </button>
      )}
      <div className="search-status" aria-live="polite">
        {statusText}
        {state.status === "error" && (
          <button type="button" onClick={onRetry}>重試</button>
        )}
      </div>
    </div>
  );
}
