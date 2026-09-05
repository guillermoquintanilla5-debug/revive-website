"use client";

import { useEffect, useRef } from "react";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation })
      .connection;
    const slow =
      Boolean(connection?.saveData) ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    if (reduce || slow) return;

    let cancelled = false;
    let started = false;
    const markReady = () => {
      if (!cancelled) video.classList.add("is-ready");
    };
    const play = () => {
      if (cancelled) return;
      video.play().then(markReady).catch(() => {});
    };

    const start = () => {
      if (cancelled || started) return;
      started = true;
      window.removeEventListener("scroll", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("touchstart", start);
      video.preload = "auto";
      if (video.readyState >= 2) play();
      else video.addEventListener("canplay", play, { once: true });
      video.load();
    };

    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    let idleId = 0;
    let fallbackId = 0;
    if (desktop) {
      const idle =
        window.requestIdleCallback?.bind(window) ??
        ((cb: () => void) => window.setTimeout(cb, 220));
      idleId = idle(start, { timeout: 900 }) as number;
    } else {
      window.addEventListener("scroll", start, { passive: true });
      window.addEventListener("pointerdown", start);
      window.addEventListener("touchstart", start, { passive: true });
      fallbackId = window.setTimeout(start, 6000);
    }

    return () => {
      cancelled = true;
      if (idleId) {
        const cancelIdle =
          window.cancelIdleCallback?.bind(window) ?? window.clearTimeout;
        cancelIdle(idleId);
      }
      window.clearTimeout(fallbackId);
      window.removeEventListener("scroll", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("touchstart", start);
      video.removeEventListener("canplay", play);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="hero-video absolute inset-0 h-full w-full object-cover object-center"
    >
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
    </video>
  );
}
