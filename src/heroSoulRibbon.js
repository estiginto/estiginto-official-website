const TAU = Math.PI * 2;
const LINE_COUNT = 17;
const PULSE_COUNT = 3;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const rgba = (color, alpha) => `rgba(${color.join(",")},${alpha})`;

const INK = [23, 27, 34];
const EARTH = [83, 69, 54];
const GOLD = [172, 121, 61];

function resizeCanvas(canvas, context) {
  const dpr = Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(canvas.clientWidth || 1));
  const height = Math.max(1, Math.round(canvas.clientHeight || 1));
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function soulPoint(progress, width, height, wave = 0) {
  const inverse = 1 - progress;
  const x = inverse ** 3 * (-width * 0.08)
    + 3 * inverse ** 2 * progress * (width * 0.25)
    + 3 * inverse * progress ** 2 * (width * 0.67)
    + progress ** 3 * (width * 1.06);
  const y = inverse ** 3 * (height * 0.94)
    + 3 * inverse ** 2 * progress * (height * 0.82)
    + 3 * inverse * progress ** 2 * (height * 0.22)
    + progress ** 3 * (height * 0.04);
  return [x, y + wave];
}

function traceRibbonPath(context, width, height, elapsed, offset = 0, energy = 0) {
  const phase = elapsed * 0.00032 + offset * 0.057;
  const amplitude = 15 + energy * 5;
  for (let progress = 0; progress <= 1.001; progress += 0.018) {
    const envelope = Math.sin(progress * Math.PI);
    const wave = Math.sin(progress * 11 + phase) * amplitude * envelope
      + offset * (0.55 + envelope * 0.7);
    const [x, y] = soulPoint(progress, width, height, wave);
    if (progress === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
}

function drawSoulRibbon(context, width, height, elapsed, energy) {
  context.clearRect(0, 0, width, height);
  context.save();

  const glow = context.createLinearGradient(0, height, width, 0);
  glow.addColorStop(0, rgba(GOLD, 0.015));
  glow.addColorStop(0.52, rgba(GOLD, 0.1 + energy * 0.035));
  glow.addColorStop(1, rgba(GOLD, 0.015));
  context.beginPath();
  traceRibbonPath(context, width, height, elapsed, 0, energy);
  context.strokeStyle = glow;
  context.lineWidth = Math.max(38, width * 0.045) + energy * 12;
  context.filter = "blur(24px)";
  context.stroke();
  context.filter = "none";

  for (let index = 0; index < LINE_COUNT; index += 1) {
    const offset = (index - (LINE_COUNT - 1) / 2) * 8.2;
    context.beginPath();
    traceRibbonPath(context, width, height, elapsed + index * 1470, offset, energy);
    const isGold = index % 5 === 0;
    context.strokeStyle = isGold
      ? rgba(GOLD, 0.24 + energy * 0.07)
      : rgba(index % 2 ? INK : EARTH, 0.075 + index * 0.006 + energy * 0.018);
    context.lineWidth = isGold ? 1.45 : 0.55 + index * 0.035;
    context.stroke();
  }

  for (let index = 0; index < PULSE_COUNT; index += 1) {
    const progress = ((elapsed * 0.000055) + index / PULSE_COUNT) % 1;
    const pulseWave = Math.sin(progress * 12 + elapsed * 0.00045) * 9;
    const [x, y] = soulPoint(progress, width, height, pulseWave);
    const radius = 11 + index * 3 + energy * 3;
    const pulse = context.createRadialGradient(x, y, 0, x, y, radius * 4);
    pulse.addColorStop(0, rgba(GOLD, 0.3 - index * 0.04 + energy * 0.08));
    pulse.addColorStop(1, rgba(GOLD, 0));
    context.fillStyle = pulse;
    context.beginPath();
    context.arc(x, y, radius * 4, 0, TAU);
    context.fill();
  }

  context.restore();
}

export function createHeroSoulRibbon({
  canvas,
  reducedMotion = false,
  now = () => performance.now(),
  requestFrame = (callback) => requestAnimationFrame(callback),
  cancelFrame = (id) => cancelAnimationFrame(id),
} = {}) {
  const context = canvas.getContext("2d");
  let frameId = null;
  let startedAt = 0;
  let energy = 0;

  const render = (timestamp) => {
    frameId = null;
    const elapsed = Math.max(0, timestamp - startedAt);
    const { width, height } = resizeCanvas(canvas, context);
    drawSoulRibbon(context, width, height, elapsed, energy);
    frameId = requestFrame(render);
  };

  return {
    start() {
      if (frameId !== null) return;
      startedAt = now();
      if (reducedMotion) {
        const { width, height } = resizeCanvas(canvas, context);
        drawSoulRibbon(context, width, height, 5000, energy);
        return;
      }
      frameId = requestFrame(render);
    },
    stop() {
      if (frameId !== null) cancelFrame(frameId);
      frameId = null;
      const { width, height } = resizeCanvas(canvas, context);
      context.clearRect(0, 0, width, height);
    },
    setEnergy(value) {
      energy = clamp(value);
    },
  };
}
