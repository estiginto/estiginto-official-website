# Desktop Service Menu Design

## Goal

Give desktop users direct access to the same eight service destinations available in the mobile menu, without requiring a category switch. Keep the cursor-following diamond as the branded trigger, then prioritize clarity and scanning speed inside the expanded menu.

General site navigation such as About, FAQ, and Contact remains in the footer and is intentionally excluded from this overlay.

## Information Architecture

Desktop and mobile navigation share `mobileMenuGroupsByLocale` as their single source of localized service content.

The expanded desktop menu presents two equal columns:

### Solutions

- System Planning
- Custom Development
- System Cases
- Project Consulting

### Consulting

- Systems Consulting
- Digital Integration
- Visual Design
- International Marketing

Existing Chinese, English, and Japanese labels and destinations remain unchanged. The standalone desktop `menuTargets` data is removed if it has no remaining consumer.

## Visual Design

The existing small cursor-following diamond remains the closed-menu trigger. When activated, it opens a full-viewport scrim with a centered editorial menu rather than enlarging into another diamond.

The menu contains:

- A restrained `SERVICES` eyebrow above the navigation.
- Two balanced service columns separated by a fine vertical rule.
- A small diamond marker beside each category heading.
- Four vertically stacked links per category, numbered `01` through `04`.
- Generous whitespace and typography sized for fast scanning.
- A faint engineering grid or diamond outline in the background, used only as decoration.
- Font-size controls centered below the two-column navigation.

Hover and focus states change the link color to the existing signal blue and extend a short horizontal rule. The panel does not add service descriptions, cards, icons, or extra navigation.

## Interaction

- The closed cursor-following trigger behaves as it does today.
- Activating the trigger fades in the scrim and reveals both columns together.
- The menu uses a restrained opacity and vertical-offset transition without bounce, rotation, or continuous motion.
- Clicking the scrim or pressing Escape closes the menu.
- Selecting a service follows its existing destination.
- No category switch appears on desktop.
- Focus moves to the first service link on open and returns to the trigger on close.

## Responsive Behavior

- Fine-pointer viewports above 640 px use the two-column desktop service menu.
- At narrower fine-pointer desktop widths, column gaps, type size, and outer padding reduce before any label wraps unnecessarily.
- Short desktop viewports tighten vertical spacing while keeping all links and font controls visible.
- Viewports at or below 640 px, and coarse-pointer devices, retain the current mobile diamond menu and category switch.
- Both variants read from the same localized menu-group data.

## Accessibility

- The overlay is exposed as navigation with a localized accessible label.
- Each category is a labelled navigation group.
- Decorative grid lines and diamond markers are hidden from assistive technology.
- Keyboard order is Solutions `01`–`04`, Consulting `01`–`04`, then font controls.
- Escape and backdrop dismissal are supported.
- Hidden menu links are not clickable or included in the tab order.
- Focus is contained within the open menu.
- Reduced-motion users receive an immediate or minimal fade.

## Implementation Boundaries

- Reuse the existing desktop trigger, scrim, font controls, color tokens, and mobile service data.
- Replace the expanded desktop diamond and its five general-navigation links with a two-column service panel.
- Extract a small category-list component only if it simplifies repeated markup for the two columns.
- Keep navigation content separate from layout so future changes update desktop and mobile together.
- Do not redesign the header, footer, mobile navigation, page transitions, language selector, or the trigger's cursor-following behavior.

## Verification

Automated checks must cover:

- Desktop and mobile menus consume the same localized category data.
- Both desktop categories render all four expected links in Chinese, English, and Japanese.
- Hidden links cannot receive pointer or keyboard interaction.
- Escape and backdrop dismissal close the menu.
- Focus enters the overlay on open, remains inside it, and returns to the trigger on close.
- Reduced-motion styling suppresses the full transition.

Rendered QA must cover:

- 1910 × 948 desktop viewport.
- 1440 × 900 desktop viewport.
- A fine-pointer viewport near the 641 px boundary.
- A short desktop viewport.
- A representative mobile viewport confirming the existing category switch remains unchanged.
- Chinese, English, and Japanese labels without clipping or horizontal overflow.

## Success Criteria

- Desktop users see both service categories immediately after opening the menu.
- Desktop and mobile offer the same eight localized service destinations.
- No category-selection action is required on desktop.
- The expanded menu is easier to scan than a pair of text-filled diamonds.
- The interface remains usable with keyboard navigation and reduced motion.
- No supported viewport gains horizontal overflow or clipped controls.
