# Map Measurement Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add draggable radius measurement and two-point straight/travel distance measurement to the existing MapLibre HUD.

**Architecture:** Pure geometry helpers create local GeoJSON and metrics; a small OSRM client resolves the fastest driving path without a key; React owns measurement state while `WorldMap` translates map clicks and draggable marker movement into callbacks. A dedicated measurement source and filtered layers keep this feature isolated from place geometry.

**Tech Stack:** React 19, MapLibre GL JS 5, OSRM HTTP API, Node test runner, Vite

## Global Constraints

- No paid service, API key, environment variable, directions UI, or geolocation.
- Preserve search, selected-place geometry, 2D/3D, compass, and reduced-motion behavior.
- Keep straight distance visible when OSRM is slow or unavailable.
- Use the existing dark HUD visual language and support desktop plus 390px mobile.

---

### Task 1: Local measurement geometry

**Files:**
- Create: `src/map/measurementGeometry.js`
- Create: `tests/map-measurement-geometry.test.mjs`

**Interfaces:**
- Produces: `haversineDistance(a, b)`, `destinationPoint(center, bearing, meters)`, `circleFeature(center, radius, steps)`, `measurementFeatureCollection({ circle, points, travelGeometry })`, `formatDistance(meters)`, and `formatArea(squareMeters)`.

- [ ] **Step 1: Write failing pure-function tests**

Assert `[0,0]` to `[0,1]` is within one meter of `111195`, a 1,000m east destination remains near the equator, a 96-step circle closes with 97 coordinates, measurement features carry `measurementKind`, and formatting switches at 1,000 meters and 1,000,000 square meters.

- [ ] **Step 2: Run the focused test and verify missing-module failure**

Run: `node --test tests/map-measurement-geometry.test.mjs`

- [ ] **Step 3: Implement the minimal spherical geometry and GeoJSON helpers**

Use earth radius `6371008.8`, radians-based haversine math, spherical destination math, immutable GeoJSON features, and literal Taiwanese unit strings.

- [ ] **Step 4: Run the focused test and commit**

Run: `node --test tests/map-measurement-geometry.test.mjs`

Commit: `feat: add local map measurement geometry`

### Task 2: Free driving-distance resolver

**Files:**
- Create: `src/map/travelDistance.js`
- Create: `tests/map-travel-distance.test.mjs`

**Interfaces:**
- Produces: `buildTravelDistanceUrl(points)` and `createTravelDistanceService({ fetchImpl, timeoutMs }).resolve(points, { signal })` returning `{ geometry, distance, duration }`.

- [ ] **Step 1: Write failing service tests**

Assert the URL uses `https://router.project-osrm.org/route/v1/driving/{lng},{lat};{lng},{lat}`, `overview=full`, `geometries=geojson`, and `steps=false`. Assert valid responses normalize geometry/distance/duration; malformed, non-OK, `NoRoute`, and timeout responses reject; external abort remains an `AbortError`.

- [ ] **Step 2: Run the focused test and verify missing-module failure**

Run: `node --test tests/map-travel-distance.test.mjs`

- [ ] **Step 3: Implement the OSRM client**

Validate exactly two finite coordinate pairs, use a linked internal `AbortController` with a 12-second default timeout, clean up listeners/timers in `finally`, and reject invalid response shapes.

- [ ] **Step 4: Run the focused test and commit**

Run: `node --test tests/map-travel-distance.test.mjs`

Commit: `feat: resolve map travel distance`

### Task 3: Interactive MapLibre measurement rendering

**Files:**
- Create: `src/map/components/MeasurementTools.jsx`
- Modify: `src/map/mapConfig.js`
- Modify: `src/map/MapExperience.jsx`
- Modify: `src/map/WorldMap.jsx`
- Modify: `src/map/map.css`
- Modify: `tests/map-mode.test.mjs`
- Modify: `tests/map-page-contracts.test.mjs`

**Interfaces:**
- `MeasurementTools` consumes mode, circle metrics, distance points, travel state, retry, clear, and mode-change callbacks.
- `WorldMap` consumes `measurementMode`, `circleMeasurement`, `distancePoints`, and `travelGeometry`; emits `onMeasurementPoint`, `onCircleCenterChange`, `onCircleRadiusChange`, and `onDistancePointChange`.
- `mapConfig.js` produces `MEASUREMENT_SOURCE_ID` and `measurementLayers()`.

- [ ] **Step 1: Write failing layer and page-contract tests**

Assert a separate measurement source exists; circle fill/outline, dashed straight line, and travel backdrop/glow/core layers exist; the travel core is amber and wider/brighter than the straight line. Assert the page renders pressed tool buttons, a polite measurement status, click callbacks, draggable markers, clear/retry controls, and no `MapboxDirections`, `GeolocateControl`, or `navigator.geolocation`.

- [ ] **Step 2: Run focused tests and verify expected failures**

Run: `node --test tests/map-mode.test.mjs tests/map-page-contracts.test.mjs`

- [ ] **Step 3: Implement React state and OSRM lifecycle**

Add measurement mode, circle `{ center, radius }`, two-point array, and travel `{ status, geometry, distance, duration }` state. Radius clicks replace the center with 500m; distance clicks fill A then B and replace B on a third click. Abort stale travel requests, preserve the straight line on errors, support retry and clear.

- [ ] **Step 4: Implement MapLibre layers, click events, and draggable markers**

Add the measurement GeoJSON source after map load and insert measurement layers after the 3D building layer but before symbols. Create accessible center/radius/A/B markers; use marker `dragend` for centers/points and `drag` for live radius updates. Set crosshair cursor only while a measurement tool is active.

- [ ] **Step 5: Implement HUD and responsive styling**

Add centered desktop tool buttons below search and a compact live readout above the bottom HUD. On mobile, place the horizontal tools below search with a 12px gap from the compass and position the readout above the bottom sheet. Keep every control at least 44px tall.

- [ ] **Step 6: Run focused and full verification**

Run: `node --test tests/map-mode.test.mjs tests/map-page-contracts.test.mjs`

Run: `npm.cmd run check`

- [ ] **Step 7: Browser QA, commit, and publish**

Exercise radius center placement and handle drag; verify changing metrics. Exercise A/B placement, straight distance, OSRM travel distance and highlighted path; drag B and verify recomputation. Repeat at 390x844 and in 2D/3D, inspect console, capture screenshots, commit `feat: add interactive map measurement tools`, push `master`, and verify the production asset and flow.
