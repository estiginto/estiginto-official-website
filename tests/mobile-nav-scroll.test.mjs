import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  advanceMobileNavScrollState,
  resolveMobileNavCompactState,
} from "../src/mobileNavScroll.js";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");
const cssSource = readFileSync(resolve(import.meta.dirname, "../src/App.css"), "utf8");

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
  const mobileNavSource = appSource.match(/function MobileNav[\s\S]*?function DesktopCursorMenu/)?.[0] || "";

  assert.match(appSource, /import \{ advanceMobileNavScrollState \} from "\.\/mobileNavScroll\.js"/);
  assert.match(mobileNavSource, /advanceMobileNavScrollState\(/);
  assert.match(mobileNavSource, /compact \? "compact" : ""/);
  assert.match(cssSource, /\.mobile-nav-trigger\s*\{[\s\S]*?width:\s*120px;[\s\S]*?height:\s*92px;/);
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
  const mobileNavSource = appSource.match(/function MobileNav[\s\S]*?function DesktopCursorMenu/)?.[0] || "";

  assert.match(appSource, /const mobileMenuGroupsByLocale\s*=\s*\{/);
  assert.match(appSource, /digital:\s*\{[\s\S]*?label:\s*"數位解決方案"/);
  assert.match(appSource, /growth:\s*\{[\s\S]*?label:\s*"商業顧問服務"/);
  assert.match(mobileNavSource, /useState\("digital"\)/);
  assert.match(mobileNavSource, /className="mobile-nav-category-switch"/);
  assert.match(mobileNavSource, /aria-pressed=\{activeGroup === groupKey\}/);
  assert.match(mobileNavSource, /setActiveGroup\(groupKey\)/);
  assert.match(mobileNavSource, /\.\.\.activeGroupCopy\.items/);
  assert.match(mobileNavSource, /items\.map/);
});

test("mobile category controls extend from both viewport edges", () => {
  assert.match(cssSource, /\.mobile-nav-category-switch\s*\{[\s\S]*?left:\s*0;[\s\S]*?right:\s*0;[\s\S]*?grid-template-columns:\s*1fr 1fr;/);
  assert.match(cssSource, /\.mobile-nav-category-button\.digital\s*\{[\s\S]*?clip-path:\s*polygon\(0 0, 92% 0, 100% 100%, 0 100%\)/);
  assert.match(cssSource, /\.mobile-nav-category-button\.growth\s*\{[\s\S]*?clip-path:\s*polygon\(8% 0, 100% 0, 100% 100%, 0 100%\)/);
});

test("short mobile viewports separate the diamond, font controls, categories, and trigger", () => {
  assert.match(cssSource, /@media \(max-width:\s*760px\) and \(max-height:\s*720px\)\s*\{[\s\S]*?\.mobile-nav-diamond\s*\{[\s\S]*?top:\s*43%;/);
  assert.match(cssSource, /@media \(max-width:\s*760px\) and \(max-height:\s*720px\)[\s\S]*?\.mobile-nav \.menu-font-controls\s*\{[\s\S]*?top:\s*calc\(43% \+ min\(44vw, 178px\)\);/);
  assert.match(cssSource, /@media \(max-width:\s*760px\) and \(max-height:\s*720px\)[\s\S]*?\.mobile-nav-category-switch\s*\{[\s\S]*?bottom:\s*max\(124px,[\s\S]*?height:\s*52px;/);
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

test("mobile home link uses a compact footprint that clears adjacent labels", () => {
  assert.match(
    cssSource,
    /\.mobile-nav-link\.center\s*\{[\s\S]*?width:\s*16%;[\s\S]*?height:\s*16%;/,
  );
});

test("mobile go-to-top arrow shares the menu trigger bottom edge", () => {
  assert.match(cssSource, /\.go-to-top\s*\{[\s\S]*?right:\s*14px;[\s\S]*?bottom:\s*max\(18px, env\(safe-area-inset-bottom, 0px\)\);[\s\S]*?display:\s*flex;[\s\S]*?align-items:\s*flex-end;/);
  assert.match(cssSource, /\.go-to-top span\s*\{[\s\S]*?margin:\s*0;/);
});
