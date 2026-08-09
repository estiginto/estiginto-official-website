# Cinematic Real-World Map HUD Implementation Plan

> **Keyless provider amendment (2026-08-09):** The delivered implementation uses OpenFreeMap for the vector basemap and Photon/OpenStreetMap for real-place search. It reads no environment variable or API key. The 3D mode uses real vector-building extrusion and cinematic camera motion without keyed terrain data. Provider-specific steps below remain as the original implementation record.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `/map.html` experience that searches real MapTiler places, renders them on an interactive MapLibre map, and preserves the selected target while switching between cinematic 2D and 3D HUD modes.

**Architecture:** Keep the feature isolated under `src/map/` with a dedicated Vite HTML entry. A small search adapter normalizes MapTiler GeoJSON into a stable local `PlaceResult` contract; a reducer-backed React layer owns query and selection state; `WorldMap` alone owns the MapLibre instance and translates React state into camera, terrain, building, and marker changes.

**Tech Stack:** React 19, Vite 7, MapLibre GL JS 5.x, MapTiler Maps and Search APIs, Node 20 built-in test runner, Browser/IAB visual QA.

## Global Constraints

- The approved design is `docs/superpowers/specs/2026-08-09-cinematic-map-hud-design.md`.
- The public URL is exactly `/map.html` and must be an independent Vite entry.
- Initial camera is centered on Taiwan; search is biased to the current view but remains global.
- 2D and 3D modes must preserve query, results, selected place, center, and an equivalent zoom.
- Do not add directions, route lines, navigation steps, geolocation permission, map uploads, accounts, persistence, or homepage navigation.
- HUD fields must come from real application state or MapTiler response data; no fake telemetry or random decorative data.
- Use a browser-restricted `VITE_MAPTILER_KEY`; never commit a live key.
- Keep MapTiler, OpenStreetMap, and MapLibre attribution visible.
- Respect `prefers-reduced-motion: reduce` in both CSS motion and MapLibre camera durations.
- Do not modify `src/App.jsx` or `src/App.css` for this isolated page.
- Do not begin product code until Task 1 concept images are approved.
- Preserve all unrelated user-owned files and worktree changes.

---

## File Structure

### New product files

- `map.html` — standalone document metadata and React mount point.
- `src/map/main.jsx` — map-page React bootstrap only.
- `src/map/MapExperience.jsx` — composition, selected place, mode, panel, and map status.
- `src/map/map.css` — full HUD design system, animation, responsive, and reduced-motion rules.
- `src/map/mapConfig.js` — URLs, Taiwan camera, 2D/3D camera presets, terrain/building style specifications.
- `src/map/WorldMap.jsx` — MapLibre lifecycle, camera synchronization, target marker, and degraded states.
- `src/map/placeSearch.js` — MapTiler URL construction, response normalization, and typed errors.
- `src/map/searchState.js` — deterministic search reducer and keyboard highlight helper.
- `src/map/usePlaceSearch.js` — debounce, AbortController, stale-response guard, and reducer wiring.
- `src/map/useReducedMotion.js` — reactive media-query hook.
- `src/map/components/HudChrome.jsx` — top and bottom system rails and mode switch.
- `src/map/components/SearchCommand.jsx` — accessible combobox input and status.
- `src/map/components/SearchResults.jsx` — listbox results and selection events.
- `src/map/components/TargetProfile.jsx` — real selected-place data only.
- `src/map/components/SystemFailure.jsx` — missing key, WebGL, map, and retry failures.
- `.env.example` — safe variable name with no credential.

### New design, test, and verification files

- `docs/design/map-hud/desktop-2d.png` — approved desktop 2D concept.
- `docs/design/map-hud/desktop-3d.png` — approved desktop 3D concept.
- `docs/design/map-hud/mobile.png` — approved mobile concept.
- `docs/design/map-hud/design-inventory.md` — exact copy, tokens, layout, icons, and allowed deviations.
- `tests/map-page-contracts.test.mjs` — standalone entry, accessibility, no-route, and bundle contracts.
- `tests/map-place-search.test.mjs` — MapTiler request and normalization tests.
- `tests/map-search-state.test.mjs` — reducer and keyboard-state tests.
- `tests/map-mode.test.mjs` — camera and 3D layer specification tests.
- `docs/superpowers/verification/2026-08-09-map-hud-fidelity.md` — final comparison ledger.

### Existing files to modify

- `package.json` and `package-lock.json` — add MapLibre GL JS.
- `vite.config.js:12-23` — add the `map.html` build entry.
- `scripts/verify-dist.mjs:5-16` — require `dist/map.html`.
- `.gitignore:1-5` — ignore local keys and visual-companion scratch files.

---

### Task 1: Produce and approve the production visual baseline

**Files:**
- Create: `docs/design/map-hud/desktop-2d.png`
- Create: `docs/design/map-hud/desktop-3d.png`
- Create: `docs/design/map-hud/mobile.png`
- Create: `docs/design/map-hud/design-inventory.md`

**Interfaces:**
- Consumes: approved layout and behavior from `docs/superpowers/specs/2026-08-09-cinematic-map-hud-design.md`.
- Produces: three accepted concept paths and an exact visual inventory used by every implementation task.

- [ ] **Step 1: Generate the desktop 2D concept**

Use the `imagegen` skill with this complete brief:

```text
Create a high-resolution 1440x900 production UI concept for an independent real-world map web app by ESTIGINTO. Show a full-viewport, readable dark MapTiler-style map centered on Taipei, in a restrained cinematic intelligence-command visual system: near-black cool navy, precise cyan hairlines, off-white labels, and very limited amber for the locked target. The real map must remain legible.

Required code-native interface: top rail with exact text "ESTIGINTO // GEO INTELLIGENCE", centered segmented control "2D 戰術" active and "3D 城市" inactive, right status "SYSTEM ONLINE · TW"; centered search command with exact placeholder "搜尋地點、地址或地標"; left search-results rail headed "SEARCH RESULTS / 搜尋結果" containing realistic examples for 台北 101; central target reticle locked to the map; right rail headed "TARGET PROFILE / 目標資料" showing only name, type, address, coordinates, and source; bottom rail with zoom, map-center coordinates, mode, and attribution.

No navigation route, route line, directions, geolocation button, fake weather, fake traffic, meaningless code, marketing hero copy, cards, pills, gradients that obscure the map, or copied movie imagery. Use fine angular frames, quiet scan texture, careful spacing, accessible type, and a clear primary search workflow. The screenshot must show the complete screen with no cropped controls and be practical to implement in React/CSS/MapLibre.
```

Save the accepted generated output as `docs/design/map-hud/desktop-2d.png`.

- [ ] **Step 2: Generate the matching desktop 3D concept**

Generate a fresh 1440x900 screen, not a crop of Step 1. Repeat the same information architecture and exact copy, but activate `3D 城市`, tilt the map about 58 degrees, show restrained terrain and cyan-tinted extruded buildings, preserve 台北 101 as the same selected target, and keep both side rails readable. Save it as `docs/design/map-hud/desktop-3d.png`.

- [ ] **Step 3: Generate the matching mobile concept**

Generate a fresh 390x844 screen using the same palette and copy. Keep search and the 2D/3D switch above the map, turn the desktop side rails into a bottom sheet with visible drag handle and tabs `搜尋結果` / `目標資料`, keep the selected target visible above the sheet, and retain map attribution. Save it as `docs/design/map-hud/mobile.png`.

- [ ] **Step 4: Inspect every concept at original detail**

Run `view_image` on all three files. Reject and regenerate any screen with invented copy, illegible map labels, cropped controls, a route line, mismatched panel anatomy, or UI text baked into the map image instead of represented as code-native chrome.

- [ ] **Step 5: Write the implementation inventory**

Create `docs/design/map-hud/design-inventory.md` with:

```markdown
# Map HUD Design Inventory

## Allowed first-viewport copy
- ESTIGINTO // GEO INTELLIGENCE
- 2D 戰術
- 3D 城市
- SYSTEM ONLINE · TW
- 搜尋地點、地址或地標
- SEARCH RESULTS / 搜尋結果
- TARGET PROFILE / 目標資料
- ZOOM
- MAPTILER · OPENSTREETMAP

## Color tokens
- --map-bg: #06111a
- --hud-surface: rgba(3, 15, 23, 0.88)
- --hud-cyan: #4ce8ff
- --hud-text: #edfcff
- --hud-muted: #6fa8b5
- --hud-amber: #ffb15c
- --hud-border: rgba(61, 216, 242, 0.35)

## Screen-specific layout
- Desktop 2D: 18 px outer gutters, 218 px rails, search width min(520 px, 48vw), 104 px reticle, 10–12 px HUD text, 20 px target title.
- Desktop 3D: same chrome geometry, pitch 58°, bearing -18°, building opacity 0.78, selected target framed at 56% viewport width.
- Mobile: 12 px outer gutters, 44 px minimum controls, sheet no taller than 46dvh, safe-area bottom padding, at least 42% of the map visible.

## Icon inventory
- Search: 1.5 px cyan outline magnifier.
- 2D: layered-map outline.
- 3D: isometric-building outline.
- Close: two-line 1.5 px cross.
- Retry: 1.5 px circular arrow.

## Media treatment
- Map is a live MapLibre surface, not a raster image.
- HUD chrome has no color overlay over map labels.
- Scan texture and vignette are pointer-transparent decorative layers.
```

If Image Gen drifts from these locked values, regenerate the image. Do not revise the inventory to legitimize an off-spec concept.

- [ ] **Step 6: Obtain explicit user approval**

Show all three concept files in the conversation and wait for approval. If the user requests changes, regenerate the affected state and update the inventory before continuing.

- [ ] **Step 7: Commit the approved visual baseline**

```bash
git add docs/design/map-hud
git commit -m "design: lock cinematic map HUD visuals"
```

---

### Task 2: Add the isolated map entry and build contract

**Files:**
- Create: `map.html`
- Create: `src/map/main.jsx`
- Create: `src/map/MapExperience.jsx`
- Create: `src/map/map.css`
- Create: `.env.example`
- Create: `tests/map-page-contracts.test.mjs`
- Modify: `package.json:7-18`
- Modify: `package-lock.json`
- Modify: `vite.config.js:12-23`
- Modify: `scripts/verify-dist.mjs:5-16`
- Modify: `.gitignore:1-5`

**Interfaces:**
- Consumes: approved design inventory from Task 1.
- Produces: `MapExperience()` React root, `/map.html` build entry, `VITE_MAPTILER_KEY` configuration contract.

- [ ] **Step 1: Write the failing entry contract**

Create `tests/map-page-contracts.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");

test("map page is an isolated Vite entry", () => {
  const html = read("map.html");
  const vite = read("vite.config.js");
  const verifier = read("scripts/verify-dist.mjs");

  assert.match(html, /<div id="map-root"><\/div>/);
  assert.match(html, /src="\/src\/map\/main\.jsx"/);
  assert.match(vite, /map:\s*htmlEntry\("\.\/map\.html"\)/);
  assert.match(verifier, /"map\.html"/);
});

test("map page has a unique title, description, canonical, and favicon", () => {
  const html = read("map.html");
  assert.match(html, /<title>[^<]*地圖[^<]*<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/estiginto\.com\/map\.html"/);
  assert.match(html, /<link rel="icon" href="\/img\/logo_estiginto\.png"/);
});

test("the existing marketing app does not absorb the map feature", () => {
  assert.doesNotMatch(read("src/App.jsx"), /MapExperience|maplibre-gl|VITE_MAPTILER_KEY/);
});
```

- [ ] **Step 2: Run the contract and verify failure**

Run: `node --test tests/map-page-contracts.test.mjs`

Expected: FAIL because `map.html` does not exist.

- [ ] **Step 3: Install the map renderer**

Run: `npm install maplibre-gl@^5.24.0`

Expected: `package.json` and `package-lock.json` include `maplibre-gl` under dependencies.

- [ ] **Step 4: Add safe local configuration rules**

Append to `.gitignore`:

```gitignore
.env.local
.env.*.local
.superpowers/
```

Create `.env.example`:

```dotenv
VITE_MAPTILER_KEY=
```

- [ ] **Step 5: Create the standalone document and bootstrap**

Create `map.html` with complete metadata, `<body class="map-page">`, `<div id="map-root"></div>`, and `<script type="module" src="/src/map/main.jsx"></script>`. Use title `電影式互動地圖｜ESTIGINTO`, canonical `https://estiginto.com/map.html`, and a description that promises real-world place search without mentioning navigation.

Create `src/map/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MapExperience from "./MapExperience.jsx";
import "./map.css";
import "maplibre-gl/dist/maplibre-gl.css";

createRoot(document.getElementById("map-root")).render(
  <StrictMode>
    <MapExperience />
  </StrictMode>,
);
```

Create the first valid `MapExperience.jsx` shell:

```jsx
export default function MapExperience() {
  return (
    <main className="map-experience" data-map-mode="2d">
      <div id="world-map" className="world-map" aria-label="可搜尋真實世界地點的互動地圖" />
    </main>
  );
}
```

Add only the full-viewport reset and approved background color from the design inventory to `map.css`. Do not invent visible placeholder text.

- [ ] **Step 6: Wire the production bundle**

Add `map: htmlEntry("./map.html")` to `vite.config.js` and `"map.html"` to `requiredFiles` in `scripts/verify-dist.mjs`.

- [ ] **Step 7: Run entry tests and build checks**

Run:

```bash
node --test tests/map-page-contracts.test.mjs
npm run build
npm run verify:dist
```

Expected: all commands PASS and `dist/map.html` exists.

- [ ] **Step 8: Commit**

```bash
git add .gitignore .env.example map.html package.json package-lock.json vite.config.js scripts/verify-dist.mjs src/map tests/map-page-contracts.test.mjs
git commit -m "feat: add standalone map experience entry"
```

---

### Task 3: Implement the MapTiler place-search adapter

**Files:**
- Create: `src/map/placeSearch.js`
- Create: `tests/map-place-search.test.mjs`

**Interfaces:**
- Produces: `buildPlaceSearchUrl({ query, apiKey, proximity, language }) -> URL`.
- Produces: `normalizeMapTilerFeature(feature, attribution) -> PlaceResult | null`.
- Produces: `createPlaceSearchService({ apiKey, fetchImpl }).search(query, options) -> Promise<PlaceResult[]>`.
- `PlaceResult` is `{ id, name, fullName, address, kind, coordinates, bbox, attribution }`.

- [ ] **Step 1: Write failing URL and normalization tests**

Create fixtures matching MapTiler’s documented `FeatureCollection` shape and assert:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  PlaceSearchError,
  buildPlaceSearchUrl,
  createPlaceSearchService,
  normalizeMapTilerFeature,
} from "../src/map/placeSearch.js";

const feature = {
  id: "poi.101",
  text: "台北 101",
  place_name: "台北 101, 信義區, 臺北市, 臺灣",
  place_type: ["poi"],
  place_type_name: ["地標"],
  center: [121.5645, 25.0339],
  bbox: [121.563, 25.032, 121.566, 25.036],
  properties: { categories: ["attraction"] },
};

test("search URL enables POIs and biases without restricting to Taiwan", () => {
  const url = buildPlaceSearchUrl({
    query: "台北 101",
    apiKey: "public-test-key",
    proximity: [121.56, 25.03],
    language: "zh",
  });

  assert.equal(url.pathname, "/geocoding/%E5%8F%B0%E5%8C%97%20101.json");
  assert.equal(url.searchParams.get("types"), "address,road,place,locality,municipality,poi");
  assert.equal(url.searchParams.get("proximity"), "121.56,25.03");
  assert.equal(url.searchParams.get("language"), "zh");
  assert.equal(url.searchParams.get("limit"), "8");
  assert.equal(url.searchParams.has("country"), false);
});

test("feature normalization returns the stable local contract", () => {
  assert.deepEqual(normalizeMapTilerFeature(feature, "© MapTiler"), {
    id: "poi.101",
    name: "台北 101",
    fullName: "台北 101, 信義區, 臺北市, 臺灣",
    address: "信義區, 臺北市, 臺灣",
    kind: "地標",
    coordinates: [121.5645, 25.0339],
    bbox: [121.563, 25.032, 121.566, 25.036],
    attribution: "© MapTiler",
  });
});
```

Also test missing coordinates return `null`, non-2xx responses throw `PlaceSearchError` with code `request-failed`, and an empty feature collection returns `[]`. Use a mock `fetchImpl` that captures its second argument and assert `options.signal` is exactly the `AbortController.signal` passed to `service.search(...)`.

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/map-place-search.test.mjs`

Expected: FAIL with module-not-found for `src/map/placeSearch.js`.

- [ ] **Step 3: Implement the search adapter**

Implement the documented interface. The URL must use:

```js
const SEARCH_TYPES = "address,road,place,locality,municipality,poi";
const SEARCH_LIMIT = "8";

export function buildPlaceSearchUrl({
  query,
  apiKey,
  proximity,
  language = "zh",
}) {
  if (!apiKey) throw new PlaceSearchError("missing-key", "MapTiler API key is missing.");
  const url = new URL(
    "https://api.maptiler.com/geocoding/" + encodeURIComponent(query.trim()) + ".json",
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("types", SEARCH_TYPES);
  url.searchParams.set("limit", SEARCH_LIMIT);
  url.searchParams.set("autocomplete", "true");
  url.searchParams.set("fuzzyMatch", "true");
  url.searchParams.set("language", language);
  if (proximity) url.searchParams.set("proximity", proximity.join(","));
  return url;
}
```

`normalizeMapTilerFeature` must validate finite longitude and latitude, prefer `place_type_name[0]` over `properties.categories[0]` over `place_type[0]`, and derive `address` by removing the first `name + ", "` prefix from `place_name`. Do not read experimental `feature_tags`.

`createPlaceSearchService` must pass the caller’s `AbortSignal` to `fetchImpl`, validate `response.ok`, read `payload.attribution`, normalize all features, and filter null entries.

- [ ] **Step 4: Run the focused and full test suites**

Run:

```bash
node --test tests/map-place-search.test.mjs
npm test
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/map/placeSearch.js tests/map-place-search.test.mjs
git commit -m "feat: add real-world place search adapter"
```

---

### Task 4: Add deterministic search state and accessible controls

**Files:**
- Create: `src/map/searchState.js`
- Create: `src/map/usePlaceSearch.js`
- Create: `src/map/components/SearchCommand.jsx`
- Create: `src/map/components/SearchResults.jsx`
- Create: `tests/map-search-state.test.mjs`
- Modify: `tests/map-page-contracts.test.mjs`

**Interfaces:**
- Produces: `createInitialSearchState()` and `searchReducer(state, action)`.
- Produces: `moveHighlight(current, direction, resultCount) -> number`.
- Produces: `createRequestGate() -> { next(): number, isCurrent(id): boolean }`.
- Produces: `usePlaceSearch({ apiKey, proximity, debounceMs = 300 })` returning `{ state, setQuery, moveActive, selectActive, selectResult, closeResults, retry }`.
- `SearchCommand` consumes the hook values and exposes a combobox.
- `SearchResults` consumes `results, activeIndex, selectedPlace, onSelect`.

- [ ] **Step 1: Write failing reducer tests**

Test these exact transitions:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialSearchState,
  createRequestGate,
  moveHighlight,
  searchReducer,
} from "../src/map/searchState.js";

test("query change resets stale results before a new search", () => {
  const state = {
    ...createInitialSearchState(),
    query: "台北",
    status: "success",
    results: [{ id: "old" }],
    activeIndex: 0,
  };
  const next = searchReducer(state, { type: "queryChanged", query: "高雄" });
  assert.equal(next.query, "高雄");
  assert.equal(next.status, "idle");
  assert.deepEqual(next.results, []);
  assert.equal(next.activeIndex, -1);
});

test("empty and error states retain the current query", () => {
  const searching = { ...createInitialSearchState(), query: "不存在地點", status: "searching" };
  assert.equal(searchReducer(searching, { type: "searchEmpty" }).status, "empty");
  assert.equal(
    searchReducer(searching, { type: "searchFailed", message: "搜尋服務暫時無法使用" }).query,
    "不存在地點",
  );
});

test("highlight movement wraps and tolerates no results", () => {
  assert.equal(moveHighlight(-1, 1, 4), 0);
  assert.equal(moveHighlight(3, 1, 4), 0);
  assert.equal(moveHighlight(0, -1, 4), 3);
  assert.equal(moveHighlight(-1, 1, 0), -1);
});

test("request gate rejects every superseded response", () => {
  const gate = createRequestGate();
  const first = gate.next();
  const second = gate.next();
  assert.equal(gate.isCurrent(first), false);
  assert.equal(gate.isCurrent(second), true);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/map-search-state.test.mjs`

Expected: FAIL with module-not-found for `src/map/searchState.js`.

- [ ] **Step 3: Implement reducer and hook**

The reducer statuses are exactly `idle | searching | success | empty | error`. Actions are exactly `queryChanged`, `searchStarted`, `searchSucceeded`, `searchEmpty`, `searchFailed`, `highlightMoved`, `resultSelected`, and `resultsClosed`.

In `usePlaceSearch.js`:

- Do not search queries shorter than two trimmed characters.
- Start one 300 ms timer per query.
- Abort the previous controller before every new request.
- Keep one `createRequestGate()` instance in a ref; call `next()` for every search and ignore responses whose ID is not current even if a test double ignores abort.
- Use current map-center proximity without adding `country=tw`.
- Treat `AbortError` as silent cancellation.
- Convert other failures to `搜尋服務暫時無法使用，請稍後重試。`.
- Clear timer and abort controller on unmount.

- [ ] **Step 4: Implement accessible search controls**

`SearchCommand.jsx` input must include:

```jsx
<input
  role="combobox"
  aria-autocomplete="list"
  aria-expanded={state.status === "success" && state.results.length > 0}
  aria-controls="map-search-results"
  aria-activedescendant={
    state.activeIndex >= 0 ? "map-result-" + state.activeIndex : undefined
  }
  value={state.query}
  placeholder="搜尋地點、地址或地標"
/>
```

Handle ArrowDown, ArrowUp, Enter, and Escape without blocking ordinary text editing. `SearchResults.jsx` must render `role="listbox"` and each result as a real `button role="option"` with `aria-selected`. Display name, kind, and address only when each value exists.

- [ ] **Step 5: Extend static accessibility contracts**

In `tests/map-page-contracts.test.mjs`, assert the component source contains `role="combobox"`, `aria-activedescendant`, `role="listbox"`, and `aria-selected`.

- [ ] **Step 6: Run tests and build**

Run:

```bash
node --test tests/map-search-state.test.mjs tests/map-page-contracts.test.mjs
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/map/searchState.js src/map/usePlaceSearch.js src/map/components/SearchCommand.jsx src/map/components/SearchResults.jsx tests/map-search-state.test.mjs tests/map-page-contracts.test.mjs
git commit -m "feat: add accessible place search workflow"
```

---

### Task 5: Build the MapLibre 2D and 3D engine

**Files:**
- Create: `src/map/mapConfig.js`
- Create: `src/map/WorldMap.jsx`
- Create: `tests/map-mode.test.mjs`

**Interfaces:**
- Produces: `TAIWAN_CAMERA`, `mapStyleUrl(apiKey)`, and `terrainSourceUrl(apiKey)`.
- Produces: `cameraForMode(mode, camera, selectedPlace) -> CameraOptions`.
- Produces: `findVectorSourceId(style) -> string | null`.
- Produces: `buildingLayer(sourceId) -> MapLibreLayerSpec`.
- `WorldMap` props: `{ apiKey, mode, selectedPlace, reducedMotion, onCameraChange, onFocusSettled, onStatusChange }`.

- [ ] **Step 1: Write failing camera and layer tests**

Create `tests/map-mode.test.mjs` and assert:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  TAIWAN_CAMERA,
  buildingLayer,
  cameraForMode,
} from "../src/map/mapConfig.js";

test("Taiwan camera is the stable initial view", () => {
  assert.deepEqual(TAIWAN_CAMERA.center, [120.96, 23.7]);
  assert.equal(TAIWAN_CAMERA.zoom, 7);
  assert.equal(TAIWAN_CAMERA.pitch, 0);
});

test("mode cameras preserve center and selected target", () => {
  const camera = { center: [121, 24], zoom: 12, pitch: 0, bearing: 0 };
  const target = { coordinates: [121.5645, 25.0339] };
  const threeD = cameraForMode("3d", camera, target);
  assert.deepEqual(threeD.center, target.coordinates);
  assert.equal(threeD.pitch, 58);
  assert.equal(threeD.bearing, -18);
  assert.ok(threeD.zoom >= 15);

  const twoD = cameraForMode("2d", threeD, target);
  assert.deepEqual(twoD.center, target.coordinates);
  assert.equal(twoD.pitch, 0);
  assert.equal(twoD.bearing, 0);
});

test("building layer is a cyan-tinted extrusion and not a route layer", () => {
  const layer = buildingLayer("openmaptiles");
  assert.equal(layer.type, "fill-extrusion");
  assert.equal(layer["source-layer"], "building");
  assert.equal(layer.source, "openmaptiles");
  assert.doesNotMatch(JSON.stringify(layer), /route|direction|navigation/i);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/map-mode.test.mjs`

Expected: FAIL with module-not-found for `src/map/mapConfig.js`.

- [ ] **Step 3: Implement map configuration**

Use:

```js
export const TAIWAN_CAMERA = Object.freeze({
  center: [120.96, 23.7],
  zoom: 7,
  pitch: 0,
  bearing: 0,
});

export const mapStyleUrl = (apiKey) =>
  "https://api.maptiler.com/maps/dataviz-dark/style.json?key=" +
  encodeURIComponent(apiKey);

export const terrainSourceUrl = (apiKey) =>
  "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=" +
  encodeURIComponent(apiKey);
```

`buildingLayer(sourceId)` must return one `fill-extrusion` layer with ID `estiginto-3d-buildings`, source-layer `building`, minzoom `14`, cyan-dark color from the inventory, height from `render_height` then `height` then `8`, base from `render_min_height` then `0`, and opacity from the inventory.

- [ ] **Step 4: Implement the MapLibre lifecycle**

In `WorldMap.jsx`:

- Create the map once inside an effect using `new maplibregl.Map({ container, style: mapStyleUrl(apiKey), ...TAIWAN_CAMERA, antialias: true, attributionControl: true, maxPitch: 70 })`.
- Catch constructor/WebGL errors and report `unsupported`.
- On `load`, add `estiginto-terrain` as a `raster-dem` source, discover the vector source, add the building layer before the first symbol layer, start in 2D with terrain disabled and building visibility `none`, then report `ready`.
- If terrain setup or vector-source discovery fails, report `three-d-unavailable` while leaving the loaded 2D map interactive; do not convert a usable 2D map into a full-page failure.
- On `moveend`, report `center, zoom, pitch, bearing`.
- On map `error`, report `map-error` without replacing a previously usable map for a transient tile error.
- Remove the marker and map in cleanup so React StrictMode does not leak canvases or listeners.

- [ ] **Step 5: Synchronize modes and selected targets**

On `mode` changes:

- 2D: `map.setTerrain(null)`, hide building extrusion, `easeTo` pitch `0` and bearing `0`.
- 3D: `map.setTerrain({ source: "estiginto-terrain", exaggeration: 1.08 })`, show building extrusion, `easeTo` pitch `58` and bearing `-18`.
- Use duration `0` with reduced motion, otherwise `700` ms.

On `selectedPlace` changes, create or move one MapLibre `Marker` containing only the target-anchor DOM element, then `flyTo` the target at zoom at least `15.5`. Use `0` ms with reduced motion, `900` ms in 2D, and `1400` ms in 3D. Call `onFocusSettled` on the matching `moveend`, and remove the one-time listener when selection changes.

- [ ] **Step 6: Run tests and build**

Run:

```bash
node --test tests/map-mode.test.mjs
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/map/mapConfig.js src/map/WorldMap.jsx tests/map-mode.test.mjs
git commit -m "feat: add switchable 2D and 3D map engine"
```

---

### Task 6: Integrate the cinematic HUD, real states, and motion

**Files:**
- Modify: `src/map/MapExperience.jsx`
- Modify: `src/map/map.css`
- Create: `src/map/useReducedMotion.js`
- Create: `src/map/components/HudChrome.jsx`
- Create: `src/map/components/TargetProfile.jsx`
- Create: `src/map/components/SystemFailure.jsx`
- Modify: `tests/map-page-contracts.test.mjs`

**Interfaces:**
- Consumes: `WorldMap`, `usePlaceSearch`, `PlaceResult`, and Task 1 design inventory.
- Produces: complete desktop workflow with `mode`, `selectedPlace`, `focusStatus`, `camera`, and `mapStatus`.

- [ ] **Step 1: Add failing scope and motion contracts**

Extend `tests/map-page-contracts.test.mjs`:

```js
test("map scope excludes directions and geolocation", () => {
  const files = [
    read("src/map/MapExperience.jsx"),
    read("src/map/WorldMap.jsx"),
    read("src/map/mapConfig.js"),
  ].join("\n");
  assert.doesNotMatch(
    files,
    /MapboxDirections|directions\/v|routeLayer|route-line|navigator\.geolocation|GeolocateControl/,
  );
});

test("map HUD provides reduced motion and truthful status regions", () => {
  const app = read("src/map/MapExperience.jsx");
  const css = read("src/map/map.css");
  assert.match(app, /aria-live="polite"/);
  assert.match(app, /useReducedMotion/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.hud-decoration[\s\S]*pointer-events:\s*none/);
});
```

- [ ] **Step 2: Run the focused contract and verify failure**

Run: `node --test tests/map-page-contracts.test.mjs`

Expected: FAIL because the HUD and reduced-motion code do not exist.

- [ ] **Step 3: Implement reduced-motion state**

`useReducedMotion.js` must initialize from `window.matchMedia("(prefers-reduced-motion: reduce)")`, subscribe to `change`, return the current boolean, and remove the listener on unmount.

- [ ] **Step 4: Compose real application state**

`MapExperience` must:

- Read `import.meta.env.VITE_MAPTILER_KEY` once.
- Hold `mode` default `2d`, `selectedPlace` default `null`, `focusStatus` default `idle`, camera default `TAIWAN_CAMERA`, and map status default `loading`.
- Pass camera center into `usePlaceSearch` as proximity.
- Set `focusStatus` to `focusing` on result selection and `locked` only after `WorldMap` reports the matching camera settled.
- Preserve selected place and search state when mode changes.
- Render `SystemFailure` instead of `WorldMap` when the key is missing or WebGL is unsupported.
- Keep the last successful target visible when a later search fails.
- Send one concise state message through `aria-live="polite"` for loading, results count, empty, error, focusing, and locked states.

- [ ] **Step 5: Implement the HUD components**

`HudChrome` contains the exact brand, mode buttons, map status, zoom, coordinates, mode, and provider attribution. Mode controls are real buttons with `aria-pressed` and disabled state when 3D is unavailable.

`TargetProfile` accepts `{ place, focusStatus, onClose }`, returns a standby panel when no selection exists, and otherwise renders a close button plus only:

```jsx
<h2>{place.name}</h2>
{place.kind ? <p>{place.kind}</p> : null}
{place.address ? <address>{place.address}</address> : null}
<output>{formatCoordinates(place.coordinates)}</output>
<small>{place.attribution}</small>
```

The close button must clear `selectedPlace` and return `focusStatus` to `idle` without clearing the query or moving the map.

`SystemFailure` supports exact failure kinds `missing-key`, `unsupported`, and `map-error`. Only `map-error` shows a retry button. Do not show stack traces or the API key.

`MapExperience` implements map retry by incrementing a `mapInstanceKey` passed as the React `key` for `WorldMap`. Search errors render the hook’s `retry` action next to the error message; retrying must reuse the current query and current map-center proximity.

- [ ] **Step 6: Implement the desktop visual system**

Translate Task 1 measured tokens and sizes into `map.css`. Required behaviors:

- Map is full bleed and always behind HUD chrome.
- Desktop has top rail, centered search, left results rail, right target rail, bottom status rail.
- Decorative scan, vignette, reticle, corner brackets, and data lines have `pointer-events: none`.
- Interactive rails, search, buttons, and results use `pointer-events: auto`.
- `ready` triggers one short HUD power-on reveal and never places an interaction-blocking overlay over the map.
- `searching` activates the scanning line only while the request is pending.
- `focusing` animates reticle acquisition.
- `locked` performs one ring pulse, then becomes still.
- `three-d-unavailable` keeps the 2D button usable, disables the 3D button, and exposes a concise status message.
- Visible focus rings have at least 3:1 contrast against the adjacent HUD surface.
- All timings and colors match `design-inventory.md` exactly.

- [ ] **Step 7: Add reduced-motion CSS**

Inside the media query, set all HUD animation durations to `0.01ms` with one iteration, remove transform-based stagger, stop reticle rotation and scan motion, and retain static state borders so status remains understandable.

- [ ] **Step 8: Run tests and build**

Run:

```bash
node --test tests/map-page-contracts.test.mjs
npm run build
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/map/MapExperience.jsx src/map/map.css src/map/useReducedMotion.js src/map/components/HudChrome.jsx src/map/components/TargetProfile.jsx src/map/components/SystemFailure.jsx tests/map-page-contracts.test.mjs
git commit -m "feat: integrate cinematic map HUD"
```

---

### Task 7: Add mobile bottom-sheet behavior and degraded interaction

**Files:**
- Modify: `src/map/MapExperience.jsx`
- Modify: `src/map/map.css`
- Modify: `src/map/components/SearchResults.jsx`
- Modify: `src/map/components/TargetProfile.jsx`
- Modify: `tests/map-page-contracts.test.mjs`

**Interfaces:**
- Produces: mobile panel state `results | target | closed`.
- Preserves: the same search and target data used by desktop; no duplicate mobile data model.

- [ ] **Step 1: Write failing mobile contracts**

Add assertions that `map.css` contains:

```js
assert.match(css, /@media\s*\(max-width:\s*760px\)/);
assert.match(css, /\.map-mobile-sheet/);
assert.match(css, /env\(safe-area-inset-bottom\)/);
assert.match(css, /touch-action:\s*pan-x pan-y/);
```

Also assert `MapExperience.jsx` contains one `mobilePanel` state and the exact tab labels `搜尋結果` and `目標資料`.

- [ ] **Step 2: Run the contract and verify failure**

Run: `node --test tests/map-page-contracts.test.mjs`

Expected: FAIL on missing mobile sheet rules.

- [ ] **Step 3: Implement mobile panel state**

At widths controlled by CSS, render one `map-mobile-sheet` container with:

- A non-interactive drag-handle visual.
- Two tab buttons with `aria-selected`.
- Results tab shown automatically when a search succeeds.
- Target tab shown automatically after a result is selected and the camera begins focusing.
- Close button that hides the sheet without clearing query or selected target.
- Search and 2D/3D switch remain outside the sheet and always reachable.

- [ ] **Step 4: Implement responsive layout**

At `max-width: 760px`:

- Hide desktop side rails without unmounting their state.
- Stack brand/mode/search controls in the measured Task 1 mobile layout.
- Limit sheet height so at least 42% of the map remains visible.
- Add bottom safe-area padding.
- Keep attribution above or inside the visible sheet boundary.
- Ensure buttons and results have at least 44 px touch height.
- Ensure pure HUD overlays never intercept pinch, pan, or rotate gestures.

- [ ] **Step 5: Validate degraded states on mobile**

Missing key, WebGL unsupported, map error, empty results, and search error must fit inside 390x844 without clipped actions or horizontal scroll. A 3D setup failure disables only 3D and leaves 2D search usable.

- [ ] **Step 6: Run tests and build**

Run:

```bash
node --test tests/map-page-contracts.test.mjs
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/map/MapExperience.jsx src/map/map.css src/map/components/SearchResults.jsx src/map/components/TargetProfile.jsx tests/map-page-contracts.test.mjs
git commit -m "feat: add responsive map HUD controls"
```

---

### Task 8: Verify live search, browser behavior, and visual fidelity

**Files:**
- Create: `docs/superpowers/verification/2026-08-09-map-hud-fidelity.md`
- Modify: any Task 2–7 file only when a verified mismatch requires a fix.

**Interfaces:**
- Consumes: a browser-restricted MapTiler key in untracked `.env.local`.
- Produces: passed automated checks, real-provider verification, final screenshots, and a five-plus-point fidelity ledger.

- [ ] **Step 1: Configure the local public browser key**

Ask the user for a MapTiler browser key restricted to `http://localhost:4302` and the production domain. After they provide it, write that exact received value to `VITE_MAPTILER_KEY` in untracked `.env.local`. Confirm `git status --short` does not list the file. Do not print the key to terminal output or the final response.

- [ ] **Step 2: Run the full automated gate**

Run: `npm run check`

Expected: all Node tests pass, Vite builds all pages including `map.html`, and `verify-dist` passes.

- [ ] **Step 3: Start the production-shaped preview**

Run: `npm run preview`.

Use the Browser/IAB skill first and open `http://127.0.0.1:4302/map.html`. Use Playwright only if Browser/IAB is unavailable or unreliable, and record that fallback reason.

- [ ] **Step 4: Verify real search behavior**

Perform and record these live cases:

1. Search `台北 101`, select the landmark, confirm name/address/coordinates, and verify 2D camera lock.
2. Switch to 3D, confirm the same query and target remain selected and buildings/terrain become visible.
3. Search `國立故宮博物院` and confirm the prior request/marker cannot overwrite the new result.
4. Search `Eiffel Tower` and confirm global search works despite Taiwan bias.
5. Search a deliberately nonsensical string and confirm empty state without camera movement.
6. Simulate a failed search request and confirm retry messaging while the last successful target remains.
7. Confirm no browser geolocation permission prompt appears and no route line exists.

- [ ] **Step 5: Verify keyboard and reduced motion**

- Tab to search; type, use ArrowDown/ArrowUp, Enter, and Escape.
- Confirm focus indicators remain visible.
- Emulate `prefers-reduced-motion: reduce` and repeat selection plus mode switching.
- Confirm the map moves immediately or briefly and scanning/rotation/stagger do not continue.

- [ ] **Step 6: Capture implementation screenshots**

Capture:

- Desktop 2D at 1440x900 with 台北 101 locked.
- Desktop 3D at 1440x900 with the same target locked.
- Mobile at 390x844 with the target bottom sheet open.

Store temporary captures under `output/playwright/map-hud/` and remove them after the fidelity ledger is complete unless the user explicitly asks to retain them.

- [ ] **Step 7: Perform mandatory visual comparison**

Run `view_image` on each Task 1 concept and its matching implementation screenshot in the same QA pass. Compare at least:

1. Exact visible copy and ordering.
2. First-viewport geometry, gutters, rail widths, and map visibility.
3. Typography family, size, weight, line height, and control text.
4. Background, cyan, amber, border, and surface colors.
5. Reticle, icons, scan texture, and attribution treatment.
6. 2D versus 3D camera framing and target position.
7. Mobile sheet height, safe-area spacing, and touch targets.

Fix every material mismatch and recapture until an agency review would have no actionable comment.

- [ ] **Step 8: Write the fidelity ledger**

Create `docs/superpowers/verification/2026-08-09-map-hud-fidelity.md` with a table:

```markdown
| Comparison point | Concept evidence | Render evidence | Fix or result |
| --- | --- | --- | --- |
| Copy | desktop-2d.png | 1440x900 2D capture | Exact; no extra copy |
| Layout | measured inventory | 1440x900 capture | Exact after stated fix |
| Typography | measured inventory | computed browser styles | Exact |
| Palette | sampled tokens | computed CSS and capture | Exact |
| Motion and reticle | approved state | browser interaction | Exact |
| Responsive | mobile.png | 390x844 capture | Exact |
| 3D framing | desktop-3d.png | 1440x900 3D capture | Exact |
```

Also record Browser/IAB use or the Playwright fallback reason, native-size checks, above-the-fold copy diff, material fixes, core interaction result, and any intentional deviation. Do not claim completion while a fixable mismatch remains.

- [ ] **Step 9: Re-run final checks**

Run:

```bash
npm run check
git diff --check
git status --short
```

Expected: all checks PASS; only intended files are modified; no key or temporary QA artifact is staged.

- [ ] **Step 10: Commit verification-driven fixes and ledger**

```bash
git add docs/superpowers/verification/2026-08-09-map-hud-fidelity.md map.html package.json package-lock.json vite.config.js scripts/verify-dist.mjs src/map tests/map-page-contracts.test.mjs tests/map-place-search.test.mjs tests/map-search-state.test.mjs tests/map-mode.test.mjs
git commit -m "test: verify cinematic map experience"
```

If no product file changed after the previous commit, stage and commit only the verification ledger.

---

## Official implementation references

- MapLibre GL JS: https://maplibre.org/maplibre-gl-js/docs
- MapLibre 3D terrain example: https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/
- MapTiler Search and Geocoding API: https://docs.maptiler.com/cloud/api/geocoding/
- MapTiler 3D MapLibre guide: https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-build-a-3d-map-with-maplibre-v2-gl-js/
- MapTiler raster DEM source: https://docs.maptiler.com/gl-style-specification/sources/
- MapTiler fill extrusion specification: https://docs.maptiler.com/gl-style-specification/layers/
