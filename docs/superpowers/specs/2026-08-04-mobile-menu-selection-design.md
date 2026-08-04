# Mobile Menu Home and Selection Design

## Objective

Improve two weak visual signals in the mobile navigation: replace the generic house icon with a cleaner system-entry symbol, and make the selected service category immediately distinguishable without depending on two similar background colors.

## Home Symbol

- Keep the existing center home link, accessible label, touch target, and blue outlined diamond.
- Redraw only the inner CSS icon as an architectural entrance: two vertical posts, a restrained top lintel, and a visible threshold.
- Remove the pitched roof silhouette so the mark feels like an intentional system entrance rather than a generic stock home icon.
- Keep the icon optically centered and slightly smaller than the surrounding diamond, with consistent two-pixel strokes.

## Selected Category Indicator

- Retain the current warm backgrounds and `aria-pressed` state.
- Add the indicator directly beneath each category label so the relationship between label and state is unambiguous.
- Use a two-layer underline: a two-pixel navy primary line and a one-pixel champagne-gold secondary line separated by two pixels.
- Keep the underline narrower than the label area, centered, and clear on Chinese, English, and Japanese labels.
- Animate the underline from the center outward when selection changes. The motion should be brief and restrained.
- Hide the underline on the unselected category.

## Accessibility and Interaction

- Do not change category button semantics, `aria-pressed`, keyboard focus behavior, destinations, or touch target sizes.
- Keep the underline decorative and non-interactive.
- Disable the underline expansion animation under `prefers-reduced-motion: reduce` while keeping the selected underline visible.

## Scope

- Apply only to the mobile navigation.
- Do not alter the desktop service menu, font-size controls, or close trigger.
- Implement through existing markup and CSS; no new image asset or dependency is required.

## Verification

- Add CSS contract coverage for the entrance icon geometry, selected dual underline, unselected hidden state, and reduced-motion behavior.
- Verify both service categories on a narrow mobile viewport.
- Confirm the active underline switches with `aria-pressed`, all labels remain legible, no overlap or horizontal overflow appears, and the console remains clean.
