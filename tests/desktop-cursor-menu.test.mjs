import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");
const cssSource = readFileSync(resolve(import.meta.dirname, "../src/App.css"), "utf8");
const desktopMenuSource = appSource.match(/function DesktopCursorMenu[\s\S]*?function GoToTop/)?.[0] || "";

test("closed desktop service menu cannot activate hidden navigation targets", () => {
  assert.match(
    cssSource,
    /\.desktop-cursor-menu:not\(\.open\) \.desktop-service-menu,[\s\S]*?\.desktop-cursor-menu:not\(\.open\) \.desktop-service-link\s*\{[\s\S]*?pointer-events:\s*none;/,
  );
  assert.match(
    cssSource,
    /\.desktop-cursor-menu\.open \.desktop-service-menu\s*\{[\s\S]*?pointer-events:\s*auto;/,
  );
  assert.match(desktopMenuSource, /tabIndex=\{open \? 0 : -1\}/);
  assert.match(desktopMenuSource, /className="desktop-menu-scrim"[\s\S]*?tabIndex=\{-1\}/);
  assert.match(desktopMenuSource, /aria-hidden=\{!open\}/);
  assert.match(desktopMenuSource, /aria-controls="desktop-service-navigation"/);
  assert.match(desktopMenuSource, /aria-expanded=\{open\}/);
});

test("desktop service menu recomputes its enabled focus boundary on every Tab press", () => {
  assert.match(desktopMenuSource, /const getFocusableControls = \(\) =>/);
  assert.match(
    desktopMenuSource,
    /if \(event\.key !== "Tab"\)[\s\S]*?const focusable = getFocusableControls\(\)/,
  );
  assert.match(desktopMenuSource, /if \(!menu\?\.contains\(document\.activeElement\)\)/);
});
