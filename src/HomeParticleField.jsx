import { useEffect, useRef } from "react";
import { createHomeParticleCurrent } from "./homeParticleCurrent.js";
import "./homeParticleField.css";

// A single viewport canvas carries the hero into quiet page-edge currents.
// Content and navigation keep native pointer and scrolling behavior.
export default function HomeParticleField() {
  const fieldRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    const main = field.closest("main");
    const hero = main.querySelector(".hero");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const current = createHomeParticleCurrent({
      canvas,
    });
    const protectedContent = Array.from(main.querySelectorAll(
      ".hero-kicker, .hero-title, .hero-lede, .scrolldown, .home-directory-row, .journey-heading, .orbital-stages, .client-logo-marquee-header, .client-logo-marquee-field, .marquee-track",
    ));
    let activated = false;
    let visible = true;
    let updateFrame = null;
    let heroBounds = hero.getBoundingClientRect();

    const playback = () => {
      if (activated && visible && !document.hidden) current.start();
      else current.stop();
    };

    const measure = () => {
      updateFrame = null;
      heroBounds = hero.getBoundingClientRect();
      const mainBounds = main.getBoundingClientRect();
      const height = canvas.clientHeight;
      const progress = Math.min(1, Math.max(0, -heroBounds.top / heroBounds.height));
      visible = mainBounds.bottom > 0 && mainBounds.top < height;
      current.resize(canvas.clientWidth, height, Math.min(2, window.devicePixelRatio || 1));
      current.setScene({
        progress,
        heroTop: heroBounds.top,
        heroHeight: heroBounds.height,
        textBounds: protectedContent.map((element) => element.getBoundingClientRect())
          .filter((rect) => rect.bottom > 0 && rect.top < height)
          .map(({ left, top, right, bottom }) => ({ left, top, right, bottom })),
      });
      field.style.setProperty("--current-presence", String(Math.min(1, Math.max(0, mainBounds.bottom / 180))));
      field.dataset.flow = progress > 0.85 ? "ambient" : "hero";
      if (progress > 0.85) current.setPointer(null);
      playback();
    };
    const queueMeasure = () => {
      if (updateFrame === null) updateFrame = window.requestAnimationFrame(measure);
    };
    const resetPointer = () => current.setPointer(null);
    const movePointer = (event) => {
      if (!activated || motion.matches || !pointer.matches || event.pointerType === "touch"
        || event.clientY < Math.max(0, heroBounds.top) || event.clientY > heroBounds.bottom) {
        resetPointer();
        return;
      }
      current.setPointer({ x: event.clientX, y: event.clientY });
    };
    const activate = () => {
      activated = true;
      field.dataset.ready = "true";
      measure();
    };
    const syncMotion = () => {
      resetPointer();
      current.setReducedMotion(motion.matches);
      measure();
    };
    const visibilityChange = () => {
      resetPointer();
      playback();
    };
    current.setReducedMotion(motion.matches);
    const observer = new ResizeObserver(queueMeasure);
    observer.observe(hero);
    observer.observe(canvas);
    const contentObserver = new MutationObserver(queueMeasure);
    contentObserver.observe(hero.querySelector(".wrap"), { childList: true, characterData: true, subtree: true });
    const fallback = window.setTimeout(activate, 5000);
    window.addEventListener("estiginto:page-entered", activate, { once: true });
    window.addEventListener("scroll", queueMeasure, { passive: true });
    window.addEventListener("resize", queueMeasure, { passive: true });
    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", visibilityChange);
    motion.addEventListener("change", syncMotion);
    pointer.addEventListener("change", resetPointer);
    measure();

    return () => {
      window.clearTimeout(fallback);
      window.cancelAnimationFrame(updateFrame);
      observer.disconnect();
      contentObserver.disconnect();
      window.removeEventListener("estiginto:page-entered", activate);
      window.removeEventListener("scroll", queueMeasure);
      window.removeEventListener("resize", queueMeasure);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", visibilityChange);
      motion.removeEventListener("change", syncMotion);
      pointer.removeEventListener("change", resetPointer);
      current.destroy();
    };
  }, []);

  return (
    <div ref={fieldRef} className="home-particle-field" aria-hidden="true" data-ready="false">
      <canvas ref={canvasRef} className="home-particle-canvas" />
    </div>
  );
}
