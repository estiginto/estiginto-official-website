# Consulting Navigation and Premium Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish four real consulting services, fix the mobile category-to-triangle seam, and replace the single fast diagonal page transition with four slower route-based variants.

**Architecture:** Keep the existing single React entry point and `data-target-section` page routing. Add consulting content as localized data plus one focused page component, and extend `PageTransition` with a pure route-to-variant selector and shared timing constants. Mobile trigger geometry uses shared CSS custom properties so the category bar and triangle cannot drift apart.

**Tech Stack:** React 19, Vite 7, CSS animations, Node test runner, in-app Browser QA.

## Global Constraints

- Consulting services are exactly: systems consulting, digital integration consulting, visual design consulting, and international marketing consulting.
- Mobile labels stay short; full titles appear on `/consulting.html`.
- Initial entry is 1,250ms, route leave is 760ms, route reveal is 1,050ms, and reduced motion is 120ms.
- Transition variant is deterministic by destination route, never random.
- The category bar overlaps the triangle boundary by 1px to prevent a Safari antialias seam.
- Preserve the current 21% mobile home diamond.
- Do not add dependencies or unverified business claims.

---

### Task 1: Localized consulting navigation and page

**Files:**
- Create: `consulting.html`
- Modify: `src/App.jsx`
- Modify: `sitemap.xml`
- Test: `tests/site-contracts.test.mjs`
- Test: `tests/mobile-nav-scroll.test.mjs`

**Interfaces:**
- Produces: `consultingServicesByLocale[locale]`, four objects with `id`, `shortLabel`, `title`, `summary`, `situations`, `scope`, `deliverables`, and `execution`.
- Produces: `ConsultingServices({ copy })`, rendering ids `systems-consulting`, `digital-integration`, `visual-design`, and `international-marketing`.
- Consumes: existing `PageTitle`, `SectionEyebrow`, `Contact`, locale selection, page-transition link handling.

- [ ] **Step 1: Write failing contracts for the consulting page and mobile links**

Add assertions that `consulting.html` has `data-target-section="consulting"`, complete metadata, the sitemap includes it, each locale maps the four mobile items to `/consulting.html#<id>`, and the React page renders all four ids plus the shared five-step process.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --test tests/site-contracts.test.mjs tests/mobile-nav-scroll.test.mjs`

Expected: FAIL because `consulting.html`, consulting content, and anchors do not exist.

- [ ] **Step 3: Implement the page and localized navigation**

Create `consulting.html` using the same metadata/font/entry structure as `solutions.html`. In `App.jsx`, replace the business-consulting mobile items with the four approved services and add localized page title/content. Route `initialSection === "consulting"` to `<ConsultingServices copy={copy} />` followed by the existing contact section.

- [ ] **Step 4: Add focused consulting page styles**

Modify `src/App.css` with `.consulting-nav`, `.consulting-service`, `.consulting-service-grid`, `.consulting-deliverables`, and `.consulting-process` rules. Reuse existing colors, type scale, buttons, spacing, and responsive breakpoints.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `node --test tests/site-contracts.test.mjs tests/mobile-nav-scroll.test.mjs`

Expected: all focused tests pass.

### Task 2: Shared mobile geometry and Safari seam guard

**Files:**
- Modify: `src/App.css`
- Test: `tests/mobile-nav-scroll.test.mjs`

**Interfaces:**
- Produces CSS variables on `.mobile-nav`: `--mobile-trigger-bottom`, `--mobile-trigger-height`, and `--mobile-trigger-seam`.
- Consumes the same variables in `.mobile-nav-trigger` and `.mobile-nav-category-switch`.

- [ ] **Step 1: Write the failing geometry contract**

Require `.mobile-nav` to declare the three variables, require trigger bottom/height to consume them, and require the category bottom calculation to subtract the 1px seam.

- [ ] **Step 2: Run the mobile test and verify RED**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: FAIL because geometry is still duplicated as literals.

- [ ] **Step 3: Implement shared geometry**

Set `--mobile-trigger-bottom: max(18px, env(safe-area-inset-bottom, 0px))`, `--mobile-trigger-height: 92px`, and `--mobile-trigger-seam: 1px`. Use them in both trigger and category positioning. Keep the short-viewport rule limited to category height.

- [ ] **Step 4: Run the mobile test and verify GREEN**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: all mobile tests pass.

### Task 3: Route-based premium transition system

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css`
- Test: `tests/page-transition.test.mjs`
- Modify: `tests/site-contracts.test.mjs`

**Interfaces:**
- Produces: `getPageTransitionVariant(pathname)` returning `grille`, `matrix`, `aperture`, or `axis`.
- Produces constants `PAGE_ENTER_DURATION = 1050`, `INITIAL_PAGE_ENTER_DURATION = 1250`, `PAGE_LEAVE_DURATION = 760`, `REDUCED_PAGE_TRANSITION_DURATION = 120`.
- `PageTransition` renders all shared layers once and sets `data-variant` plus `transition-<variant>` class from the current or destination pathname.

- [ ] **Step 1: Write route mapping and timing tests**

Test `/` → `grille`, `/solutions.html` and `/consulting.html` → `matrix`, `/case.html` → `aperture`, and `/about.html`, `/faq.html`, `/contact.html` → `axis`. Assert exact timing constants and non-random selection.

- [ ] **Step 2: Run transition tests and verify RED**

Run: `node --test tests/page-transition.test.mjs tests/site-contracts.test.mjs`

Expected: FAIL because variants and timing constants do not exist.

- [ ] **Step 3: Implement the pure variant selector and controller timing**

Move route selection into a named exported helper. On internal-link click, derive the destination pathname before setting `phase="leaving"`. Preserve hash destinations. Use 1,250ms only for the first load of `/`, 1,050ms for other reveals, 760ms before navigation, and 120ms under reduced motion.

- [ ] **Step 4: Render shared variant layers**

Add grille slats, matrix cells, aperture frame, axis panels, and delayed scan line within `PageTransition`. Keep them `aria-hidden` and pointer-event free.

- [ ] **Step 5: Implement four CSS animation families**

Use route classes to activate only the selected layers. Grille uses staggered vertical slats, matrix uses staggered rectangular cells, aperture uses a centered expanding frame, and axis uses horizontal or vertical shutters. Retain the old diagonal panels only as an unused special class, not the default.

- [ ] **Step 6: Run transition tests and verify GREEN**

Run: `node --test tests/page-transition.test.mjs tests/site-contracts.test.mjs`

Expected: all transition and site contracts pass.

### Task 4: Full verification and production release

**Files:**
- Verify: all changed files

**Interfaces:**
- Consumes all outputs from Tasks 1–3.

- [ ] **Step 1: Run the full repository check**

Run: `npm.cmd run check`

Expected: all tests pass, Vite builds all seven public pages, and `verify:dist` succeeds.

- [ ] **Step 2: Browser QA local mobile navigation**

At 390×844 and 320×667: open the menu, switch to business consulting, verify all four labels, confirm center-label clearances, and measure category-bottom versus trigger-top with the intended 1px overlap.

- [ ] **Step 3: Browser QA local pages and transitions**

Exercise `/`, `/consulting.html#systems-consulting`, `/case.html`, and `/contact.html`. Verify page identity, meaningful DOM, no framework overlay, no console errors, correct anchor landing, representative transition variant classes, and screenshot evidence.

- [ ] **Step 4: Commit and push**

Stage only intended source, HTML, sitemap, test, and plan files. Push `master` without adding existing untracked audit/output directories.

- [ ] **Step 5: Verify production deployment**

Confirm the live asset hashes match `dist`, then repeat the 390×844 menu interaction and consulting anchor check on `https://estiginto.com/`.

