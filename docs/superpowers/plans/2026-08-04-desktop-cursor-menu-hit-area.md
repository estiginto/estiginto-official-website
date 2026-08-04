# Desktop Cursor Menu Hit Area Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the hidden centered desktop menu links from receiving pointer or keyboard interaction before the pointer-following diamond trigger opens the menu.

**Architecture:** Keep the existing `DesktopCursorMenu` state and animation system. Enforce the interaction boundary in CSS so only `.desktop-cursor-menu.open` activates the centered diamond, and mirror that state in React by removing closed links from the tab order.

**Tech Stack:** React 19, CSS, Vite 7, Node.js built-in test runner, in-app Browser QA.

## Global Constraints

- Do not change mobile navigation behavior, labels, link destinations, cursor tracking, or animation timing.
- The pointer-following diamond remains interactive while the centered link diamond remains inert until `open === true`.
- Closed desktop menu links use `tabIndex={-1}`; open links use `tabIndex={0}`.
- Do not add dependencies.
- Preserve all unrelated user-owned untracked files.

---

### Task 1: Lock the closed-menu interaction boundary

**Files:**
- Create: `tests/desktop-cursor-menu.test.mjs`
- Modify: `src/App.css:989-1078`
- Modify: `src/App.jsx:2218-2229`
- Test: `tests/desktop-cursor-menu.test.mjs`

**Interfaces:**
- Consumes: `DesktopCursorMenu`'s existing `open: boolean` state and `.desktop-cursor-menu.open` class.
- Produces: a CSS-only pointer boundary and React `tabIndex` boundary keyed to the same `open` state.

- [ ] **Step 1: Write the failing source regression test**

Create `tests/desktop-cursor-menu.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");
const cssSource = readFileSync(resolve(import.meta.dirname, "../src/App.css"), "utf8");
const desktopMenuSource = appSource.match(/function DesktopCursorMenu[\s\S]*?function GoToTop/)?.[0] || "";

test("closed desktop cursor menu cannot activate hidden navigation targets", () => {
  assert.match(
    cssSource,
    /\.desktop-cursor-menu:not\(\.open\) \.desktop-menu-diamond,[\s\S]*?\.desktop-cursor-menu:not\(\.open\) \.desktop-menu-link\s*\{[\s\S]*?pointer-events:\s*none;/,
  );
  assert.doesNotMatch(cssSource, /\.desktop-cursor-menu\.hovering \.desktop-menu-diamond/);
  assert.doesNotMatch(cssSource, /\.desktop-menu-trigger\.visible:focus-visible ~ \.desktop-menu-diamond/);
  assert.match(
    cssSource,
    /\.desktop-cursor-menu\.open \.desktop-menu-diamond\s*\{[\s\S]*?pointer-events:\s*auto;/,
  );
  assert.match(desktopMenuSource, /tabIndex=\{open \? 0 : -1\}/);
  assert.match(desktopMenuSource, /aria-hidden=\{!open\}/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/desktop-cursor-menu.test.mjs`

Expected: FAIL because the hover/focus selector still enables the hidden diamond and links do not yet bind `tabIndex` to `open`.

- [ ] **Step 3: Implement the minimal pointer guard**

In `src/App.css`, delete the pre-open activation selector:

```css
.desktop-cursor-menu.hovering .desktop-menu-diamond,
.desktop-cursor-menu .desktop-menu-trigger.visible:focus-visible ~ .desktop-menu-diamond {
  pointer-events: auto;
}
```

Add an explicit closed-state guard next to the centered diamond rules:

```css
.desktop-cursor-menu:not(.open) .desktop-menu-diamond,
.desktop-cursor-menu:not(.open) .desktop-menu-link {
  pointer-events: none;
}
```

Keep the existing open-state rule unchanged:

```css
.desktop-cursor-menu.open .desktop-menu-diamond {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) rotate(45deg);
  pointer-events: auto;
}
```

- [ ] **Step 4: Remove closed links from keyboard navigation**

In the desktop menu item map in `src/App.jsx`, bind the anchor's tab order to the same state:

```jsx
<a
  key={item.key}
  className={`desktop-menu-link ${item.position}`}
  href={item.href}
  tabIndex={open ? 0 : -1}
>
  <span>{item.label}</span>
</a>
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `node --test tests/desktop-cursor-menu.test.mjs`

Expected: PASS with one test and zero failures.

- [ ] **Step 6: Run the full automated gate**

Run: `npm run check`

Expected: all Node tests pass, Vite builds all public pages, and `verify:dist` passes.

- [ ] **Step 7: Check the patch for formatting errors**

Run: `git diff --check`

Expected: no output.

### Task 2: Prove the corrected pointer interaction in a real browser

**Files:**
- Verify: `src/App.css`
- Verify: `src/App.jsx`
- Verify: `tests/desktop-cursor-menu.test.mjs`

**Interfaces:**
- Consumes: the closed/open pointer and tab-order contract from Task 1.
- Produces: browser evidence that closed page content remains clickable and the trigger still opens the menu.

- [ ] **Step 1: Start or refresh the production preview**

Run: `npm run build` followed by `npm run preview` if port `4302` is not already serving the latest `dist` output.

Expected: `http://127.0.0.1:4302/` returns HTTP 200.

- [ ] **Step 2: Inspect the closed state at 1280×800**

Using the in-app Browser, navigate to the local preview and verify through a bounded DOM evaluation:

```js
const diamond = document.querySelector(".desktop-menu-diamond");
const links = [...document.querySelectorAll(".desktop-menu-link")];
({
  menuOpen: document.querySelector(".desktop-cursor-menu")?.classList.contains("open"),
  diamondPointerEvents: getComputedStyle(diamond).pointerEvents,
  linkPointerEvents: links.map((link) => getComputedStyle(link).pointerEvents),
  linkTabIndexes: links.map((link) => link.tabIndex),
});
```

Expected: `menuOpen` is false, the diamond and all links report `pointer-events: none`, and every link reports `tabIndex: -1`.

- [ ] **Step 3: Exercise the trigger and open state**

Move the pointer so the small follower diamond appears, confirm the trigger locator resolves once, and click it. Then verify:

```js
({
  menuOpen: document.querySelector(".desktop-cursor-menu")?.classList.contains("open"),
  diamondPointerEvents: getComputedStyle(document.querySelector(".desktop-menu-diamond")).pointerEvents,
  visibleLinkCount: [...document.querySelectorAll(".desktop-menu-link")].filter((link) => getComputedStyle(link).opacity === "1").length,
  linkTabIndexes: [...document.querySelectorAll(".desktop-menu-link")].map((link) => link.tabIndex),
});
```

Expected: `menuOpen` is true, diamond pointer events are `auto`, all five links are visible, and every link reports `tabIndex: 0`.

- [ ] **Step 4: Complete browser health checks**

Verify page URL/title, meaningful DOM content, no framework error overlay, no relevant console warnings/errors, no horizontal overflow, and capture a screenshot of the open menu.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/App.css src/App.jsx tests/desktop-cursor-menu.test.mjs
git commit -m "fix: prevent closed cursor menu link activation"
```

### Task 3: Publish and verify production

**Files:**
- Verify: repository `master`
- Verify: `https://estiginto.com/`

**Interfaces:**
- Consumes: the verified implementation commit from Task 2.
- Produces: a production deployment whose asset hashes and interaction match the local build.

- [ ] **Step 1: Push the authorized master branch**

Run: `git push origin master`

Expected: push succeeds without force and `origin/master` resolves to local `HEAD`.

- [ ] **Step 2: Verify deployed asset hashes**

Compare the `main-*.js` and `main-*.css` asset URLs in local `dist/index.html` with `https://estiginto.com/`.

Expected: both production hashes match the local build.

- [ ] **Step 3: Repeat the closed/open browser check on production**

At desktop width, confirm closed links use `pointer-events: none` and `tabIndex: -1`; click the follower trigger and confirm the open links use `tabIndex: 0`, with no console errors or unintended navigation.

- [ ] **Step 4: Confirm repository state**

Run: `git status --short`, `git rev-parse HEAD`, and `git rev-parse origin/master`.

Expected: only pre-existing user-owned untracked directories remain, and both commit hashes match.
