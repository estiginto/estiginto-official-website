import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cssSource = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("Japanese desktop hero keeps each approved title row intact", () => {
  assert.match(
    cssSource,
    /@media \(min-width:\s*901px\)[\s\S]*?html\[lang="ja"\] \.hero \.wrap > div[\s\S]*?width:\s*min\(64vw,\s*1000px\)/,
  );
  assert.match(
    cssSource,
    /html\[lang="ja"\] \.hero-title[\s\S]*?font-size:\s*clamp\(3rem,\s*5\.2vw,\s*5\.5rem\)/,
  );
  assert.match(
    cssSource,
    /html\[lang="ja"\] \.hero-title \.row1,[\s\S]*?html\[lang="ja"\] \.hero-title \.row2[\s\S]*?white-space:\s*nowrap/,
  );
});
