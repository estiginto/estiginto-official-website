import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  getInitialLocale,
  resolveBrowserLocale,
  shouldShowMobileHomeLanguagePrompt,
} from "../src/mobileLanguagePrompt.js";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");
const cssSource = readFileSync(resolve(import.meta.dirname, "../src/App.css"), "utf8");

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

test("language prompt CSS provides blur, safe-area placement, flight, and reduced motion", () => {
  assert.match(cssSource, /\.mobile-language-prompt\s*\{/);
  assert.match(cssSource, /backdrop-filter:\s*blur/);
  assert.match(cssSource, /env\(safe-area-inset-bottom\)/);
  assert.match(cssSource, /\.language-prompt-flight/);
  assert.match(cssSource, /prefers-reduced-motion:\s*reduce[\s\S]*language-prompt/);
});

test("language prompt uses the approved slower flight and synchronized handoff", () => {
  const promptSource = appSource.match(/function MobileHomeLanguagePrompt[\s\S]*?function Header/)?.[0] || "";

  assert.match(cssSource, /\.language-prompt-flight\s*\{[\s\S]*?transition:\s*transform 900ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.match(promptSource, /finishPrompt\(960\)/);
});

test("closed mobile navigation does not release another overlay's scroll lock", () => {
  const mobileNavSource = appSource.match(/function MobileNav[\s\S]*?function DesktopCursorMenu/)?.[0] || "";
  assert.match(mobileNavSource, /if \(!open\)\s*\{\s*return undefined;\s*\}/);
  assert.match(mobileNavSource, /const previousOverflow = document\.body\.style\.overflow/);
  assert.match(mobileNavSource, /document\.body\.style\.overflow = previousOverflow/);
});

test("language prompt locks the document root independently of other overlays", () => {
  const promptSource = appSource.match(/function MobileHomeLanguagePrompt[\s\S]*?function Header/)?.[0] || "";
  assert.match(promptSource, /const previousDocumentOverflow = document\.documentElement\.style\.overflow/);
  assert.match(promptSource, /document\.documentElement\.style\.overflow = "hidden"/);
  assert.match(promptSource, /document\.documentElement\.style\.overflow = previousDocumentOverflow/);
});

test("language prompt owns a dedicated root scroll-lock class", () => {
  const promptSource = appSource.match(/function MobileHomeLanguagePrompt[\s\S]*?function Header/)?.[0] || "";
  assert.match(promptSource, /document\.documentElement\.classList\.add\("language-prompt-open"\)/);
  assert.match(promptSource, /document\.documentElement\.classList\.remove\("language-prompt-open"\)/);
  assert.match(cssSource, /html\.language-prompt-open\s*\{[\s\S]*?overflow:\s*hidden\s*!important/);
});
