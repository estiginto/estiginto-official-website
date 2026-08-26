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

test("open desktop menu closes from the center core or a secondary click", () => {
  assert.match(
    desktopMenuSource,
    /const onContextMenu = \(event\) =>[\s\S]*?event\.preventDefault\(\)[\s\S]*?closeMenu\(\)/,
  );
  assert.match(
    desktopMenuSource,
    /document\.addEventListener\("contextmenu", onContextMenu\)[\s\S]*?document\.removeEventListener\("contextmenu", onContextMenu\)/,
  );
  assert.match(
    desktopMenuSource,
    /className="desktop-channel-core"[\s\S]*?aria-label="Close desktop menu"[\s\S]*?onClick=\{closeMenu\}/,
  );
  assert.match(
    cssSource,
    /\.desktop-channel-core\s*\{[\s\S]*?pointer-events:\s*auto;/,
  );
});

test("desktop menu trigger follows every consecutive pointer move while closed", () => {
  assert.doesNotMatch(desktopMenuSource, /frozenRef|freezeTimerRef|scheduleFreeze|distanceFromTrigger/);
  assert.match(
    desktopMenuSource,
    /const onMove = \(event\) =>[\s\S]*?const next = \{ x: event\.clientX \+ 48, y: event\.clientY \+ 48 \}[\s\S]*?pendingPositionRef\.current = next/,
  );
});

test("desktop navigation restores site destinations and keeps consulting services", () => {
  assert.match(desktopMenuSource, /const primaryMenuItems = \[/);
  assert.match(desktopMenuSource, /key: "home", label: localizedMenuLabels\.home, href: "\/"/);
  assert.match(desktopMenuSource, /href: "\/faq\.html"/);
  assert.match(desktopMenuSource, /href: "\/\#insights"/);
  assert.match(desktopMenuSource, /href: "\/contact\.html"/);
  assert.match(desktopMenuSource, /growth: getServiceMenuGroups\(locale\)\.growth/);
  assert.match(desktopMenuSource, /Object\.entries\(desktopMenuGroups\)\.map/);
  assert.match(desktopMenuSource, /href=\{item\.href\}/);
  assert.match(cssSource, /\.desktop-service-menu\s*\{[\s\S]*?border-radius:\s*0;/);
});

test("desktop navigation renders a full-screen temporal channel control deck", () => {
  assert.match(desktopMenuSource, /className="desktop-channel-header"/);
  assert.match(desktopMenuSource, /className="desktop-channel-status"/);
  assert.match(desktopMenuSource, /className="desktop-channel-axis"/);
  assert.match(desktopMenuSource, /className="desktop-channel-core"/);
  assert.match(desktopMenuSource, /className="desktop-channel-footer"/);
  assert.match(desktopMenuSource, /data-channel=\{groupKey\}/);
  assert.match(desktopMenuSource, /style=\{\{ "--channel-index": index \}\}/);
  assert.match(cssSource, /\.desktop-service-menu\s*\{[\s\S]*?inset:\s*0;/);
  assert.match(cssSource, /\.desktop-channel-axis\s*\{[\s\S]*?left:\s*50%;/);
  assert.match(cssSource, /\.desktop-service-link::before\s*\{[\s\S]*?linear-gradient/);
  assert.match(cssSource, /@keyframes desktop-channel-pulse/);
});

test("desktop menu places a continuous spatial light field behind the panel", () => {
  assert.match(desktopMenuSource, /className="desktop-ambient-field"[\s\S]*?<nav/);
  assert.match(desktopMenuSource, /className="desktop-ambient-layer cool"/);
  assert.match(desktopMenuSource, /className="desktop-ambient-layer warm"/);
  assert.match(desktopMenuSource, /className="desktop-ambient-layer depth"/);
  assert.doesNotMatch(desktopMenuSource, /desktop-fiber|<svg|<path/);
  assert.match(cssSource, /\.desktop-ambient-field\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?inset:\s*0;[\s\S]*?z-index:\s*2;/);
  assert.match(cssSource, /\.desktop-ambient-layer\s*\{[\s\S]*?desktop-ambient-drift[\s\S]*?infinite/);
  assert.match(cssSource, /@keyframes desktop-ambient-drift[\s\S]*?translate3d[\s\S]*?scale/);
  assert.match(cssSource, /\.desktop-cursor-menu\.stream-closing \.desktop-ambient-field/);
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
