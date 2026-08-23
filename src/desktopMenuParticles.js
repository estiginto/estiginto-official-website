const FRAME_STEPS = 16;
const FRAME_MIN = 5;
const FRAME_MAX = 95;

function frameCoordinate(index) {
  return FRAME_MIN + ((FRAME_MAX - FRAME_MIN) * index) / (FRAME_STEPS - 1);
}

export function createDesktopMenuAssemblyParticles() {
  const frame = Array.from({ length: FRAME_STEPS }, (_, index) => ({ x: frameCoordinate(index), y: FRAME_MIN }))
    .concat(Array.from({ length: FRAME_STEPS }, (_, index) => ({ x: FRAME_MAX, y: frameCoordinate(index) })))
    .concat(Array.from({ length: FRAME_STEPS }, (_, index) => ({ x: frameCoordinate(FRAME_STEPS - 1 - index), y: FRAME_MAX })))
    .concat(Array.from({ length: FRAME_STEPS }, (_, index) => ({ x: FRAME_MIN, y: frameCoordinate(FRAME_STEPS - 1 - index) })))
    .map((point, id) => ({
      id,
      ...point,
      layer: "frame",
      delay: id * 3,
      size: id % 8 === 0 ? 4 : 3,
    }));

  const axis = Array.from({ length: 16 }, (_, index) => ({
    id: frame.length + index,
    x: 50,
    y: 8 + (84 * index) / 15,
    layer: "axis",
    delay: 220 + index * 5,
    size: index % 5 === 0 ? 4 : 3,
  }));

  const gridColumns = [10, 22, 34, 46, 58, 70, 82, 94];
  const gridRows = [22, 42, 62, 82];
  const grid = gridRows.flatMap((y, rowIndex) => gridColumns.map((x, columnIndex) => {
    const gridIndex = rowIndex * gridColumns.length + columnIndex;
    return {
      id: frame.length + axis.length + gridIndex,
      x,
      y,
      layer: "grid",
      delay: 320 + gridIndex * 4,
      size: (rowIndex + columnIndex) % 7 === 0 ? 3 : 2,
    };
  }));

  return [...frame, ...axis, ...grid];
}

export function getParticleAssemblyOffset(particle, origin, dimensions) {
  if (!origin || !dimensions || !Number.isFinite(dimensions.width) || !Number.isFinite(dimensions.height)) {
    return { x: 0, y: 0 };
  }

  return {
    x: ((origin.x - particle.x) / 100) * dimensions.width,
    y: ((origin.y - particle.y) / 100) * dimensions.height,
  };
}
