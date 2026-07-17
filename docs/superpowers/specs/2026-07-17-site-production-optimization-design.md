# ESTIGINTO Site Production Optimization Design

## Outcome

Ship a corrected production build of the existing ESTIGINTO website without redesigning it or migrating frameworks. The corrected build must be materially smaller, expose finished content instead of construction screens, use unambiguous primary navigation, and provide complete page-level search metadata.

## Scope

- Keep Vite, React, the existing multi-entry HTML pages, visual system, and current content.
- Keep the Oasis guide reachable, but exclude its local `assets/videos` archive because the guide already uses remote video sources.
- Convert the five referenced plan photographs to appropriately sized WebP assets and update React references.
- Make `/about.html`, `/case.html`, `/solutions.html`, `/faq.html`, and `/contact.html` public content pages.
- Use `/solutions.html` for solutions and `/case.html` for the selected case study. Keep FAQ reachable from the footer rather than mislabeling it as a case-study navigation item.
- Add unique title, description, canonical, Open Graph, and Twitter metadata to every HTML entry.
- Add `robots.txt` and `sitemap.xml` to the build output.
- Add Node built-in contract tests and a production output budget; do not introduce a test framework dependency.

## Architecture

`src/App.jsx` remains the shared renderer. HTML entry files identify the target section through `data-target-section`. Primary navigation maps labels directly to the corresponding entry file. The copy script becomes the deployment boundary: it copies marketing images, the non-video Oasis guide, and root discovery files into `dist`.

Asset-policy logic lives in a small importable module so tests verify behavior rather than matching script text. Site-contract tests inspect entry metadata, navigation targets, draft-page behavior, source image references, and built output size.

## Error and containment behavior

- A missing configured source asset fails the build instead of silently producing an incomplete deployment.
- The production budget fails when `dist` exceeds 40 MiB or when a marketing image exceeds 1 MiB.
- Original JPG files stay in the repository for rollback but are excluded from production output once no longer referenced.
- No canonical URL or locale URL strategy is changed beyond the existing Traditional Chinese public URLs.

## Verification

- `npm test` passes all source contracts.
- `npm run build` succeeds.
- `npm run verify:dist` confirms required files, excluded Oasis videos, and output budgets.
- `git diff --check` reports no whitespace errors.

## Deferred decisions

- Locale-specific URLs and pre-rendering/SSG need a content and URL strategy decision.
- Analytics, Search Console, Lighthouse, and observed navigation usability require production/browser evidence not available in this implementation slice.

