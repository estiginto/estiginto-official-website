import test from "node:test";
import assert from "node:assert/strict";

import { getTransitionDestination } from "../src/pageTransition.js";

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
