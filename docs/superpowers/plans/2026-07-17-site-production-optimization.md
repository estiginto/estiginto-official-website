# ESTIGINTO Site Production Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a smaller, searchable, consistently routed production build while preserving the current Vite/React site design.

**Architecture:** Keep the multi-entry React application and introduce a testable static-asset policy module plus Node built-in contract tests. HTML entries own page metadata; the build-copy step owns non-bundled assets and discovery files.

**Tech Stack:** React 19, Vite 7, Node.js test runner, WebP static images

## Global Constraints

- No framework migration or visual redesign.
- Preserve current public HTML entry paths.
- Keep original photographs in source control but exclude them from the production artifact.
- Do not deploy `Oasis/assets/videos`.
- Production output must remain below 40 MiB and each deployed marketing image below 1 MiB.

---

### Task 1: Website contract tests

**Files:**
- Create: `tests/site-contracts.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: HTML entries, `src/App.jsx`, and exported static asset policy.
- Produces: `npm test` and `npm run check` commands.

- [ ] Write tests that require unique metadata, canonical navigation targets, no draft-page gate, WebP plan-image references, sitemap/robots sources, and an asset policy that rejects Oasis videos.
- [ ] Run `npm test` and confirm failures describe the missing corrected behavior.
- [ ] Add only the scripts needed to run the tests.

### Task 2: Deployment asset boundary and optimized photographs

**Files:**
- Create: `scripts/static-assets.mjs`
- Modify: `scripts/copy-static.mjs`
- Modify: `src/App.jsx`
- Create: `img/plan/*.webp`

**Interfaces:**
- Produces: `shouldCopyOasisPath(relativePath)` and `rootStaticFiles` for the copy script and tests.

- [ ] Implement a platform-independent filter that excludes `Oasis/assets/videos`.
- [ ] Convert the five referenced source photographs to WebP with maximum dimension 1920 and quality 82.
- [ ] Update React image references to WebP.
- [ ] Run `npm test` and confirm the asset and image-reference contracts pass.

### Task 3: Route and content readiness

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Primary navigation maps solutions to `/solutions.html` and case studies to `/case.html`.

- [ ] Change localized navigation labels so solutions and case studies are distinct.
- [ ] Remove the production construction gate for finished about and case content.
- [ ] Keep FAQ reachable in the footer.
- [ ] Run `npm test` and confirm route/content contracts pass.

### Task 4: Page discovery metadata

**Files:**
- Modify: `about.html`, `case.html`, `contact.html`, `faq.html`, `solutions.html`
- Create: `robots.txt`, `sitemap.xml`

**Interfaces:**
- Each entry provides a unique title, description, canonical URL, Open Graph fields, and Twitter card fields.

- [ ] Add page-specific metadata to all secondary entries.
- [ ] Add a robots file pointing to the sitemap and a sitemap listing all six public pages.
- [ ] Run `npm test` and confirm all discovery contracts pass.

### Task 5: Built-output verification

**Files:**
- Create: `scripts/verify-dist.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run verify:dist` and a combined `npm run check` gate.

- [ ] Verify required root files and HTML entries exist in `dist`.
- [ ] Fail if Oasis video files are present, total output exceeds 40 MiB, or a deployed marketing image exceeds 1 MiB.
- [ ] Run `npm run check`, `npm run build`, `npm run verify:dist`, and `git diff --check`.

## Self-review

- Coverage: every in-scope requirement maps to Tasks 1-5.
- Placeholder scan: no deferred implementation placeholders exist; deliberately deferred strategy is documented in the design.
- Interface consistency: the asset policy is exported once and consumed by both copy and tests; `check` is the single complete local verification command.

