# Map Geometry Highlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Highlight the real geometry of selected roads, buildings, and large places, add a north-reset compass, and simplify the mode labels to 2D/3D.

**Architecture:** Keep Photon as the search boundary and preserve OSM identifiers on normalized results. Resolve selected OSM objects through a focused geometry service with cancellation and caching, then render one replaceable GeoJSON source through MapLibre line/fill layers. Use MapLibre's compass-only NavigationControl so bearing resets independently from 3D pitch.

**Tech Stack:** React 19, MapLibre GL JS 5.24, Vite 7, Node test runner, Photon, OpenStreetMap/Nominatim GeoJSON.

## Global Constraints

- No paid map provider, API key, environment variable, directions, route planning, or geolocation.
- Geometry lookup only runs after explicit place selection and must cache successful results.
- Missing or invalid geometry falls back to the existing point marker without breaking search.
- Motion respects `prefers-reduced-motion`.
- Desktop and mobile controls must not overlap search, side panels, bottom sheet, or safe areas.

---

### Task 1: Preserve OSM identity and resolve selected geometry

**Files:**
- Modify: `src/map/placeSearch.js`
- Create: `src/map/placeGeometry.js`
- Modify: `tests/map-place-search.test.mjs`
- Create: `tests/map-place-geometry.test.mjs`

**Interfaces:**
- Produces: normalized places with `osmType: "N" | "W" | "R" | null` and `osmId: string | null`.
- Produces: `buildGeometryLookupUrl(place)` and `createPlaceGeometryService({ fetchImpl })`.
- `service.resolve(place, { signal })` returns a GeoJSON Feature or `null`.

- [ ] **Step 1: Write failing identity and geometry tests**

```js
assert.equal(normalizePhotonFeature(feature).osmType, "W");
assert.equal(normalizePhotonFeature(feature).osmId, "293782783");

const url = buildGeometryLookupUrl({ osmType: "W", osmId: "293782783" });
assert.equal(url.searchParams.get("osm_ids"), "W293782783");
assert.equal(url.searchParams.get("polygon_geojson"), "1");

const service = createPlaceGeometryService({
  fetchImpl: async () => ({ ok: true, json: async () => polygonPayload }),
});
assert.equal((await service.resolve(place)).geometry.type, "Polygon");
```

- [ ] **Step 2: Run the focused tests and verify missing exports/fields fail**

Run: `node --test tests/map-place-search.test.mjs tests/map-place-geometry.test.mjs`

Expected: FAIL because the normalized identity fields and geometry service do not exist.

- [ ] **Step 3: Implement normalized identity, validation, caching, and cancellation**

```js
export function buildGeometryLookupUrl(place) {
  const url = new URL("https://nominatim.openstreetmap.org/lookup");
  url.searchParams.set("osm_ids", `${place.osmType}${place.osmId}`);
  url.searchParams.set("format", "geojson");
  url.searchParams.set("polygon_geojson", "1");
  return url;
}

export function createPlaceGeometryService({ fetchImpl = fetch } = {}) {
  const cache = new Map();
  return {
    async resolve(place, { signal } = {}) {
      const key = `${place?.osmType ?? ""}${place?.osmId ?? ""}`;
      if (!/^[NWR]\d+$/.test(key)) return null;
      if (cache.has(key)) return cache.get(key);
      const response = await fetchImpl(buildGeometryLookupUrl(place), {
        signal,
        headers: { Accept: "application/geo+json, application/json" },
      });
      if (!response.ok) return null;
      const feature = normalizeGeometryFeature((await response.json())?.features?.[0]);
      if (feature) cache.set(key, feature);
      return feature;
    },
  };
}
```

Validation accepts Point, MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon only when every coordinate is finite. Empty features, HTTP failures, and unsupported geometries return `null`; AbortError is rethrown.

- [ ] **Step 4: Run the focused tests and verify they pass**

Run: `node --test tests/map-place-search.test.mjs tests/map-place-geometry.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the data boundary**

```powershell
git add -- src/map/placeSearch.js src/map/placeGeometry.js tests/map-place-search.test.mjs tests/map-place-geometry.test.mjs
git commit -m "feat: resolve selected place geometry"
```

### Task 2: Define geometry layers and bounds behavior

**Files:**
- Modify: `src/map/mapConfig.js`
- Modify: `tests/map-mode.test.mjs`

**Interfaces:**
- Produces: `TARGET_GEOMETRY_SOURCE_ID`.
- Produces: `targetGeometryLayers()` returning fill glow, fill outline, line glow, and line core layer specifications.
- Produces: `geometryBounds(feature)` returning `[west, south, east, north] | null`.

- [ ] **Step 1: Write failing layer and bounds tests**

```js
const layers = targetGeometryLayers();
assert.deepEqual(layers.map((layer) => layer.type), ["fill", "line", "line", "line"]);
assert.ok(layers.every((layer) => layer.source === TARGET_GEOMETRY_SOURCE_ID));
assert.deepEqual(geometryBounds(polygonFeature), [121.50, 25.00, 121.52, 25.02]);
assert.equal(geometryBounds(pointFeature), null);
```

- [ ] **Step 2: Run and verify missing layer helpers fail**

Run: `node --test tests/map-mode.test.mjs`

Expected: FAIL because the geometry layer exports do not exist.

- [ ] **Step 3: Implement deterministic MapLibre layer specs and recursive bounds**

The fill uses `rgba(12, 154, 177, 0.20)`. The outer line uses cyan at low opacity and a larger width; the core line uses `#baf8ff`. Every layer filters by `$type` so polygon and line styles do not leak into each other. `geometryBounds` recursively visits coordinate arrays and ignores Point geometry so existing fly-to remains authoritative for point-only results.

- [ ] **Step 4: Run the focused tests and verify they pass**

Run: `node --test tests/map-mode.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the geometry rendering contract**

```powershell
git add -- src/map/mapConfig.js tests/map-mode.test.mjs
git commit -m "feat: define target geometry layers"
```

### Task 3: Render selected geometry and keep it stable across modes

**Files:**
- Modify: `src/map/WorldMap.jsx`
- Modify: `src/map/MapExperience.jsx`
- Modify: `tests/map-page-contracts.test.mjs`

**Interfaces:**
- `MapExperience` owns geometry state: `idle | loading | ready | unavailable`.
- `WorldMap` consumes `selectedGeometry` and updates the existing GeoJSON source with `setData`.
- `WorldMap` reports geometry lookup status through the existing live status message.

- [ ] **Step 1: Write failing integration contract tests**

```js
assert.match(app, /createPlaceGeometryService/);
assert.match(app, /AbortController/);
assert.match(map, /TARGET_GEOMETRY_SOURCE_ID/);
assert.match(map, /setData/);
assert.match(map, /fitBounds/);
```

- [ ] **Step 2: Run and verify the integration contract fails**

Run: `node --test tests/map-page-contracts.test.mjs`

Expected: FAIL because geometry lookup and rendering are not wired.

- [ ] **Step 3: Implement selection-time lookup and stale-request protection**

Use one `useEffect` keyed by `selectedPlace?.id`. Abort the previous request during cleanup. Set geometry to null before resolving a different target. Catch non-abort failures and expose an unavailable state without changing the existing selected place.

- [ ] **Step 4: Add one GeoJSON source and layers after map load**

```js
map.addSource(TARGET_GEOMETRY_SOURCE_ID, {
  type: "geojson",
  data: { type: "FeatureCollection", features: [] },
});
for (const layer of targetGeometryLayers()) map.addLayer(layer, firstSymbol);
```

On geometry changes call `source.setData(featureCollection)`. When bounds are present, call `fitBounds` with desktop/mobile-safe padding and reduced-motion duration; otherwise retain the current point fly-to. Do not remove the geometry when mode changes.

- [ ] **Step 5: Run focused search, mode, and page tests**

Run: `node --test tests/map-place-geometry.test.mjs tests/map-mode.test.mjs tests/map-page-contracts.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the rendered geometry flow**

```powershell
git add -- src/map/WorldMap.jsx src/map/MapExperience.jsx tests/map-page-contracts.test.mjs
git commit -m "feat: highlight selected map geometry"
```

### Task 4: Add the HUD compass and simplify mode labels

**Files:**
- Modify: `src/map/WorldMap.jsx`
- Modify: `src/map/components/HudChrome.jsx`
- Modify: `src/map/map.css`
- Modify: `tests/map-page-contracts.test.mjs`

**Interfaces:**
- MapLibre `NavigationControl({ showZoom: false, showCompass: true, visualizePitch: false })` resets bearing while preserving pitch.
- The visible mode labels are exactly `2D` and `3D`.

- [ ] **Step 1: Write failing compass, label, and responsive contract tests**

```js
assert.match(map, /new maplibregl\.NavigationControl/);
assert.match(map, /showZoom:\s*false/);
assert.match(map, /visualizePitch:\s*false/);
assert.match(hud, />2D</);
assert.match(hud, />3D</);
assert.doesNotMatch(hud, />2D 戰術<|>3D 城市</);
assert.match(css, /\.maplibregl-ctrl-top-right/);
```

- [ ] **Step 2: Run and verify the UI contract fails**

Run: `node --test tests/map-page-contracts.test.mjs`

Expected: FAIL because the compass and simplified labels are absent.

- [ ] **Step 3: Add the compass-only control and HUD styling**

Add the control at `top-right`, set its localized `aria-label` and title to `將地圖轉回正北`, and remove it through `map.remove()` cleanup. Style the group as a 48px circular cyan HUD ring with a visible `:focus-visible` state.

Desktop uses `top: 92px; right: 250px`. Mobile uses `top: 178px; right: 12px`, and positions above the open bottom sheet. Short mobile viewports use `top: 158px`.

- [ ] **Step 4: Run the page contract test and full check**

Run: `node --test tests/map-page-contracts.test.mjs`

Run: `npm.cmd run check`

Expected: all tests pass, Vite build exits 0, and distribution verification succeeds.

- [ ] **Step 5: Commit the compass and labels**

```powershell
git add -- src/map/WorldMap.jsx src/map/components/HudChrome.jsx src/map/map.css tests/map-page-contracts.test.mjs
git commit -m "feat: add map compass control"
```

### Task 5: Browser QA and production deployment

**Files:**
- No committed test artifact files.

**Interfaces:**
- Local: `http://127.0.0.1:4302/map.html`
- Production: `https://estiginto.com/map.html`

- [ ] **Step 1: Validate the desktop flow in Browser**

Flow: load map -> rotate map -> click `將地圖轉回正北` -> bearing reads 0 -> search/select a road or area -> geometry is visibly highlighted -> switch 2D/3D -> geometry remains.

- [ ] **Step 2: Validate mobile layout in Browser**

Use a mobile viewport and verify the 48px compass does not overlap the search box or bottom sheet. Confirm search, target selection, geometry highlight, and compass click remain operable.

- [ ] **Step 3: Run final repository verification**

Run: `npm.cmd run check`

Run: `git diff --check`

Expected: 0 failures and no whitespace errors.

- [ ] **Step 4: Push and verify production**

```powershell
git push origin master
```

Poll `https://estiginto.com/map.html` until the deployed bundle changes, then repeat page identity, DOM, console, compass, mode, and screenshot checks on production.
