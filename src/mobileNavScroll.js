export function advanceMobileNavScrollState({
  scrollY,
  previousScrollY,
  isOpen,
  wasCompact,
  directionTravel = 0,
  topBoundary = 24,
  directionThreshold = 6,
}) {
  if (isOpen || scrollY <= topBoundary) {
    return { compact: false, directionTravel: 0 };
  }

  const delta = scrollY - previousScrollY;
  const continuesDirection = directionTravel === 0
    || delta === 0
    || Math.sign(delta) === Math.sign(directionTravel);
  const nextDirectionTravel = continuesDirection ? directionTravel + delta : delta;

  if (nextDirectionTravel > directionThreshold) {
    return { compact: true, directionTravel: 0 };
  }
  if (nextDirectionTravel < -directionThreshold) {
    return { compact: false, directionTravel: 0 };
  }

  return { compact: wasCompact, directionTravel: nextDirectionTravel };
}

export function resolveMobileNavCompactState(options) {
  return advanceMobileNavScrollState(options).compact;
}
