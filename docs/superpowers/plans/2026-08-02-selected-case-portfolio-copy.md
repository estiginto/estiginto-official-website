# Selected Case Portfolio Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace public anonymous-industry framing with four selected capability categories that show clients the operational value ESTIGINTO delivers.

**Architecture:** Keep `src/content2026.js` as the localized source of truth. Add localized category records that reference existing case IDs, replace each case's `industry` field with an outcome-focused `outcome` field, and make `CasePortfolio` render category sections around the existing accessible expandable case rows. Update route copy and static SEO metadata without adding new assets or dependencies.

**Tech Stack:** React 19, Vite 7, plain JavaScript content modules, CSS, Node test runner, Playwright CLI.

## Global Constraints

- Public copy must not say `匿名案例`, `匿名產業`, `anonymized cases`, `anonymous portfolio`, or `匿名事例`.
- Keep client names, logos, and identifiable client screenshots private.
- Keep the existing 13 public cases and keep `elevator-operations` hidden.
- Do not invent revenue, conversion, time-saving, testimonial, or performance claims.
- Preserve verified case-scale claims such as 80,000 members and million-record-scale data.
- Traditional Chinese, English, and Japanese must use the same four category IDs and case membership.
- Keep the current expand/collapse behavior, keyboard semantics, mobile layout, and font scaling.
- Do not add packages or visual assets.

## File Structure

- `src/content2026.js`: localized case outcomes and the new `caseStudyGroupsByLocale` category records.
- `src/App.jsx`: localized page-level copy and grouped portfolio rendering.
- `src/App.css`: category heading and outcome-label presentation using the existing visual system.
- `case.html`: Chinese-first title, description, Open Graph, and Twitter metadata.
- `tests/content-2026.test.mjs`: content schema, category membership, locale parity, and privacy boundaries.
- `tests/site-contracts.test.mjs`: public copy, grouped rendering, semantic controls, and SEO contracts.

---

### Task 1: Model selected categories and outcome-first case copy

**Files:**
- Modify: `tests/content-2026.test.mjs`
- Modify: `src/content2026.js`

**Interfaces:**
- Produces: `caseStudiesByLocale: Record<"zh" | "en" | "ja", CaseStudy[]>`, where each `CaseStudy` contains `{ id, number, outcome, title, summary, capabilities }` and no `industry` field.
- Produces: `caseStudyGroupsByLocale: Record<"zh" | "en" | "ja", CaseStudyGroup[]>`, where each group contains `{ id, number, title, summary, caseIds }`.
- Group IDs: `operations-management`, `iot-visibility`, `commerce-members`, `brand-digital`.

- [ ] **Step 1: Write failing content-model tests**

Add `caseStudyGroupsByLocale` to the dynamic import and assert the exact category contract:

```js
const expectedCaseGroups = {
  "operations-management": [
    "pharma-management",
    "government-administration",
    "production-quality",
    "manufacturing-management",
  ],
  "iot-visibility": [
    "senior-care-iot",
    "shipping-warehouse",
    "location-broadcast",
  ],
  "commerce-members": [
    "fresh-food-omnichannel",
    "yacht-event-management",
    "event-booking-commerce",
    "consumer-brand-site",
  ],
  "brand-digital": ["art-collection", "travel-discovery"],
};

for (const locale of supportedLocales) {
  const groups = caseStudyGroupsByLocale[locale];
  assert.deepEqual(groups.map(({ id }) => id), Object.keys(expectedCaseGroups));
  assert.deepEqual(
    Object.fromEntries(groups.map(({ id, caseIds }) => [id, caseIds])),
    expectedCaseGroups,
  );
  assert.deepEqual(
    groups.flatMap(({ caseIds }) => caseIds).sort(),
    [...expectedCaseIds].sort(),
  );
  assertCompleteStrings(groups, `${locale}.caseStudyGroups`);

  for (const caseStudy of caseStudiesByLocale[locale]) {
    assert.equal("industry" in caseStudy, false);
    assert.equal(typeof caseStudy.outcome, "string");
    assert.notEqual(caseStudy.outcome.trim(), "");
  }
}
```

Also replace the old anonymous-field assertion message with a privacy assertion for the absent `customerName` and `logo` fields.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/content-2026.test.mjs`

Expected: FAIL because `caseStudyGroupsByLocale` is missing and case records still expose `industry` instead of `outcome`.

- [ ] **Step 3: Replace industry labels with exact outcome labels**

Rename `industry` to `outcome` for all 14 source records in each locale. Use these exact public values for the 13 visible cases:

| Case ID | zh | en | ja |
| --- | --- | --- | --- |
| `senior-care-iot` | 全棟設備與照護資料整合 | Connected facilities and care data | 館内設備とケアデータの統合 |
| `pharma-management` | 跨國醫療關係與簽署流程 | Global medical relationships and approvals | グローバル医療関係者・署名業務 |
| `shipping-warehouse` | 儲量、船運與指派同步 | Inventory, shipping, and allocation in sync | 在庫量・船便・割り当ての一元化 |
| `art-collection` | 數位典藏到交易服務 | From digital archives to transactions | デジタルアーカイブから取引まで |
| `fresh-food-omnichannel` | 電商、冷鏈與配送整合 | Commerce, cold chain, and delivery | EC・コールドチェーン・配送の統合 |
| `government-administration` | 高安全性大規模資料管理 | Secure large-scale data operations | 高セキュリティの大規模データ管理 |
| `yacht-event-management` | 報價、保險與預約串接 | Quotations, insurance, and booking | 見積・保険・予約の連携 |
| `production-quality` | 行動驗收與生產履歷 | Mobile inspection and production records | モバイル検収と生産履歴 |
| `manufacturing-management` | 物料、工單與成本串接 | Materials, work orders, and costing | 材料・製造指示・原価の連携 |
| `travel-discovery` | 地點探索與社群互動 | Place discovery and community engagement | スポット探索とコミュニティ交流 |
| `location-broadcast` | 定位式訊息與實境互動 | Location-aware messaging and interaction | 位置連動メッセージとリアル体験 |
| `event-booking-commerce` | 會員、預約與支付自動化 | Automated membership, booking, and payment | 会員・予約・決済の自動化 |
| `consumer-brand-site` | 品牌體驗與購物轉換 | Brand experience and shopping conversion | ブランド体験と購買導線 |

The hidden elevator record may use `維修派工與設備即時管理` / `Real-time dispatch and equipment operations` / `保守派遣と設備のリアルタイム管理`; it remains filtered from exports.

- [ ] **Step 4: Add localized group data**

Add a `caseStudyGroupsByLocale` export after `caseStudiesByLocale` with these exact titles, descriptions, and memberships:

```js
export const caseStudyGroupsByLocale = {
  zh: [
    { id: "operations-management", number: "01", title: "營運整合與管理", summary: "把分散的人員、資料、權限與作業流程，整理成一套可追蹤、可管理的營運系統。", caseIds: ["pharma-management", "government-administration", "production-quality", "manufacturing-management"] },
    { id: "iot-visibility", number: "02", title: "IoT 與即時監控", summary: "串接設備、感測資料、派工與戰情資訊，讓現場狀況即時可見，也更容易採取行動。", caseIds: ["senior-care-iot", "shipping-warehouse", "location-broadcast"] },
    { id: "commerce-members", number: "03", title: "電商與會員服務", summary: "整合會員、預約、付款、物流與通知，讓線上服務不只好看，也能完成交易與後續營運。", caseIds: ["fresh-food-omnichannel", "yacht-event-management", "event-booking-commerce", "consumer-brand-site"] },
    { id: "brand-digital", number: "04", title: "品牌體驗與數位創新", summary: "把內容、互動與服務設計成可使用的數位產品，讓品牌特色被看見，也能持續延伸。", caseIds: ["art-collection", "travel-discovery"] },
  ],
  en: [
    { id: "operations-management", number: "01", title: "Operations & Management", summary: "Bring people, data, permissions, and workflows into one operation teams can track and manage.", caseIds: ["pharma-management", "government-administration", "production-quality", "manufacturing-management"] },
    { id: "iot-visibility", number: "02", title: "IoT & Real-time Visibility", summary: "Connect equipment, sensor data, dispatch, and dashboards so teams can see what is happening and act sooner.", caseIds: ["senior-care-iot", "shipping-warehouse", "location-broadcast"] },
    { id: "commerce-members", number: "03", title: "Commerce & Member Services", summary: "Connect membership, booking, payment, logistics, and notifications into services that complete transactions and support operations.", caseIds: ["fresh-food-omnichannel", "yacht-event-management", "event-booking-commerce", "consumer-brand-site"] },
    { id: "brand-digital", number: "04", title: "Brand Experience & Digital Products", summary: "Turn content, interaction, and service ideas into useful digital products that carry the brand forward.", caseIds: ["art-collection", "travel-discovery"] },
  ],
  ja: [
    { id: "operations-management", number: "01", title: "業務統合・管理", summary: "人、データ、権限、業務フローを一つに整理し、追跡・管理できる運用基盤を構築します。", caseIds: ["pharma-management", "government-administration", "production-quality", "manufacturing-management"] },
    { id: "iot-visibility", number: "02", title: "IoT・リアルタイム監視", summary: "設備、センサーデータ、派遣、ダッシュボードをつなぎ、現場の状況把握と迅速な対応を支えます。", caseIds: ["senior-care-iot", "shipping-warehouse", "location-broadcast"] },
    { id: "commerce-members", number: "03", title: "EC・会員サービス", summary: "会員、予約、決済、物流、通知をつなぎ、取引から運用まで続くオンラインサービスを設計します。", caseIds: ["fresh-food-omnichannel", "yacht-event-management", "event-booking-commerce", "consumer-brand-site"] },
    { id: "brand-digital", number: "04", title: "ブランド体験・デジタルプロダクト", summary: "コンテンツ、体験、サービスを使えるデジタルプロダクトへ落とし込み、ブランドの展開を支えます。", caseIds: ["art-collection", "travel-discovery"] },
  ],
};
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `node --test tests/content-2026.test.mjs`

Expected: all content tests pass with 13 visible cases assigned exactly once across four groups in all locales.

- [ ] **Step 6: Commit the content model**

```powershell
git add src/content2026.js tests/content-2026.test.mjs
git commit -m "feat: group selected work by client value"
```

---

### Task 2: Render the grouped portfolio and replace public page copy

**Files:**
- Modify: `tests/site-contracts.test.mjs`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `caseStudiesByLocale[locale]` and `caseStudyGroupsByLocale[locale]` from Task 1.
- Preserves: `activeCaseId: string | null`, `aria-expanded`, `aria-controls`, and the labelled detail region.
- Produces: four `.case-portfolio-group` sections, each containing its referenced case rows.

- [ ] **Step 1: Write failing grouped-rendering and copy tests**

Replace the old anonymized-portfolio contract with:

```js
test("case page groups selected work by client value", () => {
  const app = read("src/App.jsx");

  assert.match(app, /caseStudyGroupsByLocale\[copy\.locale\]/);
  assert.match(app, /className="case-portfolio-group"/);
  assert.match(app, /caseStudy\.outcome/);
  assert.doesNotMatch(app, /caseStudy\.industry/);
  assert.match(app, /aria-expanded=\{isActive\}/);
  assert.match(app, /role="region"/);
  assert.match(app, /精選實績/);
  assert.match(app, /查看解法/);
  assert.doesNotMatch(app, /14 個匿名案例|跨產業匿名案例|14 anonymized cases|匿名事例 14件/);
});
```

Load `src/App.css` with the test file's existing `read()` helper and assert `.case-portfolio-group`, `.case-portfolio-group-header`, and `.case-portfolio-outcome` exist.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/site-contracts.test.mjs`

Expected: FAIL because the component still renders a flat list, industry labels, and anonymous-count copy.

- [ ] **Step 3: Import group data and replace localized page copy**

Import `caseStudyGroupsByLocale` beside `caseStudiesByLocale`.

Use these page titles:

```js
zh: { kicker: "Selected Work", title: "精選實績", lede: "不只完成系統，更把複雜的營運需求，整理成真正能長期使用的工具。" }
en: { kicker: "Selected Work", title: "Selected Work", lede: "We turn complex operating needs into systems teams can rely on and keep using." }
ja: { kicker: "Selected Work", title: "実績紹介", lede: "複雑な業務要件を整理し、現場で長く使える仕組みへ。" }
```

Replace `solutionsUi.label` values with `依需求查看解法`, `Explore by need`, and `課題別に見る`.

Replace `CasePortfolio` labels with:

```js
zh: { section: "精選實績", meta: "依需求查看解法", intro: "從問題出發，看見我們如何把流程做成可持續運作的系統。", expand: "查看解法", collapse: "收合內容", details: "建置內容" }
en: { section: "Selected Work", meta: "Explore by need", intro: "Start with the problem and see how we turn workflows into systems built for ongoing use.", expand: "View solution", collapse: "Close details", details: "What we built" }
ja: { section: "実績紹介", meta: "課題別に見る", intro: "課題を起点に、業務フローを継続運用できる仕組みへ整えた事例をご紹介します。", expand: "解決内容を見る", collapse: "詳細を閉じる", details: "構築内容" }
```

- [ ] **Step 4: Render cases inside category sections**

Create a `Map` from case ID to case record, then render each group in source order:

```jsx
const groups = caseStudyGroupsByLocale[copy.locale] || caseStudyGroupsByLocale.zh;
const casesById = new Map(cases.map((caseStudy) => [caseStudy.id, caseStudy]));

{groups.map((group) => (
  <section className="case-portfolio-group" key={group.id} aria-labelledby={`case-group-${group.id}`}>
    <header className="case-portfolio-group-header">
      <span className="case-portfolio-group-number">{group.number}</span>
      <div>
        <h2 id={`case-group-${group.id}`}>{group.title}</h2>
        <p>{group.summary}</p>
      </div>
    </header>
    <div className="case-portfolio-group-list">
      {group.caseIds.map((caseId) => {
        const caseStudy = casesById.get(caseId);
        if (!caseStudy) return null;
        const isActive = activeCaseId === caseStudy.id;
        const triggerId = `case-trigger-${caseStudy.id}`;
        const detailId = `case-detail-${caseStudy.id}`;

        return (
          <article className={`case-portfolio-item ${isActive ? "is-active" : ""}`} key={caseStudy.id}>
            <button
              className="case-portfolio-trigger"
              id={triggerId}
              type="button"
              aria-expanded={isActive}
              aria-controls={detailId}
              onClick={() => setActiveCaseId(isActive ? null : caseStudy.id)}
            >
              <span className="case-portfolio-number">{caseStudy.number}</span>
              <span className="case-portfolio-heading">
                <span className="case-portfolio-outcome">{caseStudy.outcome}</span>
                <span className="case-portfolio-title">{caseStudy.title}</span>
              </span>
              <span className="case-portfolio-action">{isActive ? labels.collapse : labels.expand}</span>
              <span className="case-portfolio-icon" aria-hidden="true" />
            </button>
            <p className="case-portfolio-summary">{caseStudy.summary}</p>
            {isActive ? (
              <div className="case-portfolio-detail" id={detailId} role="region" aria-labelledby={triggerId}>
                <span className="case-portfolio-detail-label">{labels.details}</span>
                <ul className="case-capability-list">
                  {caseStudy.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  </section>
))}
```

Add `<p className="case-portfolio-intro">{labels.intro}</p>` below `SectionEyebrow`. Change the old industry span to:

```jsx
<span className="case-portfolio-outcome">{caseStudy.outcome}</span>
```

- [ ] **Step 5: Add minimal category styling**

Use existing variables and responsive behavior:

```css
.case-portfolio-intro {
  max-width: 720px;
  margin: 0 0 clamp(48px, 7vw, 88px);
  color: var(--ink-soft);
  font-size: var(--fs-body-lg);
}

.case-portfolio-group + .case-portfolio-group {
  margin-top: clamp(64px, 9vw, 112px);
}

.case-portfolio-group-header {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 24px;
  max-width: 860px;
  margin-bottom: 28px;
}

.case-portfolio-group-header h2 {
  margin: 0 0 10px;
  font-size: var(--fs-h3);
}

.case-portfolio-group-header p {
  margin: 0;
  color: var(--ink-soft);
  max-width: 60ch;
}

.case-portfolio-group-number,
.case-portfolio-outcome {
  color: var(--amber);
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .case-portfolio-group-header {
    grid-template-columns: 40px minmax(0, 1fr);
    gap: 12px;
  }
}
```

Reuse the old `.case-portfolio-industry` declarations for `.case-portfolio-outcome`, then remove the obsolete industry selector.

- [ ] **Step 6: Run the focused test and verify GREEN**

Run: `node --test tests/site-contracts.test.mjs`

Expected: all site contract tests pass with grouped rendering and no public anonymous wording.

- [ ] **Step 7: Commit the grouped interface**

```powershell
git add src/App.jsx src/App.css tests/site-contracts.test.mjs
git commit -m "feat: present selected work by client need"
```

---

### Task 3: Align case-page metadata and verify the public experience

**Files:**
- Modify: `tests/site-contracts.test.mjs`
- Modify: `case.html`

**Interfaces:**
- Consumes: selected-work positioning from Task 2.
- Produces: consistent route metadata and a deployable verified build.

- [ ] **Step 1: Write failing SEO copy tests**

Add assertions for the exact Chinese-first metadata and forbidden public phrases:

```js
test("case metadata presents selected capabilities without anonymity framing", () => {
  const html = read("case.html");
  assert.match(html, /精選實績｜ESTIGINTO 造物者科技/);
  assert.match(html, /營運整合、IoT、電商會員與數位產品/);
  assert.doesNotMatch(html, /匿名|14 個跨產業/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/site-contracts.test.mjs`

Expected: FAIL because `case.html` still advertises 14 anonymous cross-industry cases.

- [ ] **Step 3: Replace static metadata**

Use:

```html
<title>精選實績｜ESTIGINTO 造物者科技</title>
<meta name="description" content="查看 ESTIGINTO 在營運整合、IoT、電商會員與數位產品上的精選實績，了解我們如何把複雜需求整理成能長期使用的系統。" />
<meta property="og:title" content="精選實績｜ESTIGINTO 造物者科技" />
<meta property="og:description" content="從營運整合、IoT 到電商會員與數位產品，看 ESTIGINTO 如何把流程做成可持續運作的系統。" />
<meta name="twitter:title" content="精選實績｜ESTIGINTO 造物者科技" />
<meta name="twitter:description" content="查看營運整合、IoT、電商會員與數位產品的精選實績。" />
```

Preserve canonical URL, social image, favicon, fonts, body route data, and script loading.

- [ ] **Step 4: Run focused and full automated verification**

Run:

```powershell
node --test tests/content-2026.test.mjs tests/site-contracts.test.mjs
npm run check
git diff --check
```

Expected: 0 failures; Vite build succeeds; `verify:dist` verifies the complete distribution; no whitespace errors.

- [ ] **Step 5: Run local browser QA**

At 390x844 and 1440x900, verify `/case.html` in Chinese, English, and Japanese:

- Four groups appear in the approved order.
- Every visible case appears once.
- Expand/collapse works by pointer and keyboard.
- No anonymous/industry framing is visible.
- No horizontal overflow at 100% and 120% font scale.
- Console contains zero errors.

- [ ] **Step 6: Commit metadata and final verification changes**

```powershell
git add case.html tests/site-contracts.test.mjs
git commit -m "seo: position case page around selected work"
```

- [ ] **Step 7: Push and verify production**

Push the current `master` branch as previously authorized, wait for Vercel commit status `success`, then repeat the mobile selected-work and console checks at `https://estiginto.com/case.html`.

Expected: production serves the new metadata, four grouped sections, outcome-first labels, and no public anonymous wording.
