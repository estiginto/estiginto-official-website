# Transition Palette and Mobile Category Rail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the mobile category controls with the triangle trigger and replace the blue transition treatment with ESTIGINTO's graphite, warm ivory, and champagne palette.

**Architecture:** Keep the existing React structure, route-based transition variants, timing constants, and mobile navigation state. Change only CSS geometry and color tokens, backed by source-contract tests and responsive browser measurements.

**Tech Stack:** React 19, CSS, Node test runner, Vite, in-app browser QA.

## Global Constraints

- Preserve transition timings at 1250 ms initial entry, 1050 ms page reveal, 760 ms internal leave, and 120 ms reduced motion.
- Remove saturated blue transition surfaces, seams, and glow.
- Use graphite black, warm ivory, and muted champagne gold.
- At 320 px and 390 px widths, category buttons occupy the same bottom band as the centered triangle trigger.
- Preserve safe-area handling, touch target size, closed-menu behavior, and all existing navigation destinations.

---

### Task 1: Lock the approved palette and bottom-rail geometry

**Files:**
- Modify: `tests/mobile-nav-scroll.test.mjs`
- Modify: `tests/site-contracts.test.mjs`

**Interfaces:**
- Consumes: existing CSS source-contract test helpers.
- Produces: regression contracts for `--transition-*` tokens and `--mobile-trigger-width` geometry.

- [ ] **Step 1: Write failing contracts**

Assert that `.page-transition` declares graphite, ivory, and champagne custom properties; transition layers consume them; no `#4f9dff` or `rgba(79, 157, 255` remains in the transition block. Assert that `.mobile-nav-category-switch` shares trigger bottom and height, while buttons use left/right half-width geometry and the trigger width variable.

- [ ] **Step 2: Verify the contracts fail**

Run: `node --test tests/mobile-nav-scroll.test.mjs tests/site-contracts.test.mjs`

Expected: failures for the old blue transition colors and category rail positioned above the trigger.

- [ ] **Step 3: Commit test contracts with implementation in Tasks 2 and 3**

Tests remain red until the paired CSS tasks are complete.

### Task 2: Recolor all transition variants

**Files:**
- Modify: `src/App.css`
- Test: `tests/site-contracts.test.mjs`

**Interfaces:**
- Consumes: existing `.transition-grille`, `.transition-matrix`, `.transition-aperture`, `.transition-axis`, and `.page-transition-scan` selectors.
- Produces: `--transition-graphite`, `--transition-graphite-soft`, `--transition-ivory`, and `--transition-champagne` CSS properties.

- [ ] **Step 1: Add palette properties to `.page-transition`**

Use graphite `#171817`, soft graphite `#242522`, warm ivory `#eee8dc`, champagne `#b89a62`, and restrained translucent reflections derived from ivory/champagne.

- [ ] **Step 2: Replace every transition-layer blue**

Apply graphite surfaces to grille, matrix, aperture, and axis. Use warm ivory seams at low opacity. Replace the scan line with a thin champagne gradient and a restrained warm shadow no larger than 10 px.

- [ ] **Step 3: Run the focused contract tests**

Run: `node --test tests/site-contracts.test.mjs`

Expected: all transition palette assertions pass.

### Task 3: Move category controls beside the triangle

**Files:**
- Modify: `src/App.css`
- Test: `tests/mobile-nav-scroll.test.mjs`

**Interfaces:**
- Consumes: `--mobile-trigger-bottom`, `--mobile-trigger-height`, and existing category button classes.
- Produces: `--mobile-trigger-width: 120px` and a same-band two-button rail behind the centered trigger.

- [ ] **Step 1: Share the trigger width variable**

Set `--mobile-trigger-width: 120px` on `.mobile-nav` and consume it in `.mobile-nav-trigger`.

- [ ] **Step 2: Position the category rail in the trigger band**

Set the category switch bottom to `var(--mobile-trigger-bottom)` and height to `var(--mobile-trigger-height)`. Keep it full width below the trigger's stacking layer.

- [ ] **Step 3: Shape the two side buttons**

Each button spans 50% of the viewport. The left button clips from the center apex to 60 px left at the bottom; the right button mirrors it. This leaves the centered 120 px triangle visible above the two buttons with a 1 px overlap to prevent seams.

- [ ] **Step 4: Run the focused mobile tests**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: all mobile geometry and behavior assertions pass.

### Task 4: Verify and publish

**Files:**
- Verify only; no new implementation files expected.

**Interfaces:**
- Consumes: production build and responsive UI.
- Produces: verified formal deployment.

- [ ] **Step 1: Run the complete project check**

Run: `npm.cmd run check`

Expected: zero test failures, successful Vite build, and successful dist verification.

- [ ] **Step 2: Perform responsive browser QA**

At 320×667 and 390×844, open the menu and verify: both category buttons and triangle share the same bottom edge; inner diagonal edges meet the triangle; labels remain readable; no horizontal overflow; transition layers contain no blue and use subdued warm highlights.

- [ ] **Step 3: Commit and push**

Stage only the CSS, tests, and this plan/spec work. Commit with `fix: refine transition palette and mobile category rail`, push `master`, then verify the new production asset and formal page behavior.

### Task 5: Refine category color, localized labels, and diamond corners

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.jsx` only if a locale needs a shorter mobile-only category label.
- Modify: `tests/mobile-nav-scroll.test.mjs`

**Interfaces:**
- Consumes: `.mobile-nav-category-button[aria-pressed="true"]`, `.mobile-nav-diamond::before`, `.mobile-nav-link::before`, `.mobile-nav-link.center::before`, and `.menu-font-button::before`.
- Produces: the approved champagne selected state, locale-aware category typography, and the 10/6/5 px rounded-diamond hierarchy.

- [ ] **Step 1: Write failing source contracts**

Assert that the selected category uses `#b89a62` with `#171817` text and does not consume `var(--signal)`. Assert outer/item/center/font-control radii of 10/6/5/5 px. Assert category labels use a Chinese single-line rule plus English and Japanese two-line locale rules.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: failures identify the existing blue selected state, absent diamond radii, and absent locale-specific label constraints.

- [ ] **Step 3: Implement the minimal CSS and localized copy adjustment**

Use champagne `#b89a62`, graphite `#171817`, warm ivory for the inactive state, and border radii applied before each square rotation. Set the Chinese category label to a restrained single line; allow English and Japanese up to two balanced lines with smaller tracking. If Japanese text cannot fit at 320 px after CSS sizing, use concise mobile labels `デジタル支援` and `ビジネス顧問` while retaining the full consulting page names elsewhere.

- [ ] **Step 4: Verify focused tests GREEN**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: all mobile navigation tests pass.

- [ ] **Step 5: Run multilingual responsive QA**

At 320×667 and 390×844, select zh, en, and ja in turn. Verify category labels remain inside the visible side-button areas, use no more than two lines, do not overlap the triangle, and every diamond has the approved restrained rounding.

- [ ] **Step 6: Run full verification and publish**

Run `npm.cmd run check`, stage only the intended implementation and tests, commit with `fix: polish multilingual mobile menu styling`, push `master`, and verify the formal CSS asset and rendered states.
