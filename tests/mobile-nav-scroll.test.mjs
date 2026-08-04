import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  advanceMobileNavScrollState,
  resolveMobileNavCompactState,
} from "../src/mobileNavScroll.js";
import { getServiceMenuGroups } from "../src/navigationMenu.js";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");
const cssSource = readFileSync(resolve(import.meta.dirname, "../src/App.css"), "utf8");
const mobileNavSource = appSource.match(/function MobileNav[\s\S]*?function DesktopCursorMenu/)?.[0] || "";

const resolveState = (overrides = {}) => resolveMobileNavCompactState({
  scrollY: 120,
  previousScrollY: 100,
  isOpen: false,
  wasCompact: false,
  ...overrides,
});

test("open navigation and the top of the page always use the full-size trigger", () => {
  assert.equal(resolveState({ isOpen: true, wasCompact: true }), false);
  assert.equal(resolveState({ scrollY: 24, previousScrollY: 40, wasCompact: true }), false);
  assert.equal(resolveState({ scrollY: 0, previousScrollY: 40, wasCompact: true }), false);
});

test("meaningful downward scrolling compacts and upward scrolling restores the trigger", () => {
  assert.equal(resolveState({ scrollY: 107, previousScrollY: 100 }), true);
  assert.equal(resolveState({ scrollY: 93, previousScrollY: 100, wasCompact: true }), false);
});

test("touch jitter within the direction threshold preserves the current state", () => {
  assert.equal(resolveState({ scrollY: 106, previousScrollY: 100, wasCompact: false }), false);
  assert.equal(resolveState({ scrollY: 94, previousScrollY: 100, wasCompact: true }), true);
});

test("small consecutive scroll events accumulate until direction is meaningful", () => {
  let previousScrollY = 100;
  let state = { compact: true, directionTravel: 0 };

  for (const scrollY of [98, 96, 94, 92]) {
    state = advanceMobileNavScrollState({
      scrollY,
      previousScrollY,
      isOpen: false,
      wasCompact: state.compact,
      directionTravel: state.directionTravel,
    });
    previousScrollY = scrollY;
  }

  assert.deepEqual(state, { compact: false, directionTravel: 0 });
});

test("mobile navigation connects scroll state without shrinking its touch target", () => {
  assert.match(appSource, /import \{ advanceMobileNavScrollState \} from "\.\/mobileNavScroll\.js"/);
  assert.match(mobileNavSource, /advanceMobileNavScrollState\(/);
  assert.match(mobileNavSource, /compact \? "compact" : ""/);
  assert.match(cssSource, /\.mobile-nav-trigger\s*\{[\s\S]*?width:\s*var\(--mobile-trigger-width\);[\s\S]*?height:\s*var\(--mobile-trigger-height\);/);
  assert.match(cssSource, /\.mobile-nav\.compact:not\(\.open\) \.mobile-nav-trigger-shape\s*\{[\s\S]*?scale\(0\.5\)/);
  assert.match(cssSource, /\.mobile-nav\.compact:not\(\.open\) \.mobile-nav-trigger-icon\s*\{[\s\S]*?scale\(0\.5\)/);
  assert.match(cssSource, /\.mobile-nav\.compact:not\(\.open\) \.mobile-nav-trigger-icon\s*\{[\s\S]*?bottom:\s*11px;/);
  assert.match(cssSource, /\.mobile-nav-trigger-icon\s*\{[\s\S]*?transition:\s*transform 320ms var\(--ease-soft\), bottom 320ms var\(--ease-soft\)/);
  assert.match(cssSource, /transition:\s*transform 320ms var\(--ease-soft\)/);
});

test("mobile menu stages its geometric open and close motion", () => {
  assert.match(appSource, /--menu-item-index/);
  assert.match(appSource, /is-selecting/);
  assert.match(cssSource, /\.mobile-nav-scrim\s*\{[\s\S]*?backdrop-filter:\s*blur\(10px\)/);
  assert.match(cssSource, /\.mobile-nav-diamond\s*\{[\s\S]*?transform 520ms var\(--ease-soft\)/);
  assert.match(cssSource, /\.mobile-nav\.open \.mobile-nav-link\s*\{[\s\S]*?calc\(var\(--menu-item-index\) \* 60ms \+ 120ms\)/);
  assert.match(cssSource, /\.mobile-nav:not\(\.open\) \.mobile-nav-link\s*\{[\s\S]*?calc\(\(4 - var\(--menu-item-index\)\) \* 60ms\)/);
  assert.match(cssSource, /\.mobile-nav-link\.is-selecting/);
});

test("mobile menu switches between two localized service link groups", () => {
  const expectedGroupLabels = {
    zh: ["解決方案", "顧問服務"],
    en: ["Solutions", "Consulting"],
    ja: ["ソリューション", "コンサルティング"],
  };

  for (const locale of ["zh", "en", "ja"]) {
    assert.deepEqual(Object.values(getServiceMenuGroups(locale)).map((group) => group.label), expectedGroupLabels[locale]);
  }

  assert.match(mobileNavSource, /getServiceMenuGroups\(locale\)/);
  assert.match(mobileNavSource, /useState\("digital"\)/);
  assert.match(mobileNavSource, /className="mobile-nav-category-switch"/);
  assert.match(mobileNavSource, /aria-pressed=\{activeGroup === groupKey\}/);
  assert.match(mobileNavSource, /setActiveGroup\(groupKey\)/);
  assert.match(mobileNavSource, /\.\.\.activeGroupCopy\.items/);
  assert.match(mobileNavSource, /items\.map/);
});

test("closed mobile navigation removes hidden controls from pointer and keyboard navigation", () => {
  assert.match(mobileNavSource, /className="mobile-nav-scrim"[\s\S]*?tabIndex=\{-1\}/);
  assert.equal((mobileNavSource.match(/tabIndex=\{open \? 0 : -1\}/g) || []).length, 3);
  assert.match(cssSource, /\.mobile-nav-category-button\s*\{[\s\S]*?pointer-events:\s*none;/);
  assert.match(cssSource, /\.mobile-nav\.open \.mobile-nav-category-button\s*\{[\s\S]*?pointer-events:\s*auto;/);
});

test("navigation component follows responsive media-query changes without a reload", () => {
  assert.match(appSource, /const \[shouldUseMobileNav, setShouldUseMobileNav\] = useState/);
  assert.match(appSource, /mediaQuery\.addEventListener\("change", onChange\)/);
  assert.match(appSource, /mediaQuery\.removeEventListener\("change", onChange\)/);
});

test("business consulting menu links to the four approved consulting sections in every locale", () => {
  const expectedIds = ["systems-consulting", "digital-integration", "visual-design", "international-marketing"];

  for (const locale of ["zh", "en", "ja"]) {
    const links = getServiceMenuGroups(locale).growth.items.map((item) => item.href);
    assert.deepEqual(links, expectedIds.map((id) => `/consulting.html#${id}`));
  }

  assert.deepEqual(getServiceMenuGroups("zh").growth.items.map((item) => item.label), ["系統顧問", "數位整合", "視覺設計", "國際行銷"]);
});

test("mobile category controls extend from both viewport edges", () => {
  assert.match(cssSource, /\.mobile-nav\s*\{[\s\S]*?--mobile-trigger-bottom:\s*max\(18px, env\(safe-area-inset-bottom, 0px\)\);[\s\S]*?--mobile-trigger-height:\s*92px;[\s\S]*?--mobile-trigger-width:\s*120px;[\s\S]*?--mobile-trigger-seam:\s*1px;/);
  assert.match(cssSource, /\.mobile-nav-trigger\s*\{[\s\S]*?bottom:\s*var\(--mobile-trigger-bottom\);[\s\S]*?width:\s*var\(--mobile-trigger-width\);[\s\S]*?height:\s*var\(--mobile-trigger-height\);/);
  assert.match(cssSource, /\.mobile-nav-category-switch\s*\{[\s\S]*?left:\s*0;[\s\S]*?right:\s*0;[\s\S]*?bottom:\s*var\(--mobile-trigger-bottom\);[\s\S]*?height:\s*var\(--mobile-trigger-height\);/);
  assert.match(cssSource, /\.mobile-nav-category-button\.digital\s*\{[\s\S]*?left:\s*0;[\s\S]*?width:\s*calc\(50% \+ var\(--mobile-trigger-seam\)\);[\s\S]*?clip-path:\s*polygon\(0 0, 100% 0, calc\(100% - 60px\) 100%, 0 100%\)/);
  assert.match(cssSource, /\.mobile-nav-category-button\.growth\s*\{[\s\S]*?right:\s*0;[\s\S]*?width:\s*calc\(50% \+ var\(--mobile-trigger-seam\)\);[\s\S]*?clip-path:\s*polygon\(0 0, 100% 0, 100% 100%, 60px 100%\)/);
});

test("mobile menu uses the approved warm category palette and rounded diamonds", () => {
  const selectedCategory = cssSource.match(/\.mobile-nav-category-button\[aria-pressed="true"\]\s*\{[\s\S]*?\}/)?.[0] || "";

  assert.match(selectedCategory, /border-color:\s*#b7a98f;/);
  assert.match(selectedCategory, /background:\s*#d8d0c2;/);
  assert.match(selectedCategory, /color:\s*#171817;/);
  assert.doesNotMatch(selectedCategory, /var\(--signal\)|#3b82f6/);
  assert.match(cssSource, /\.mobile-nav-diamond::before\s*\{[\s\S]*?border-radius:\s*10px;/);
  assert.match(cssSource, /\.mobile-nav-link::before\s*\{[\s\S]*?border-radius:\s*6px;/);
  assert.match(cssSource, /\.mobile-nav-link\.center::before\s*\{[\s\S]*?border-radius:\s*5px;/);
  assert.match(cssSource, /\.mobile-nav \.menu-font-button::before\s*\{[\s\S]*?border-radius:\s*5px;/);
});

test("mobile home icon uses a simple outlined house", () => {
  const outerFrame = cssSource.match(/\.mobile-nav-home-icon::before\s*\{[^}]*\}/)?.[0] || "";
  const threshold = cssSource.match(/\.mobile-nav-home-icon::after\s*\{[^}]*\}/)?.[0] || "";
  const innerFrame = cssSource.match(/\.mobile-nav-home-icon i\s*\{[^}]*\}/)?.[0] || "";

  assert.match(outerFrame, /border-left:\s*2\.5px solid currentColor;/);
  assert.match(outerFrame, /border-top:\s*2\.5px solid currentColor;/);
  assert.match(outerFrame, /rotate\(45deg\)/);
  assert.match(threshold, /border:\s*2\.5px solid currentColor;/);
  assert.match(threshold, /border-top:\s*0;/);
  assert.match(innerFrame, /border:\s*2\.5px solid currentColor;/);
  assert.match(innerFrame, /border-bottom:\s*0;/);
});

test("selected mobile category uses a navy and champagne dual underline", () => {
  const underline = cssSource.match(/\.mobile-nav-category-button span::after\s*\{[^}]*\}/)?.[0] || "";
  const selectedUnderline = cssSource.match(/\.mobile-nav-category-button\[aria-pressed="true"\] span::after\s*\{[^}]*\}/)?.[0] || "";

  assert.match(underline, /#0a1f44/);
  assert.match(underline, /rgba\(159,\s*128,\s*77/);
  assert.match(underline, /scaleX\(0\)/);
  assert.match(underline, /opacity:\s*0;/);
  assert.match(selectedUnderline, /scaleX\(1\)/);
  assert.match(selectedUnderline, /opacity:\s*1;/);
  assert.match(
    cssSource,
    /prefers-reduced-motion:\s*reduce[\s\S]*?\.mobile-nav-category-button span::after\s*\{[\s\S]*?transition:\s*none\s*!important/,
  );
});

test("mobile category labels adapt safely across supported locales", () => {
  assert.match(cssSource, /\.mobile-nav-category-button\s*\{[\s\S]*?font-size:\s*clamp\(1\.1rem, 5vw, 1\.25rem\);/);
  assert.match(cssSource, /html:lang\(en\) \.mobile-nav-category-button\s*\{[\s\S]*?font-family:\s*var\(--font-body\);[\s\S]*?font-size:\s*clamp\(0\.95rem, 4vw, 1rem\);[\s\S]*?letter-spacing:\s*0\.02em;/);
  assert.match(cssSource, /\.mobile-nav-category-button span\s*\{[\s\S]*?max-width:\s*100%;/);
  assert.match(cssSource, /html:lang\(zh-Hant\) \.mobile-nav-category-button span\s*\{[\s\S]*?white-space:\s*nowrap;/);
  assert.match(cssSource, /html:lang\(en\) \.mobile-nav-category-button span,[\s\S]*?html:lang\(ja\) \.mobile-nav-category-button span\s*\{[\s\S]*?-webkit-line-clamp:\s*2;[\s\S]*?letter-spacing:\s*0\.02em;/);
});

test("short mobile viewports separate the diamond, font controls, categories, and trigger", () => {
  assert.match(cssSource, /@media \(max-width:\s*760px\) and \(max-height:\s*720px\)\s*\{[\s\S]*?\.mobile-nav-diamond\s*\{[\s\S]*?top:\s*43%;/);
  assert.match(cssSource, /@media \(max-width:\s*760px\) and \(max-height:\s*720px\)[\s\S]*?\.mobile-nav \.menu-font-controls\s*\{[\s\S]*?top:\s*calc\(43% \+ min\(44vw, 178px\)\);/);
  assert.doesNotMatch(cssSource, /@media \(max-width:\s*760px\) and \(max-height:\s*720px\)[\s\S]*?\.mobile-nav-category-switch\s*\{[\s\S]*?height:\s*52px;/);
});

test("mobile trigger suppresses the native full-button tap highlight", () => {
  assert.match(cssSource, /\.mobile-nav-trigger\s*\{[\s\S]*?-webkit-tap-highlight-color:\s*transparent;/);
  assert.match(cssSource, /\.mobile-nav-trigger:active\s*\{[\s\S]*?background:\s*transparent;/);
});

test("go to top hides while the mobile menu is open", () => {
  assert.match(cssSource, /\.mobile-nav\.open\s*~\s*\.go-to-top(?:\.is-visible)?\s*\{[\s\S]*?opacity:\s*0;[\s\S]*?pointer-events:\s*none;/);
});

test("mobile home link keeps its center translation throughout menu motion", () => {
  assert.match(
    cssSource,
    /\.mobile-nav\.open \.mobile-nav-link\.center\s*\{[\s\S]*?transform:\s*translate\(-50%, -50%\) scale\(1\);/,
  );
  assert.match(
    cssSource,
    /\.mobile-nav:not\(\.open\) \.mobile-nav-link\.center\s*\{[\s\S]*?transform:\s*translate\(-50%, -50%\) scale\(0\.92\);/,
  );
  assert.match(
    cssSource,
    /\.mobile-nav-link\.center\.is-selecting\s*\{[\s\S]*?transform:\s*translate\(-50%, -50%\) scale\(0\.94\);/,
  );
});

test("mobile home link uses a balanced footprint that clears adjacent labels", () => {
  assert.match(
    cssSource,
    /\.mobile-nav-link\.center\s*\{[\s\S]*?width:\s*21%;[\s\S]*?height:\s*21%;/,
  );
});

test("mobile home uses a compact visual icon without shrinking its touch target", () => {
  const mobileNavSource = appSource.match(/function MobileNav[\s\S]*?function DesktopCursorMenu/)?.[0] || "";

  assert.match(mobileNavSource, /aria-label=\{item\.position === "center" \? item\.label : undefined\}/);
  assert.match(mobileNavSource, /className="mobile-nav-home-icon" aria-hidden="true"/);
  assert.match(cssSource, /\.mobile-nav-link\.center\s*\{[\s\S]*?width:\s*21%;[\s\S]*?height:\s*21%;/);
  assert.match(cssSource, /\.mobile-nav-link\.center::before\s*\{[\s\S]*?inset:\s*17\.5%;/);
  assert.match(cssSource, /\.mobile-nav-home-icon\s*\{[\s\S]*?width:\s*20px;[\s\S]*?height:\s*19px;/);
});

test("mobile go-to-top arrow shares the menu trigger bottom edge", () => {
  assert.match(cssSource, /\.go-to-top\s*\{[\s\S]*?right:\s*14px;[\s\S]*?bottom:\s*max\(18px, env\(safe-area-inset-bottom, 0px\)\);[\s\S]*?display:\s*flex;[\s\S]*?align-items:\s*flex-end;/);
  assert.match(cssSource, /\.go-to-top span\s*\{[\s\S]*?margin:\s*0;/);
});
