# HERO Soul Ribbon Design QA

## Evidence

- Source visual truth: `.superpowers/brainstorm/34-1787759526/content/soul-ribbon-diagonal-restored-20260826.html`
- Source capture: `.superpowers/design-qa/hero-soul-ribbon-reference.png`
- Implementation capture: `.superpowers/design-qa/hero-soul-ribbon-desktop-v2.png`
- Combined comparison: `.superpowers/design-qa/hero-soul-ribbon-comparison.png`
- Viewport and normalization: source and implementation were both captured at 1440 × 900 CSS px and 1440 × 900 output px (device scale factor 1). The combined comparison is 2880 × 900 with the source on the left and implementation on the right.
- State: homepage entry animation completed; HERO idle animation active; Chinese locale; no menu or dialog open.

## Full-view comparison

The implementation preserves the selected full-field composition: a cream paper field, a continuous bundle originating just beyond the lower-left edge, crossing the central field, and exiting beyond the upper-right edge. The line bundle remains subordinate to the homepage copy, while graphite and champagne accents match the existing ESTIGINTO palette.

The production HERO deliberately retains the site's established sans-serif display typography, header, spacing system, and copy positioning. The selected prototype supplied the motion and composition target rather than replacing those existing product tokens.

## Focused-region comparison

A separate focused crop was not needed. At 1440 × 900, the full-view comparison keeps the complete ribbon path, headline, body copy, header, HUD label, grid, and both edge exits clearly readable at 1:1 density.

## Required fidelity surfaces

- Fonts and typography: existing production families, weights, line height, wrapping, and hierarchy are unchanged. This is an intentional product-system constraint; text remains crisp and readable above the animation.
- Spacing and layout rhythm: the production header and HERO rail remain aligned. The animated field now uses the full HERO inset instead of the previous right-side region.
- Colors and visual tokens: paper, graphite, earth brown, and champagne gold match both the selected direction and current brand tokens. The left copy protection uses the same paper tone instead of black.
- Image quality and asset fidelity: the decorative target is a procedural motion field, implemented as a high-DPI canvas so lines remain sharp at runtime. The supplied brand logo remains the real existing asset; no logo or icon was approximated.
- Copy and content: all localized production copy is unchanged. The HUD label matches the selected `SOUL CURRENT / FULL FIELD · 01A` direction.

## Findings

No actionable P0, P1, or P2 mismatches remain.

## Comparison history

1. Initial capture: `.superpowers/design-qa/hero-soul-ribbon-desktop.png`
   - [P2] The previous linear copy mask and 0.78 field opacity made the lower-left origin too faint, weakening the full-screen diagonal gesture.
   - Fix: replaced the full-height linear mask with a localized radial paper field around the copy and raised the ready opacity to 0.90.
2. Post-fix capture: `.superpowers/design-qa/hero-soul-ribbon-desktop-v2.png`
   - The origin is now visible at the lower-left edge, the line bundle reads continuously through the center, and the headline remains unaffected.

## Interaction and runtime checks

- Pointer interaction tested along the ribbon path; the energy value reached `0.954` and parallax updated without affecting copy layout.
- Page-entry overlay reached the idle state before comparison.
- Browser console warnings/errors checked: none.
- No active dialog or blocking overlay remained after entry.
- Automated coverage confirms the path crosses both horizontal edges, uses continuous lines with exactly three travelling light pulses, loops while active, and paints only once under reduced-motion preferences.

## Follow-up polish

- P3: review the final opacity again only after observing the deployed page on a bright physical display; no code change is required for this release.

## Implementation checklist

- [x] Full-field lower-left to upper-right path
- [x] Protected copy region
- [x] Existing paper and brand palette preserved
- [x] Reduced-motion behavior
- [x] Pointer energy response
- [x] Browser console and overlay check

final result: passed
