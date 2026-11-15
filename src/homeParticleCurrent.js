const desktopCount = 800;
const mobileCount = 260;
// Champagne gold leads the current; a small bronze layer adds depth without black.
const defaultPalette = [[177, 129, 71], [193, 151, 91], [139, 106, 64]];
const tau = 2 * Math.PI;
const strandCount = 4;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smooth(min, max, value) {
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

function flowPosition(phase) {
  // The stream slows as it rises, concentrating dots toward the upper right.
  const remaining = 1 - phase;
  return phase + 0.62 * remaining * (1 - remaining ** 4);
}

function strandOffset(strand, t, time) {
  const center = (strandCount - 1) / 2;
  return (strand - center) * 0.18 * Math.cos(t * 6.4 - time * 0.35)
    + 0.11 * Math.sin(t * 10 + strand * 1.45 - time * 0.46);
}

function makeParticles() {
  // A stable seed keeps the composition in place across resize and pause.
  let seed = 24798;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: desktopCount }, (_, index) => {
    const tone = random();
    const color = tone < 0.55 ? 0 : tone < 0.85 ? 1 : 2;
    const layer = random();
    const isCore = layer < 0.78;
    const sizeVariation = random();
    const size = random();
    const opacity = random();
    const radius = size < 0.70
      ? 0.8 + 0.6 * sizeVariation
      : size < 0.95 ? 1.5 + 0.5 * sizeVariation : 2.2 + 0.5 * sizeVariation;
    return {
      t: (index + random()) / desktopCount,
      spread: (random() + random() + random() - 1.5) / 1.5,
      isCore,
      scatter: layer >= 0.95,
      strand: Math.floor(random() * strandCount),
      wave: random() * tau,
      speed: 0.012 + random() * 0.010,
      color,
      opacity: isCore ? (color === 1 ? 0.45 + 0.20 * opacity : 0.50 + 0.22 * opacity) : 0.14 + 0.14 * opacity,
      radius,
      side: random() < 0.5 ? 0 : 1,
      hasAfterflow: random() < 0.13,
      edgeOpacity: 0.28 + 0.27 * opacity,
      edgeRadius: 0.65 + 1.15 * sizeVariation ** 2,
      offsetX: 0,
      offsetY: 0,
    };
  });
}

export function createHomeParticleCurrent({
  canvas,
  requestFrame = (callback) => globalThis.requestAnimationFrame(callback),
  cancelFrame = (id) => globalThis.cancelAnimationFrame(id),
  now = () => globalThis.performance.now(),
  palette = defaultPalette,
}) {
  const context = canvas?.getContext?.("2d");
  if (!context) {
    const noop = () => {};
    return { resize: noop, setScene: noop, setPointer: noop, setReducedMotion: noop, start: noop, stop: noop, destroy: noop };
  }

  const particles = makeParticles();
  const colors = defaultPalette.map((fallback, index) => {
    const color = palette?.[index] ?? fallback;
    return Array.isArray(color) ? `rgb(${color.join(", ")})` : color;
  });
  let width = 0;
  let height = 0;
  let ratio = 0;
  let progress = 0;
  let heroTop = 0;
  let heroHeight = 0;
  let textBounds = [];
  let pointer = null;
  let reduced = false;
  let running = false;
  let destroyed = false;
  let frameId = null;
  let lastFrame = 0;
  let elapsed = 0;

  function textVisibility(x, y) {
    let visibility = 1;
    for (const { left, top, right, bottom } of textBounds) {
      const dx = Math.max(left - x, x - right, 0);
      const dy = Math.max(top - y, y - bottom, 0);
      if (dx < 32 && dy < 32) visibility = Math.min(visibility, smooth(0, 32, Math.hypot(dx, dy)));
      if (visibility === 0) break;
    }
    return visibility;
  }

  function curve(t) {
    const h = heroHeight || height;
    const inv = 1 - t;
    // Cubic control points: (-.08, .96), (.52, .94), (.50, .18), (1.08, .12).
    const x = width * (-0.08 * inv ** 3 + 1.56 * inv ** 2 * t + 1.50 * inv * t ** 2 + 1.08 * t ** 3);
    const y = heroTop + h * (0.96 * inv ** 3 + 2.82 * inv ** 2 * t + 0.54 * inv * t ** 2 + 0.12 * t ** 3);
    const dx = width * (1.80 * inv ** 2 - 0.12 * inv * t + 1.74 * t ** 2);
    const dy = h * (-0.06 * inv ** 2 - 4.56 * inv * t - 0.18 * t ** 2);
    const inverseLength = 1 / Math.hypot(dx, dy);
    return { x, y, nx: -dy * inverseLength, ny: dx * inverseLength };
  }

  function visible(x, y) {
    return x > -3 && x < width + 3 && y > -3 && y < height + 3;
  }

  function dot(x, y, radius, opacity, color) {
    if (opacity < 0.005 || !visible(x, y)) return;
    const alpha = opacity * textVisibility(x, y);
    if (alpha < 0.005) return;
    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.beginPath();
    context.arc(x, y, radius, 0, tau);
    context.fill();
  }

  function drawThreads(time, intensity, band) {
    if (intensity < 0.08) return;
    context.lineWidth = 0.6;
    for (let strand = 0; strand < strandCount; strand += 1) {
      context.strokeStyle = colors[strand === 1 ? 1 : 0];
      let previous = null;
      for (let step = 0; step <= 42; step += 1) {
        const t = step / 42;
        const { x, y, nx, ny } = curve(t);
        const shift = band * strandOffset(strand, t, time);
        const next = { x: x + nx * shift, y: y + ny * shift };
        if (previous && (visible(next.x, next.y) || visible(previous.x, previous.y))) {
          const mx = (next.x + previous.x) / 2;
          const my = (next.y + previous.y) / 2;
          const clear = Math.min(textVisibility(next.x, next.y), textVisibility(previous.x, previous.y), textVisibility(mx, my));
          const fade = smooth(0.12, 0.64, t) * (1 - smooth(0.87, 1, t));
          context.globalAlpha = intensity * 0.10 * clear * fade;
          if (context.globalAlpha >= 0.004) {
            context.beginPath();
            context.moveTo(previous.x, previous.y);
            context.lineTo(next.x, next.y);
            context.stroke();
          }
        }
        previous = next;
      }
    }
  }

  function paint(dt = 0) {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const time = reduced ? 0 : elapsed;
    const count = width < 700 ? mobileCount : desktopCount;
    const band = clamp((heroHeight || height) * 0.13, 65, width < 700 ? 74 : 110);
    const heroIntensity = 1 - smooth(0.15, 0.98, progress);
    const edgeIntensity = 0.15 * smooth(0.32, 1, progress);
    const ease = 1 - Math.exp(-12 * dt);

    drawThreads(time, heroIntensity, band);
    for (let i = 0; i < count; i += 1) {
      // Sample the full ribbon on small screens rather than cropping its left half.
      const particle = particles[Math.floor(i * desktopCount / count)];
      const color = colors[particle.color];
      if (heroIntensity > 0) {
        const t = flowPosition((particle.t + time * particle.speed) % 1);
        const { x, y, nx, ny } = curve(t);
        const breath = 0.90 + 0.14 * Math.sin(t * 7 - time * 0.52);
        const lane = strandOffset(particle.strand, t, time);
        const shoulder = particle.scatter ? 0.64 : 0.36;
        const spread = particle.isCore
          ? particle.spread * 0.25
          : Math.sign(particle.spread) * (shoulder + Math.abs(particle.spread) * 0.58);
        const shift = band * (lane + spread * breath + 0.04 * Math.sin(t * 9 + particle.wave - time * 0.71));
        const px = x + nx * shift;
        const py = y + ny * shift;
        let targetX = 0;
        let targetY = 0;
        if (!reduced && pointer) {
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 130) {
            const force = 32 * (1 - smooth(0, 130, distance));
            targetX = force * (distance ? dx / distance : nx);
            targetY = force * (distance ? dy / distance : ny);
          }
        }
        particle.offsetX += (targetX - particle.offsetX) * ease;
        particle.offsetY += (targetY - particle.offsetY) * ease;
        const entry = 0.40 + 0.60 * smooth(0.18, 0.73, t);
        const fade = entry * smooth(0, 0.11, t) * (1 - smooth(0.89, 1, t));
        dot(px + particle.offsetX, py + particle.offsetY, particle.radius, particle.opacity * heroIntensity * fade, color);
      } else {
        particle.offsetX = 0;
        particle.offsetY = 0;
      }

      if (edgeIntensity > 0 && particle.hasAfterflow) {
        const t = (particle.t + time * particle.speed * 0.24) % 1;
        const inset = width * (0.070 + 0.028 * Math.sin(t * 4.5 + particle.side + time * 0.25) + particle.spread * 0.05);
        const x = particle.side ? width - inset : inset;
        const y = particle.side ? height * t : height * (1 - t);
        const fade = smooth(0, 0.12, t) * (1 - smooth(0.87, 1, t));
        dot(x, y, particle.edgeRadius * 0.88, particle.edgeOpacity * edgeIntensity * fade, color);
      }
    }
    context.globalAlpha = 1;
  }

  function schedule() {
    if (running && !reduced && !destroyed && frameId === null && width && height) frameId = requestFrame(tick);
  }

  function tick(timestamp) {
    frameId = null;
    if (!running || reduced || destroyed) return;
    const current = Number.isFinite(timestamp) ? timestamp : now();
    const dt = clamp((current - lastFrame) / 1000, 0, 0.05);
    lastFrame = current;
    elapsed += dt;
    paint(dt);
    schedule();
  }

  function cancel() {
    if (frameId === null) return;
    cancelFrame(frameId);
    frameId = null;
  }

  return {
    resize(nextWidth, nextHeight, nextRatio = 1) {
      if (destroyed) return;
      const dpr = nextRatio > 0 && Number.isFinite(nextRatio) ? nextRatio : 1;
      const cssWidth = Math.max(0, Number.isFinite(nextWidth) ? nextWidth : 0);
      const cssHeight = Math.max(0, Number.isFinite(nextHeight) ? nextHeight : 0);
      if (cssWidth === width && cssHeight === height && dpr === ratio) return;
      width = cssWidth;
      height = cssHeight;
      ratio = dpr;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint();
      schedule();
    },
    setScene(scene) {
      if (destroyed) return;
      heroTop = scene.heroTop ?? heroTop;
      heroHeight = scene.heroHeight ?? heroHeight;
      progress = clamp(scene.progress ?? progress, 0, 1);
      textBounds = scene.textBounds ?? textBounds;
      if (reduced || !running) paint();
    },
    setPointer(point) {
      if (destroyed) return;
      pointer = !reduced && point && Number.isFinite(point.x) && Number.isFinite(point.y) ? point : null;
    },
    setReducedMotion(value) {
      if (destroyed || reduced === Boolean(value)) return;
      reduced = Boolean(value);
      if (reduced) {
        cancel();
        pointer = null;
        for (const particle of particles) {
          particle.offsetX = 0;
          particle.offsetY = 0;
        }
        paint();
      } else {
        lastFrame = now();
        schedule();
      }
    },
    start() {
      if (destroyed || running) return;
      running = true;
      lastFrame = now();
      schedule();
    },
    stop() {
      running = false;
      cancel();
    },
    destroy() {
      destroyed = true;
      running = false;
      cancel();
    },
  };
}
