# Mobile Home Language Prompt Design

## Goal

Add a language prompt that appears only on the mobile home page. It should start with the browser-derived locale selected, let the visitor choose a language in one tap, and then visually return the language control to its existing position in the top-right header.

During the current testing phase, the prompt must appear on every fresh page load or reload of the mobile home page. It must not store a dismissed or completed state. The existing locale preference may continue to update when a language is selected.

## Scope

### Included

- Mobile home page only.
- Full-viewport backdrop with background blur.
- Bottom-positioned prompt and the existing three-language control.
- Browser-language-derived initial selection.
- Immediate selection without a separate confirmation button.
- Transition from the bottom prompt to the header language control.
- Reduced-motion behavior.
- Automated contract tests and real-browser verification.
- Production build, push, and deployment verification through the current repository workflow.

### Excluded

- Desktop prompt.
- Prompt on about, solutions, case, FAQ, or contact pages.
- Permanent first-visit or session dismissal storage during testing.
- Changes to the supported locale inventory.
- Changes to the mobile navigation system.

## User Experience

1. A visitor opens or reloads the home page on a mobile viewport or coarse-pointer device.
2. The page derives the preferred locale from the browser when no saved locale is available. Supported values map to Traditional Chinese, English, or Japanese. Unsupported values fall back to Traditional Chinese.
3. A full-screen translucent backdrop covers the page and applies a strong blur to the content behind it.
4. A prompt sits above the lower safe area. It contains a concise language question and the same three-option language switch used in the header.
5. The browser-derived or saved locale is visibly selected.
6. The visitor taps any language option. The locale changes immediately and repeated input is disabled during the transition.
7. A visual copy of the complete switch moves from the bottom prompt to the measured position of the existing header switch.
8. When the moving copy arrives, the backdrop and prompt disappear and the real header switch becomes visible and interactive.
9. Reloading the mobile home page shows the prompt again while this testing behavior is enabled.

The backdrop is not dismissible by tapping outside it. Choosing a language is the only completion action, preventing an ambiguous locale state.

## Visual Direction

- Reuse the existing language-switch appearance so the motion reads as one control changing location.
- Keep the prompt visually quiet: one short question, no large marketing headline, no illustration, and no additional confirmation button.
- Position the prompt above `env(safe-area-inset-bottom)` with enough space for mobile browser chrome.
- Use the existing paper, navy, border, and shadow tokens.
- Apply backdrop blur and a translucent light veil without making the underlying page readable enough to compete with the prompt.
- Keep the header destination visible as a spatial cue, but hide or dim the real header switch until the moving copy arrives.

## Component Design

### Browser Locale Resolver

A small pure helper maps a browser locale string to one of the supported locale keys:

- `zh-*` becomes `zh`.
- `ja-*` becomes `ja`.
- `en-*` becomes `en`.
- Any other or missing value becomes `zh`.

The existing saved locale remains authoritative when it exists. Browser detection supplies the initial value only when no valid saved locale is available.

### Language Switch

The existing `LanguageSwitch` remains the single visual implementation. It accepts an optional ref or forwarded ref so the prompt can measure the header destination without duplicating its markup or styling.

### Mobile Home Language Prompt

A focused component owns only the prompt lifecycle:

- receives the active locale and locale-selection callback;
- knows whether it is visible or transitioning;
- measures its source switch and the header destination;
- renders the backdrop, prompt copy, bottom switch, and moving visual copy;
- completes by hiding itself after the animation;
- falls back to a short fade when geometry is unavailable.

The parent decides whether the component is eligible to render. Eligibility requires the home route and the existing mobile/coarse-pointer condition.

## Animation

The animation uses a temporary visual copy rather than physically moving the header component. This isolates the fixed overlay from header layout and avoids changing the header's normal positioning rules.

- Measure source and destination rectangles at selection time.
- Render the moving switch at the source rectangle using fixed positioning.
- Animate translation and scale to the destination rectangle using transform and opacity.
- Keep the backdrop until the moving switch is almost at the destination, then fade it out.
- Reveal the real header switch at completion and remove the moving copy.
- Target duration: approximately 600 ms with an ease-out curve.
- Under `prefers-reduced-motion: reduce`, skip translation and use a short opacity transition.

Window resizing or missing geometry during the animation uses the fade fallback rather than leaving the overlay stuck.

## Accessibility

- The prompt uses `role="dialog"`, `aria-modal="true"`, and a visible heading.
- Focus moves to the currently selected language option when the prompt opens.
- Keyboard users can activate the same language buttons with their existing native behavior.
- Background scrolling is locked while the prompt is visible.
- Background content is made non-interactive for the prompt duration where supported.
- The selection remains understandable when animation is disabled.
- Touch targets preserve the existing mobile language-switch sizing.

## State and Data Flow

- `App` initializes locale from a valid saved locale, otherwise from the browser locale resolver.
- `App` passes the current locale and `setLocale` to both header and prompt.
- Selecting a prompt option updates the locale immediately through the existing state path.
- The existing locale effect updates document language and `estiginto-locale`.
- Prompt visibility is local UI state and is intentionally not persisted during testing.
- A page reload reconstructs the prompt as visible on the eligible mobile home route.

## Testing

Automated tests will verify:

- Browser locale mapping for Chinese, Japanese, English, missing, and unsupported values.
- Prompt eligibility is limited to the mobile home page.
- The prompt does not introduce a persisted dismissal key during testing.
- The dialog, three language options, and reduced-motion branch are present.
- Existing locale and navigation contracts remain intact.

Real-browser verification will cover:

- 390 x 844 mobile home page.
- Prompt at the bottom with full-screen blur.
- Each language selection updates content.
- Moving control reaches the top-right header position.
- Reload shows the prompt again.
- About and other standalone pages do not show the prompt.
- Desktop home page does not show the prompt.
- No console errors, horizontal overflow, or blocked page state after completion.

## Deployment

After tests and production build pass, push the current branch using the repository's existing Git workflow. The production link will be checked after the hosting platform finishes deploying. No deployment-specific configuration change is part of this feature.
