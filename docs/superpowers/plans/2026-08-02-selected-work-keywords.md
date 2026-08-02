# Selected Work Keywords Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add localized, always-visible capability keywords to each selected-work category and align the case page's static SEO metadata with those capabilities.

**Architecture:** Extend each localized object in `caseStudyGroupsByLocale` with a `keywords: string[]` field, then render that field as a non-interactive list between the group header and case list. Keep SEO metadata static in `case.html`; no filtering state, new dependencies, or reusable component abstraction is needed.

**Tech Stack:** React 19, Vite 7, plain CSS, Node.js test runner, static HTML metadata

## Global Constraints

- Each category must expose 5–8 non-empty keywords in Chinese, English, and Japanese.
- Keywords must be supported by existing case capabilities; do not add unsupported services or outcomes.
- Preserve standard abbreviations such as ERP, WMS, IoT, CRM, SSO, and UI/UX.
- Keyword chips are informational and must not look or behave like filters.
- Mobile keywords wrap naturally with no horizontal scrolling, including at 120% text scaling.
- Do not change category order, case order, accordion behavior, or any page other than the case portfolio.
- Do not add dependencies.

---

### Task 1: Localized Category Keyword Data

**Files:**
- Modify: `tests/content-2026.test.mjs:94-108`
- Modify: `src/content2026.js:166-184`

**Interfaces:**
- Consumes: existing `caseStudyGroupsByLocale: Record<"zh" | "en" | "ja", CaseStudyGroup[]>`
- Produces: each `CaseStudyGroup` gains `keywords: string[]`

- [ ] **Step 1: Write the failing content test**

Inside the locale loop, after `assertCompleteStrings(groups, ...)`, add:

```js
for (const group of groups) {
  assert.ok(group.keywords.length >= 5, `${locale}.${group.id} minimum keywords`);
  assert.ok(group.keywords.length <= 8, `${locale}.${group.id} maximum keywords`);
  assert.equal(
    new Set(group.keywords).size,
    group.keywords.length,
    `${locale}.${group.id} keywords must be unique`,
  );
  group.keywords.forEach((keyword) => {
    assert.equal(typeof keyword, "string", `${locale}.${group.id} keyword type`);
    assert.notEqual(keyword.trim(), "", `${locale}.${group.id} keyword must not be blank`);
  });
}
```

Also add one semantic guard per locale:

```js
assert.ok(caseStudyGroupsByLocale.zh[0].keywords.includes("ERP"));
assert.ok(caseStudyGroupsByLocale.en[1].keywords.includes("Real-time Monitoring"));
assert.ok(caseStudyGroupsByLocale.ja[2].keywords.includes("会員システム"));
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/content-2026.test.mjs`

Expected: FAIL because `group.keywords` is undefined.

- [ ] **Step 3: Add the localized data**

Add these arrays to the matching category objects:

```js
// zh
operations-management: ["ERP", "WMS", "SCM", "SSO", "權限管理", "生產履歷", "成本管理", "數據儀表板"]
iot-visibility: ["IoT", "即時監控", "感測器整合", "派工管理", "設備管理", "戰情室", "Beacon"]
commerce-members: ["電子商務", "會員系統", "線上預約", "金流串接", "電子發票", "冷鏈物流", "CRM"]
brand-digital: ["品牌官網", "UI/UX", "行動應用", "數位典藏", "互動體驗", "社群功能", "數位產品"]

// en
operations-management: ["ERP", "WMS", "SCM", "SSO", "Access Control", "Production Traceability", "Cost Management", "Data Dashboards"]
iot-visibility: ["IoT", "Real-time Monitoring", "Sensor Integration", "Dispatch Management", "Equipment Management", "Command Dashboard", "Beacon"]
commerce-members: ["E-commerce", "Membership Systems", "Online Booking", "Payment Integration", "E-invoicing", "Cold-chain Logistics", "CRM"]
brand-digital: ["Brand Websites", "UI/UX", "Mobile Apps", "Digital Archives", "Interactive Experiences", "Community Features", "Digital Products"]

// ja
operations-management: ["ERP", "WMS", "SCM", "SSO", "権限管理", "生産履歴", "原価管理", "データダッシュボード"]
iot-visibility: ["IoT", "リアルタイム監視", "センサー連携", "作業指示管理", "設備管理", "統合ダッシュボード", "Beacon"]
commerce-members: ["ECサイト", "会員システム", "オンライン予約", "決済連携", "電子インボイス", "コールドチェーン物流", "CRM"]
brand-digital: ["ブランドサイト", "UI/UX", "モバイルアプリ", "デジタルアーカイブ", "インタラクティブ体験", "コミュニティ機能", "デジタルプロダクト"]
```

Use `keywords: [...]` as a property on each existing object; do not create a second lookup table.

- [ ] **Step 4: Run the content test and verify pass**

Run: `node --test tests/content-2026.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add -- src/content2026.js tests/content-2026.test.mjs
git commit -m "content: add selected work keywords"
```

---

### Task 2: Visible Keyword List and Responsive Styling

**Files:**
- Modify: `tests/site-contracts.test.mjs:95-115`
- Modify: `src/App.jsx:1129-1137`
- Modify: `src/App.css:3427-3460,3590-3610`

**Interfaces:**
- Consumes: `group.keywords: string[]` from Task 1
- Produces: `.case-portfolio-keywords` semantic list rendered once per category

- [ ] **Step 1: Write the failing rendering contract**

In the existing case-page structure test, add:

```js
assert.match(app, /className="case-portfolio-keywords"/);
assert.match(app, /group\.keywords\.map/);
assert.match(css, /\.case-portfolio-keywords\s*\{/);
assert.match(css, /\.case-portfolio-keywords li\s*\{/);
```

- [ ] **Step 2: Run the contract test and verify failure**

Run: `node --test tests/site-contracts.test.mjs`

Expected: FAIL because the keyword list and styles do not exist.

- [ ] **Step 3: Render a non-interactive semantic list**

In `App.jsx`, insert this immediately after `</header>` and before `.case-portfolio-group-list`:

```jsx
<ul className="case-portfolio-keywords" aria-label={`${group.title} keywords`}>
  {group.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
</ul>
```

Use list items, not buttons or links, so the chips do not imply filtering.

- [ ] **Step 4: Add desktop and mobile styling**

Add near the group-header rules:

```css
.case-portfolio-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 860px;
  margin: 0 0 28px 88px;
  padding: 0;
  list-style: none;
}

.case-portfolio-keywords li {
  padding: 7px 10px;
  border: 1px solid var(--ink-line);
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  line-height: 1.4;
  letter-spacing: 0.04em;
}
```

Inside `@media (max-width: 640px)`, align the list with the header copy:

```css
.case-portfolio-keywords {
  margin-left: 52px;
  margin-bottom: 24px;
}
```

- [ ] **Step 5: Run the focused tests**

Run: `node --test tests/content-2026.test.mjs tests/site-contracts.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add -- src/App.jsx src/App.css tests/site-contracts.test.mjs
git commit -m "feat: show selected work keywords"
```

---

### Task 3: Case Page SEO Keywords

**Files:**
- Modify: `tests/site-contracts.test.mjs:123-132`
- Modify: `case.html:5-17`

**Interfaces:**
- Consumes: the approved Chinese capability vocabulary
- Produces: one static `meta[name="keywords"]` and capability-rich description metadata

- [ ] **Step 1: Write the failing SEO contract**

Extend `case metadata presents selected capabilities without anonymity framing` with:

```js
const keywordMeta = html.match(/<meta name="keywords" content="([^"]+)"\s*\/?>/g) || [];
assert.equal(keywordMeta.length, 1, "case page must have one keywords meta tag");
assert.match(keywordMeta[0], /客製化系統開發/);
assert.match(keywordMeta[0], /ERP/);
assert.match(keywordMeta[0], /IoT/);
assert.match(keywordMeta[0], /UI\/UX/);
```

- [ ] **Step 2: Run the contract test and verify failure**

Run: `node --test tests/site-contracts.test.mjs`

Expected: FAIL because `case.html` has no keywords meta tag.

- [ ] **Step 3: Update static metadata**

Add one tag next to the existing description:

```html
<meta name="keywords" content="客製化系統開發, ERP 系統, WMS 倉儲管理, IoT 整合, 即時監控, 電子商務網站, 會員系統, 預約系統, 品牌官網, UI/UX 設計" />
```

Update the standard description, Open Graph description, and Twitter description to the same natural sentence:

```text
精選客製化系統開發實績，涵蓋 ERP、WMS、IoT 即時監控、電子商務、會員與預約系統，以及品牌官網與 UI/UX 設計。
```

- [ ] **Step 4: Run the contract test and verify pass**

Run: `node --test tests/site-contracts.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add -- case.html tests/site-contracts.test.mjs
git commit -m "seo: add case capability keywords"
```

---

### Task 4: Full Verification and Production Deployment

**Files:**
- Verify only: all tracked files changed in Tasks 1–3

**Interfaces:**
- Consumes: completed keyword content, UI, and metadata
- Produces: verified production deployment at `https://estiginto.com/case.html`

- [ ] **Step 1: Run the complete project check**

Run: `npm run check`

Expected: all Node tests pass, Vite build succeeds, and distribution verification succeeds.

- [ ] **Step 2: Check the patch and repository state**

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git status --short`

Expected: only the known untracked `.playwright-cli/`, `docs/audits/`, `output/`, and `tmp/` directories remain; do not add or modify them.

- [ ] **Step 3: Browser QA before deployment**

Start the local production preview and inspect `/case.html` at desktop and a 390px-wide mobile viewport. For `zh`, `en`, and `ja`, verify:

- four keyword lists are visible without opening an accordion;
- chips wrap without horizontal overflow;
- accordion expand/collapse still works;
- at 120% text scaling, `document.documentElement.scrollWidth <= window.innerWidth`;
- browser console has zero errors.

- [ ] **Step 4: Push the verified commits**

Run: `git push origin master`

Expected: push succeeds and the configured production deployment starts.

- [ ] **Step 5: Production QA**

Inspect `https://estiginto.com/case.html` at desktop and mobile widths. Repeat the keyword visibility, three-language, accordion, overflow, and console checks. View page source or inspect the head to confirm exactly one keywords meta tag and the updated description.

- [ ] **Step 6: Record final evidence**

Report the pushed commit, test count, build result, production URL, browser viewport coverage, locale coverage, overflow result, and console error count. Do not claim completion without fresh command and production-browser evidence.
