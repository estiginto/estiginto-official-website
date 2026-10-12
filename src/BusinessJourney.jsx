import { useEffect, useRef, useState } from "react";
import "./businessJourney.css";
import { localizeHref } from "./siteRoutes.js";
import { createOrbitalGlobe } from "./orbitalGlobe.js";

const content = {
  zh: { title: "從 0 到 1，持續成長。", stages: ["品牌起步", "數位營運", "營運成長", "國際拓展", "跨國經營"], pause: "暫停環繞動畫", play: "播放環繞動畫" },
  en: { title: "From zero to one. And to the world.", stages: ["Brand foundation", "Digital operations", "Operational growth", "Global expansion", "Multinational operations"], pause: "Pause orbital animation", play: "Play orbital animation" },
  ja: { title: "0 から 1 へ、そして世界へ。", stages: ["ブランドの始動", "デジタル運営", "事業の成長", "海外への展開", "多国籍経営"], pause: "周回アニメーションを停止", play: "周回アニメーションを再生" },
};
const routes = ["visual-design", "digital-integration", "systems-consulting", "international-marketing", "international-finance"];
const START = -150;

export default function BusinessJourney({ locale }) {
  const copy = content[locale] || content.zh;
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);
  const rocketRef = useRef(null);
  const controllerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let manuallyPaused = false;
    let progress = 0;
    let globeRotation = 0;
    let previous = 0;
    let frame = null;
    let lastActive = 0;
    const globe = createOrbitalGlobe(canvasRef.current);
    const position = () => {
      const angle = (START + progress * 360) * Math.PI / 180;
      const x = 50 + 40 * Math.cos(angle);
      const y = 50 + 38 * Math.sin(angle);
      const rotation = Math.atan2(.38 * scene.clientHeight * Math.cos(angle), -.4 * scene.clientWidth * Math.sin(angle)) * 180 / Math.PI;
      rocketRef.current.style.left = `${x}%`;
      rocketRef.current.style.top = `${y}%`;
      rocketRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation + 90}deg)`;
      const next = Math.floor((progress * 5 + .12) % 5);
      if (next !== lastActive) { lastActive = next; setActive(next); }
      globe.draw(globeRotation);
    };
    const tick = (now) => {
      frame = null;
      if (previous) {
        const delta = Math.min(now - previous, 50) / 30000;
        progress = (progress + delta) % 1;
        globeRotation = (globeRotation + delta * 60) % 360;
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
        <svg className="orbital-track" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="500" cy="500" rx="400" ry="380" /><ellipse className="orbital-track-secondary" cx="500" cy="500" rx="435" ry="420" /></svg>
        <ol className="orbital-stages">{copy.stages.map((label, index) => {
          const angle = (START + index * 72) * Math.PI / 180;
          return <li key={routes[index]} className={active === index ? "is-current" : ""} style={{ left: `${50 + 40 * Math.cos(angle)}%`, top: `${50 + 38 * Math.sin(angle)}%` }}><a href={localizeHref(`/${routes[index]}.html`, locale)}><span className="orbital-stage-number">0{index + 1}</span><span className="orbital-stage-name">{label}</span></a></li>;
        })}</ol>
        <div className="orbital-rocket" ref={rocketRef} aria-hidden="true"><svg viewBox="0 0 40 64" fill="none"><path className="rocket-flame" d="m14 43 6 17 6-17" /><path d="M12 35 5 46l9-2m14-9 7 11-9-2" fill="#b18b54" stroke="#0a1f44" strokeWidth="1.4" /><path d="M20 4C9 15 10 29 14 44h12C30 29 31 15 20 4Z" fill="#fff" stroke="#0a1f44" strokeWidth="1.8" /><path d="M14 15h12" stroke="#0a1f44" strokeWidth="1.4" /><circle cx="20" cy="25" r="4" fill="#b18b54" stroke="#0a1f44" strokeWidth="1.4" /><path d="M16 44h8v4h-8z" fill="#0a1f44" /></svg></div>
      </div>
      <button className="orbital-motion-toggle" type="button" onClick={() => controllerRef.current?.()} aria-label={paused ? copy.play : copy.pause} aria-pressed={paused}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{paused ? <path d="m9 5 10 7-10 7Z" /> : <path d="M9 5v14M15 5v14" />}</svg></button>
    </div>
  </section>;
}
