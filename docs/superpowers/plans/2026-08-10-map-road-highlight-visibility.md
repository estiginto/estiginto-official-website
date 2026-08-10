# Map Road Highlight Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make selected roads immediately visible in both 2D and 3D without implying navigation.

**Architecture:** Keep the existing GeoJSON source and add one static road backdrop layer below the existing glow and core layers. Increase the glow/core contrast and narrow the pulse range so the selected road never fades into the basemap.

**Tech Stack:** React, MapLibre GL JS style layers, Node test runner, Vite

## Global Constraints

- Do not add arrows, dashes, moving dots, directions, or route-planning behavior.
- Preserve reduced-motion behavior and all existing geometry/search interfaces.
- Validate at desktop and 390px mobile widths.

---

### Task 1: Strengthen the selected-road rendering stack

**Files:**
- Modify: `tests/map-mode.test.mjs`
- Modify: `src/map/mapConfig.js`
- Modify: `src/map/WorldMap.jsx`

**Interfaces:**
- Consumes: `targetGeometryLayers(): Array<MapLibreLayer>` and the selected geometry pulse effect.
- Produces: a six-layer geometry stack containing `estiginto-target-road-backdrop`, stronger road glow/core paint values, and a pulse floor of `0.88`.

- [ ] **Step 1: Write the failing layer-contract test**

Assert that `targetGeometryLayers()` returns six layers, includes a road backdrop with color `#001116`, has a road glow opacity of at least `0.72`, a road core width reaching at least `7` at zoom 17, and still contains no route/navigation semantics.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test tests/map-mode.test.mjs`

Expected: FAIL because the current stack has five layers and no backdrop.

- [ ] **Step 3: Implement the three-layer road treatment**

Insert `estiginto-target-road-backdrop` before the road glow using a round line with `#001116`, width interpolation from `16` at zoom 10 to `34` at zoom 17, blur `2`, and opacity `0.82`. Increase road glow to widths `12`/`28`, blur `9`, opacity `0.78`; increase the core to widths `3`/`7` and opacity `1`.

In `WorldMap.jsx`, set road pulse restore values to `0.78` and `1`, then change the multiplier to:

```js
const pulse = 0.88 + Math.sin(progress * Math.PI) * 0.12;
```

- [ ] **Step 4: Run focused and full verification**

Run: `node --test tests/map-mode.test.mjs`

Expected: PASS.

Run: `npm.cmd run check`

Expected: all tests, Vite build, and dist verification pass.

- [ ] **Step 5: Verify the rendered target flow**

The flow under test is: `map.html` -> search and select `板橋大觀路二段156巷45號` -> the complete road renders with a clearly separated backdrop, bright cyan glow, and white-cyan core in 2D/3D on desktop and 390px mobile.

Check page identity, meaningful DOM, framework overlays, console warnings/errors, screenshot evidence, and geometry status `ready`.

- [ ] **Step 6: Commit and publish**

```bash
git add tests/map-mode.test.mjs src/map/mapConfig.js src/map/WorldMap.jsx
git commit -m "fix: strengthen selected road highlight"
git push origin master
```
