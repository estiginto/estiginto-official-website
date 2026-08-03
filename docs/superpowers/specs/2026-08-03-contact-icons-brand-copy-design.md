# Contact Icons and Brand Copy Design

## Scope

Refine the shared contact presentation, simplify footer company information, tighten the achievements section, and replace the manifesto headline and supporting copy in all three supported locales.

## Contact icons

- Add one small outline icon beside each Email, office telephone, mobile telephone, and LINE value in the primary contact section.
- Add the same icon system beside the corresponding Email, office telephone, mobile telephone, and LINE links in the shared footer.
- Icons are supplementary. Visible link text and existing localized labels remain unchanged.
- Draw the icons with compact inline SVG or reusable presentation markup. Do not add an icon package, emoji, raster asset, or external request.
- Use consistent stroke width, optical size, baseline alignment, and `currentColor` so the icons follow existing hover and contrast states.
- Mark decorative icons `aria-hidden="true"`; link text remains the accessible name.
- Preserve every existing `mailto:`, `tel:`, and LINE destination.

## Footer company information

- Remove the visible business registration number (`統一編號: 42752468`) from the shared footer on every page.
- Preserve `造物者科技`, the ESTIGINTO wordmark, contact links, navigation, and copyright line.

## Achievements section

- Remove the introductory achievements paragraph currently displayed beneath the `ACHIEVEMENTS` eyebrow.
- Move the Founded, Longevity, and Delivered metrics upward to close the vacated space rather than retaining an empty text block.
- Preserve all three metric values and localized metric labels.

## Manifesto headline and supporting copy

Use a two-part headline. The first phrase uses the existing dark text color and the second phrase uses the existing gold highlight color.

### Traditional Chinese

- Dark: `致力於打造`
- Gold: `有靈魂的設計`
- Supporting line 1: `打造直達目標、永續且彈性的解決方案`
- Supporting line 2: `改善企業及社會榮景`

### English

- Dark: `Driven to create`
- Gold: `design with soul`
- Supporting line 1: `We build focused, sustainable, and adaptable solutions`
- Supporting line 2: `that advance business and social prosperity.`

### Japanese

- Dark: `私たちが目指すのは`
- Gold: `魂のあるデザイン`
- Supporting line 1: `目標へ直結する、持続可能で柔軟なソリューションを構築し`
- Supporting line 2: `企業と社会の豊かさに貢献します。`

- Remove the old headline fragments and old three-line supporting copy from the rendered manifesto.
- Tighten responsive spacing for the shorter headline while preserving the current grid background, hierarchy, and gold treatment.
- Allow natural locale-specific wrapping without splitting the highlighted phrase internally.

## Accessibility and responsive behavior

- Contact links remain fully keyboard accessible with the existing focus treatment.
- Icon and text alignment must remain stable at 320px, 390px, and desktop widths.
- The shorter manifesto headline must not leave a large empty vertical gap or overlap supporting copy.
- English and Japanese copy may wrap naturally; highlighted phrases remain visually grouped.

## Verification

- Add regression tests for the icon types, decorative semantics, preserved destinations, and shared use in both Contact and Footer.
- Add regression tests confirming the registration number and achievements paragraph no longer render while all metrics remain.
- Add content tests for exact Traditional Chinese copy and approved English/Japanese equivalents.
- Run the complete test, production build, and dist verification command.
- Use the in-app Browser at 320px, 390px, and desktop width to inspect the manifesto layout, contact rows, footer links, icon alignment, wrapping, console health, and interaction destinations.

## Non-goals

- No changes to phone numbers, email addresses, LINE URL, contact CTA destinations, footer navigation, metric values, or page-transition behavior.
- No new icon library or external visual asset.
