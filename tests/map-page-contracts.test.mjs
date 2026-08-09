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
