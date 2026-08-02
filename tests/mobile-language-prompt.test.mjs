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
