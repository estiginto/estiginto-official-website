# Mobile Motion Tuning Design

## Scope

This adjustment refines two existing mobile interactions without changing layout, navigation, locale persistence, or desktop behavior:

1. Slow the homepage language switch flight from 600ms to 900ms.
2. Make the closed triangular mobile menu visually smaller while the user scrolls down, then restore it smoothly when the user scrolls up.

## Language switch flight

- Keep the existing geometry-based flight from the bottom prompt to the header language switch.
- Change the transform transition to 900ms while preserving the current easing curve.
- Complete and remove the prompt 60ms after the transform ends, so the destination handoff remains seamless.
- Keep the existing reduced-motion behavior; users who request reduced motion do not receive the extended flight.

## Mobile triangle menu

- Track scroll direction only on mobile through the existing `MobileNav` component.
- Ignore tiny scroll deltas to prevent touch jitter from repeatedly changing the visual state.
- After the page has moved away from the top, a meaningful downward scroll applies a compact state.
- A meaningful upward scroll removes the compact state with a smooth transition.
- At the top of the page, the trigger always returns to its full visual size.
- Opening the menu always restores the full-size trigger and keeps it full size while open.
- Only the visual triangle and menu icon shrink. The button retains its current 120x92px hit area for accessibility and reliable touch input.

## Motion and styling

- Use a bottom-centered transform origin so the triangle appears anchored to the safe-area position.
- Animate the visual scale with the site's existing soft easing over 320ms.
- Scale both the triangle and hamburger icon to 50% so they remain visually synchronized.
- Respect `prefers-reduced-motion` by removing the scroll-driven scale transition while still applying the correct final size.

## Testing and acceptance

- Add source-contract coverage for the 900ms flight and matching 960ms completion delay.
- Add behavior coverage for scroll-direction state decisions, including jitter, top-of-page reset, downward compacting, and upward restoring.
- Verify on a 390x844 mobile viewport that:
  - the language switch flight is visibly slower and hands off to the top-right control;
  - downward scrolling compacts the closed triangle;
  - upward scrolling restores it smoothly;
  - opening the menu restores the full-size triangle;
  - no horizontal overflow or browser console errors are introduced.
- Run the full test, build, and distribution verification before deployment.
