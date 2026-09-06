"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Drone, Droplet, Satellite } from "lucide-react";
import { isLegacyCss } from "../lib/cssMode";

const steps = [
  {
    num: "01",
    icon: Satellite,
    iconKey: "satellite",
    title: "Free Roof Quote & Measurements",
    copy: "Includes complimentary aerial roof measurements and a professional evaluation to determine if your roof qualifies for rejuvenation.",
  },
  {
    num: "02",
    icon: Drone,
    iconKey: "drone",
    title: "Drone Inspection",
    copy: "Detailed drone photos and video provide a complete view of your roof and create a documented before-and-after record.",
  },
  {
    num: "03",
    icon: Droplet,
    iconKey: "droplet",
    title: "Roof Rejuvenation Treatment",
    copy: "The rejuvenation treatment is professionally applied and absorbed within hours, with no disruption to your home.",
  },
] as const;

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (isLegacyCss()) return;
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      section.classList.add("is-in");
      return;
    }

    section.classList.add("process-pending");

    const intro = section.querySelector(".process-intro");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-in");
        observer.disconnect();
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(intro ?? section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (isLegacyCss()) return;
    const section = sectionRef.current;
    const timelineRoot = timelineRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    const list = listRef.current;
    if (!section || !timelineRoot || !track || !progress || !list) return;

    const stepEls = [...list.querySelectorAll<HTMLElement>(".process-step")];
    if (stepEls.length !== 3) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const showFinal = () => {
        gsap.set(progress, { scaleY: 1 });
        stepEls.forEach((step) => {
          gsap.set(step, { "--on": 1 });
          gsap.set(step.querySelector(".process-node"), { scale: 1 });
          gsap.set(step.querySelector(".process-step-icon-in"), {
            scale: 1,
            opacity: 1,
          });
          gsap.set(step.querySelector(".process-step-title-in"), {
            y: 0,
            opacity: 1,
          });
          gsap.set(step.querySelector(".process-step-copy-in"), {
            y: 0,
            opacity: 1,
          });
          gsap.set(step.querySelector(".process-connector"), { scaleX: 1 });
        });
      };

      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.classList.add("is-in");
        showFinal();
      });

      const bind = (
        id: string,
        textY: number,
        start: string,
        end: string,
        scrub: number | boolean,
      ) => {
        const state = { p: 0 };
        let ratios = [0.18, 0.5, 0.82];

        const measure = () => {
          const height = Math.max(1, timelineRoot.offsetHeight);
          const rootTop = timelineRoot.getBoundingClientRect().top;
          ratios = stepEls.map((step) => {
            const node = step.querySelector(".process-node");
            if (!(node instanceof HTMLElement)) return 0.5;
            const rect = node.getBoundingClientRect();
            const mid = rect.top - rootTop + rect.height / 2;
            return gsap.utils.clamp(0.04, 0.96, mid / height);
          });
        };

        const apply = () => {
          const p = state.p;
          gsap.set(progress, { scaleY: p });

          stepEls.forEach((step, i) => {
            const at = ratios[i] ?? 0.5;
            const window = 0.055;
            const t = gsap.utils.clamp(0, 1, (p - (at - window)) / window);

            gsap.set(step, { "--on": t });
            gsap.set(step.querySelector(".process-node"), {
              scale: 0.9 + 0.1 * t,
            });
            gsap.set(step.querySelector(".process-step-icon-in"), {
              scale: 0.93 + 0.07 * t,
              opacity: 0.25 + 0.75 * t,
            });
            gsap.set(step.querySelector(".process-step-title-in"), {
              y: textY * (1 - t),
              opacity: 0.4 + 0.6 * t,
            });
            gsap.set(step.querySelector(".process-step-copy-in"), {
              y: textY * (1 - t),
              opacity: 0.28 + 0.72 * t,
            });
            gsap.set(step.querySelector(".process-connector"), {
              scaleX: t,
            });
          });
        };

        gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });
        stepEls.forEach((step) => {
          gsap.set(step, { "--on": 0 });
          gsap.set(step.querySelector(".process-node"), { scale: 0.9 });
          gsap.set(step.querySelector(".process-step-icon-in"), {
            scale: 0.93,
            opacity: 0.25,
          });
          gsap.set(step.querySelector(".process-step-title-in"), {
            y: textY,
            opacity: 0.4,
          });
          gsap.set(step.querySelector(".process-step-copy-in"), {
            y: textY,
            opacity: 0.28,
          });
          gsap.set(step.querySelector(".process-connector"), { scaleX: 0 });
        });

        measure();
        apply();

        const animation = gsap.timeline({
          defaults: { ease: "none" },
        });
        animation.to(
          state,
          {
            p: 1,
            duration: 1,
            ease: "none",
            onUpdate: apply,
          },
          0,
        );

        ScrollTrigger.create({
          id,
          animation,
          trigger: timelineRoot,
          start,
          endTrigger: section,
          end,
          scrub,
          pin: false,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            apply();
          },
          onToggle: (self) => {
            progress.style.willChange = self.isActive ? "transform" : "auto";
          },
        });

        return () => {
          progress.style.willChange = "auto";
          ScrollTrigger.getById(id)?.kill();
          animation.kill();
        };
      };

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 539.98px)",
        () => bind("process-progress-compact", 7, "top 75%", "bottom bottom", true),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 540px) and (max-width: 1023.98px)",
        () => bind("process-progress-tablet", 8, "top 70%", "bottom bottom", true),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        () => bind("process-progress-desktop", 8, "top 70%", "bottom bottom", 0.75),
      );

      void document.fonts?.ready.then(() => {
        if (
          ScrollTrigger.getById("process-progress-compact") ||
          ScrollTrigger.getById("process-progress-tablet") ||
          ScrollTrigger.getById("process-progress-desktop")
        ) {
          ScrollTrigger.refresh();
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-process"
      className="process"
      aria-labelledby="process-heading"
    >
      <div className="process-shell">
        <header className="process-intro">
          <p className="process-eyebrow">Our Process</p>
          <h2 id="process-heading" className="process-title">
            <span className="process-title-lead">
              Extending <em>Roof Life</em>
            </span>
            <span className="process-title-rest"> in 3 Steps</span>
          </h2>
        </header>

        <div ref={timelineRef} className="process-timeline">
          <div ref={trackRef} className="process-track" aria-hidden="true">
            <span className="process-track-base" />
            <span ref={progressRef} className="process-track-progress" />
          </div>

          <ol ref={listRef} className="process-steps">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.num} className="process-step">
                  <span className="process-node">
                    <span className="process-node-label">{step.num}</span>
                  </span>
                  <span className="process-connector" aria-hidden="true" />
                  <div className="process-body">
                    <div className="process-step-main">
                      <span
                        className="process-step-icon"
                        data-icon={step.iconKey}
                        aria-hidden="true"
                      >
                        <span className="process-step-icon-in">
                          <Icon strokeWidth={1.75} />
                        </span>
                      </span>
                      <div className="process-step-content">
                        <h3 className="process-step-title">
                          <span className="process-step-title-in">{step.title}</span>
                        </h3>
                        <p className="process-step-copy">
                          <span className="process-step-copy-in">{step.copy}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
