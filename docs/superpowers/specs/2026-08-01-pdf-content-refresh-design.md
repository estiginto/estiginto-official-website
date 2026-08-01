# Estiginto 2026 PDF Content Refresh Design

## Goal

Update the existing Estiginto website from `Estiginto_服務及案例介紹_2026.pdf` while preserving the current visual identity and page structure. The website will present the same verified company facts, service scope, and anonymized reference cases in Traditional Chinese, English, and Japanese.

## Source of truth

The supplied 20-page PDF is authoritative for this update. Existing website claims that are not supported by the PDF must not be presented as verified facts or case outcomes.

Verified company facts:

- The team was formed in 2011 by national software competition representatives.
- The longest-running delivered system has operated for 12 years.
- More than 325 systems, design deliverables, and integrated solutions have been delivered.
- The company emphasizes direct, effective, sustainable, and flexible solutions within budget.
- Public contact details are `+886 2 2431 5362`, `+886 972 118 427`, and `contact@estiginto.com`.

Claims such as `99.9%` availability, `70+` partners, or numerical improvements that do not appear in the PDF will be removed or rewritten as qualitative statements.

## Selected approach

Use a content-first refresh inside the current React/Vite implementation. Keep the established typography, colors, header, navigation, motion, spacing system, and responsive behavior. Add only the layout needed to make the expanded case portfolio readable.

This approach is preferred over:

1. Copy-only replacement, which would not adequately expose the 14 cases.
2. A full visual redesign based on the PDF, which would unnecessarily discard the website's existing design system.

## Information architecture

### Home

- Retain the current hero structure.
- Rewrite the company positioning from the PDF's themes: building durable systems, creating thoughtful design, and helping brands grow.
- Replace the current metrics with source-backed facts: founded in 2011, 12 years for the longest-running system, and 325+ delivered outcomes.
- Present a concise preview of the four service families and link to the solutions page.
- Keep the contact call to action.

### About

- Explain the 2011 origin and the team's operating principles.
- Present the three verified proof points without adding unsupported partner or availability figures.
- Preserve the existing manifesto layout and adapt its copy to the PDF.

### Solutions

Organize services into four source-backed families:

1. Website design
   - Brand and corporate websites
   - E-commerce
   - Online booking
   - Static, dynamic, medium, and high-load websites
2. Custom system development
   - Online management systems, desktop applications, and mobile apps
   - ERP, CRM, POS, HRM, WMS, SCM, and BDM
3. Graphic design
   - Logo and identity, stationery, catalogs and DM, social media assets, presentations, and exhibition/event visuals
4. Marketing and advertising
   - Social strategy, content and SEO, KOL collaboration, Google and Meta ads, YouTube/LINE/TikTok ads, e-commerce platform promotion, and brand/marketing consulting

The page may retain concise references to current implementation capabilities when they clarify delivery, but these must not displace or contradict the PDF service scope.

### Case studies

Replace the current single, numerically detailed case with an anonymized portfolio of 14 PDF-backed cases:

1. Elevator operations: automated maintenance dispatch, calendar/map management, IoT monitoring, dashboards, and multi-country operation.
2. Senior care IoT: building equipment control, health-device monitoring, smart sensors, personnel/procurement management, security, and UPS backup.
3. Pharmaceutical management: global physicians, clinics, and suppliers; electronic agreements; security and high-load operation.
4. Shipping warehouse management: dashboards, shipping notifications, IoT inventory sensing, storage reports, and automated allocation.
5. Art collection platform: 3D digital archives, virtual securitization, online auctions, certificate signatures, design, and marketing.
6. Fresh-food omnichannel: e-commerce, cold-chain warehousing, same-day delivery, enterprise reporting, online/offline integration, and load balancing for 80,000 members.
7. Government administration: SSO, nationwide education information, million-record data management, budget management, security, and intranet operation.
8. Yacht and event management: yachts, aircraft, and venue inventory; quotes/orders; insurance workflow; booking; design and marketing.
9. Production traceability and quality: iOS/Android apps, QR acceptance, product and production-photo management, security, and intranet operation.
10. Manufacturing management: materials, work in progress, finished goods, automated work orders, assembly, costing, and shortage alerts.
11. Travel discovery app: destinations, facilities, trip trails, social interaction, advertising revenue, and placement management.
12. Location-based broadcast app: scoped messaging, broadcast range/frequency, mobile notifications, beacons, and location-based game use.
13. Event booking and commerce: booking, membership, payments, invoices, SMS, membership-fee notices, and payment-slip generation.
14. Consumer brand website: interactive color matching, brand presentation, visual design, checkout, and discount rules.

Every case uses an industry description rather than a customer or brand name. No logo wall or client-identifying label will be added. Case descriptions will avoid invented dates, performance metrics, or commercial results.

The default view will be a scannable portfolio list or grid with a short summary and capability tags. Each case can expand in place or open a lightweight accessible detail panel. This adds depth without creating fourteen separate pages.

### Contact

- Retain email, landline, LINE, and Facebook links already present.
- Add the mobile number shown in the PDF.
- Keep the existing consultation-focused call to action.

## Localization

Traditional Chinese is the semantic source. English and Japanese versions will be complete translations rather than partial fallbacks.

- English will use concise international B2B language.
- Japanese will use natural, polite business language and familiar technical terms.
- Product acronyms such as ERP, CRM, POS, HRM, WMS, SCM, BDM, SSO, QR, and IoT remain unchanged.
- Industry labels remain anonymous in all locales.
- All navigation, section headings, calls to action, case summaries, capability tags, and accessible labels must respond to the selected locale.

## Component and data design

The existing single React application remains the runtime architecture.

- Store shared factual values and the 14-case inventory in structured data rather than duplicating markup.
- Store locale-specific display text in the existing localization layer or a focused adjacent data module if `App.jsx` becomes harder to maintain.
- Replace the current `CaseStudy` presentation with a portfolio component that renders the localized case inventory.
- Reuse existing section, button, typography, reveal, and responsive primitives.
- Add only focused case-card/detail styles; unrelated CSS and components remain untouched.

No backend, CMS, external API, or new production dependency is required.

## Interaction and accessibility

- Case summaries must be usable with mouse, touch, and keyboard.
- Expand controls expose `aria-expanded` and identify their detail region.
- Focus indicators, Escape-to-close behavior for any dialog, and body-scroll restoration are required if a modal pattern is used.
- Reduced-motion preferences continue to be honored.
- Text remains readable at the site's supported font-scale settings and at mobile widths.
- The page remains useful when images are unavailable; case meaning must not depend on imagery.

## Visual treatment

- Preserve the website's current navy, white, signal-blue, and editorial typography system.
- Use existing optimized WebP photography only where it supports a service or industry theme.
- Do not copy client screenshots or logos out of the PDF into the public site, because anonymity is part of the approved scope.
- Vary case density through hierarchy, spacing, and tags rather than adding decorative card styles unrelated to the current system.

## Metadata

Update relevant title and description copy when necessary so the homepage, solutions page, case page, about page, and contact page describe the refreshed content accurately. Canonical URLs and the current public route structure remain unchanged.

## Error and fallback behavior

- Unknown or missing locales fall back to Traditional Chinese through the existing locale mechanism.
- Missing optional case imagery uses the text layout without a broken-image element.
- Each case record requires an identifier, industry label, title, summary, and capability list; incomplete records must be caught by tests.
- External contact links retain safe target and relationship attributes.

## Verification

Automated checks will cover:

- All 14 anonymized cases exist and render from structured data.
- Each case has complete Traditional Chinese, English, and Japanese content.
- Unsupported numeric claims are absent from the refreshed source.
- Verified company facts and contact details are present.
- Existing navigation, metadata, sitemap, WebP asset, and distribution checks continue to pass.
- Production build and distribution verification succeed.

Browser QA will cover:

- Home, about, solutions, case, and contact pages in all three locales.
- Desktop and mobile layouts, including long English and Japanese text.
- Keyboard operation and focus behavior for case expansion/details.
- Font scaling and reduced-motion behavior.
- No clipped text, horizontal overflow, broken assets, or console errors.

## Out of scope

- Publishing customer or brand names.
- Reusing the PDF's client logos or identifiable case screenshots.
- Adding a CMS or admin interface.
- Creating separate pages for every case.
- A full visual rebrand.
- Inventing case results, dates, testimonials, or performance metrics not present in the source PDF.
