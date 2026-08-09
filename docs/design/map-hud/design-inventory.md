# Map HUD Design Inventory

## Accepted concept files

- `desktop-2d.png` — 1440 × 900 desktop 2D tactical state.
- `desktop-3d.png` — 1440 × 900 desktop 3D city state.
- `mobile.png` — 390 × 844 mobile search-results state.

These concepts translate the user's approved combined HUD direction into a production baseline. Map labels and result content shown in the concepts are illustrative; the product renders the map and all application data live and code-native.

## Allowed first-viewport copy

- ESTIGINTO // GEO INTELLIGENCE
- ESTIGINTO
- 2D 戰術
- 3D 城市
- SYSTEM ONLINE · TW
- SYSTEM ONLINE
- 搜尋地點、地址或地標
- SEARCH RESULTS / 搜尋結果
- TARGET PROFILE / 目標資料
- 搜尋結果
- 目標資料
- ZOOM
- CENTER
- MODE
- OPENFREEMAP · OPENSTREETMAP

Selected-place names, types, addresses, coordinates, and provider attribution come from live Photon/OpenStreetMap responses and the OpenFreeMap map state. They are not fixed product copy.

## Color tokens

- `--map-bg: #06111a`
- `--hud-surface: rgba(3, 15, 23, 0.88)`
- `--hud-cyan: #4ce8ff`
- `--hud-text: #edfcff`
- `--hud-muted: #6fa8b5`
- `--hud-amber: #ffb15c`
- `--hud-border: rgba(61, 216, 242, 0.35)`

The background is a true cool near-black navy. It must not be warmed or replaced by a generic black gradient.

## Typography

- HUD chrome: `"IBM Plex Mono", "Noto Sans TC", ui-monospace, monospace`.
- Place content: `"Noto Sans TC", "IBM Plex Sans", system-ui, sans-serif`.
- Chrome labels: 10–12 px desktop, uppercase where shown, 0.08–0.16 em tracking.
- Result titles: 14–16 px desktop and 16 px mobile, medium weight.
- Target title: 20 px desktop, 18 px mobile.
- Control text: 12–14 px desktop and at least 16 px input text on mobile.

## Screen-specific layout

- Desktop 2D: 18 px outer gutters, 218 px rails, search width `min(520px, 48vw)`, 104 px reticle, map-first composition.
- Desktop 3D: same chrome geometry, pitch 58°, bearing -18°, building opacity 0.78, selected target framed near 56% viewport width.
- Mobile: 12 px outer gutters, 44 px minimum controls, sheet no taller than 46dvh, safe-area bottom padding, at least 42% of the map visible.
- Desktop container model: full-bleed live map plus open HUD rails; no generic card grid.
- Mobile container model: full-bleed live map plus one bottom sheet with a drag handle and two tabs.

## Component families

- Angular rail: clipped corner frame, 1 px cyan border, translucent navy surface.
- Mode switch: two equal segments with a hairline active frame, no pill radius.
- Search command: single input with magnifier, loading/status region, and clear button only when content exists.
- Search result: open list row with a pin icon, name, type, and address; selection uses border and subtle surface emphasis.
- Target reticle: cyan concentric/radial lines with an amber center only after a place is selected.
- Target profile: definition list containing only live name, type, address, coordinates, and source.
- Bottom status rail: zoom, center, mode, and provider attribution from live state.

## Icon inventory

- Search: 1.5 px cyan outline magnifier.
- 2D: layered-map outline.
- 3D: isometric-building outline.
- Location: 1.5 px pin outline.
- Clear: two-line 1.5 px cross.
- Retry: 1.5 px circular arrow.
- Loading: restrained circular progress line.

Icons are code-native SVGs using `currentColor`; they have 1.5 px strokes, square caps or visually restrained round caps, and no filled icon containers.

## Motion

- Search focus: 180 ms border/surface transition.
- Results reveal: 260 ms opacity and 8 px rise, stagger capped at five rows.
- Target lock: 520 ms reticle scale/opacity acquisition, followed by a quiet 2.8 s pulse.
- Mode camera: 900 ms in normal motion; instant when reduced motion is requested.
- Sheet/tab changes: 220 ms, transform and opacity only.

## Media treatment

- Map is a live MapLibre surface, not a raster image.
- HUD chrome has no color overlay over map labels.
- Scan texture and vignette are pointer-transparent decorative layers.
- The map remains readable; cyan and amber do not wash the basemap.
- Concepts are visual references only and are never rendered behind the application.

## Prohibited visible content

- Route lines, turn instructions, navigation steps, or travel-time estimates.
- Geolocation controls or location permission prompts.
- Fake weather, traffic, signal strength, timestamps, last-updated values, or random telemetry.
- Distances unless a future provider response explicitly supplies a trustworthy value and the product scope is expanded.
- Marketing hero copy, decorative code, copied movie imagery, and unrelated provider controls.

## Responsive continuation

- Below 760 px, both desktop rails disappear and their content moves into the bottom sheet.
- The search command and mode switch remain above the map.
- The selected target and attribution remain visible while the sheet is open.
- Search results and target profile share one tabbed sheet; selecting a result switches to the target tab on compact screens.
