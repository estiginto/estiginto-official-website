import { useEffect } from "react";

// Reveal small editorial groups rather than moving an entire long section.
export function useScrollExperience() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const groups = [
      ...document.querySelectorAll(".reveal"),
      ...document.querySelectorAll(".home-directory-row, .client-logo-marquee"),
    ];
    const targets = new Set();
    for (const group of groups) {
      group.classList.add("is-visible");
      const nested = group.querySelectorAll(
        ".journey-heading, .growth-experience, .growth-renewal, .section-eyebrow, .section-head, .service-overview-card, .team-card, .client-logo-marquee-header, .client-logo-marquee-field"
      );
      const items = nested.length ? [...nested] : [...group.children];
      items.forEach((item, index) => {
        // Do not animate both an ancestor and its descendant.
        if (items.some((parent) => parent !== item && parent.contains(item))) return;
        item.style.setProperty("--entry-delay", `${Math.min(index % 5, 3) * 65}ms`);
        targets.add(item);
      });
    }

    let observer;
    const show = (target) => {
      target.classList.remove("is-pending");
      target.classList.add("is-entered");
      observer?.unobserve(target);
    };
    const showAll = () => {
      if (motion.matches) targets.forEach(show);
    };
    if (!motion.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) show(entry.target); });
      }, { rootMargin: "0px 0px -32px 0px", threshold: 0 });
      targets.forEach((target) => {
        target.classList.add("scroll-entry");
        const bounds = target.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) show(target);
        else {
          target.classList.add("is-pending");
          observer.observe(target);
        }
      });
    }
    // Keyboard users and direct anchors must never wait for an entrance.
    const showFocused = (event) => {
      targets.forEach((target) => { if (target.contains(event.target)) show(target); });
    };
    document.addEventListener("focusin", showFocused);
    motion.addEventListener("change", showAll);
    return () => {
      observer?.disconnect();
      document.removeEventListener("focusin", showFocused);
      motion.removeEventListener("change", showAll);
      targets.forEach((target) => {
        target.classList.remove("scroll-entry", "is-pending", "is-entered");
        target.style.removeProperty("--entry-delay");
      });
    };
  }, []);
}
