// Fixed orbital plane shared by the spacecraft and the five station anchors.
export function orbitPoint(angle) {
  return { x: 50 + 40 * Math.cos(angle), y: 50 + 38 * Math.sin(angle), depth: Math.sin(angle) };
}

export function orbitStage(progress) {
  const phase = (progress % 1 + 1) % 1;
  const nearest = Math.round(phase * 5);
  // Enlarge a title only while the ship is within 23.4 degrees of its station.
  return Math.abs(phase - nearest / 5) <= .065 ? nearest % 5 : -1;
}
