# Cinematic Map HUD Fidelity Verification

Date: 2026-08-09

## Method

- Accepted concepts: `docs/design/map-hud/desktop-2d.png`, `desktop-3d.png`, and `mobile.png`.
- Rendered implementation: production Vite build served at `/map.html` and exercised in the Codex in-app browser.
- Native comparison viewports: 1440 × 900 desktop and 390 × 844 mobile.
- Both concept and implementation captures were inspected at original resolution with image inspection.
- Implementation captures: `output/map-hud/desktop-2d.png`, `desktop-3d-taipei101.png`, and `mobile-3d-paris.png`.

## Fidelity ledger

| Area | Concept | Implementation | Result |
| --- | --- | --- | --- |
| Overall frame | Full-viewport dark map with cyan angular HUD | Same full-viewport composition and visual hierarchy | Match |
| Header | Brand left, centered 2D/3D switch, status right | Same placement and active-mode treatment | Match |
| Search | Centered command field above the map | Same desktop placement; full-width mobile placement | Match |
| Desktop panels | Results left and target profile right | Same two-rail layout with real live data | Match |
| Target lock | Cyan reticle with restrained amber target core | Same animated reticle and selected marker | Match |
| 3D city | Pitched city view with extruded buildings | Real OpenStreetMap vector-building extrusion at pitched camera | Match |
| Footer telemetry | Zoom, center, mode, provider | Same fields, all derived from live map state | Match |
| Mobile | Compact header, search, map, bottom sheet | Same responsive stack; no horizontal overflow at 390 px | Match |
| Motion | Scan texture, target locking, camera transition | Implemented with reduced-motion fallback | Match |
| Provider credit | Concept shows MapTiler and OpenStreetMap | Intentionally changed to OpenFreeMap and OpenStreetMap | Approved deviation: keyless requirement |

## Above-the-fold copy diff

- `MAPTILER · OPENSTREETMAP` became `OPENFREEMAP · OPENSTREETMAP` because the user required no environment configuration or API key.
- Search results, place type, address, coordinates, and source are live Photon/OpenStreetMap data rather than fixed concept text.
- No route, directions, navigation, or geolocation copy was added.

## Interaction verification

- Searched and selected `台北 101`; target profile and WGS84 coordinates populated from the live provider.
- Used Arrow Down, Arrow Up, and Enter in the combobox/listbox flow.
- Switched the selected Taipei target from 2D to 3D while retaining selection and map center.
- Searched globally for `Tour Eiffel Paris` and locked the Paris result.
- Verified the mobile target tab remains selected after the search refresh.
- Verified 390 px viewport width equals document scroll width, with no horizontal overflow.

No material visual mismatch remained after the mobile target-panel fix.
