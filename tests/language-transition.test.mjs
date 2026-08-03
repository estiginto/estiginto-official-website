import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  LANGUAGE_TRANSITION_DURATION,
  LANGUAGE_TRANSITION_SWAP_DELAY,
  shouldAnimateLanguageChange,
} from "../src/languageTransition.js";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");
const cssSource = readFileSync(resolve(import.meta.dirname, "../src/App.css"), "utf8");

test("language transition uses the approved deliberate timing", () => {
  assert.equal(LANGUAGE_TRANSITION_SWAP_DELAY, 280);
  assert.equal(LANGUAGE_TRANSITION_DURATION, 650);
});

test("language transition runs only for a new idle locale when motion is allowed", () => {
  assert.equal(shouldAnimateLanguageChange({ currentLocale: "zh", nextLocale: "en", busy: false, reducedMotion: false }), true);
  assert.equal(shouldAnimateLanguageChange({ currentLocale: "zh", nextLocale: "zh", busy: false, reducedMotion: false }), false);
  assert.equal(shouldAnimateLanguageChange({ currentLocale: "zh", nextLocale: "en", busy: true, reducedMotion: false }), false);
  assert.equal(shouldAnimateLanguageChange({ currentLocale: "zh", nextLocale: "en", busy: false, reducedMotion: true }), false);
});

test("App stages the visible locale swap and leaves the prompt flight independent", () => {
  assert.match(appSource, /LANGUAGE_TRANSITION_SWAP_DELAY/);
  assert.match(appSource, /LANGUAGE_TRANSITION_DURATION/);
  assert.match(appSource, /const \[languageTransitionPhase, setLanguageTransitionPhase\] = useState\("idle"\)/);
  assert.match(appSource, /const commitLocale = \(nextLocale\) =>/);
  assert.match(appSource, /setLanguageTransitionPhase\("covering"\)/);
  assert.match(appSource, /setLanguageTransitionPhase\("revealing"\)/);
  assert.match(appSource, /onSelect=\{commitLocale\}/);
  assert.match(appSource, /className=\{`language-transition language-transition-\$\{languageTransitionPhase\}`\}/);
  assert.match(appSource, /className="language-transition-scan" aria-hidden="true"/);
});

test("language transition CSS provides restrained blur, scan, and reduced motion", () => {
  assert.match(cssSource, /\.language-transition\s*\{[\s\S]*?pointer-events:\s*none;/);
  assert.match(cssSource, /\.language-transition-covering \.language-transition-scan[\s\S]*?animation:\s*language-scan 650ms/);
  assert.match(cssSource, /\.site-shell\.language-transition-covering \.page-main,[\s\S]*?filter:\s*blur\(3px\);/);
  assert.match(cssSource, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.language-transition[\s\S]*?display:\s*none;/);
});
