import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("homepage hero renders a layered perspective grid behind its content", () => {
  assert.match(app, /className="hero-depth-grid"/);
  assert.match(css, /\.hero-depth-grid\s*\{[\s\S]*?perspective:/);
  assert.match(css, /\.hero-depth-grid::before\s*\{[\s\S]*?rotateX\(/);
  assert.match(css, /\.hero-depth-grid::after\s*\{[\s\S]*?translate3d\([^)]*-[0-9]+px\)/);
});

test("hero depth grid is restrained on mobile and static with reduced motion", () => {
  assert.match(css, /@media \(max-width: 640px\), \(pointer: coarse\)[\s\S]*?\.hero-depth-grid\s*\{[\s\S]*?perspective:/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.hero-depth-grid[\s\S]*?animation:\s*none/);
});
