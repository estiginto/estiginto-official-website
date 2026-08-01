# Mobile Home Language Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mobile-home-only language prompt that starts at the bottom of a blurred full-screen overlay and flies into the existing top-right language-switch position after a one-tap selection.

**Architecture:** Keep locale resolution and prompt eligibility in a small pure module so Node tests can verify them directly. Reuse the existing `LanguageSwitch` visual component in a focused prompt component, measure source and destination DOM rectangles at selection time, and animate a temporary fixed-position visual copy while leaving the header layout intact. The prompt lifecycle stays local and deliberately does not persist dismissal during testing.

**Tech Stack:** React 19, Vite 7, CSS transitions, browser DOM geometry APIs, Node test runner, Playwright CLI.

## Global Constraints

- Show the prompt only on the home route when the existing mobile/coarse-pointer condition is true.
- Show it on every fresh mobile-home load or reload during testing; do not add a persisted dismissal key.
- Keep valid `estiginto-locale` data authoritative; use browser locale when no valid saved locale exists.
- Support only `zh`, `en`, and `ja`; unsupported or missing browser locales fall back to `zh`.
- Language selection is immediate and has no separate confirmation action.
- The backdrop cannot be dismissed by tapping outside it.
- Preserve the existing language switch as the visual source of truth.
- Use a translation-and-scale animation of about 600 ms and a fade fallback for reduced motion or missing geometry.
- Do not add dependencies or change deployment configuration.

---

## File Structure

- Create `src/mobileLanguagePrompt.js`: pure browser-locale resolution and prompt-eligibility helpers.
- Create `tests/mobile-language-prompt.test.mjs`: behavior tests for helpers and source-contract tests for prompt wiring and CSS guarantees.
- Modify `src/App.jsx`: reusable switch ref support, prompt component, initialization, eligibility, focus/scroll lifecycle, and render wiring.
- Modify `src/App.css`: overlay, blur, safe-area bottom panel, hidden header destination, moving visual copy, responsive scoping, and reduced-motion styling.

### Task 1: Locale Resolution and Eligibility

**Files:**
- Create: `src/mobileLanguagePrompt.js`
- Create: `tests/mobile-language-prompt.test.mjs`
- Modify: `src/App.jsx:1-6,1666-1672`

**Interfaces:**
- Produces: `resolveBrowserLocale(language?: string): "zh" | "en" | "ja"`
- Produces: `getInitialLocale(savedLocale?: string | null, browserLanguage?: string): "zh" | "en" | "ja"`
- Produces: `shouldShowMobileHomeLanguagePrompt({ initialSection: string, shouldUseMobileNav: boolean }): boolean`
- Consumes: `window.localStorage.getItem("estiginto-locale")` and `window.navigator.language`

- [ ] **Step 1: Write failing pure behavior tests**

Create `tests/mobile-language-prompt.test.mjs` with direct assertions:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  getInitialLocale,
  resolveBrowserLocale,
  shouldShowMobileHomeLanguagePrompt,
} from "../src/mobileLanguagePrompt.js";

test("browser locale maps to the three supported locales", () => {
  assert.equal(resolveBrowserLocale("zh-TW"), "zh");
  assert.equal(resolveBrowserLocale("zh-Hant-TW"), "zh");
  assert.equal(resolveBrowserLocale("ja-JP"), "ja");
  assert.equal(resolveBrowserLocale("en-US"), "en");
  assert.equal(resolveBrowserLocale("fr-FR"), "zh");
  assert.equal(resolveBrowserLocale(), "zh");
});

test("saved locale wins and invalid saved locale falls back to browser locale", () => {
  assert.equal(getInitialLocale("ja", "en-US"), "ja");
  assert.equal(getInitialLocale("invalid", "en-US"), "en");
  assert.equal(getInitialLocale(null, "ja-JP"), "ja");
});

test("prompt eligibility is limited to mobile home", () => {
  assert.equal(shouldShowMobileHomeLanguagePrompt({ initialSection: "", shouldUseMobileNav: true }), true);
  assert.equal(shouldShowMobileHomeLanguagePrompt({ initialSection: "about", shouldUseMobileNav: true }), false);
  assert.equal(shouldShowMobileHomeLanguagePrompt({ initialSection: "", shouldUseMobileNav: false }), false);
});
```

- [ ] **Step 2: Run the new tests and verify RED**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: FAIL because `src/mobileLanguagePrompt.js` does not exist.

- [ ] **Step 3: Implement the minimal pure helpers**

Create `src/mobileLanguagePrompt.js`:

```js
const supportedLocales = new Set(["zh", "en", "ja"]);

export function resolveBrowserLocale(language = "") {
  const primary = String(language).toLowerCase().split("-")[0];
  return supportedLocales.has(primary) ? primary : "zh";
}

export function getInitialLocale(savedLocale, browserLanguage) {
  return supportedLocales.has(savedLocale)
    ? savedLocale
    : resolveBrowserLocale(browserLanguage);
}

export function shouldShowMobileHomeLanguagePrompt({ initialSection, shouldUseMobileNav }) {
  return !initialSection && shouldUseMobileNav;
}
```

Modify the App locale initializer to call `getInitialLocale(savedLocale, window.navigator.language)`.

- [ ] **Step 4: Run focused and full tests and verify GREEN**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: 3 passing tests.

Run: `npm test`

Expected: all existing and new tests pass.

- [ ] **Step 5: Commit the independently testable locale behavior**

```bash
git add src/mobileLanguagePrompt.js src/App.jsx tests/mobile-language-prompt.test.mjs
git commit -m "feat: detect preferred site language"
```

### Task 2: Prompt Lifecycle and Shared Switch Wiring

**Files:**
- Modify: `tests/mobile-language-prompt.test.mjs`
- Modify: `src/App.jsx:648-685,1658-1821`

**Interfaces:**
- Consumes: `shouldShowMobileHomeLanguagePrompt({ initialSection, shouldUseMobileNav })`
- Produces: `LanguageSwitch({ locale, onSelect, switchRef, className })`
- Produces: `MobileHomeLanguagePrompt({ locale, onSelect, destinationRef, onComplete })`
- Produces: `headerLanguageSwitchRef: React.RefObject<HTMLDivElement | null>`

- [ ] **Step 1: Add failing source-contract tests**

Append tests that read `src/App.jsx` and assert the required wiring:

```js
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");

test("mobile home prompt reuses the language switch and exposes dialog semantics", () => {
  assert.match(appSource, /function MobileHomeLanguagePrompt/);
  assert.match(appSource, /role="dialog"/);
  assert.match(appSource, /aria-modal="true"/);
  assert.match(appSource, /<LanguageSwitch[\s\S]*className="language-prompt-switch"/);
  assert.match(appSource, /destinationRef/);
});

test("prompt is gated by route and mobile eligibility without persisted dismissal", () => {
  assert.match(appSource, /shouldShowMobileHomeLanguagePrompt/);
  assert.match(appSource, /showLanguagePrompt/);
  assert.doesNotMatch(appSource, /language-prompt-(dismissed|completed)/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: FAIL because `MobileHomeLanguagePrompt` and prompt state do not exist.

- [ ] **Step 3: Make the existing switch ref-aware and reusable**

Update `LanguageSwitch` to accept `switchRef` and `className`, attach the ref to its root, and append the optional class without changing its button behavior. Update `Header` to accept `languageSwitchRef` and pass it to the switch.

- [ ] **Step 4: Add the focused prompt component**

Implement `MobileHomeLanguagePrompt` above `Header` with:

```jsx
const [phase, setPhase] = useState("idle");
const [flightStyle, setFlightStyle] = useState(null);
const sourceRef = useRef(null);
const selectedButtonRef = useRef(null);

const selectLanguage = (nextLocale) => {
  if (phase !== "idle") return;
  onSelect(nextLocale);
  // Measure source and destination, set the fixed start rectangle,
  // then advance to the destination transform on the next frame.
};
```

Render requirements:

- root `.mobile-language-prompt` with `role="dialog"` and `aria-modal="true"`;
- `.mobile-language-prompt-backdrop` as a non-button backdrop;
- `.mobile-language-prompt-panel` with localized short copy;
- shared `LanguageSwitch` with `className="language-prompt-switch"`;
- `.language-prompt-flight` only while transitioning;
- transition completion callback with a timeout fallback;
- no close button and no backdrop click handler.

Use localized prompt text:

```js
const languagePromptCopy = {
  zh: { eyebrow: "LANGUAGE", title: "選擇您的語言" },
  en: { eyebrow: "LANGUAGE", title: "Choose your language" },
  ja: { eyebrow: "LANGUAGE", title: "言語を選択してください" },
};
```

- [ ] **Step 5: Wire App state and lifecycle**

Add:

```jsx
const headerLanguageSwitchRef = useRef(null);
const promptEligible = shouldShowMobileHomeLanguagePrompt({ initialSection, shouldUseMobileNav });
const [showLanguagePrompt, setShowLanguagePrompt] = useState(promptEligible);
```

Pass the header ref through `Header`, render the prompt after the header only when `showLanguagePrompt` is true, and set it false through `onComplete`. Keep visibility unpersisted so reload recreates it.

While visible, lock body scrolling and move focus to the active prompt option. Restore body overflow on cleanup. Use `inert` on `#mainpage` and remove it on cleanup when browser support is available.

- [ ] **Step 6: Run focused and full tests and verify GREEN**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: all focused tests pass.

Run: `npm test`

Expected: the complete suite passes.

- [ ] **Step 7: Commit the prompt behavior**

```bash
git add src/App.jsx tests/mobile-language-prompt.test.mjs
git commit -m "feat: add mobile home language prompt"
```

### Task 3: Overlay and Flight Styling

**Files:**
- Modify: `tests/mobile-language-prompt.test.mjs`
- Modify: `src/App.css:449-607,2594-2631,2955-2962`

**Interfaces:**
- Consumes classes produced by Task 2: `.mobile-language-prompt`, `.mobile-language-prompt-backdrop`, `.mobile-language-prompt-panel`, `.language-prompt-switch`, `.language-prompt-flight`, `.is-flight-active`, `.is-prompt-active`
- Produces responsive presentation and motion only; no new JavaScript API.

- [ ] **Step 1: Add failing CSS contract tests**

Read `src/App.css` in the existing test file and assert:

```js
const cssSource = readFileSync(resolve(import.meta.dirname, "../src/App.css"), "utf8");

test("language prompt CSS provides blur, safe-area placement, flight, and reduced motion", () => {
  assert.match(cssSource, /\.mobile-language-prompt\s*\{/);
  assert.match(cssSource, /backdrop-filter:\s*blur/);
  assert.match(cssSource, /env\(safe-area-inset-bottom\)/);
  assert.match(cssSource, /\.language-prompt-flight/);
  assert.match(cssSource, /prefers-reduced-motion:\s*reduce[\s\S]*language-prompt/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: FAIL because prompt CSS is absent.

- [ ] **Step 3: Add mobile-scoped prompt styles**

Inside the existing mobile media query, add styles that:

- fix the overlay to `inset: 0` with a z-index above the header and below the moving copy;
- blur the backdrop and cover it with a translucent paper-colored veil;
- anchor the panel with `bottom: calc(24px + env(safe-area-inset-bottom))`;
- center the panel and cap its width to `calc(100vw - 40px)`;
- reuse the switch at full available width without changing its three equal columns;
- hide the real header switch with opacity while `.is-prompt-active` is applied;
- position `.language-prompt-flight` fixed and animate only transform and opacity;
- disable pointer input while `.is-flight-active` is applied;
- keep question copy readable without adding a card-heavy or modal-template appearance.

Add a desktop default of `display: none` for `.mobile-language-prompt` so CSS remains safe even if JavaScript eligibility regresses.

- [ ] **Step 4: Add reduced-motion fallback**

Within the existing `@media (prefers-reduced-motion: reduce)` block, disable transform transition for `.language-prompt-flight` and shorten prompt/backdrop opacity transitions.

- [ ] **Step 5: Run focused tests and production build**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: focused tests pass.

Run: `npm run build`

Expected: Vite build exits 0 with static assets copied.

- [ ] **Step 6: Commit visual behavior**

```bash
git add src/App.css tests/mobile-language-prompt.test.mjs
git commit -m "style: animate mobile language selection"
```

### Task 4: Browser QA, Full Verification, and Production Push

**Files:**
- Modify only if QA exposes a defect: `src/App.jsx`, `src/App.css`, `src/mobileLanguagePrompt.js`, `tests/mobile-language-prompt.test.mjs`
- Create test artifacts under: `output/playwright/`

**Interfaces:**
- Consumes the complete built feature and existing Vite development server.
- Produces browser evidence, a verified build, and the pushed production branch.

- [ ] **Step 1: Start one local development server**

Run the existing `npm run dev` process at `http://127.0.0.1:4302/`. Do not start a second server if the port is already healthy.

- [ ] **Step 2: Verify the 390 x 844 mobile home flow**

Using Playwright CLI:

1. Open the home page and resize to 390 x 844.
2. Confirm the dialog is visible at the bottom.
3. Confirm the background is blurred and cannot be interacted with.
4. Capture `output/playwright/mobile-language-prompt-before.png`.
5. Select English and wait for the transition.
6. Confirm English content and the top-right English selection.
7. Capture `output/playwright/mobile-language-prompt-after.png`.
8. Reload and confirm the prompt appears again.
9. Select Japanese and confirm Japanese content.

- [ ] **Step 3: Verify route and desktop exclusions**

1. Open `/about.html` at 390 x 844 and confirm no language dialog.
2. Open `/` at 1440 x 1000 and confirm no language dialog.
3. Check console errors and horizontal overflow in both sizes.

- [ ] **Step 4: Fix any QA defect with a fresh RED-GREEN cycle**

For each defect, first add a focused test that reproduces it, run the test to observe the expected failure, implement the smallest correction, then rerun the focused and full suites. Commit only after green.

- [ ] **Step 5: Run the complete verification gate**

Run: `npm run check`

Expected: all Node tests pass, Vite production build exits 0, and distribution verification exits 0.

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git status --short`

Expected: only known pre-existing untracked audit or browser-artifact directories remain; no uncommitted feature source files.

- [ ] **Step 6: Push the current branch**

Run: `git branch --show-current` and confirm the intended production branch. Then run `git push origin <current-branch>`.

Expected: push succeeds and the hosting integration begins deployment.

- [ ] **Step 7: Verify the formal production link**

Open `https://estiginto.com/` after deployment completes, use a mobile viewport, and repeat the home prompt and `/about.html` exclusion checks. Report the exact production URL, deployed commit, and verification result.
