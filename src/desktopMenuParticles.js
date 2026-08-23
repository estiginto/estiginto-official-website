const STREAM_COUNT = 48;
const GOLDEN_ANGLE = 137.5;
const GLYPHS = ["01", "SYS", "API", "DATA", "TX", "RX", "//", "↗"];

export function createDesktopMenuDataStreams() {
  return Array.from({ length: STREAM_COUNT }, (_, id) => {
    const angle = ((id * GOLDEN_ANGLE) % 360) * (Math.PI / 180);
    const radius = 0.34 + ((id * 29) % 66) / 100;
    const duration = 1800 + ((id * 173) % 1400);
    const typeIndex = id % 4;
    const type = typeIndex === 0 ? "glyph" : typeIndex === 2 ? "node" : "streak";

    return {
      id,
      type,
      glyph: type === "glyph" ? GLYPHS[(id / 4) % GLYPHS.length] : "",
      laneX: Number((Math.cos(angle) * radius).toFixed(4)),
      laneY: Number((Math.sin(angle) * radius * 0.72).toFixed(4)),
      duration,
      delay: -Math.floor(((id + 1) / (STREAM_COUNT + 1)) * duration),
      size: 2 + ((id * 7) % 4),
    };
  });
}
