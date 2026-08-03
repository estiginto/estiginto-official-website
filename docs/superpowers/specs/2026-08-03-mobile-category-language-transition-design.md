# Mobile Category Rail and Language Transition Design

## Scope

Refine the two mobile-menu category controls and add a dedicated transition when visitors change the site language. The work must preserve the current menu geometry, touch targets, link groups, cookie behavior, and page-transition system.

## Mobile category controls

- Replace the Traditional Chinese labels with `解決方案` and `顧問服務`.
- Use concise localized equivalents for English and Japanese. English and Japanese may wrap to two balanced lines when the available width is insufficient; Traditional Chinese stays on one line.
- Increase the category-label size from roughly 11–12px to roughly 20px on common mobile widths. Use responsive sizing and locale-specific limits so 320px layouts do not overflow.
- Keep the current left/right trapezoid geometry, alignment with the triangular menu trigger, interaction behavior, and touch area.
- Replace the heavy selected gold fill with a light warm greige (`#d8d0c2`) and graphite text. Use a restrained gold-grey border only as a secondary selection cue.
- Keep the inactive control warm ivory. Selection must remain understandable without relying on color alone through `aria-pressed`, border treatment, and state change.

## Language-change transition

- Run a dedicated transition only when an explicit language option changes the locale.
- Total duration is approximately 650ms.
- The visible page-content surface briefly softens with mild blur and reduced opacity, while a subtle horizontal light scan moves from top to bottom. The new locale becomes clear after the midpoint.
- Keep the header, page position, mobile-menu geometry, and language-switch position stable; the transition must not produce navigation, scroll jumps, or layout shifts.
- Do not reuse the full-page geometric route overlay. The language transition has its own state and presentation so it cannot conflict with link navigation.
- Ignore clicks on the already-active locale and prevent overlapping language transitions from rapid repeated input.
- Persist the selected locale and cookie at the same semantic point as today, while delaying the visible locale swap until the covered midpoint.
- Under `prefers-reduced-motion: reduce`, switch language immediately and use no blur or scan movement.

## Accessibility and resilience

- Language controls remain native buttons with their existing pressed state.
- The decorative scan is hidden from assistive technology and never receives pointer events.
- Content remains readable at the start and end states; no permanent blur or opacity state may survive an interrupted/unmounted transition.
- English and Japanese category labels are capped at two lines with safe overflow handling at 320px and 390px widths.

## Verification

- Add regression tests for the new localized labels, responsive font sizing, two-line English/Japanese rule, and softened selected palette.
- Add behavioral tests for active-locale no-op, midpoint locale update, overlap prevention, and reduced-motion behavior where the current test architecture supports it.
- Run the complete test/build/dist verification command.
- Use the in-app Browser at 320px and 390px to exercise opening the mobile menu, switching both category groups, and changing Traditional Chinese to English and Japanese. Check DOM state, console health, screenshots, wrapping, clipping, and layout stability.

## Non-goals

- No changes to the four links inside either category group.
- No redesign of the language switch itself.
- No changes to route-transition variants, desktop cursor-menu behavior, or the initial mobile language prompt flight.
