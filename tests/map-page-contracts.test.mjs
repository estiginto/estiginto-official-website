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
  assert.match(html, /<title>地圖特效展示<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/estiginto\.com\/map\.html"/);
  assert.match(html, /<link rel="icon" href="\/img\/logo_estiginto\.png"/);
});

test("the existing marketing app does not absorb the map feature", () => {
  assert.doesNotMatch(read("src/App.jsx"), /MapExperience|maplibre-gl|VITE_MAPTILER_KEY/);
});

test("map experience is keyless and has no environment setup contract", () => {
  const app = read("src/map/MapExperience.jsx");
  const map = read("src/map/WorldMap.jsx");
  const search = read("src/map/placeSearch.js");
  assert.doesNotMatch([app, map, search].join("\n"), /VITE_MAPTILER_KEY|missing-key|apiKey/);
  assert.doesNotMatch(read("map.html"), /MapTiler/);
});

test("map search controls expose combobox and listbox semantics", () => {
  const command = read("src/map/components/SearchCommand.jsx");
  const results = read("src/map/components/SearchResults.jsx");
  assert.match(command, /role="combobox"/);
  assert.match(command, /aria-activedescendant/);
  assert.match(results, /role="listbox"/);
  assert.match(results, /aria-selected/);
});

test("map measurement excludes turn-by-turn UI and geolocation", () => {
  const files = [
    read("src/map/MapExperience.jsx"),
    read("src/map/WorldMap.jsx"),
    read("src/map/mapConfig.js"),
  ].join("\n");
  assert.doesNotMatch(
    files,
    /MapboxDirections|directions\/v|navigator\.geolocation|GeolocateControl/,
  );
});

test("map exposes accessible radius and two-point measurement controls", () => {
  const app = read("src/map/MapExperience.jsx");
  const map = read("src/map/WorldMap.jsx");
  const tools = read("src/map/components/MeasurementTools.jsx");
  const css = read("src/map/map.css");

  assert.match(app, /MeasurementTools/);
  assert.match(app, /measurementMode/);
  assert.match(app, /travelState/);
  assert.match(map, /onMeasurementPoint/);
  assert.match(map, /draggable:\s*true/);
  assert.match(tools, /aria-pressed/);
  assert.match(tools, /aria-live="polite"/);
  assert.match(tools, /範圍/);
  assert.match(tools, /距離/);
  assert.match(tools, /清除/);
  assert.match(tools, /重試/);
  assert.match(css, /\.measurement-tools/);
  assert.match(css, /\.measurement-readout/);
});

test("map HUD provides reduced motion and truthful status regions", () => {
  const app = read("src/map/MapExperience.jsx");
  const css = read("src/map/map.css");
  assert.match(app, /aria-live="polite"/);
  assert.match(app, /useReducedMotion/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.hud-decoration[\s\S]*pointer-events:\s*none/);
});

test("search field delegates its visible keyboard focus ring to the HUD wrapper", () => {
  const css = read("src/map/map.css");
  assert.match(css, /\.search-command input:focus-visible\s*\{[^}]*outline:\s*0/);
});

test("mobile target lock is not replaced by a refreshed result list", () => {
  const app = read("src/map/MapExperience.jsx");
  assert.match(app, /search\.state\.results\.length && !selectedPlace/);
});

test("mobile map HUD provides a safe-area bottom sheet without stealing map gestures", () => {
  const app = read("src/map/MapExperience.jsx");
  const css = read("src/map/map.css");
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /\.map-mobile-sheet/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /touch-action:\s*pan-x pan-y/);
  assert.match(app, /mobilePanel/);
  assert.match(app, />搜尋結果</);
  assert.match(app, />目標資料</);
});

test("map HUD exposes a compass-only north reset and concise mode labels", () => {
  const map = read("src/map/WorldMap.jsx");
  const hud = read("src/map/components/HudChrome.jsx");
  const css = read("src/map/map.css");

  assert.match(map, /new maplibregl\.NavigationControl/);
  assert.match(map, /showZoom:\s*false/);
  assert.match(map, /showCompass:\s*true/);
  assert.match(map, /visualizePitch:\s*false/);
  assert.match(map, /將地圖轉回正北/);
  assert.match(hud, /<span>2D<\/span>/);
  assert.match(hud, /<span>3D<\/span>/);
  assert.doesNotMatch(hud, />2D 戰術<|>3D 城市</);
  assert.match(css, /\.maplibregl-ctrl-top-right/);
  assert.match(css, /\.maplibregl-ctrl-compass:focus-visible/);
});

test("map HUD styles load after MapLibre defaults so control placement is preserved", () => {
  const entry = read("src/map/main.jsx");
  assert.ok(
    entry.indexOf('maplibre-gl/dist/maplibre-gl.css') < entry.indexOf('./map.css'),
    "MapLibre defaults must load before the custom HUD stylesheet",
  );
});
