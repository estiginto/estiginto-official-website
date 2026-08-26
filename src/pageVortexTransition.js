const DURATION = 4600;
const TAU = Math.PI * 2;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const easeOut = (value) => 1 - (1 - clamp(value)) ** 3;
const range = (progress, from, to) => clamp((progress - from) / (to - from));

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeStars(count = 190) {
  const random = seededRandom(48271);
  return Array.from({ length: count }, () => ({
    angle: random() * TAU,
    depth: lerp(0.08, 1, random()),
    size: lerp(0.3, 1.8, random() ** 2),
    drift: lerp(-1, 1, random()),
  }));
}

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

function drawFrame(context, width, height, stars, progress, elapsed, { ambient = false, energy = 0 } = {}) {
  const fadeOut = ambient ? 1 : 1 - easeOut(range(progress, 0.9, 1));
  const lock = ambient ? 0 : easeOut(range(progress, 0.72, 0.96));
  const invert = ambient ? (Math.sin(elapsed * 0.00012) + 1) * 0.5 : range(progress, 0.58, 0.72);
  const speed = ambient ? 0.34 : lerp(0.7, 2.8, easeOut(range(progress, 0, 0.58)));
  const centerX = width * (ambient ? 0.54 : 0.5) + Math.sin(elapsed * 0.0017) * width * 0.026 * (1 - lock);
  const centerY = height * 0.5 + Math.cos(elapsed * 0.0012) * height * 0.022 * (1 - lock);
  const maxRadius = Math.hypot(width, height) * 0.72;

  context.clearRect(0, 0, width, height);
  context.save();
  context.globalAlpha = fadeOut;
  if (!ambient) {
    context.fillStyle = "#020405";
    context.fillRect(0, 0, width, height);
  }

  const ambientGlow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.62);
  ambientGlow.addColorStop(0, ambient ? "rgba(177,129,71,.18)" : "rgba(28,91,103,.22)");
  ambientGlow.addColorStop(0.42, ambient ? "rgba(91,72,51,.08)" : "rgba(11,26,31,.18)");
  ambientGlow.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = ambientGlow;
  context.fillRect(0, 0, width, height);

  context.save();
  context.translate(centerX, centerY);
  const rotationDirection = ambient ? -1 : invert > 0.5 ? -1 : 1;
  const rotationSpeed = ambient ? 0.000055 : 0.00014;
  context.rotate(elapsed * rotationSpeed * rotationDirection);
  for (let index = 0; index < 34; index += 1) {
    const z = (index / 34 + progress * speed) % 1;
    const radius = 8 + z ** 2.15 * maxRadius;
    const alpha = Math.sin(z * Math.PI) * (1 - lock * 0.68);
    context.beginPath();
    context.ellipse(0, 0, radius, radius * lerp(0.35, 0.68, z), index * 0.17, 0, TAU);
    context.strokeStyle = ambient
      ? index % 3 === 0
        ? `rgba(36,32,27,${alpha * 0.52})`
        : `rgba(82,69,54,${alpha * 0.48})`
      : index % 3 === 0
        ? `rgba(118,215,219,${alpha * 0.42})`
        : `rgba(201,158,98,${alpha * 0.27})`;
    context.lineWidth = lerp(0.4, 2.1, z);
    context.stroke();
  }
  context.restore();

  context.save();
  context.globalCompositeOperation = ambient ? "multiply" : "screen";
  stars.forEach((star, index) => {
    const radial = ((star.depth + progress * speed * 0.8) % 1) ** 2;
    const angle = star.angle + elapsed * 0.00012 * star.drift;
    const length = (ambient ? lerp(7, 24, radial) : lerp(1, 36, radial))
      * (1 - lock * 0.72)
      * (1 + energy * 1.4);
    const x = centerX + Math.cos(angle) * radial * maxRadius;
    const y = centerY + Math.sin(angle) * radial * maxRadius * 0.62;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length * 0.62);
    context.strokeStyle = ambient
      ? index % 4 === 0 ? "rgba(54,49,42,.50)" : "rgba(82,69,54,.42)"
      : index % 4 === 0 ? "rgba(101,220,226,.54)" : "rgba(225,188,124,.37)";
    context.lineWidth = star.size;
    context.stroke();
  });
  context.restore();

  const core = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * lerp(0.015, 0.12, 1 - lock));
  core.addColorStop(0, ambient ? "rgba(255,250,236,.86)" : "rgba(244,238,215,.68)");
  core.addColorStop(0.16, ambient ? "rgba(177,129,71,.32)" : "rgba(107,211,218,.31)");
  core.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = core;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function createVortexController({
  canvas,
  reducedMotion = false,
  now = () => performance.now(),
  requestFrame = (callback) => requestAnimationFrame(callback),
  cancelFrame = (id) => cancelAnimationFrame(id),
  ambient = false,
} = {}) {
  const context = canvas.getContext("2d");
  const stars = makeStars(ambient ? 48 : 190);
  let frameId = null;
  let startedAt = 0;
  let energy = 0;

  const render = (timestamp) => {
    frameId = null;
    const elapsed = Math.max(0, timestamp - startedAt);
    const progress = ambient ? elapsed / 16000 : Math.min(1, elapsed / DURATION);
    const { width, height } = resizeCanvas(canvas, context);
    drawFrame(context, width, height, stars, progress, elapsed, { ambient, energy });
    if (ambient || progress < 1) frameId = requestFrame(render);
  };

  return {
    start() {
      startedAt = now();
      if (reducedMotion) {
        const { width, height } = resizeCanvas(canvas, context);
        const elapsed = ambient ? 8000 : DURATION;
        drawFrame(context, width, height, stars, ambient ? 0.5 : 1, elapsed, { ambient, energy });
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

export function createPageVortexTransition(options = {}) {
  return createVortexController(options);
}

export function createHeroVortexBackground(options = {}) {
  return createVortexController({ ...options, ambient: true });
}
