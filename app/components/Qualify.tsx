"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarDays, Check, House, ShieldCheck, Sun } from "lucide-react";
import QuoteCta from "./QuoteCta";

const criteria = [
  {
    num: "01",
    icon: CalendarDays,
    optical: "calendar",
    text: (
      <>
        Roof is <strong>8–25 years old</strong>
      </>
    ),
  },
  {
    num: "02",
    icon: House,
    optical: "house",
    text: (
      <>
        <strong>Asphalt</strong> shingle roof
      </>
    ),
  },
  {
    num: "03",
    icon: Sun,
    optical: "sun",
    text: (
      <>
        Shingles look <strong>dry or faded</strong>
      </>
    ),
  },
  {
    num: "04",
    icon: ShieldCheck,
    optical: "shield",
    text: (
      <>
        <strong>Good</strong> structural condition
      </>
    ),
  },
] as const;

export default function Qualify() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const ctaQRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      section.classList.add("is-in");
      return;
    }

    const intro = introRef.current;
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
    const section = sectionRef.current;
    const list = listRef.current;
    const ctaQ = ctaQRef.current;
    const ctaBtn = ctaBtnRef.current;
    if (!section || !list || !ctaQ || !ctaBtn) return;

    const rows = [...list.querySelectorAll<HTMLElement>(".qualify-row")];
    if (rows.length !== 4) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.classList.add("is-in");
        gsap.set([ctaQ, ctaBtn], { opacity: 1, y: 0, scale: 1 });
        rows.forEach((row) => {
          gsap.set(row.querySelectorAll(".qualify-num, .qualify-icon-in, .qualify-text-in, .qualify-check-in, .qualify-rule"), {
            opacity: 1,
            y: 0,
            scale: 1,
            scaleX: 1,
          });
        });
      });

      const mobileTiming = {
        titleAt: 0,
        titleDur: 0.12,
        copyAt: 0.08,
        copyDur: 0.1,
        rowWindows: [
          [0.18, 0.16],
          [0.32, 0.16],
          [0.46, 0.16],
          [0.6, 0.16],
        ] as const,
        ctaQAt: 0.76,
        ctaQDur: 0.1,
        ctaBtnAt: 0.84,
        ctaBtnDur: 0.12,
        holdDur: 0.17,
        start: "top 75%",
        end: "bottom 96%",
        scrub: 0.6,
      };

      const compactTiming = {
        ...mobileTiming,
        start: "top 60%",
        end: "bottom 90%",
      };

      const desktopTiming = {
        titleAt: 0,
        titleDur: 0.1,
        copyAt: 0.08,
        copyDur: 0.1,
        rowWindows: [
          [0.18, 0.14],
          [0.3, 0.14],
          [0.42, 0.14],
          [0.54, 0.14],
        ] as const,
        ctaQAt: 0.7,
        ctaQDur: 0.12,
        ctaBtnAt: 0.82,
        ctaBtnDur: 0.13,
        holdDur: 0.05,
        start: "top 88%",
        end: "bottom 68%",
        scrub: 0.75,
      };

      type Motion = {
        titleY: number;
        textY: number;
        numY: number;
        iconScale: number;
        ctaY: number;
        btnY: number;
      };

      type Timing = {
        rowWindows: readonly (readonly [number, number])[];
        ctaQAt: number;
        ctaQDur: number;
        ctaBtnAt: number;
        ctaBtnDur: number;
        holdDur: number;
        start: string;
        end: string;
        scrub: number;
      };

      const unit = (time: number, at: number, dur: number) =>
        gsap.utils.clamp(0, 1, dur <= 0 ? 1 : (time - at) / dur);

      const bindProgress = (id: string, motion: Motion, timing: Timing) => {
        const easeOut = gsap.parseEase("power2.out");
        const rowParts = rows.map((row) => ({
          num: row.querySelector(".qualify-num"),
          icon: row.querySelector(".qualify-icon-in"),
          text: row.querySelector(".qualify-text-in"),
          rule: row.querySelector(".qualify-rule"),
          check: row.querySelector(".qualify-check-in"),
        }));

        const total = timing.ctaBtnAt + timing.ctaBtnDur + timing.holdDur;
        const state = { p: 0 };

        const apply = () => {
          const time = state.p * total;

          timing.rowWindows.forEach(([start, span], i) => {
            const parts = rowParts[i];
            const numT = unit(time, start, span * 0.28);
            const iconT = easeOut(unit(time, start + span * 0.12, span * 0.36));
            const textT = unit(time, start + span * 0.2, span * 0.42);
            const ruleT = easeOut(unit(time, start + span * 0.42, span * 0.38));
            const checkT = easeOut(unit(time, start + span * 0.66, span * 0.32));

            gsap.set(parts.num, { opacity: numT, y: motion.numY * (1 - numT) });
            gsap.set(parts.icon, {
              opacity: iconT,
              scale: motion.iconScale + (1 - motion.iconScale) * iconT,
            });
            gsap.set(parts.text, { opacity: textT, y: motion.textY * (1 - textT) });
            gsap.set(parts.rule, { scaleX: ruleT });
            gsap.set(parts.check, { opacity: checkT, scale: 0.65 + 0.35 * checkT });
          });

          const qT = unit(time, timing.ctaQAt, timing.ctaQDur);
          gsap.set(ctaQ, { opacity: qT, y: motion.ctaY * (1 - qT) });

          const btnT = easeOut(unit(time, timing.ctaBtnAt, timing.ctaBtnDur));
          gsap.set(ctaBtn, {
            opacity: btnT,
            y: motion.btnY * (1 - btnT),
            scale: 0.97 + 0.03 * btnT,
          });
        };

        const applyFrom = (progress: number) => {
          state.p = gsap.utils.clamp(0, 1, progress);
          apply();
        };

        applyFrom(0);

        ScrollTrigger.create({
          id,
          trigger: section,
          start: timing.start,
          end: timing.end,
          scrub: true,
          pin: false,
          invalidateOnRefresh: true,
          onUpdate: (self) => applyFrom(self.progress),
          onRefresh: (self) => applyFrom(self.progress),
        });

        return () => {
          ScrollTrigger.getById(id)?.kill();
        };
      };

      const bindTimeline = (id: string, motion: Motion, timing: Timing) => {
        gsap.set(ctaQ, { opacity: 0, y: motion.ctaY });
        gsap.set(ctaBtn, { opacity: 0, y: motion.btnY, scale: 0.97 });

        rows.forEach((row) => {
          gsap.set(row.querySelector(".qualify-num"), { opacity: 0, y: motion.numY });
          gsap.set(row.querySelector(".qualify-icon-in"), {
            opacity: 0,
            scale: motion.iconScale,
          });
          gsap.set(row.querySelector(".qualify-text-in"), {
            opacity: 0,
            y: motion.textY,
          });
          gsap.set(row.querySelector(".qualify-rule"), { scaleX: 0 });
          gsap.set(row.querySelector(".qualify-check-in"), {
            opacity: 0,
            scale: 0.65,
          });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
        });

        const rowWindows = timing.rowWindows;

        rows.forEach((row, i) => {
          const [start, span] = rowWindows[i];
          const num = row.querySelector(".qualify-num");
          const icon = row.querySelector(".qualify-icon-in");
          const text = row.querySelector(".qualify-text-in");
          const rule = row.querySelector(".qualify-rule");
          const check = row.querySelector(".qualify-check-in");

          timeline.fromTo(
            num,
            { opacity: 0, y: motion.numY },
            { opacity: 1, y: 0, duration: span * 0.28 },
            start,
          );
          timeline.fromTo(
            icon,
            { opacity: 0, scale: motion.iconScale },
            { opacity: 1, scale: 1, duration: span * 0.36, ease: "power2.out" },
            start + span * 0.12,
          );
          timeline.fromTo(
            text,
            { opacity: 0, y: motion.textY },
            { opacity: 1, y: 0, duration: span * 0.42 },
            start + span * 0.2,
          );
          timeline.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: span * 0.38, ease: "power2.out" },
            start + span * 0.42,
          );
          timeline.fromTo(
            check,
            { opacity: 0, scale: 0.65 },
            { opacity: 1, scale: 1, duration: span * 0.32, ease: "power2.out" },
            start + span * 0.66,
          );
        });

        timeline.fromTo(
          ctaQ,
          { opacity: 0, y: motion.ctaY },
          { opacity: 1, y: 0, duration: timing.ctaQDur },
          timing.ctaQAt,
        );
        timeline.fromTo(
          ctaBtn,
          { opacity: 0, y: motion.btnY, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: timing.ctaBtnDur, ease: "power2.out" },
          timing.ctaBtnAt,
        );
        timeline.to({}, { duration: timing.holdDur });

        ScrollTrigger.create({
          id,
          animation: timeline,
          trigger: section,
          start: timing.start,
          end: timing.end,
          scrub: timing.scrub,
          pin: false,
          invalidateOnRefresh: true,
        });

        return () => {
          ScrollTrigger.getById(id)?.kill();
          timeline.kill();
        };
      };

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 539.98px)",
        () =>
          bindProgress("qualify-progress-compact", {
            titleY: 14,
            textY: 9,
            numY: 6,
            iconScale: 0.88,
            ctaY: 10,
            btnY: 11,
          }, compactTiming),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 540px) and (max-width: 1023.98px)",
        () =>
          bindProgress("qualify-progress-tablet", {
            titleY: 18,
            textY: 14,
            numY: 8,
            iconScale: 0.82,
            ctaY: 12,
            btnY: 16,
          }, mobileTiming),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        () =>
          bindTimeline("qualify-progress-desktop", {
            titleY: 18,
            textY: 14,
            numY: 8,
            iconScale: 0.82,
            ctaY: 12,
            btnY: 16,
          }, desktopTiming),
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="qualify"
      className="qualify qualify-pending"
      aria-labelledby="qualify-heading"
    >
      <Image
        src="/images/roof-drone-photo.jpg"
        alt="Aerial view of a residential asphalt shingle roof"
        fill
        sizes="100vw"
        quality={80}
        className="qualify-photo"
      />
      <div className="qualify-overlay" aria-hidden="true" />

      <div className="qualify-shell">
        <header ref={introRef} className="qualify-intro">
          <h2
            id="qualify-heading"
            className="qualify-title"
          >
            <span className="qualify-title-lead">See If Your Roof</span>
            <span className="qualify-title-rest">Qualifies</span>
          </h2>
          <p className="qualify-copy">
            A free assessment is the fastest way to find out whether rejuvenation
            can help extend the life of your roof.
          </p>
        </header>

        <ol ref={listRef} className="qualify-list">
          {criteria.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.num} className="qualify-row">
                <span className="qualify-num">{item.num}</span>
                <span
                  className={`qualify-icon qualify-icon--${item.optical}`}
                  aria-hidden="true"
                >
                  <span className="qualify-icon-in">
                    <Icon strokeWidth={2.15} />
                  </span>
                </span>
                <span className="qualify-text">
                  <span className="qualify-text-in">{item.text}</span>
                </span>
                <span className="qualify-check" aria-hidden="true">
                  <span className="qualify-check-in">
                    <Check strokeWidth={2.6} />
                  </span>
                </span>
                <span className="qualify-rule" aria-hidden="true" />
              </li>
            );
          })}
        </ol>

        <div className="qualify-cta">
          <p ref={ctaQRef} className="qualify-cta-q">
            Not sure if your roof qualifies?
          </p>
          <span ref={ctaBtnRef} className="qualify-btn">
            <span className="lg:hidden">
              <QuoteCta size="qualify">Get Your Free Quote</QuoteCta>
            </span>
            <span className="hidden lg:contents">
              <QuoteCta size="qualify">Get Your Free Roof Assessment</QuoteCta>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
