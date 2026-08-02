export function getTransitionDestination({ anchor, event, currentUrl }) {
  if (
    !anchor
    || event.defaultPrevented
    || event.button !== 0
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
  ) {
    return null;
  }

  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return null;
  }

  const destination = new URL(anchor.href, currentUrl);
  const current = new URL(currentUrl);
  if (!/^https?:$/.test(destination.protocol) || destination.origin !== current.origin) {
    return null;
  }

  const sameDocument = destination.pathname === current.pathname
    && destination.search === current.search;
  if (sameDocument) {
    return null;
  }

  return destination.href;
}
