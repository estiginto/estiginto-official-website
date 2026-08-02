# Site Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build geometric page transitions for every internal page link, staged mobile-menu motion, and a Replicant-inspired mechanical Hero background as one coherent motion system.

**Architecture:** A pure link-classification module decides which clicks receive transitions. A global React overlay handles entering/leaving states while the existing mobile menu receives staged CSS classes. A decorative SVG component inside the homepage Hero supplies the mechanical background and pointer parallax without changing content or routing.

**Tech Stack:** React 19, Vite 7, CSS animations/transforms, inline SVG, Node.js test runner

## Global Constraints

- Apply transitions to all same-origin cross-page HTML links, excluding hashes, downloads, external URLs, `mailto:`, `tel:`, `_blank`, modified clicks, and non-primary clicks.
- Total page-transition feel is about 900ms: 500ms exit and 400ms entry.
- Mobile menu items enter at 60ms intervals and reverse on close; a selected item connects to the page transition after about 120ms.
- Hero motion uses original geometric assets only; do not copy game artwork, typefaces, logos, characters, icons, or interface files.
- Hero motion stays concentrated on the right and edges; copy remains stable and readable.
- `prefers-reduced-motion: reduce` uses at most 120ms fades and a static Hero background.
- Use transform and opacity for continuous motion; add no dependencies.
- Preserve native links and multi-tab behaviors.

---

### Task 1: Internal Navigation Classifier

**Files:**
- Create: `src/pageTransition.js`
- Create: `tests/page-transition.test.mjs`

**Interfaces:**
- Produces: `getTransitionDestination({ anchor, event, currentUrl }): string | null`

- [ ] Write tests covering `/about.html`, same-page URL, hashes, external origins, `mailto:`, `tel:`, `download`, `_blank`, button 1, and each modifier key.
- [ ] Run `node --test tests/page-transition.test.mjs`; expect failure because the module does not exist.
- [ ] Implement URL resolution and guards in `getTransitionDestination`; return the absolute destination URL only for same-origin cross-page primary clicks.

```js
export function getTransitionDestination({ anchor, event, currentUrl }) {
  if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, currentUrl);
  const current = new URL(currentUrl);
  if (!/^https?:$/.test(url.protocol) || url.origin !== current.origin || url.hash || url.href === current.href) return null;
  return url.href;
}
```
- [ ] Re-run the focused test; expect pass.
- [ ] Commit `src/pageTransition.js` and `tests/page-transition.test.mjs` as `feat: classify animated page links`.

### Task 2: Global Geometric Page Transition

**Files:**
- Modify: `src/App.jsx` near the root `App` return
- Modify: `src/App.css` near global overlays and reduced-motion rules
- Modify: `tests/site-contracts.test.mjs`

**Interfaces:**
- Consumes: `getTransitionDestination(...)`
- Produces: `PageTransition`, root states `is-entering`, `is-idle`, `is-leaving`, and custom event `estiginto:page-entered`

- [ ] Add failing contracts for `PageTransition`, document click delegation, `page-transition-panel-top`, `page-transition-panel-bottom`, `page-transition-scan`, and the reduced-motion override.
- [ ] Run `node --test tests/site-contracts.test.mjs`; expect the new contracts to fail.
- [ ] Implement `PageTransition`: initialize `entering`, change to `idle` after `animationend` with a 400ms fallback, intercept eligible anchors, guard repeated clicks, switch to `leaving`, and navigate after the exit animation with a 500ms fallback.

```jsx
function PageTransition() {
  const [phase, setPhase] = useState("entering");
  const destinationRef = useRef(null);
  // document click delegation calls getTransitionDestination, prevents the
  // eligible navigation once, sets leaving, then assigns location.href after coverage.
  return <div className={`page-transition is-${phase}`} aria-hidden="true">
    <span className="page-transition-panel-top" />
    <span className="page-transition-panel-bottom" />
    <span className="page-transition-scan" />
  </div>;
}
```
- [ ] Render the overlay once beside the header and apply `page-transition-active`/state classes without hiding static HTML before JavaScript runs.
- [ ] Add fixed, pointer-transparent overlay CSS: two navy diagonal panels close toward center on exit and retreat on entry, with one blue scan line; set its z-index above all existing overlays.

```css
.page-transition { position: fixed; inset: 0; z-index: 300; pointer-events: none; }
.page-transition-panel-top,
.page-transition-panel-bottom { position: absolute; inset-inline: -8%; height: 56%; background: #0a1f44; will-change: transform; }
.page-transition-panel-top { top: 0; clip-path: polygon(0 0, 100% 0, 92% 100%, 0 82%); }
.page-transition-panel-bottom { bottom: 0; clip-path: polygon(8% 0, 100% 18%, 100% 100%, 0 100%); }
.page-transition.is-idle > span { transform: translateY(var(--idle-offset)); }
.page-transition-scan { position: absolute; inset-inline: 0; top: 50%; height: 1px; background: #3d8cff; }
```
- [ ] Add reduced-motion CSS and shorten the component timeout to 120ms when the media query matches.
- [ ] Run the focused classifier and contract tests; expect pass.
- [ ] Commit as `feat: add geometric page transitions`.

### Task 3: Staged Mobile Menu Motion

**Files:**
- Modify: `src/App.jsx` in `MobileNav`
- Modify: `src/App.css` in the mobile-nav media block
- Modify: `tests/mobile-nav-scroll.test.mjs`

**Interfaces:**
- Consumes: existing `open`, `compact`, and page-transition click delegation
- Produces: `.mobile-nav-link` delay variables and reversible open/close styling

- [ ] Add failing tests that require scrim blur, a 520ms diamond transform, per-link `--menu-item-index`, 60ms stagger calculation, and closing-state reversal.
- [ ] Run `node --test tests/mobile-nav-scroll.test.mjs`; expect failure.
- [ ] Render each link with `style={{ "--menu-item-index": index }}` and add a short `is-selecting` state on internal-link activation.

```jsx
{items.map((item, index) => (
  <a key={item.key} className={`mobile-nav-link ${item.position}`} href={item.href}
    style={{ "--menu-item-index": index }} onClick={() => setSelectingKey(item.key)}>
    <span>{item.label}</span>
  </a>
))}
```
- [ ] Make links begin translated and transparent; on `.open`, animate them in with `calc(var(--menu-item-index) * 60ms)` delays. Reverse delays during close while keeping the fixed menu container mounted.

```css
.mobile-nav-link { opacity: 0; transform: translateY(12px) scale(.92); transition: opacity 260ms ease, transform 420ms var(--ease-soft); }
.mobile-nav.open .mobile-nav-link { opacity: 1; transform: none; transition-delay: calc(var(--menu-item-index) * 60ms + 120ms); }
.mobile-nav:not(.open) .mobile-nav-link { transition-delay: calc((4 - var(--menu-item-index)) * 60ms); }
```
- [ ] Add `backdrop-filter` to the scrim, sequence font controls after the fifth item, and retain the existing hamburger-to-close transformation.
- [ ] Ensure selected links show a 120ms navy/blue response before the global overlay covers them.
- [ ] Run mobile-nav and site-contract tests; expect pass.
- [ ] Commit as `feat: stage mobile menu motion`.

### Task 4: Mechanical Hero Background

**Files:**
- Modify: `src/App.jsx` before and inside `Hero`
- Modify: `src/App.css` in the Hero and responsive/reduced-motion sections
- Modify: `tests/site-contracts.test.mjs`

**Interfaces:**
- Produces: `HeroTechBackground`, `.hero-tech-background`, two ring groups, scan line, marker group, and CSS variables `--hero-parallax-x/y`

- [ ] Add failing contracts requiring `HeroTechBackground`, `aria-hidden="true"`, ring/scan/marker classes, pointer media-query gating, cleanup of `requestAnimationFrame`, and reduced-motion static rules.
- [ ] Run `node --test tests/site-contracts.test.mjs`; expect failure.
- [ ] Build the decorative inline SVG using original circles, dashed arcs, ticks, crosshairs, coordinates, and generic ESTIGINTO system indices; mount it only inside the homepage `Hero`.

```jsx
function HeroTechBackground() {
  return <div className="hero-tech-background" aria-hidden="true">
    <svg viewBox="0 0 1440 900" focusable="false">
      <g className="hero-tech-ring hero-tech-ring-outer"><circle cx="1090" cy="430" r="286" /></g>
      <g className="hero-tech-ring hero-tech-ring-inner"><circle cx="1090" cy="430" r="196" /></g>
      <g className="hero-tech-markers"><text x="1030" y="112">SYS / 011</text></g>
      <line className="hero-tech-scan" x1="760" y1="0" x2="760" y2="900" />
    </svg>
  </div>;
}
```
- [ ] Add a fine-pointer effect that maps cursor position to a maximum ±12px CSS-variable offset through one queued animation frame; remove the listener and cancel the frame on cleanup.
- [ ] Add 28s and 22s counter-rotating rings, a 9s scan, 12–18s marker drift, and a sparse 7–11s local glitch. Start after `estiginto:page-entered` with a 900ms fallback.

```css
.hero-tech-ring-outer { animation: hero-ring-spin 28s linear infinite; }
.hero-tech-ring-inner { animation: hero-ring-spin-reverse 22s linear infinite; }
.hero-tech-scan { animation: hero-tech-scan 9s ease-in-out infinite; }
.hero-tech-markers { animation: hero-marker-drift 16s ease-in-out infinite alternate; }
.hero:not(.hero-motion-ready) .hero-tech-background * { animation-play-state: paused; }
```
- [ ] Add mobile cropping and half the marker density; disable parallax on coarse pointers. Pause CSS animations when the document has `.motion-paused`, toggled from visibility changes.
- [ ] Make reduced motion static and verify the background never receives pointer events or causes overflow.
- [ ] Run contract tests; expect pass.
- [ ] Commit as `feat: animate hero tech background`.

### Task 5: Integrated Verification and Deployment

**Files:**
- Verify all files from Tasks 1–4 and `docs/superpowers/plans/2026-08-02-selected-work-keywords.md`

**Interfaces:**
- Produces: production deployment at `https://estiginto.com/`

- [ ] Execute the already-approved selected-work keyword plan with its focused red/green test cycles and commits.
- [ ] Run `npm run check`; require all tests, build, and distribution verification to pass.
- [ ] Run `git diff --check` and confirm only known untracked `.playwright-cli/`, `docs/audits/`, `output/`, and `tmp/` remain.
- [ ] QA desktop navigation between every HTML entry, browser back/forward, modified clicks, external links, Hero parallax, scan timing, no white flash, and zero console errors.
- [ ] QA a 390px mobile viewport in zh/en/ja at 100% and 120% font size: menu open/close/selection sequencing, page transitions, Hero readability, keyword wrapping, and `scrollWidth <= innerWidth`.
- [ ] Verify reduced motion produces short fades, a static Hero, and no delayed navigation.
- [ ] Push `master`, wait for production deployment, and repeat key homepage/case-page mobile and desktop checks on `https://estiginto.com/`.
- [ ] Report commit, test count, build result, production URLs, viewport/locale coverage, overflow result, and console error count.
