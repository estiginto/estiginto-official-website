# Desktop Cursor Menu Hit Area Fix Design

## Problem

The small diamond that follows the desktop pointer is only the menu trigger. Before the menu opens, the large centered diamond remains visually hidden but can become pointer-active through the `.hovering` state. Its invisible links can intercept a page click and navigate even though the user never opened the menu.

`aria-hidden` does not prevent pointer or keyboard interaction, so the current accessibility attribute does not protect against the unintended navigation.

## Root cause

The closed menu correctly starts with `.desktop-menu-diamond { pointer-events: none; }`, but a later selector restores pointer interaction while the trigger is merely hovered or focused:

```css
.desktop-cursor-menu.hovering .desktop-menu-diamond,
.desktop-cursor-menu .desktop-menu-trigger.visible:focus-visible ~ .desktop-menu-diamond {
  pointer-events: auto;
}
```

That state is independent from `.desktop-cursor-menu.open`, allowing hidden navigation targets to become active too early.

## Approved behavior

- The pointer-following diamond remains the only interactive menu control while the menu is closed.
- The centered menu diamond and every link inside it accept pointer input only while `.desktop-cursor-menu.open` is present.
- Closed menu links are removed from keyboard tab order.
- Opening and closing animation, trigger position, menu labels, destinations, and mobile navigation remain unchanged.

## Implementation

- Remove the hover/focus selector that enables the centered diamond before opening.
- Add an explicit closed-state pointer guard for the centered diamond and its links.
- Set each desktop menu link's `tabIndex` to `0` only while open and `-1` while closed.
- Keep `aria-hidden={!open}` on the centered diamond.

## Verification

- A source regression test proves the centered diamond is pointer-active only under `.desktop-cursor-menu.open`.
- The test proves closed links receive `tabIndex={-1}` through the component's open state.
- Full tests, build, and distribution verification pass.
- Browser QA at desktop width verifies:
  - moving to and clicking the small follower diamond opens the menu;
  - clicking the page before opening does not navigate through hidden menu links;
  - open menu links still navigate normally;
  - no console errors or horizontal overflow occur.
- Production assets and the corrected interaction are verified at `https://estiginto.com/` after deployment.
