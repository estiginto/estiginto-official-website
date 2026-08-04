# Desktop Service Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the expanded desktop diamond navigation with a two-column service menu that shares all eight localized destinations with the mobile menu.

**Architecture:** Keep `mobileMenuGroupsByLocale` as the single navigation-content source. `DesktopCursorMenu` maps the two categories into semantic groups inside a new editorial overlay while retaining the existing cursor trigger, scrim, and font controls. CSS owns the two-column layout, compact desktop variants, focus states, and reduced-motion behavior.

**Tech Stack:** React 19, CSS, Vite, Node test runner

## Global Constraints

- Fine-pointer viewports above 640 px use the two-column desktop service menu.
- Viewports at or below 640 px, and coarse-pointer devices, retain the current mobile menu and category switch.
- Chinese, English, and Japanese labels and destinations remain sourced from `mobileMenuGroupsByLocale`.
- Do not redesign the header, footer, mobile navigation, page transitions, language selector, or closed cursor trigger.
- Hidden links must not accept pointer or keyboard interaction.
- Escape and backdrop dismissal close the menu; focus enters on open and returns to the trigger on close.

---

### Task 1: Preserve the approved manifesto copy

**Files:**
- Modify: `src/App.jsx:575-588`

**Interfaces:**
- Consumes: `localizedCopy` locale structure.
- Produces: Matching positive manifesto copy for `zh`, `en`, and `ja`.

- [ ] **Step 1: Run the existing localized-content checks**

Run: `npm test`

Expected: all existing locale inventory and unsupported-claim checks pass.

- [ ] **Step 2: Review the pending copy diff**

Run: `git diff -- src/App.jsx`

Expected: only the three manifesto locale objects contain copy changes.

- [ ] **Step 3: Commit the approved copy**

```powershell
git add -- src/App.jsx
git commit -m "content: refine system design manifesto"
```

### Task 2: Lock the shared desktop menu contract with tests

**Files:**
- Create: `src/navigationMenu.js`
- Create: `tests/navigation-menu.test.mjs`
- Modify: `src/App.jsx:41-125`
- Modify: `src/App.jsx:796-803`
- Modify: `src/App.jsx:2106-2275`

**Interfaces:**
- Consumes: localized service definitions currently embedded in `App.jsx`.
- Produces: `getServiceMenuGroups(locale)`, returning the requested locale's `digital` and `growth` groups with a Chinese fallback; both navigation components consume this function.

- [ ] **Step 1: Write failing behavior tests for the shared menu model**

Create `tests/navigation-menu.test.mjs` with literal expectations derived from the approved navigation:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { getServiceMenuGroups } from "../src/navigationMenu.js";

test("desktop and mobile consumers receive the approved Chinese service destinations", () => {
  const groups = getServiceMenuGroups("zh");
  assert.deepEqual(Object.keys(groups), ["digital", "growth"]);
  assert.deepEqual(groups.digital.items.map(({ label, href }) => [label, href]), [
    ["系統規劃", "/solutions.html"],
    ["客製開發", "/solutions.html"],
    ["系統案例", "/case.html#case-group-operations-management"],
    ["專案諮詢", "/contact.html"],
  ]);
});

test("unsupported locales fall back to the Chinese service menu", () => {
  assert.equal(getServiceMenuGroups("unsupported").digital.label, "解決方案");
});
```

Add equivalent literal item-label assertions for English and Japanese so a missing or mismatched localized destination fails independently.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/navigation-menu.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` because `src/navigationMenu.js` does not exist.

- [ ] **Step 3: Create the shared service-menu model**

Move `mobileMenuGroupsByLocale` into `src/navigationMenu.js` and export:

```js
export function getServiceMenuGroups(locale) {
  return serviceMenuGroupsByLocale[locale] || serviceMenuGroupsByLocale.zh;
}
```

Update `MobileNav` to call `getServiceMenuGroups(locale)`. In `DesktopCursorMenu`, call the same function and render a labelled navigation surface containing a `SERVICES` eyebrow and two category sections. For each category, map its four items and render the number with `String(index + 1).padStart(2, "0")`. Remove `menuTargets` and `getMenuItems` when they have no remaining consumer.

- [ ] **Step 4: Add keyboard dismissal and focus management**

Add `triggerRef` and `menuRef`. When `open` becomes true, focus the first menu link. Handle Escape and Tab in an open-state effect; Tab wraps between the first and last enabled menu controls. Closing through Escape or the scrim restores focus to `triggerRef`.

- [ ] **Step 5: Run the focused test**

Run: `node --test tests/navigation-menu.test.mjs tests/desktop-cursor-menu.test.mjs`

Expected: PASS.

### Task 3: Build the editorial two-column overlay

**Files:**
- Modify: `src/App.css:880-1200`
- Test: `tests/desktop-cursor-menu.test.mjs`

**Interfaces:**
- Consumes: `.desktop-service-menu`, `.desktop-service-columns`, `.desktop-service-group`, and `.desktop-service-link` emitted by Task 2.
- Produces: Responsive desktop overlay styling with closed/open, focus, compact-height, and reduced-motion states.

- [ ] **Step 1: Add failing CSS contract assertions**

Add assertions for:

```js
assert.match(cssSource, /\.desktop-service-columns\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,/);
assert.match(cssSource, /\.desktop-cursor-menu:not\(\.open\) \.desktop-service-menu[\s\S]*?pointer-events:\s*none/);
assert.match(cssSource, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.desktop-service-menu/);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/desktop-cursor-menu.test.mjs`

Expected: FAIL because the two-column CSS does not exist.

- [ ] **Step 3: Replace expanded-diamond styling**

Create the centered overlay with `width: min(920px, calc(100vw - 96px))`, a two-column grid, fine divider, small diamond category markers, numbered rows, and blue hover/focus rules. Move font controls into the menu flow with a scoped static-position override. Keep the existing trigger and scrim rules.

- [ ] **Step 4: Add responsive and reduced-motion rules**

At fine-pointer widths below 900 px, reduce outer padding, gaps, and type size while retaining two columns. For short viewports, cap the menu height and allow its content to scroll. In the existing reduced-motion query, remove transform animation from the service surface and links.

- [ ] **Step 5: Run the focused and complete tests**

Run: `node --test tests/desktop-cursor-menu.test.mjs`

Expected: focused tests pass.

Run: `npm run check`

Expected: all tests, production build, and distribution verification pass.

### Task 4: Rendered QA and delivery

**Files:**
- Modify only if QA reveals a reproducible issue: `src/App.jsx`, `src/App.css`, `tests/desktop-cursor-menu.test.mjs`

**Interfaces:**
- Consumes: completed desktop overlay and unchanged mobile navigation.
- Produces: verified desktop and mobile behavior ready for remote delivery.

- [ ] **Step 1: Verify desktop interaction at 1910 × 948 and 1440 × 900**

Open `/`, move the pointer to reveal the trigger, activate it, and verify both service columns, eight destinations, scrim dismissal, Escape dismissal, console health, and absence of clipping.

- [ ] **Step 2: Verify constrained desktop and mobile layouts**

Check a fine-pointer viewport near 641 px and one short desktop viewport for overflow. Check a representative mobile viewport and confirm the existing category switch remains present and unchanged.

- [ ] **Step 3: Verify all locales**

Switch through Chinese, English, and Japanese while the desktop menu is available. Verify the two localized category labels and eight localized links render without horizontal page overflow.

- [ ] **Step 4: Run final verification**

Run: `npm run check`

Run: `git diff --check`

Expected: both commands exit with code 0.

- [ ] **Step 5: Commit and push**

```powershell
git add -- src/App.jsx src/App.css tests/desktop-cursor-menu.test.mjs docs/superpowers/plans/2026-08-04-desktop-service-menu.md
git commit -m "feat: align desktop service navigation"
git push origin master
```
