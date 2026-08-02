# Language Cookie Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the mobile homepage language prompt only when no valid one-year language preference cookie exists.

**Architecture:** Extend the focused `mobileLanguagePrompt.js` module with pure cookie parsing and serialization helpers, then have `App.jsx` consume those helpers for initial locale, prompt eligibility, and explicit language selection. Browser-language detection remains read-only and never creates the cookie.

**Tech Stack:** React 19, JavaScript ES modules, browser cookies, localStorage, Node test runner, Vite, Playwright browser QA.

## Global Constraints

- Cookie name is exactly `estiginto_locale`.
- Supported cookie values are exactly `zh`, `en`, and `ja`.
- Cookie lifetime is exactly 31,536,000 seconds.
- Cookie attributes are `Path=/; SameSite=Lax`, plus `Secure` only on HTTPS.
- Missing, malformed, or unsupported cookie values are treated as absent.
- Only explicit prompt or header selections create or refresh the cookie.
- A valid cookie suppresses the prompt only on the mobile homepage; existing desktop and standalone-page exclusions remain.
- localStorage remains for backward-compatible locale restoration but does not suppress the prompt.

---

### Task 1: Cookie parsing and serialization

**Files:**
- Modify: `src/mobileLanguagePrompt.js`
- Modify: `tests/mobile-language-prompt.test.mjs`

**Interfaces:**
- Produces: `readLanguageCookie(cookieString): "zh" | "en" | "ja" | null`.
- Produces: `serializeLanguageCookie(locale, secure): string` where unsupported locales return an empty string.
- Consumes: raw `document.cookie`, a locale string, and a boolean HTTPS flag.

- [ ] **Step 1: Add failing parser and serializer tests**

Use literal inputs to require valid locale extraction from multi-cookie strings; null results for missing, malformed, and unsupported values; and exact serialized outputs for HTTP and HTTPS, including `Max-Age=31536000`, `Path=/`, `SameSite=Lax`, and conditional `Secure`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: FAIL because the cookie helpers are not exported.

- [ ] **Step 3: Implement the pure cookie helpers**

Parse semicolon-separated cookie pairs, match only `estiginto_locale`, decode defensively, and validate against the existing supported locale set. Serialize only supported values and append `; Secure` when `secure` is true.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: all parser and serializer cases pass.

- [ ] **Step 5: Commit cookie helpers**

```powershell
git add -- src/mobileLanguagePrompt.js tests/mobile-language-prompt.test.mjs
git commit -m "feat: add language preference cookie helpers"
```

### Task 2: Cookie-aware prompt and explicit persistence

**Files:**
- Modify: `src/mobileLanguagePrompt.js`
- Modify: `src/App.jsx`
- Modify: `tests/mobile-language-prompt.test.mjs`

**Interfaces:**
- Extends: `getInitialLocale(savedLocale, browserLanguage, cookieLocale)` with valid cookie precedence.
- Extends: `shouldShowMobileHomeLanguagePrompt({ initialSection, shouldUseMobileNav, hasLanguageCookie })`.
- Produces in `App`: `selectLocale(nextLocale)` as the single explicit-selection path that updates locale, localStorage, and cookie.

- [ ] **Step 1: Add failing behavior tests**

Require cookie locale precedence over localStorage and browser locale. Require a valid cookie to suppress the mobile-home prompt, while missing or invalid cookie state allows it. Add an integration contract proving the header and prompt both use `selectLocale`, and that `document.cookie` is written only inside this explicit-selection path rather than the locale effect.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: FAIL because cookie precedence, eligibility, and explicit selection are not wired.

- [ ] **Step 3: Wire cookie reads into initial state and eligibility**

Read the cookie through `readLanguageCookie(document.cookie)` during locale initialization and prompt eligibility. Pass the cookie locale into `getInitialLocale`; pass its validity into `shouldShowMobileHomeLanguagePrompt`.

- [ ] **Step 4: Add the explicit selection handler**

Create `selectLocale(nextLocale)` that validates via `serializeLanguageCookie`, calls `setLocale`, updates `estiginto-locale`, and assigns `document.cookie`. Pass it to both Header and MobileHomeLanguagePrompt. Keep the locale effect limited to document language and localStorage compatibility, with no cookie write.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `node --test tests/mobile-language-prompt.test.mjs`

Expected: all cookie, eligibility, and integration cases pass.

- [ ] **Step 6: Commit prompt integration**

```powershell
git add -- src/mobileLanguagePrompt.js src/App.jsx tests/mobile-language-prompt.test.mjs
git commit -m "feat: gate language prompt with cookie"
```

### Task 3: Full verification and deployment

**Files:**
- Verify only; no planned production edits.

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: production deployment and browser evidence.

- [ ] **Step 1: Run full automated verification**

Run: `npm run check`

Expected: all Node tests pass, Vite build succeeds, and distribution verification succeeds.

- [ ] **Step 2: Run mobile browser QA at 390x844**

In a clean context, verify the homepage prompt appears and no cookie exists before explicit selection. Choose English and verify `estiginto_locale=en` with one-year expiry attributes, reload and verify no prompt, clear only the cookie and verify the prompt returns. Confirm desktop and `/about.html` remain excluded, with no console errors or horizontal overflow.

- [ ] **Step 3: Push and verify production**

Push `master`, wait for Vercel success, and repeat the cookie lifecycle checks at `https://estiginto.com/`.
