# Desktop Menu Living Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained breathing and two-beat heartbeat animation to the desktop service menu grid while preserving readability, interaction, and reduced-motion behavior.

**Architecture:** Keep the menu component unchanged and isolate all motion in CSS decorative layers on `.desktop-service-menu`. The base panel remains static; `::before` renders the drifting grid and `::after` renders a low-opacity radial glow whose keyframes encode the breathing crest and two short heartbeat pulses.

**Tech Stack:** React 19, CSS animations and pseudo-elements, Node.js built-in test runner, Vite, in-app Browser QA.

## Global Constraints

- Apply only to the desktop service menu; the mobile diamond menu remains unchanged.
- Animate only while `.desktop-cursor-menu.open` is present.
- Keep all menu text, links, dividers, and font controls outside the animated layers.
- Preserve a static grid and disable all living-grid animation under `prefers-reduced-motion: reduce`.
- Do not add runtime JavaScript or dependencies.

---

### Task 1: Living grid animation contracts and CSS

**Files:**
- Modify: `tests/desktop-cursor-menu.test.mjs`
- Modify: `src/App.css:976-1107`

**Interfaces:**
- Consumes: `.desktop-cursor-menu.open` and `.desktop-service-menu` from the existing desktop navigation.
- Produces: `desktop-grid-breathe` and `desktop-grid-heartbeat` keyframes applied only to decorative pseudo-elements.

- [x] **Step 1: Write the failing CSS contract test**

Add a test that asserts the menu defines `::before` and `::after` decorative layers, open-state animations named `desktop-grid-breathe` and `desktop-grid-heartbeat`, two closely spaced pulse keyframe peaks, and a reduced-motion rule that sets their animations to `none`.

```js
test("desktop service grid breathes with a restrained two-beat pulse", () => {
  assert.match(cssSource, /\.desktop-service-menu::before[\s\S]*?background-size:\s*40px 40px/);
  assert.match(cssSource, /\.desktop-service-menu::after[\s\S]*?radial-gradient/);
  assert.match(cssSource, /\.desktop-cursor-menu\.open \.desktop-service-menu::before[\s\S]*?desktop-grid-breathe/);
  assert.match(cssSource, /\.desktop-cursor-menu\.open \.desktop-service-menu::after[\s\S]*?desktop-grid-heartbeat/);
  assert.match(cssSource, /@keyframes desktop-grid-heartbeat[\s\S]*?48%[\s\S]*?52%/);
  assert.match(cssSource, /prefers-reduced-motion:\s*reduce[\s\S]*?\.desktop-service-menu::before[\s\S]*?\.desktop-service-menu::after[\s\S]*?animation:\s*none\s*!important/);
});
```

- [x] **Step 2: Run the targeted test and verify RED**

Run: `node --test tests/desktop-cursor-menu.test.mjs`

Expected: FAIL because the pseudo-elements, keyframes, and reduced-motion override do not exist.

- [x] **Step 3: Implement the decorative layers**

Move the grid out of the panel's main `background` into `.desktop-service-menu::before`; add a radial glow in `::after`; give both `position: absolute`, `inset: 0`, `pointer-events: none`, and place them behind existing `z-index: 1` content. Keep the menu's existing `overflow: auto` behavior unchanged so short-viewport scrolling continues to work.

Use an eight-second cycle. Keep the grid opacity approximately `0.58–0.9`, move its position by no more than 10 px per cycle, and keep the glow opacity below `0.22`. Encode two short peaks around `48%` and `52%`, returning close to baseline between them.

- [x] **Step 4: Add open-state and reduced-motion rules**

Apply animations only through:

```css
.desktop-cursor-menu.open .desktop-service-menu::before { animation: desktop-grid-breathe 8s ease-in-out infinite; }
.desktop-cursor-menu.open .desktop-service-menu::after { animation: desktop-grid-heartbeat 8s ease-in-out infinite; }
```

Inside the existing reduced-motion media query, set both pseudo-element animations to `none !important` and retain visible static opacity.

- [x] **Step 5: Run targeted tests and commit**

Run: `node --test tests/desktop-cursor-menu.test.mjs`

Expected: PASS.

Commit:

```bash
git add src/App.css tests/desktop-cursor-menu.test.mjs
git commit -m "feat: animate desktop service grid"
```

### Task 2: Full verification and rendered QA

**Files:**
- Modify: `docs/superpowers/plans/2026-08-04-desktop-menu-living-grid.md` only to mark completed steps.

**Interfaces:**
- Consumes: production build and local preview.
- Produces: verified desktop animation with no regressions.

- [x] **Step 1: Run repository verification**

Run: `npm run check`

Expected: all tests pass, Vite production build succeeds, and `verify:dist` succeeds.

- [x] **Step 2: Validate desktop rendering**

Open the local production preview at `http://127.0.0.1:4303/`, open the desktop service menu, and verify at `1440x900` and `1440x650` that the animated layers exist, have running animations, remain behind the content, and create no horizontal overflow.

- [x] **Step 3: Validate interaction and console health**

Verify all eight service links remain present, the first link receives focus when opened, Escape closes the menu and restores focus to the trigger, and no relevant console warnings or errors are logged.

- [x] **Step 4: Validate reduced motion**

Emulate or inspect the reduced-motion media rule and confirm both decorative layers resolve to `animation-name: none` while the static grid remains visible.

- [x] **Step 5: Final repository checks**

Run:

```bash
git diff --check
git status --short --branch
```

Expected: no whitespace errors; only unrelated pre-existing untracked artifacts may remain.
