# Estiginto 2026 PDF Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the Estiginto website with the verified 2026 PDF company facts, four service families, fourteen anonymized cases, and complete Traditional Chinese, English, and Japanese content.

**Architecture:** Keep the current React/Vite application and visual system. Add a JSX-free localized content module as the source for company facts, services, and cases; update the existing page components to consume it; replace the single case feature with an accessible expandable portfolio.

**Tech Stack:** React 19, Vite 7, CSS, Node.js built-in test runner.

## Global Constraints

- Traditional Chinese is the semantic source; English and Japanese must be complete natural business translations.
- All fourteen cases remain anonymous in every locale.
- Do not publish PDF client logos or identifiable case screenshots.
- Keep only PDF-backed quantitative claims: 2011, 12 years, 325+, 80,000 members, and one-million-scale data where those last two belong to their specific cases.
- Keep current public routes, visual identity, responsive behavior, reduced-motion support, and font scaling.
- Add no backend, CMS, external API, or production dependency.
- Preserve unrelated working-tree changes.

---

### Task 1: Localized 2026 content model

**Files:**
- Create: `src/content2026.js`
- Create: `tests/content-2026.test.mjs`

**Interfaces:**
- Produces: `supportedLocales: readonly ["zh", "en", "ja"]`
- Produces: `companyStatsByLocale: Record<Locale, CompanyStat[]>`
- Produces: `serviceFamiliesByLocale: Record<Locale, ServiceFamily[]>`
- Produces: `caseStudiesByLocale: Record<Locale, CaseStudy[]>`
- `CompanyStat`: `{ id, label, keyLabel, value, suffix, description }`
- `ServiceFamily`: `{ id, number, eyebrow, title, summary, capabilities, image, meta }`
- `CaseStudy`: `{ id, number, industry, title, summary, capabilities }`

- [ ] **Step 1: Write failing content-contract tests**

Create tests that import the four exports and assert:

```js
assert.deepEqual(supportedLocales, ["zh", "en", "ja"]);
for (const locale of supportedLocales) {
  assert.equal(companyStatsByLocale[locale].length, 3);
  assert.equal(serviceFamiliesByLocale[locale].length, 4);
  assert.equal(caseStudiesByLocale[locale].length, 14);
  assert.deepEqual(
    caseStudiesByLocale[locale].map(({ id }) => id),
    ["elevator-operations", "senior-care-iot", "pharma-management", "shipping-warehouse", "art-collection", "fresh-food-omnichannel", "government-administration", "yacht-event-management", "production-quality", "manufacturing-management", "travel-discovery", "location-broadcast", "event-booking-commerce", "consumer-brand-site"],
  );
}
```

Also recursively assert that every string is non-empty, every case has at least five capabilities, all locales have identical IDs, no content contains `99.9`, `70+`, a customer-name field, or a logo field, and all service images end in `.webp`.

- [ ] **Step 2: Run the new test and verify it fails**

Run: `node --test tests/content-2026.test.mjs`

Expected: FAIL because `src/content2026.js` does not exist.

- [ ] **Step 3: Implement the content module**

Add the three verified company stats, four PDF service families, and fourteen cases listed in the approved design spec. Translate every display field into concise B2B English and polite natural Japanese. Keep acronyms such as ERP, CRM, POS, HRM, WMS, SCM, BDM, SSO, QR, and IoT unchanged. Use only existing `/img/plan/*.webp` assets for the four service records.

- [ ] **Step 4: Run the content tests**

Run: `node --test tests/content-2026.test.mjs`

Expected: PASS with all locale, schema, anonymity, and source-claim checks satisfied.

### Task 2: Integrate verified facts and services

**Files:**
- Modify: `src/App.jsx`
- Modify: `tests/site-contracts.test.mjs`
- Modify: `index.html`
- Modify: `about.html`
- Modify: `solutions.html`
- Modify: `contact.html`

**Interfaces:**
- Consumes: `companyStatsByLocale[copy.locale]`
- Consumes: `serviceFamiliesByLocale[copy.locale]`
- Preserves: existing `Header`, `Hero`, `Manifesto`, `Solutions`, `Contact`, and routing behavior

- [ ] **Step 1: Add failing integration assertions**

Extend the site contracts to require imports from `./content2026.js`, source-backed home/about wording, the mobile number link `tel:+886972118427`, and localized service lookup. Assert the source no longer contains the unsupported public stats:

```js
assert.doesNotMatch(app, /val:\s*"99\.9"/);
assert.doesNotMatch(app, /val:\s*"70"/);
assert.match(app, /companyStatsByLocale\[copy\.locale\]/);
assert.match(app, /serviceFamiliesByLocale\[copy\.locale\]/);
assert.match(app, /href="tel:\+886972118427"/);
```

- [ ] **Step 2: Run the focused integration test and verify failure**

Run: `node --test tests/site-contracts.test.mjs`

Expected: FAIL on the new content integration assertions.

- [ ] **Step 3: Connect the localized content**

Import the content exports into `App.jsx`. Replace the global four-stat and six-solution arrays with locale-selected three-stat and four-service data. Update `Numbers` and `Solutions` to render the new plain-string fields while retaining current typography, image-preview behavior, links, and reveal motion. Update hero, manifesto, page introductions, and contact/footer copy in all three locale objects from the approved source material. Add the mobile telephone link without removing the existing landline, email, LINE, or Facebook links.

- [ ] **Step 4: Refresh page discovery copy**

Update titles and descriptions in the four listed HTML files to accurately mention durable custom systems, website/design/marketing services, anonymized implementation experience, and consultation. Preserve canonical URLs, Open Graph fields, Twitter cards, body route attributes, and script loading.

- [ ] **Step 5: Run site and content tests**

Run: `npm test`

Expected: PASS.

### Task 3: Build the anonymized case portfolio

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css`
- Modify: `case.html`
- Modify: `tests/site-contracts.test.mjs`

**Interfaces:**
- Consumes: `caseStudiesByLocale[copy.locale]`
- Produces: `CasePortfolio({ copy })`
- State: one `activeCaseId: string | null`; selecting the active case again collapses it
- Accessibility: each trigger owns a stable detail-region ID and reports `aria-expanded`

- [ ] **Step 1: Add failing portfolio assertions**

Require `CasePortfolio`, locale-selected case data, buttons with `aria-expanded`, and a labelled details region. Require `case.html` metadata to describe anonymized cross-industry cases. Assert the legacy fabricated metrics (`3.2%`, `D+0.7`, `Manual 28h`) are absent.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `node --test tests/site-contracts.test.mjs`

Expected: FAIL because the legacy single-case component is still present.

- [ ] **Step 3: Implement the portfolio component**

Replace `CaseStudy` with `CasePortfolio`. Render a numbered editorial list/grid in source order. Each item shows industry, title, and summary; its button expands an in-flow detail region containing the localized capabilities. Use in-flow expansion rather than a modal so keyboard focus and mobile scroll remain predictable. Keep text meaningful without images and add no client marks.

- [ ] **Step 4: Add focused responsive styles**

Add `.case-portfolio`, `.case-portfolio-item`, `.case-portfolio-trigger`, `.case-portfolio-summary`, `.case-portfolio-detail`, and `.case-capability-list` styles using existing CSS variables. Use two columns only where space permits, collapse to one column below 900px, retain visible focus treatment, avoid fixed heights, and support long English/Japanese strings plus 120% font scaling.

- [ ] **Step 5: Run tests**

Run: `npm test`

Expected: PASS with fourteen cases, localized content, anonymity, accessibility hooks, and legacy-claim removal verified.

### Task 4: Production and browser verification

**Files:**
- Modify if defects are found: `src/App.jsx`, `src/App.css`, relevant HTML metadata, or tests
- Do not retain temporary screenshots or PDF render artifacts in the final change set

**Interfaces:**
- Produces: verified production build in `dist/`

- [ ] **Step 1: Run the complete automated gate**

Run: `npm run check`

Expected: all Node tests pass, Vite production build succeeds, and distribution verification succeeds.

- [ ] **Step 2: Inspect pages in a browser**

Run the production preview and inspect home, about, solutions, case, and contact at desktop and mobile widths. Switch each page through `zh`, `en`, and `ja`. Verify the case expand/collapse controls with mouse and keyboard, font sizes 90/100/110/120%, reduced motion, external links, and absence of horizontal overflow or console errors.

- [ ] **Step 3: Fix and re-run proportionate checks**

For any defect, add or strengthen the smallest relevant automated assertion, apply the focused fix, rerun that test, and then rerun `npm run check`.

- [ ] **Step 4: Clean temporary artifacts and review the diff**

Remove `tmp/pdfs/` and new browser screenshots created solely for this task. Run `git status --short`, `git diff --check`, and inspect only the task files to confirm no unrelated user changes were overwritten.

- [ ] **Step 5: Commit the implementation**

Stage only the content module, tests, React/CSS changes, refreshed HTML files, and this plan. Commit with:

```text
feat: refresh site from 2026 service portfolio
```
