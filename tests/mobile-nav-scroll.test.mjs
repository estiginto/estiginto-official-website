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
  assert.match(cssSource, /\.mobile-nav\.compact:not\(\.open\) \.mobile-nav-trigger-icon\s*\{[\s\S]*?scale\(0\.88\)/);
  assert.match(cssSource, /transition:\s*transform 320ms var\(--ease-soft\)/);
});
