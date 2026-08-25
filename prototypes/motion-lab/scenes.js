const TAU = Math.PI * 2;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const easeOut = (value) => 1 - (1 - clamp(value)) ** 3;
const easeInOut = (value) => {
  const t = clamp(value);
  return t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2;
};
const range = (progress, from, to) => clamp((progress - from) / (to - from));

const phaseThresholds = {
  dune: [[0.15, "void"], [0.48, "horizon"], [0.78, "monument"], [1.01, "reveal"]],
  vortex: [[0.58, "accelerate"], [0.72, "invert"], [1.01, "lock"]],
  hybrid: [[0.42, "gravity"], [0.74, "fold"], [0.9, "collapse"], [1.01, "arrival"]],
};

export function getScenePhase(id, progress) {
  const thresholds = phaseThresholds[id];
  if (!thresholds) throw new RangeError(`Unknown motion scene: ${id}`);
  return thresholds.find(([limit]) => progress < limit)?.[1] ?? thresholds.at(-1)[1];
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeParticles(count, seed) {
  const random = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    x: random(), y: random(),
    size: lerp(0.35, 2.2, random() ** 2),
    depth: lerp(0.25, 1, random()),
    angle: random() * TAU,
    drift: lerp(-1, 1, random()),
  }));
}

function resizeCanvas(canvas, drawingContext) {
  const dpr = Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(canvas.clientWidth || 1));
  const height = Math.max(1, Math.round(canvas.clientHeight || 1));
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  drawingContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function backdrop(ctx, width, height, warm = true) {
  ctx.fillStyle = "#020202";
  ctx.fillRect(0, 0, width, height);
  const glow = ctx.createRadialGradient(width * 0.5, height * 0.58, 0, width * 0.5, height * 0.58, width * 0.65);
  glow.addColorStop(0, warm ? "rgba(108,67,37,.24)" : "rgba(30,94,107,.2)");
  glow.addColorStop(0.48, warm ? "rgba(28,21,15,.2)" : "rgba(13,25,31,.16)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function drawDust(ctx, width, height, particles, elapsed, opacity = 1) {
  ctx.save();
  particles.forEach((particle, index) => {
    const motion = elapsed * 0.000018 * particle.depth;
    const x = ((particle.x + motion + Math.sin(particle.angle + elapsed * 0.0003) * 0.018) % 1) * width;
    const y = height * (0.34 + particle.y * 0.58) + Math.sin(elapsed * 0.001 + index) * 3;
    const alpha = opacity * particle.depth * (0.12 + Math.sin(index * 3.7 + elapsed * 0.0012) * 0.05);
    ctx.fillStyle = `rgba(213,169,105,${Math.max(0, alpha)})`;
    ctx.fillRect(x, y, particle.size * particle.depth, particle.size * 0.55);
  });
  ctx.restore();
}

function drawDuneLandscape(ctx, width, height, progress, elapsed, particles, strength = 1) {
  const horizonProgress = easeOut(range(progress, 0.12, 0.43));
  const horizonY = height * 0.61;
  const glow = ctx.createLinearGradient(0, horizonY - height * 0.16, 0, horizonY + height * 0.2);
  glow.addColorStop(0, "rgba(188,126,71,0)");
  glow.addColorStop(0.48, `rgba(206,144,82,${0.14 * horizonProgress * strength})`);
  glow.addColorStop(0.5, `rgba(242,202,137,${0.42 * horizonProgress * strength})`);
  glow.addColorStop(0.52, `rgba(132,78,42,${0.14 * horizonProgress * strength})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, horizonY - height * 0.18, width, height * 0.45);

  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, horizonY + height * 0.08);
  ctx.quadraticCurveTo(width * 0.22, horizonY - height * 0.015, width * 0.5, horizonY + height * 0.055);
  ctx.quadraticCurveTo(width * 0.78, horizonY + height * 0.13, width, horizonY + height * 0.035);
  ctx.lineTo(width, height);
  ctx.closePath();
  const sand = ctx.createLinearGradient(0, horizonY, 0, height);
  sand.addColorStop(0, `rgba(72,43,26,${0.78 * strength})`);
  sand.addColorStop(0.42, `rgba(23,17,13,${0.96 * strength})`);
  sand.addColorStop(1, "#030303");
  ctx.fillStyle = sand;
  ctx.fill();

  ctx.strokeStyle = `rgba(220,169,103,${0.18 * horizonProgress * strength})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, horizonY + height * 0.08);
  ctx.quadraticCurveTo(width * 0.22, horizonY - height * 0.015, width * 0.5, horizonY + height * 0.055);
  ctx.quadraticCurveTo(width * 0.78, horizonY + height * 0.13, width, horizonY + height * 0.035);
  ctx.stroke();
  drawDust(ctx, width, height, particles, elapsed, horizonProgress * strength);
}

function drawMonument(ctx, width, height, progress) {
  const build = easeInOut(range(progress, 0.38, 0.72));
  const reveal = easeOut(range(progress, 0.76, 1));
  const center = width * 0.5;
  const halfWidth = lerp(width * 0.018, width * 0.13, reveal);
  const top = lerp(height * 0.64, -height * 0.1, build);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(center - halfWidth, height * 0.74);
  ctx.lineTo(center - halfWidth * 0.28, top);
  ctx.lineTo(center + halfWidth * 0.28, top);
  ctx.lineTo(center + halfWidth, height * 0.74);
  ctx.closePath();
  ctx.fillStyle = `rgba(2,2,2,${0.96 - reveal * 0.3})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(226,185,120,${0.22 + build * 0.42})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  const beam = ctx.createLinearGradient(center - halfWidth, 0, center + halfWidth, 0);
  beam.addColorStop(0, "rgba(184,154,98,0)");
  beam.addColorStop(0.48, `rgba(245,223,178,${0.08 + reveal * 0.75})`);
  beam.addColorStop(0.5, `rgba(255,250,227,${0.34 + reveal * 0.66})`);
  beam.addColorStop(0.52, `rgba(245,223,178,${0.08 + reveal * 0.75})`);
  beam.addColorStop(1, "rgba(184,154,98,0)");
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = beam;
  ctx.fillRect(center - halfWidth, 0, halfWidth * 2, height);
  ctx.restore();
}

function drawVortex(ctx, width, height, progress, elapsed, particles, opacity = 1) {
  const invert = easeInOut(range(progress, 0.56, 0.74));
  const lock = easeOut(range(progress, 0.72, 1));
  const centerX = width * 0.5 + Math.sin(elapsed * 0.0017) * width * 0.026 * (1 - lock);
  const centerY = height * 0.5 + Math.cos(elapsed * 0.0012) * height * 0.022 * (1 - lock);
  const maxRadius = Math.hypot(width, height) * 0.72;
  const speed = lerp(0.7, 2.8, easeOut(range(progress, 0, 0.58)));
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(elapsed * 0.00014 * (invert > 0.5 ? -1 : 1));
  for (let index = 0; index < 34; index += 1) {
    const z = (index / 34 + progress * speed) % 1;
    const radius = 8 + z ** 2.15 * maxRadius;
    const alpha = Math.sin(z * Math.PI) * (1 - lock * 0.72) * opacity;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * lerp(0.35, 0.68, z), index * 0.17, 0, TAU);
    ctx.strokeStyle = index % 3 === 0 ? `rgba(118,215,219,${alpha * 0.34})` : `rgba(201,158,98,${alpha * 0.22})`;
    ctx.lineWidth = lerp(0.4, 2.1, z);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  particles.forEach((particle, index) => {
    const radial = ((particle.depth + progress * speed * 0.8) % 1) ** 2;
    const angle = particle.angle + elapsed * 0.00012 * particle.drift;
    const length = lerp(1, 36, radial) * (1 - lock * 0.75);
    const x = centerX + Math.cos(angle) * radial * maxRadius;
    const y = centerY + Math.sin(angle) * radial * maxRadius * 0.62;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length * 0.62);
    ctx.strokeStyle = index % 4 === 0 ? `rgba(101,220,226,${0.5 * opacity})` : `rgba(225,188,124,${0.34 * opacity})`;
    ctx.lineWidth = particle.size;
    ctx.stroke();
  });
  ctx.restore();
  const core = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * lerp(0.015, 0.12, 1 - lock));
  core.addColorStop(0, `rgba(244,238,215,${0.62 * opacity})`);
  core.addColorStop(0.16, `rgba(107,211,218,${0.28 * opacity})`);
  core.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, width, height);
}

function drawFold(ctx, width, height, progress, elapsed) {
  const fold = easeInOut(range(progress, 0.38, 0.76));
  const collapse = easeInOut(range(progress, 0.72, 0.92));
  const arrival = easeOut(range(progress, 0.88, 1));
  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const spread = lerp(width * 0.42, width * 0.018, collapse);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.globalCompositeOperation = "screen";
  for (let index = 0; index < 17; index += 1) {
    const normalized = (index - 8) / 8;
    const x = normalized * spread;
    const wave = Math.sin(normalized * Math.PI + elapsed * 0.0014) * height * 0.07 * fold * (1 - collapse);
    ctx.beginPath();
    ctx.moveTo(x, -height * 0.42);
    ctx.bezierCurveTo(x + wave, -height * 0.16, x - wave, height * 0.16, x, height * 0.42);
    ctx.strokeStyle = index === 8
      ? `rgba(255,240,200,${0.8 * fold})`
      : `rgba(${index % 2 ? "115,211,216" : "197,155,95"},${0.16 * fold * (1 - Math.abs(normalized) * 0.65)})`;
    ctx.lineWidth = index === 8 ? lerp(1, 5, arrival) : 1;
    ctx.stroke();
  }
  const door = ctx.createLinearGradient(-spread, 0, spread, 0);
  door.addColorStop(0, "rgba(184,154,98,0)");
  door.addColorStop(0.48, `rgba(118,215,219,${0.2 * arrival})`);
  door.addColorStop(0.5, `rgba(255,245,217,${0.9 * arrival})`);
  door.addColorStop(0.52, `rgba(184,154,98,${0.2 * arrival})`);
  door.addColorStop(1, "rgba(184,154,98,0)");
  ctx.fillStyle = door;
  ctx.fillRect(-spread, -height * 0.48, spread * 2, height * 0.96);
  ctx.restore();
}

function setOverlay(context, id, progress, phase) {
  const arrivalStart = id === "dune" ? 0.77 : id === "vortex" ? 0.73 : 0.89;
  const arrival = easeOut(range(progress, arrivalStart, 1));
  context.overlay.classList.remove("scene-dune", "scene-vortex", "scene-hybrid");
  context.overlay.classList.add(`scene-${id}`);
  context.overlay.style.setProperty("--arrival-progress", arrival.toFixed(4));
  context.overlay.style.setProperty("--arrival-blur", `${lerp(16, 0, arrival).toFixed(2)}px`);
  context.overlay.style.setProperty("--arrival-y", `${lerp(28, 0, arrival).toFixed(2)}px`);
  context.overlay.style.setProperty("--arrival-scale", lerp(0.94, 1, arrival).toFixed(4));
  context.setStageState(phase.toUpperCase());
}

function createScene(id, duration, draw) {
  let runtime = null;
  let particles = [];
  return {
    duration,
    start(context) {
      const drawingContext = context.canvas.getContext("2d", { alpha: false });
      runtime = { ...context, drawingContext };
      const { width, height } = resizeCanvas(context.canvas, drawingContext);
      particles = makeParticles(Math.round(clamp((width * height) / 3200, 90, 360)), id.length * 9109);
      drawingContext.clearRect(0, 0, width, height);
      setOverlay(runtime, id, 0, getScenePhase(id, 0));
    },
    render(progress, elapsed) {
      if (!runtime) return;
      const normalized = runtime.reducedMotion ? 1 : clamp(progress);
      const size = resizeCanvas(runtime.canvas, runtime.drawingContext);
      draw(runtime.drawingContext, size.width, size.height, normalized, elapsed, particles);
      setOverlay(runtime, id, normalized, getScenePhase(id, normalized));
    },
    stop() {
      if (!runtime) return;
      const { width, height } = resizeCanvas(runtime.canvas, runtime.drawingContext);
      runtime.drawingContext.clearRect(0, 0, width, height);
      runtime = null;
      particles = [];
    },
  };
}

export const scenes = {
  dune: createScene("dune", 5600, (ctx, width, height, progress, elapsed, particles) => {
    backdrop(ctx, width, height, true);
    drawDuneLandscape(ctx, width, height, progress, elapsed, particles);
    drawMonument(ctx, width, height, progress);
  }),
  vortex: createScene("vortex", 4600, (ctx, width, height, progress, elapsed, particles) => {
    backdrop(ctx, width, height, false);
    drawVortex(ctx, width, height, progress, elapsed, particles);
  }),
  hybrid: createScene("hybrid", 6200, (ctx, width, height, progress, elapsed, particles) => {
    backdrop(ctx, width, height, true);
    drawDuneLandscape(ctx, width, height, progress, elapsed, particles, 1 - range(progress, 0.58, 0.9) * 0.7);
    drawVortex(ctx, width, height, progress, elapsed, particles, range(progress, 0.38, 0.82) * (1 - range(progress, 0.82, 1)));
    drawFold(ctx, width, height, progress, elapsed);
  }),
};
