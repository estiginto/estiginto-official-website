const LEFT_EDGE_TARGETS = [
  [-4, 8],
  [-4, 24],
  [-4, 44],
  [-4, 68],
  [-4, 88],
  [18, 104],
];

function createPath(endX, endY, id) {
  const controlOneX = 50 + (endX - 50) * 0.2;
  const controlOneY = 47 + (endY - 47) * 0.16;
  const controlTwoX = 50 + (endX - 50) * 0.68;
  const bend = (id % 3 - 1) * 2.4;
  const controlTwoY = 47 + (endY - 47) * 0.64 + bend;

  return `M 50 47 C ${controlOneX.toFixed(1)} ${controlOneY.toFixed(1)}, ${controlTwoX.toFixed(1)} ${controlTwoY.toFixed(1)}, ${endX} ${endY}`;
}

export function createDesktopMenuFiberTracks() {
  const targets = LEFT_EDGE_TARGETS.concat(
    LEFT_EDGE_TARGETS.slice().reverse().map(([x, y]) => [100 - x, y]),
  );

  return targets.map(([endX, endY], id) => {
    const duration = 2800 + ((id * 137) % 1200);
    return {
      id,
      endX,
      endY,
      path: createPath(endX, endY, id),
      duration,
      delay: -Math.floor(((id + 1) / (targets.length + 1)) * duration),
    };
  });
}
