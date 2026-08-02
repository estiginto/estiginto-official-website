export function resolveMobileNavCompactState({
  scrollY,
  previousScrollY,
  isOpen,
  wasCompact,
  topBoundary = 24,
  directionThreshold = 6,
}) {
  if (isOpen || scrollY <= topBoundary) {
    return false;
  }

  const delta = scrollY - previousScrollY;
  if (delta > directionThreshold) {
    return true;
  }
  if (delta < -directionThreshold) {
    return false;
  }

  return wasCompact;
}
