# Desktop Menu Living Grid Design

## Objective

Give the desktop service menu background a restrained sense of life without competing with navigation content. The motion should feel like breathing with a subtle two-beat heartbeat, not like a technical scanner or decorative screensaver.

## Visual Behavior

- Keep the existing 40 px navy grid as the static visual foundation.
- Add a slow breathing cycle of approximately eight seconds by gently varying the grid's visibility and a soft localized glow.
- Near the crest of each breathing cycle, add two brief, low-amplitude pulses separated by a short pause. The effect should read subconsciously as a heartbeat rather than visibly flashing.
- Allow a very slow background-position drift so the grid does not feel mechanically fixed. Drift must remain secondary to the breathing rhythm.
- Do not scale, move, blur, or fade menu text, links, dividers, or font controls.

## Motion Scope

- Run the animation only while the desktop service menu is open.
- Keep the motion CSS-only and isolated to decorative pseudo-elements behind the menu content.
- Ensure the decorative layers do not affect scrolling, focus, pointer interaction, layout, or menu accessibility.
- Stop all background animation when `prefers-reduced-motion: reduce` is active and retain the existing static grid.

## Tone and Intensity

- Use the existing navy and cool-blue palette at very low opacity.
- Avoid bright highlights, large contrast changes, rapid scanning lines, and whole-panel transforms.
- The intended reaction is "this feels alive" after a moment, not "there is an animation here" on first glance.

## Responsive Scope

- Apply only to the desktop service menu. The mobile diamond menu remains unchanged.
- Preserve the current desktop, narrow-desktop, and short-viewport layouts.

## Verification

- Add CSS contract coverage for the living-grid layers, breathing/heartbeat keyframes, open-state animation, and reduced-motion override.
- Verify in a real browser at desktop and short-desktop sizes.
- Confirm menu links remain readable and interactive, no horizontal overflow appears, and the console stays free of relevant warnings or errors.
