import { useEffect, useRef, useState } from "react";
import "./businessJourney.css";
import { localizeHref } from "./siteRoutes.js";
import { createOrbitalGlobe } from "./orbitalGlobe.js";
import { orbitPoint, orbitStage } from "./orbitalJourney.js";
import { createOrbitalShip } from "./orbitalShip.js";

const content = {
  zh: { title: "陪伴企業成長，度過每個階段", stages: ["品牌策略", "數位營運", "企業成長", "國際行銷", "跨國拓展"], pause: "暫停環繞動畫", play: "播放環繞動畫" },
  en: { title: "From zero to one. And to the world.", stages: ["Brand strategy", "Digital operations", "Business growth", "International marketing", "Cross-border expansion"], pause: "Pause orbital animation", play: "Play orbital animation" },
  ja: { title: "0 から 1 へ、そして世界へ。", stages: ["ブランド戦略", "デジタル運営", "企業の成長", "国際マーケティング", "海外事業展開"], pause: "周回アニメーションを停止", play: "周回アニメーションを再生" },
};
const routes = ["visual-design", "digital-integration", "systems-consulting", "international-marketing", "international-finance"];
const START = -150;

export default function BusinessJourney({ locale }) {
  const copy = content[locale] || content.zh;
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);
  const shipRef = useRef(null);
  const shipCanvasRef = useRef(null);
  const controllerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let manuallyPaused = false;
    let progress = 0;
    let previous = 0;
    let frame = null;
    let lastActive = 0;
    const globe = createOrbitalGlobe(canvasRef.current);
    const ship = createOrbitalShip(shipCanvasRef.current);
    const position = () => {
      const angle = (START + progress * 360) * Math.PI / 180;
      const point = orbitPoint(angle);
      const ahead = orbitPoint(angle + .001);
      const rotation = Math.atan2((ahead.y-point.y)*scene.clientHeight, (ahead.x-point.x)*scene.clientWidth)*180/Math.PI;
      shipRef.current.style.left = `${point.x}%`;
      shipRef.current.style.top = `${point.y}%`;
      shipRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation + 90}deg) scale(${.85 + (point.depth+1)*.18})`;
      shipRef.current.style.zIndex = point.depth < -.25 ? '0' : '3';
      const next = orbitStage(progress);
      scene.dataset.stage = String(next + 1);
      if (next !== lastActive) { lastActive = next; setActive(next); }
      globe.draw(0, { x: 50, y: 50, scale: .9, tilt: -12, roll: -10 });
      ship.draw(point.depth);
    };
    const tick = (now) => {
      frame = null;
      if (previous) {
        const delta = Math.min(now - previous, 50) / 30000;
        progress = (progress + delta) % 1;
      }
      previous = now;
      position();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      const running = visible && document.visibilityState === "visible" && !manuallyPaused && !motion.matches;
      if (running && frame === null) { previous = 0; frame = requestAnimationFrame(tick); }
      else if (!running && frame !== null) { cancelAnimationFrame(frame); frame = null; previous = 0; }
      setPaused(manuallyPaused || motion.matches);
    };
    const resize = new ResizeObserver(position);
    resize.observe(scene);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 });
    observer.observe(scene);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    controllerRef.current = () => { if (motion.matches) return; manuallyPaused = !manuallyPaused; sync(); };
    position();
    sync();
    return () => { if (frame !== null) cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", sync); controllerRef.current = null; };
  }, []);

  return <section className="section business-journey" id="business-journey" aria-labelledby="journey-title">
    <div className="wrap">
      <header className="journey-heading"><h2 id="journey-title">{copy.title}</h2></header>
      <div className="orbital-scene" ref={sceneRef}>
        <canvas className="orbital-globe" ref={canvasRef} aria-hidden="true" />
        <svg className="orbital-track" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="500" cy="500" rx="400" ry="380" /></svg>
        <ol className="orbital-stages">{copy.stages.map((label, index) => {
          const angle = (START + index * 72) * Math.PI / 180;
          return <li key={routes[index]} className={active === index ? "is-current" : ""} style={{ left: `${50 + 40 * Math.cos(angle)}%`, top: `${50 + 38 * Math.sin(angle)}%` }}><a href={localizeHref(`/${routes[index]}.html`, locale)} aria-current={active === index ? "step" : undefined}><span className="orbital-stage-number">0{index + 1}</span><span className="orbital-stage-name">{label}</span></a></li>;
        })}</ol>
        <div className="orbital-spaceship" ref={shipRef} aria-hidden="true"><canvas ref={shipCanvasRef} /></div>
      </div>
      <button className="orbital-motion-toggle" type="button" onClick={() => controllerRef.current?.()} aria-label={paused ? copy.play : copy.pause} aria-pressed={paused}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{paused ? <path d="m9 5 10 7-10 7Z" /> : <path d="M9 5v14M15 5v14" />}</svg></button>
    </div>
  </section>;
}
