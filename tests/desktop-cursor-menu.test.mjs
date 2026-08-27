import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  cancelCursorMenuFrame,
  resolveCursorMenuApproach,
} from "../src/desktopCursorMenuMotion.js";

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
  assert.match(desktopMenuSource, /tabIndex=\{open && !closing && !opening \? 0 : -1\}/);
  assert.match(desktopMenuSource, /className="desktop-menu-scrim"[\s\S]*?tabIndex=\{-1\}/);
  assert.match(desktopMenuSource, /aria-hidden=\{!open \|\| closing \|\| opening\}/);
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

test("desktop menu trigger locks when the pointer clearly approaches from its upper-left", () => {
  assert.match(
    desktopMenuSource,
    /const onMove = \(event\) =>[\s\S]*?resolveCursorMenuApproach[\s\S]*?approachLockedRef\.current = motion\.locked/,
  );
  assert.match(desktopMenuSource, /if \(!motion\.shouldFollow\)[\s\S]*?return;/);
});

test("desktop menu releases a cancelled animation frame before tracking resumes", () => {
  const frameRef = { current: 42 };
  const cancelledFrames = [];

  cancelCursorMenuFrame((frameId) => cancelledFrames.push(frameId), frameRef);

  assert.deepEqual(cancelledFrames, [42]);
  assert.equal(frameRef.current, null);
});

test("cursor approach lock waits until a deliberate southeast movement", () => {
  const tentative = resolveCursorMenuApproach({
    pointer: { x: 108, y: 108 },
    previousPointer: { x: 104, y: 104 },
    triggerCenter: { x: 152, y: 152 },
    southeastTravel: 3,
  });
  assert.equal(tentative.locked, false);
  assert.equal(tentative.shouldFollow, true);

  const locked = resolveCursorMenuApproach({
    pointer: { x: 111, y: 111 },
    previousPointer: { x: 108, y: 108 },
    triggerCenter: { x: 152, y: 152 },
    southeastTravel: tentative.southeastTravel,
  });
  assert.equal(locked.locked, true);
  assert.equal(locked.shouldFollow, false);
});

test("cursor approach lock releases only beyond the trigger's lower-right buffer", () => {
  const stillTargeting = resolveCursorMenuApproach({
    pointer: { x: 197, y: 197 },
    previousPointer: { x: 190, y: 190 },
    triggerCenter: { x: 152, y: 152 },
    locked: true,
  });
  assert.equal(stillTargeting.locked, true);
  assert.equal(stillTargeting.shouldFollow, false);

  const passedTarget = resolveCursorMenuApproach({
    pointer: { x: 205, y: 207 },
    previousPointer: { x: 197, y: 197 },
    triggerCenter: { x: 152, y: 152 },
    locked: true,
  });
  assert.equal(passedTarget.locked, false);
  assert.equal(passedTarget.shouldFollow, true);
});

test("cursor approach lock resumes following when the pointer moves far away in any direction", () => {
  const movedFarLeft = resolveCursorMenuApproach({
    pointer: { x: -16, y: 152 },
    previousPointer: { x: 80, y: 152 },
    triggerCenter: { x: 152, y: 152 },
    locked: true,
  });

  assert.equal(movedFarLeft.locked, false);
  assert.equal(movedFarLeft.shouldFollow, true);
});

test("cursor approach lock releases after a deliberate retreat from the trigger", () => {
  const firstRetreat = resolveCursorMenuApproach({
    pointer: { x: 101, y: 111 },
    previousPointer: { x: 111, y: 111 },
    triggerCenter: { x: 152, y: 152 },
    locked: true,
  });
  assert.equal(firstRetreat.locked, true);
  assert.equal(firstRetreat.shouldFollow, false);

  const secondRetreat = resolveCursorMenuApproach({
    pointer: { x: 91, y: 111 },
    previousPointer: { x: 101, y: 111 },
    triggerCenter: { x: 152, y: 152 },
    retreatTravel: firstRetreat.retreatTravel,
    locked: firstRetreat.locked,
  });
  assert.equal(secondRetreat.locked, true);

  const deliberateRetreat = resolveCursorMenuApproach({
    pointer: { x: 81, y: 111 },
    previousPointer: { x: 91, y: 111 },
    triggerCenter: { x: 152, y: 152 },
    retreatTravel: secondRetreat.retreatTravel,
    locked: secondRetreat.locked,
  });
  assert.equal(deliberateRetreat.locked, false);
  assert.equal(deliberateRetreat.shouldFollow, true);
});

test("desktop menu opens through one cursor-anchored core before controls become active", () => {
  assert.match(desktopMenuSource, /const \[opening, setOpening\] = useState\(false\)/);
  assert.match(desktopMenuSource, /setOpening\(true\)[\s\S]*?setOpen\(true\)/);
  assert.match(desktopMenuSource, /stream-opening/);
  assert.match(desktopMenuSource, /className="desktop-menu-morph"/);
  assert.match(desktopMenuSource, /style=\{\{ "--cursor-x": `\$\{position\.x\}px`, "--cursor-y": `\$\{position\.y\}px` \}\}/);
  assert.match(desktopMenuSource, /if \(!open \|\| closing \|\| opening\)/);
  assert.match(cssSource, /\.desktop-cursor-menu\.stream-opening \.desktop-menu-morph[\s\S]*?desktop-menu-core-open 620ms/);
  assert.match(cssSource, /@keyframes desktop-menu-core-open[\s\S]*?50vw[\s\S]*?rotate\(405deg\)/);
  assert.match(cssSource, /@keyframes desktop-menu-surface-open[\s\S]*?circle\(0[\s\S]*?circle\(150vmax/);
});

test("desktop menu closes from its center core toward the latest pointer position", () => {
  assert.match(
    desktopMenuSource,
    /const onMove = \(event\) =>[\s\S]*?pendingPositionRef\.current = next;[\s\S]*?if \(open \|\| hoveringTrigger\)/,
  );
  assert.match(desktopMenuSource, /setPosition\(pendingPositionRef\.current\)[\s\S]*?setClosing\(true\)/);
  assert.match(
    desktopMenuSource,
    /closeTimerRef\.current = window\.setTimeout\(\(\) => \{[\s\S]*?setOpen\(false\);[\s\S]*?setClosing\(false\);[\s\S]*?setHoveringTrigger\(false\);[\s\S]*?\}, 620\)/,
  );
  assert.match(cssSource, /\.desktop-cursor-menu\.stream-closing \.desktop-menu-morph[\s\S]*?desktop-menu-core-close 620ms/);
  assert.match(cssSource, /@keyframes desktop-menu-core-close[\s\S]*?50vw[\s\S]*?var\(--cursor-x/);
  assert.match(cssSource, /@keyframes desktop-menu-stream-close[\s\S]*?circle\(150vmax[\s\S]*?circle\(0/);
  assert.match(cssSource, /prefers-reduced-motion:\s*reduce[\s\S]*?\.desktop-menu-morph\s*\{[\s\S]*?display:\s*none/);
});

test("desktop navigation restores site destinations and keeps consulting services", () => {
  assert.match(desktopMenuSource, /const primaryMenuItems = \[/);
  assert.match(desktopMenuSource, /key: "home", label: localizedMenuLabels\.home, href: "\/"/);
  assert.match(desktopMenuSource, /href: "\/faq\.html"/);
  assert.doesNotMatch(desktopMenuSource, /href: "\/\#insights"/);
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
