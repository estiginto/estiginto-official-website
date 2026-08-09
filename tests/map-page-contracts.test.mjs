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
