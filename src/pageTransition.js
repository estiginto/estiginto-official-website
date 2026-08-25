export const INITIAL_PAGE_ENTER_DURATION = 4600;
export const PAGE_ENTER_DURATION = 1050;
export const PAGE_LEAVE_DURATION = 760;
export const REDUCED_PAGE_TRANSITION_DURATION = 120;

export function getPageTransitionVariant(pathname = "/") {
  const normalizedPath = pathname.toLowerCase();

  if (normalizedPath === "/" || normalizedPath.endsWith("/index.html")) return "grille";
  if (normalizedPath.endsWith("/solutions.html") || normalizedPath.endsWith("/consulting.html")) return "matrix";
  if (normalizedPath.endsWith("/case.html")) return "aperture";
  return "axis";
}

export function getInitialPageTransitionVariant(pathname = "/") {
  const normalizedPath = pathname.toLowerCase();
  if (normalizedPath === "/" || normalizedPath.endsWith("/index.html")) return "vortex";
  return getPageTransitionVariant(pathname);
}

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
