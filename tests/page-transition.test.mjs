import assert from "node:assert/strict";
import test from "node:test";

import {
  INITIAL_PAGE_ENTER_DURATION,
  PAGE_ENTER_DURATION,
  PAGE_LEAVE_DURATION,
  REDUCED_PAGE_TRANSITION_DURATION,
  getInitialPageTransitionVariant,
  getPageTransitionVariant,
  getTransitionDestination,
} from "../src/pageTransition.js";

const currentUrl = "https://estiginto.com/case.html";

function anchor(href, overrides = {}) {
  return {
    href,
    target: "",
    hasAttribute: (name) => name === "download" && Boolean(overrides.download),
    ...overrides,
  };
}

function click(overrides = {}) {
  return {
    defaultPrevented: false,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    ...overrides,
  };
}

test("page transitions use deliberate premium timings", () => {
  assert.equal(INITIAL_PAGE_ENTER_DURATION, 4600);
  assert.equal(PAGE_ENTER_DURATION, 1050);
  assert.equal(PAGE_LEAVE_DURATION, 760);
  assert.equal(REDUCED_PAGE_TRANSITION_DURATION, 120);
});

test("routes deterministically select varied geometric transitions", () => {
  const routes = new Map([
    ["/", "grille"],
    ["/index.html", "grille"],
    ["/solutions.html", "matrix"],
    ["/consulting.html", "matrix"],
    ["/case.html", "aperture"],
    ["/about.html", "axis"],
    ["/faq.html", "axis"],
    ["/contact.html", "axis"],
  ]);

  for (const [pathname, expected] of routes) {
    assert.equal(getPageTransitionVariant(pathname), expected);
    assert.equal(getPageTransitionVariant(pathname), expected);
  }
});

test("only the initial homepage entry uses the temporal vortex", () => {
  assert.equal(getInitialPageTransitionVariant("/"), "vortex");
  assert.equal(getInitialPageTransitionVariant("/index.html"), "vortex");
  assert.equal(getInitialPageTransitionVariant("/case.html"), "aperture");
  assert.equal(getPageTransitionVariant("/"), "grille");
});

test("unknown routes use the restrained axis transition", () => {
  assert.equal(getPageTransitionVariant("/unknown.html"), "axis");
});

test("returns an absolute destination for a same-origin page link", () => {
  assert.equal(
    getTransitionDestination({ anchor: anchor("/about.html"), event: click(), currentUrl }),
    "https://estiginto.com/about.html",
  );
});

test("allows a cross-page destination that includes a hash", () => {
  assert.equal(
    getTransitionDestination({ anchor: anchor("/about.html#team"), event: click(), currentUrl }),
    "https://estiginto.com/about.html#team",
  );
});

test("ignores links that should retain native browser behavior", () => {
  const excluded = [
    anchor("#case"),
    anchor(currentUrl),
    anchor("https://example.com/about.html"),
    anchor("mailto:contact@estiginto.com"),
    anchor("tel:+886224315362"),
    anchor("/brief.pdf", { download: true }),
    anchor("/about.html", { target: "_blank" }),
  ];

  excluded.forEach((item) => {
    assert.equal(getTransitionDestination({ anchor: item, event: click(), currentUrl }), null);
  });
});

test("ignores modified, handled, and non-primary clicks", () => {
  const excludedEvents = [
    click({ defaultPrevented: true }),
    click({ button: 1 }),
    click({ metaKey: true }),
    click({ ctrlKey: true }),
    click({ shiftKey: true }),
    click({ altKey: true }),
  ];

  excludedEvents.forEach((event) => {
    assert.equal(getTransitionDestination({ anchor: anchor("/about.html"), event, currentUrl }), null);
  });
});
