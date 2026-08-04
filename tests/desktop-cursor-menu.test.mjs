import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");
const cssSource = readFileSync(resolve(import.meta.dirname, "../src/App.css"), "utf8");
const desktopMenuSource = appSource.match(/function DesktopCursorMenu[\s\S]*?function GoToTop/)?.[0] || "";

test("closed desktop cursor menu cannot activate hidden navigation targets", () => {
  assert.match(
    cssSource,
    /\.desktop-cursor-menu:not\(\.open\) \.desktop-menu-diamond,[\s\S]*?\.desktop-cursor-menu:not\(\.open\) \.desktop-menu-link\s*\{[\s\S]*?pointer-events:\s*none;/,
  );
  assert.doesNotMatch(cssSource, /\.desktop-cursor-menu\.hovering \.desktop-menu-diamond/);
  assert.doesNotMatch(cssSource, /\.desktop-menu-trigger\.visible:focus-visible ~ \.desktop-menu-diamond/);
  assert.match(
    cssSource,
    /\.desktop-cursor-menu\.open \.desktop-menu-diamond\s*\{[\s\S]*?pointer-events:\s*auto;/,
  );
  assert.match(desktopMenuSource, /tabIndex=\{open \? 0 : -1\}/);
  assert.match(desktopMenuSource, /aria-hidden=\{!open\}/);
});
