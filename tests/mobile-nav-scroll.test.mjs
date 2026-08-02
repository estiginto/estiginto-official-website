import assert from "node:assert/strict";
import test from "node:test";
import { resolveMobileNavCompactState } from "../src/mobileNavScroll.js";

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
