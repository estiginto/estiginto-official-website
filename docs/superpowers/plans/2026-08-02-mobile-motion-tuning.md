# Mobile Motion Tuning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Slow the mobile homepage language-switch flight to 900ms and make the closed triangular mobile navigation trigger compact on downward scroll and restore smoothly on upward scroll.

**Architecture:** Add a pure scroll-direction state function in a focused module and consume it from `MobileNav`, keeping scroll interpretation independently testable. Apply compact styling only to the triangle and icon so the existing touch target remains unchanged; update the existing language prompt timing in place.

**Tech Stack:** React 19, JavaScript ES modules, CSS, Node test runner, Vite, Playwright browser QA.

## Global Constraints

- The language-switch transform duration is exactly 900ms and prompt completion is exactly 960ms.
- The compact triangle scale is exactly 78%; the compact icon scale is exactly 88%.
- The compact transition duration is exactly 320ms using the existing soft easing.
- The trigger keeps its existing 120x92px touch target.
- Opening the menu or reaching the top restores full visual size.
- Reduced-motion users do not receive extended transition motion.
- Desktop navigation and non-home language behavior remain unchanged.

---

### Task 1: Scroll-direction state model

**Files:**
- Create: `src/mobileNavScroll.js`
- Create: `tests/mobile-nav-scroll.test.mjs`

**Interfaces:**
- Produces: `resolveMobileNavCompactState({ scrollY, previousScrollY, isOpen, wasCompact, topBoundary, directionThreshold }): boolean`.
- Consumes: numeric scroll positions and existing open/compact state; no DOM dependencies.

- [ ] **Step 1: Write the failing behavior tests**

Add literal cases proving that open navigation and positions at or above 24px return `false`, a downward delta greater than 6px returns `true`, an upward delta less than -6px returns `false`, and deltas within ±6px preserve `wasCompact`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: FAIL because `src/mobileNavScroll.js` does not exist.

- [ ] **Step 3: Implement the pure state function**

Create `resolveMobileNavCompactState` with defaults `topBoundary = 24` and `directionThreshold = 6`. Prioritize `isOpen` and the top boundary, then compare the signed delta, otherwise return `wasCompact`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: all scroll-state cases pass.

- [ ] **Step 5: Commit the state model**

```powershell
git add -- src/mobileNavScroll.js tests/mobile-nav-scroll.test.mjs
git commit -m "feat: model mobile menu scroll state"
```

### Task 2: Mobile navigation visual behavior

**Files:**
- Modify: `src/App.jsx` in imports and `MobileNav`
- Modify: `src/App.css` in the mobile navigation trigger rules and reduced-motion block
- Modify: `tests/mobile-nav-scroll.test.mjs`

**Interfaces:**
- Consumes: `resolveMobileNavCompactState` from Task 1.
- Produces: `compact` class on the closed `.mobile-nav`, scroll listener cleanup, and full-size behavior while open.

- [ ] **Step 1: Add a failing integration contract**

Add a test that reads the app and CSS sources and verifies the component imports and calls the pure state function, emits the `compact` class, keeps `.mobile-nav-trigger` at 120x92px, and defines the exact visual scales and 320ms transition.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: FAIL because `MobileNav` does not yet consume the state model or emit compact styling.

- [ ] **Step 3: Wire scroll behavior into `MobileNav`**

Add `compact` state and `previousScrollYRef`. Attach one passive `scroll` listener that feeds current and previous positions into `resolveMobileNavCompactState`, updates the ref, and removes the listener on cleanup. Include `compact` only when the menu is closed; opening the menu immediately clears it.

- [ ] **Step 4: Add exact compact styling**

Keep the button dimensions unchanged. Add bottom-centered `scale(0.78)` to the triangle and `scale(0.88)` to the icon under `.mobile-nav.compact:not(.open)`, using 320ms soft easing. Extend reduced-motion rules so these transforms have no animated transition.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: all behavior and integration cases pass.

- [ ] **Step 6: Commit mobile navigation behavior**

```powershell
git add -- src/App.jsx src/App.css tests/mobile-nav-scroll.test.mjs
git commit -m "feat: compact mobile menu while scrolling"
```

### Task 3: Slower language-switch flight

**Files:**
- Modify: `src/App.jsx` in `MobileHomeLanguagePrompt`
- Modify: `src/App.css` in `.language-prompt-flight`
- Modify: `tests/mobile-language-prompt.test.mjs`

**Interfaces:**
- Produces: 900ms visual flight and 960ms prompt lifecycle handoff.
- Consumes: existing flight geometry and reduced-motion behavior unchanged.

- [ ] **Step 1: Add a failing timing contract**

Extend the current language-prompt contract test to require a 900ms transform transition and a 960ms completion call, while retaining the reduced-motion assertion.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: FAIL because production still uses 600ms and 660ms.

- [ ] **Step 3: Update the exact timing values**

Change the flight transform transition to 900ms and `finishPrompt` delay to 960ms. Do not change the easing curve, geometry calculation, or reduced-motion fade path.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: all language-prompt tests pass.

- [ ] **Step 5: Commit timing adjustment**

```powershell
git add -- src/App.jsx src/App.css tests/mobile-language-prompt.test.mjs
git commit -m "style: slow mobile language handoff"
```

### Task 4: Full verification and deployment

**Files:**
- Verify only; no planned production edits.

**Interfaces:**
- Consumes: completed Tasks 1-3.
- Produces: production deployment and browser QA evidence.

- [ ] **Step 1: Run the full automated verification**

Run: `npm run check`

Expected: all Node tests pass, Vite production build succeeds, and distribution verification succeeds.

- [ ] **Step 2: Check the patch and repository state**

Run: `git diff --check` and `git status --short --branch`.

Expected: no whitespace errors; only known local QA/audit directories remain untracked.

- [ ] **Step 3: Run mobile browser QA at 390x844**

Verify the homepage language flight remains present before 900ms and completes after 960ms; downward scrolling applies the compact visual scale; upward scrolling restores full size; opening the menu restores full size; there is no horizontal overflow and no console error. Verify `/about.html` does not show the language prompt.

- [ ] **Step 4: Push and verify production**

Push `master` to `origin`, wait for Vercel success, and repeat the browser checks at `https://estiginto.com/`.
