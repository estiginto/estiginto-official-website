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
    /\.desktop-cursor-menu\.open:not\(\.stream-closing\) \.desktop-service-menu\s*\{[\s\S]*?pointer-events:\s*auto;/,
  );
  assert.match(
    cssSource,
    /\.desktop-cursor-menu\.stream-closing \.desktop-service-menu\s*\{[\s\S]*?pointer-events:\s*none;/,
  );
  assert.match(desktopMenuSource, /tabIndex=\{open && !closing \? 0 : -1\}/);
  assert.match(desktopMenuSource, /className="desktop-menu-scrim"[\s\S]*?tabIndex=\{-1\}/);
  assert.match(desktopMenuSource, /aria-hidden=\{!open \|\| closing\}/);
  assert.match(desktopMenuSource, /aria-controls="desktop-service-navigation"/);
  assert.match(desktopMenuSource, /aria-expanded=\{open && !closing\}/);
});

test("desktop service menu recomputes its enabled focus boundary on every Tab press", () => {
  assert.match(desktopMenuSource, /const getFocusableControls = \(\) =>/);
  assert.match(
    desktopMenuSource,
    /if \(event\.key !== "Tab"\)[\s\S]*?const focusable = getFocusableControls\(\)/,
  );
  assert.match(desktopMenuSource, /if \(!menu\?\.contains\(document\.activeElement\)\)/);
});

test("desktop navigation restores site destinations and keeps consulting services", () => {
  assert.match(desktopMenuSource, /const primaryMenuItems = \[/);
  assert.match(desktopMenuSource, /href: "\/faq\.html"/);
  assert.match(desktopMenuSource, /href: "\/\#insights"/);
  assert.match(desktopMenuSource, /href: "\/contact\.html"/);
  assert.match(desktopMenuSource, /growth: getServiceMenuGroups\(locale\)\.growth/);
  assert.match(desktopMenuSource, /Object\.entries\(desktopMenuGroups\)\.map/);
  assert.match(desktopMenuSource, /href=\{item\.href\}/);
  assert.match(cssSource, /\.desktop-service-menu\s*\{[\s\S]*?border-radius:\s*18px;/);
});

test("desktop menu places a continuous fiber field behind the panel", () => {
  assert.match(desktopMenuSource, /className="desktop-fiber-field"[\s\S]*?<nav/);
  assert.match(desktopMenuSource, /fiberTracks\.map/);
  assert.match(desktopMenuSource, /viewBox="0 0 100 100"[\s\S]*?preserveAspectRatio="none"/);
  assert.match(cssSource, /\.desktop-fiber-field\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?inset:\s*0;[\s\S]*?z-index:\s*2;/);
  assert.match(cssSource, /\.desktop-fiber-pulse\s*\{[\s\S]*?desktop-fiber-pulse[\s\S]*?infinite;/);
  assert.match(cssSource, /@keyframes desktop-fiber-pulse[\s\S]*?stroke-dashoffset:\s*100[\s\S]*?stroke-dashoffset:\s*-100/);
  assert.match(cssSource, /\.desktop-cursor-menu\.stream-closing \.desktop-fiber-field/);
  assert.match(cssSource, /\.desktop-service-menu::before[\s\S]*?background-size:\s*40px 40px/);
  assert.match(cssSource, /\.desktop-service-menu::after[\s\S]*?radial-gradient/);
  assert.match(
    cssSource,
    /\.desktop-cursor-menu\.open:not\(\.stream-closing\) \.desktop-service-menu::before[\s\S]*?desktop-grid-breathe 8s/,
  );
  assert.match(
    cssSource,
    /\.desktop-cursor-menu\.open:not\(\.stream-closing\) \.desktop-service-menu::after[\s\S]*?desktop-grid-heartbeat 8s/,
  );
  assert.match(cssSource, /@keyframes desktop-grid-heartbeat[\s\S]*?48%[\s\S]*?52%/);
  assert.match(
    cssSource,
    /prefers-reduced-motion:\s*reduce[\s\S]*?\.desktop-service-menu::before,[\s\S]*?\.desktop-service-menu::after\s*\{[\s\S]*?animation:\s*none\s*!important/,
  );
});
