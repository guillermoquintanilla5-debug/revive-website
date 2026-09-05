"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll-driven overlap: Hero (background) is held while Replace/Revive
 * slides over it. Does not touch the How It Works card timeline.
 * Incoming layer is never transformed so card ScrollTrigger geometry
 * stays native at the handoff frame.
 */
export default function HeroHiwOverlap({
  hero,
  incoming,
}: {
  hero: ReactNode;
  incoming: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const shiftRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const outgoing = outgoingRef.current;
    const shift = shiftRef.current;
    const incomingEl = incomingRef.current;
    if (!root || !outgoing || !shift || !incomingEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const createOverlap = (yPercent: number) => {
        const tween = gsap.fromTo(
          shift,
          { yPercent: 0 },
          {
            yPercent,
            ease: "none",
            immediateRender: false,
            force3D: true,
          },
        );

        const docTop = (el: HTMLElement) =>
          el.getBoundingClientRect().top + window.scrollY;

        ScrollTrigger.create({
          id: "hero-hiw-overlap",
          animation: tween,
          trigger: outgoing,
          /* Hold the Hero only once Replace/Revive is actually entering.
             If the Hero is taller than the viewport, skip the empty
             pre-cover distance so short/landscape is not a second trap. */
          start: () => {
            const extra = Math.max(
              0,
              docTop(incomingEl) - window.innerHeight - docTop(outgoing),
            );
            return `top+=${extra} top`;
          },
          endTrigger: incomingEl,
          end: "top top",
          pin: outgoing,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 1,
          onToggle: (self) => {
            shift.style.willChange = self.isActive ? "transform" : "auto";
          },
        });

        return () => {
          shift.style.willChange = "auto";
          tween.kill();
          ScrollTrigger.getById("hero-hiw-overlap")?.kill();
        };
      };

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(shift, { yPercent: 0, clearProps: "transform" });
      });

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 541px)",
        () => createOverlap(-32),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (max-height: 540px)",
        () => createOverlap(-20),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 1023.98px) and (min-height: 541px)",
        () => createOverlap(-24),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 1023.98px) and (max-height: 540px)",
        () => createOverlap(-18),
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-hiw-overlap" ref={rootRef}>
      <div className="hero-outgoing-layer" ref={outgoingRef}>
        <div className="hero-outgoing-shift" ref={shiftRef}>
          {hero}
        </div>
      </div>
      <div className="hiw-incoming-layer" ref={incomingRef}>
        {incoming}
      </div>
    </div>
  );
}
