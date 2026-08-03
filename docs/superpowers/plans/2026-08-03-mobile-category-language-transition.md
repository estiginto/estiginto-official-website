# Mobile Category and Language Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the mobile category rail, replace the mobile Home label with a compact icon, add a restrained language-change transition, and remove Facebook from the shared footer.

**Architecture:** Keep localized menu content in `App.jsx` and presentation in `App.css`. Add a small pure `languageTransition.js` module for transition eligibility and timing so timer coordination in `App` has independently testable rules. The existing initial language-prompt flight remains separate and commits its locale immediately.

**Tech Stack:** React 19, Vite 7, CSS, Node test runner, in-app Browser QA.

## Global Constraints

- Category labels are `解決方案` and `顧問服務` in Traditional Chinese, with concise English/Japanese equivalents.
- Common mobile category type is approximately 20px; English and Japanese may wrap to at most two lines.
- Selected category background is light warm greige `#d8d0c2`, not saturated gold.
- Language transition totals approximately 650ms and uses mild blur plus a subtle horizontal scan.
- Reduced-motion users receive an immediate locale swap without blur or scan movement.
- The Home control keeps its URL, accessible localized name, and touch target while the visible center diamond shrinks approximately 35%.
- The Facebook footer link is removed; LINE and all other contact information remain.
- Do not alter route-transition variants, mobile prompt flight, category link destinations, or desktop cursor-menu behavior.

---

### Task 1: Mobile category copy, palette, and typography

**Files:**
- Modify: `tests/mobile-nav-scroll.test.mjs`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `mobileMenuGroupsByLocale` and `.mobile-nav-category-button`.
- Produces: localized category labels and responsive two-line-safe rail styling.

- [ ] **Step 1: Write failing assertions**

Update the existing category tests to require `解決方案`, `顧問服務`, concise English/Japanese labels, `font-size: clamp(1.1rem, 5vw, 1.25rem)`, and selected fill `#d8d0c2` with a muted border.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: category-copy, font-size, and palette assertions fail against the current long labels, 11–12px type, and `#b89a62` fill.

- [ ] **Step 3: Implement minimal copy and CSS changes**

Set localized labels to concise equivalents, increase responsive type, retain two-line clamping for `en`/`ja`, and change the pressed rule to:

```css
.mobile-nav-category-button[aria-pressed="true"] {
  border-color: #b7a98f;
  background: #d8d0c2;
  color: #171817;
}
```

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: all mobile-nav tests pass.

### Task 2: Compact icon-only Home control

**Files:**
- Modify: `tests/mobile-nav-scroll.test.mjs`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: center item from `getMenuItems(locale)`.
- Produces: `.mobile-nav-home-icon`, localized `aria-label`, and a smaller visual diamond with unchanged link hit area.

- [ ] **Step 1: Write failing assertions**

Require the center anchor to expose `aria-label={item.label}`, render a decorative `.mobile-nav-home-icon`, and apply the smaller center pseudo-element without reducing the anchor's width/height.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: icon, accessible-name, and reduced visual-footprint assertions fail.

- [ ] **Step 3: Implement the icon and visual size**

Render the normal text for non-center items and this presentation for the center item:

```jsx
{item.position === "center" ? (
  <span className="mobile-nav-home-icon" aria-hidden="true"><i /></span>
) : <span>{item.label}</span>}
```

Add the localized `aria-label` on the center link. Draw the outline house with CSS borders/pseudo-elements, and size `.mobile-nav-link.center::before` to approximately 65% of its current visual footprint while leaving the anchor hit box unchanged.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/mobile-nav-scroll.test.mjs`

Expected: all mobile-nav tests pass.

### Task 3: Remove Facebook from the shared footer

**Files:**
- Modify: `tests/content-2026.test.mjs`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: shared `Footer` component.
- Produces: footer without Facebook while preserving LINE.

- [ ] **Step 1: Write the failing regression test**

Read `App.jsx` and assert it does not contain `facebook.com` or a Facebook link label, while still containing `https://lin.ee/vFdwfVg`.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/content-2026.test.mjs`

Expected: failure because the Facebook anchor still exists.

- [ ] **Step 3: Remove only the Facebook anchor**

Delete the footer `<a>` pointing to `https://www.facebook.com/Estiginto/`. Leave adjacent contact markup unchanged.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/content-2026.test.mjs`

Expected: all content tests pass.

### Task 4: Testable language-transition rules

**Files:**
- Create: `src/languageTransition.js`
- Create: `tests/language-transition.test.mjs`

**Interfaces:**
- Produces: `LANGUAGE_TRANSITION_SWAP_DELAY`, `LANGUAGE_TRANSITION_DURATION`, and `shouldAnimateLanguageChange({ currentLocale, nextLocale, busy, reducedMotion })`.
- Returns: boolean; true only for a new locale while idle and motion is allowed.

- [ ] **Step 1: Write failing unit tests**

Test exact timing values, a normal locale change, active-locale no-op, busy-state rejection, and reduced-motion rejection.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/language-transition.test.mjs`

Expected: module-not-found failure because `languageTransition.js` does not exist.

- [ ] **Step 3: Implement the pure rules**

```js
export const LANGUAGE_TRANSITION_SWAP_DELAY = 280;
export const LANGUAGE_TRANSITION_DURATION = 650;

export function shouldAnimateLanguageChange({ currentLocale, nextLocale, busy, reducedMotion }) {
  return Boolean(nextLocale) && nextLocale !== currentLocale && !busy && !reducedMotion;
}
```

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/language-transition.test.mjs`

Expected: all language-transition unit tests pass.

### Task 5: Wire the language transition into App

**Files:**
- Modify: `tests/language-transition.test.mjs`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: helpers from `src/languageTransition.js`.
- Produces: `language-transition-covering`, `language-transition-revealing`, and decorative `.language-transition-scan` states.

- [ ] **Step 1: Add failing integration assertions**

Require imports of the timing/rule module, phase state, timer cleanup, a midpoint `commitLocale`, a no-op for the active locale, a dedicated scan element with `aria-hidden="true"`, and prompt usage of immediate `commitLocale`.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/language-transition.test.mjs`

Expected: integration assertions fail because App still swaps locale immediately and has no scan layer.

- [ ] **Step 3: Implement state and timer coordination**

Split persistence into `commitLocale(nextLocale)`. In `selectLocale`, immediately commit only for reduced motion; otherwise set `covering`, schedule `commitLocale` plus `revealing` at 280ms, and reset to `idle` at 650ms. Ignore repeated/active selection, clear both timers on unmount, and pass `commitLocale` to `MobileHomeLanguagePrompt` so its existing flight remains unchanged.

- [ ] **Step 4: Implement presentation CSS**

Add a fixed, pointer-transparent transition layer below the header and controls. During covering/revealing, apply mild `filter: blur(...)` and opacity only to `.page-main` and footer, animate a low-contrast horizontal scan top-to-bottom, and remove all motion/effects under `prefers-reduced-motion: reduce`.

- [ ] **Step 5: Verify GREEN**

Run: `node --test tests/language-transition.test.mjs tests/mobile-language-prompt.test.mjs`

Expected: all transition and prompt tests pass.

### Task 6: Complete verification and rendered QA

**Files:**
- Verify: `src/App.jsx`, `src/App.css`, `src/languageTransition.js`, affected tests

**Interfaces:**
- Consumes: completed implementation.
- Produces: production-ready verified bundle.

- [ ] **Step 1: Run the full verification command**

Run: `npm.cmd run check`

Expected: all Node tests pass, Vite production build succeeds, and dist verification succeeds.

- [ ] **Step 2: Run Browser QA at 320px and 390px**

The flow under test is: `/solutions.html` loads → mobile menu opens → category controls switch link groups → Home icon remains centered and accessible → language changes from Chinese to English/Japanese → scan/blur completes without layout shift → footer has LINE and no Facebook.

Check page identity, meaningful DOM, no framework overlay, `tab.dev.logs({ levels: ["error", "warn"], limit: 50 })`, screenshots, label wrapping, clipping, and interaction state.

- [ ] **Step 3: Commit implementation**

Stage only the implementation and test files. Commit with `fix: refine mobile menu and locale transition`.

- [ ] **Step 4: Push and verify production**

Push `master`, wait for the new asset hash on `https://estiginto.com/solutions.html`, repeat the 320px target interaction, and confirm `HEAD` equals `origin/master`.
