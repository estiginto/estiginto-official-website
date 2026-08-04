# Mobile Menu Selection Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mobile menu's generic house icon with a refined entrance symbol and add an unmistakable dual-line selected state to the two service category buttons.

**Architecture:** Keep the existing React markup, navigation state, and accessibility semantics unchanged. Redraw the icon and selected indicator entirely through the existing `.mobile-nav-home-icon`, its pseudo-elements, the existing child `<i>`, and a decorative pseudo-element on each category label.

**Tech Stack:** React 19 existing markup, CSS pseudo-elements and transitions, Node.js built-in test runner, Vite, Browser QA.

## Global Constraints

- Apply only to the mobile navigation.
- Preserve the center link touch target, accessible label, destinations, category buttons, and `aria-pressed` behavior.
- Use the existing navy, signal blue, and champagne-gold palette.
- Add no image asset, runtime JavaScript, or dependency.
- Keep the selected underline visible without expansion motion under `prefers-reduced-motion: reduce`.

---

### Task 1: Entrance icon and category selection indicator

**Files:**
- Modify: `tests/mobile-nav-scroll.test.mjs:131-197`
- Modify: `src/App.css:3407-3458, 3599-3638`

**Interfaces:**
- Consumes: `.mobile-nav-home-icon`, its child `<i>`, and `.mobile-nav-category-button[aria-pressed="true"]` from the current mobile menu.
- Produces: CSS-only entrance geometry and a selected dual underline tied to `aria-pressed`.

- [x] **Step 1: Write failing visual contract tests**

Add tests that require an entrance frame with no rotated roof, a nested inner frame, a threshold, the navy-and-gold label underline, hidden default scale, selected visible scale, and a reduced-motion transition override.

```js
test("mobile home icon uses an architectural entrance instead of a pitched roof", () => {
  assert.match(cssSource, /\.mobile-nav-home-icon::before\s*\{[\s\S]*?border:\s*2px solid currentColor;[\s\S]*?border-bottom:\s*0;/);
  assert.doesNotMatch(cssSource, /\.mobile-nav-home-icon::before\s*\{[\s\S]*?rotate\(45deg\)/);
  assert.match(cssSource, /\.mobile-nav-home-icon::after\s*\{[\s\S]*?background:\s*currentColor;/);
  assert.match(cssSource, /\.mobile-nav-home-icon i\s*\{[\s\S]*?border:\s*2px solid currentColor;[\s\S]*?border-bottom:\s*0;/);
});

test("selected mobile category uses a navy and champagne dual underline", () => {
  assert.match(cssSource, /\.mobile-nav-category-button span::after\s*\{[\s\S]*?#0a1f44[\s\S]*?rgba\(159, 128, 77/);
  assert.match(cssSource, /\.mobile-nav-category-button span::after\s*\{[\s\S]*?scaleX\(0\)/);
  assert.match(cssSource, /\.mobile-nav-category-button\[aria-pressed="true"\] span::after\s*\{[\s\S]*?scaleX\(1\)/);
  assert.match(cssSource, /prefers-reduced-motion:\s*reduce[\s\S]*?\.mobile-nav-category-button span::after\s*\{[\s\S]*?transition:\s*none\s*!important/);
});
```

- [x] **Step 2: Run the targeted test and verify RED**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: FAIL because the current icon still uses a rotated pitched roof and no selected underline exists.

- [x] **Step 3: Redraw the home entrance**

Use `.mobile-nav-home-icon::before` for the outer three-sided frame, `::after` for a horizontal threshold, and the existing `<i>` for a smaller nested three-sided frame. Keep two-pixel strokes, remove the 45-degree roof rotation, and preserve the existing blue diamond and link dimensions.

- [x] **Step 4: Add the selected dual underline**

Create `.mobile-nav-category-button span::after` as a centered five-pixel decorative strip: two pixels navy, a two-pixel transparent gap, and one pixel champagne gold. Default it to `opacity: 0` and `scaleX(0)`; set `opacity: 1` and `scaleX(1)` under `[aria-pressed="true"]`. Use a brief center-out transition and `pointer-events: none`.

- [x] **Step 5: Add reduced-motion behavior and verify GREEN**

Inside the existing reduced-motion media query, set the underline transition to `none !important`. Run `node --test tests/mobile-nav-scroll.test.mjs` and expect all targeted tests to pass.

- [x] **Step 6: Commit the feature**

```bash
git add src/App.css tests/mobile-nav-scroll.test.mjs
git commit -m "feat: clarify mobile menu selection"
```

### Task 2: Production and rendered verification

**Files:**
- Modify: `docs/superpowers/plans/2026-08-04-mobile-menu-selection.md` to mark completed steps.

**Interfaces:**
- Consumes: the production build served locally.
- Produces: evidence that both mobile category states and the home link render correctly without regressions.

- [x] **Step 1: Run full repository verification**

Run: `npm run check`

Expected: all tests pass, the Vite production build succeeds, and `verify:dist` succeeds.

- [x] **Step 2: Verify the default category at 390 × 844**

Open the production preview, open the mobile menu, and confirm the center icon reads as an entrance, the Solutions button has the dual underline, Consulting does not, labels remain legible, and no horizontal overflow appears.

- [x] **Step 3: Verify the alternate category and interaction**

Select Consulting and confirm `aria-pressed` changes, the dual underline moves to Consulting, the four consulting links render, the center home link remains focusable, and the console contains no relevant warning or error.

- [x] **Step 4: Save screenshot evidence and finalize**

Capture both selected states outside the repository, reset the temporary viewport, and close test tabs.

- [x] **Step 5: Complete repository checks**

Run `git diff --check` and `git status --short --branch`. Commit the completed checklist, then push `master` because the user previously requested completed changes be pushed directly.
