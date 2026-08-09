function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export default function SearchResults({
  results,
  activeIndex,
  selectedPlace,
  onSelect,
}) {
  return (
    <div id="map-search-results" className="search-results" role="listbox" aria-label="搜尋結果">
      {results.map((result, index) => {
        const selected = selectedPlace?.id === result.id;
        const active = activeIndex === index;
        return (
          <button
            id={`map-result-${index}`}
            className="result-row"
            type="button"
            role="option"
            aria-selected={selected}
            data-active={active || undefined}
            key={result.id}
            onClick={() => onSelect(result)}
          >
            <LocationIcon />
            <span className="result-copy">
              <strong>{result.name}</strong>
              {result.kind && <span>{result.kind}</span>}
              {result.address && <small>{result.address}</small>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
