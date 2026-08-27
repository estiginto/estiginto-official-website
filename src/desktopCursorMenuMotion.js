const TRIGGER_RADIUS = 32;
const APPROACH_DEPTH = 80;
const APPROACH_TRAVEL = 10;
const LOWER_RIGHT_EXIT_BUFFER = 18;
const REACQUIRE_DISTANCE = 160;

export function resolveCursorMenuApproach({
  pointer,
  previousPointer,
  triggerCenter,
  southeastTravel = 0,
  locked = false,
}) {
  if (locked) {
    const passedLowerRight = (
      pointer.x > triggerCenter.x + TRIGGER_RADIUS + LOWER_RIGHT_EXIT_BUFFER
      && pointer.y > triggerCenter.y + TRIGGER_RADIUS + LOWER_RIGHT_EXIT_BUFFER
    );
    const distanceFromTrigger = Math.hypot(
      pointer.x - triggerCenter.x,
      pointer.y - triggerCenter.y,
    );
    const shouldReacquire = passedLowerRight || distanceFromTrigger > REACQUIRE_DISTANCE;

    return {
      locked: !shouldReacquire,
      shouldFollow: shouldReacquire,
      southeastTravel: 0,
    };
  }

  if (!previousPointer) {
    return { locked: false, shouldFollow: true, southeastTravel: 0 };
  }

  const deltaX = pointer.x - previousPointer.x;
  const deltaY = pointer.y - previousPointer.y;
  const movingSoutheast = deltaX > 0 && deltaY > 0;

  if (!movingSoutheast) {
    return { locked: false, shouldFollow: true, southeastTravel: 0 };
  }

  const nextTravel = southeastTravel + Math.min(deltaX, deltaY);
  const beforeTrigger = (
    pointer.x >= triggerCenter.x - APPROACH_DEPTH
    && pointer.x <= triggerCenter.x - TRIGGER_RADIUS
    && pointer.y >= triggerCenter.y - APPROACH_DEPTH
    && pointer.y <= triggerCenter.y - TRIGGER_RADIUS
  );
  const shouldLock = beforeTrigger && nextTravel >= APPROACH_TRAVEL;

  return {
    locked: shouldLock,
    shouldFollow: !shouldLock,
    southeastTravel: shouldLock ? 0 : nextTravel,
  };
}
