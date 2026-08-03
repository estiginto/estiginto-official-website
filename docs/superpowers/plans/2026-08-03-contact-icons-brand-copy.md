# Contact Icons and Brand Copy Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refresh the homepage brand statement, remove outdated achievements/footer copy, and add consistent accessible contact icons to the main contact card and shared footer across all locales.

**Architecture:** Keep localized marketing copy inside `localizedCopy` in `src/App.jsx`, keep shared company statistics in `src/content2026.js`, and introduce one small inline-SVG `ContactIcon` component reused by both contact surfaces. Styling remains in `src/App.css`; source-level regression tests protect exact multilingual copy, structure, destinations, and removed business-ID text.

**Tech Stack:** React 19, Vite 7, CSS, Node.js built-in test runner.

---

## Task 1: Lock the multilingual hero contract with a failing test

**Files:**
- Create: `tests/contact-brand-copy.test.mjs`
- Test: `tests/contact-brand-copy.test.mjs`

**Step 1: Write the failing test**

Create a source-contract test that reads `src/App.jsx` as UTF-8 and asserts all four approved strings per locale:

```js
const approvedHeroCopy = {
  zh: ["致力於打造", "有靈魂的設計", "打造直達目標、永續且彈性的解決方案", "改善企業及社會榮景"],
  en: ["Driven to create", "design with soul", "We build focused, sustainable, and adaptable solutions", "that advance business and social prosperity."],
  ja: ["私たちが目指すのは", "魂のあるデザイン", "目標へ直結する、持続可能で柔軟なソリューションを構築し", "企業と社会の豊かさに貢献します。"],
};
```

Also assert the hero renders exactly two title rows and two lede lines: `title[0]`, `title[1]`, `lede[0]`, and `lede[1]` are present in the `Hero` function, while `title[2]` and `lede[2]` are absent from that function body.

**Step 2: Run the test to verify it fails**

Run: `node --test tests/contact-brand-copy.test.mjs`

Expected: FAIL because the approved copy and two-row structure are not implemented yet.

## Task 2: Implement the approved hero copy and layout

**Files:**
- Modify: `src/App.jsx:553-557,662,714,1079-1091`
- Modify: `src/App.css:1666-1688,2934`
- Test: `tests/contact-brand-copy.test.mjs`

**Step 1: Replace localized hero copy**

Change each locale's hero title and lede arrays to the approved two-item arrays. Preserve the existing locale-specific kicker and scroll label.

**Step 2: Simplify the hero markup**

Render the first title line with `row1` and the gold second line with `row2 accent`. Render only the two lede lines with a single `<br />`.

**Step 3: Remove obsolete three-row styling**

Drop `.row3` selectors and retain block layout for `.row1` and `.row2`. Keep the approved restrained gold `#b18147`, current responsive type scale, and spacing after the accent line.

**Step 4: Run the focused test**

Run: `node --test tests/contact-brand-copy.test.mjs`

Expected: PASS for the multilingual hero assertions.

## Task 3: Remove the achievements introduction and visible business ID

**Files:**
- Modify: `tests/contact-brand-copy.test.mjs`
- Modify: `src/App.jsx:1182-1194,1835-1838`
- Modify: `src/App.css:1495-1499`

**Step 1: Add failing removal assertions**

Assert that the `Numbers` function still resolves `companyStatsByLocale` and renders `copy.achievements.meta`, but no longer renders `copy.achievements.label`. Assert that the shared footer still renders `footer.company`, while `統一編號` and `42752468` no longer appear anywhere in `src/App.jsx`.

**Step 2: Run the focused test to verify it fails**

Run: `node --test tests/contact-brand-copy.test.mjs`

Expected: FAIL on the old achievements label and business ID.

**Step 3: Remove only the requested visible copy**

Omit the `label` prop from the achievements `SectionEyebrow`, leaving its index, rule, meta, and three existing statistic cells intact. Remove the business-ID line break and text from `Footer`, leaving the localized company name.

**Step 4: Remove dead achievements-label CSS**

Delete `.achievements-eyebrow .section-eyebrow-label` because the paragraph no longer renders.

**Step 5: Run the focused test**

Run: `node --test tests/contact-brand-copy.test.mjs`

Expected: PASS for removal assertions without changing `src/content2026.js` statistic values.

## Task 4: Add one reusable accessible contact-icon system

**Files:**
- Modify: `tests/contact-brand-copy.test.mjs`
- Modify: `src/App.jsx:1778-1853`
- Modify: `src/App.css:2764-2785,2818-2833,3620-3621`

**Step 1: Add failing icon assertions**

Assert that `ContactIcon` exists, uses an inline `<svg>` with `aria-hidden="true"`, and supports `email`, `phone`, `mobile`, and `line`. Assert that both `Contact` and `Footer` render all four types while preserving these destinations:

```text
mailto:contact@estiginto.com
tel:+886224315362
tel:+886972118427
https://lin.ee/vFdwfVg
```

**Step 2: Run the focused test to verify it fails**

Run: `node --test tests/contact-brand-copy.test.mjs`

Expected: FAIL because no contact icon component exists.

**Step 3: Implement `ContactIcon`**

Add a local component above `Contact` that returns a 24×24, `fill="none"`, `stroke="currentColor"` SVG. Use simple outline geometry for envelope, telephone handset, mobile device, and chat bubble. Keep it decorative with `aria-hidden="true"` and `focusable="false"`; the adjacent visible link text remains the accessible name.

**Step 4: Reuse icons in both contact surfaces**

Wrap each main contact value and footer contact item with a common `contact-channel-link` class, render its matching `ContactIcon`, and retain current link labels, protocols, targets, and rel attributes.

**Step 5: Style alignment and responsive behavior**

Give `.contact-channel-link` an inline-flex row, centered alignment, consistent gap, and `min-width: 0`. Size `.contact-channel-icon` at approximately 18px in the contact card and 15–16px in the footer; prevent shrinking and inherit text color. Change `.contact-row` alignment from baseline to center so icon and value stay optically aligned. At small widths, allow long email text to wrap without clipping.

**Step 6: Run the focused test**

Run: `node --test tests/contact-brand-copy.test.mjs`

Expected: PASS for component reuse, accessibility, and preserved links.

## Task 5: Verify the complete site and production build

**Files:**
- Verify: `src/App.jsx`
- Verify: `src/App.css`
- Verify: `tests/contact-brand-copy.test.mjs`

**Step 1: Run the full automated gate**

Run: `npm run check`

Expected: all Node tests pass, Vite builds successfully, and `verify:dist` passes.

**Step 2: Run whitespace validation**

Run: `git diff --check`

Expected: no output.

**Step 3: Perform browser QA**

Start the production preview and inspect at 390px mobile and desktop width:

- Hero shows two title lines and two supporting lines in Chinese, English, and Japanese.
- Language changes do not reveal stale third lines.
- Achievements keeps its title/rule/meta and metrics but has no introduction paragraph.
- Main contact and footer each show four aligned outline icons.
- Email may wrap on narrow screens without overflow.
- Footer contains no visible business ID.
- Browser console has no errors.

**Step 4: Review the final diff**

Run: `git diff -- src/App.jsx src/App.css tests/contact-brand-copy.test.mjs`

Expected: only the approved content, icon, accessibility, and layout changes.

**Step 5: Commit the implementation**

```bash
git add src/App.jsx src/App.css tests/contact-brand-copy.test.mjs docs/superpowers/plans/2026-08-03-contact-icons-brand-copy.md
git commit -m "feat: refresh brand copy and contact details"
```

**Step 6: Publish and verify**

Push `master`, confirm the remote branch contains the new commit, and verify the formal site serves the new build assets and approved visible content.
