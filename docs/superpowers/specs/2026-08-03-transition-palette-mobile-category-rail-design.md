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

### Category state and multilingual labels

- The selected category uses muted champagne `#b89a62` with graphite text; saturated blue is not used.
- The unselected category remains warm ivory with graphite text.
- Traditional Chinese labels stay on one line at a restrained small size.
- English and Japanese labels may use at most two balanced lines, with reduced tracking and locale-aware sizing.
- At 320 px, no label may sit beneath the centered triangle or overflow its visible button area.

## Diamond corner treatment

Keep the geometric identity while softening the mechanical sharpness:

- outer navigation diamond: 10 px radius;
- four navigation item diamonds: 6 px radius;
- center home diamond: 5 px radius;
- A+, A, and A- diamonds: 5 px radius.

The radii apply to each square before rotation, producing consistent rounded diamond corners. The rounded treatment must not change link positions, hit areas, open/close motion, or center alignment.

## Verification

- Contract tests verify the shared bottom and height variables and the three-part bottom geometry.
- Browser QA measures the category and trigger bottom edges at 320×667 and 390×844.
- Visual QA confirms no horizontal overflow, no seam, readable one- or two-line localized labels, consistent rounded diamonds, and the graphite/ivory/champagne palette.
- The production bundle and formal site must be verified after deployment.
