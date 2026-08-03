# Transition Palette and Mobile Category Rail

## Scope

This revision changes two existing presentation details without altering navigation content, route mapping, transition timing, or menu behavior.

## Transition palette

Use the approved ESTIGINTO-aligned palette:

- graphite black for the primary transition surfaces;
- warm ivory for seams and restrained highlights;
- muted champagne gold for the scan line and small reflective accents;
- no saturated blue surfaces, electric-blue seams, or blue glow.

The existing grille, matrix, aperture, and axis movement variants remain. The 1250 ms initial entry, 1050 ms page reveal, 760 ms internal leave, and 120 ms reduced-motion timings remain unchanged. Highlights must read as material reflection rather than neon light.

## Mobile category rail

When the mobile menu is open, the two category buttons move from the row above the triangle into the same bottom band as the triangle trigger:

`Digital Solutions | triangle trigger | Business Consulting`

- The rail uses the trigger's bottom offset and height variables.
- The left and right buttons extend to their respective viewport edges.
- Their inner edges slope along the triangle sides and sit behind the triangle without a visible seam.
- The trigger remains centered, retains its full touch target, and stays above the category buttons in stacking order.
- The layout must remain usable at 320 px and 390 px viewport widths and respect the bottom safe area.
- Closed-menu category controls remain non-interactive and visually hidden.

## Verification

- Contract tests verify the shared bottom and height variables and the three-part bottom geometry.
- Browser QA measures the category and trigger bottom edges at 320×667 and 390×844.
- Visual QA confirms no horizontal overflow, no seam, readable labels, and the graphite/ivory/champagne transition palette.
- The production bundle and formal site must be verified after deployment.
