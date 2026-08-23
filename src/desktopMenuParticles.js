const PARTICLE_COLUMNS = [5, 20, 35, 50, 65, 80, 95];
const PARTICLE_ROWS = [8, 36, 64, 92];

export function createDesktopMenuParticles() {
  return PARTICLE_ROWS.flatMap((y, rowIndex) => (
    PARTICLE_COLUMNS.map((x, columnIndex) => {
      const id = rowIndex * PARTICLE_COLUMNS.length + columnIndex;

      return {
        id,
        x,
        y,
        pull: 0.34 + ((rowIndex + columnIndex) % 5) * 0.02,
        delay: id * 12,
      };
    })
  ));
}

export function projectParticleTowardTarget(particle, target) {
  if (!target) {
    return { x: particle.x, y: particle.y };
  }

  return {
    x: particle.x + (target.x - particle.x) * particle.pull,
    y: particle.y + (target.y - particle.y) * particle.pull,
  };
}
