"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isLegacyCss } from "../lib/cssMode";

type BenefitLine = {
  before?: string;
  highlight?: string;
  after?: string;
};

const BENEFITS = [
  {
    index: "01",
    lines: [
      { before: "Minor Repairs" },
      { highlight: "INCLUDED" },
    ] satisfies BenefitLine[],
    direction: 1,
    scale: "lg",
    travelVw: 12,
    travelPx: 22,
  },
  {
    index: "02",
    lines: [
      { highlight: "FREE", after: " Roof Assessment" },
      { before: "& Measurements" },
    ] satisfies BenefitLine[],
    direction: -1,
    scale: "sm",
    travelVw: 10,
    travelPx: 20,
  },
  {
    index: "03",
    lines: [
      { before: "Detailed Roof ", highlight: "REPORT" },
      { before: "with Photos" },
    ] satisfies BenefitLine[],
    direction: 1,
    scale: "md",
    travelVw: 11,
    travelPx: 22,
  },
  {
    index: "04",
    lines: [
      { highlight: "BEFORE & AFTER" },
      { before: "Documentation" },
    ] satisfies BenefitLine[],
    direction: -1,
    scale: "md",
    travelVw: 10,
    travelPx: 20,
  },
  {
    index: "05",
    lines: [
      { highlight: "FAST" },
      { before: "Scheduling" },
    ] satisfies BenefitLine[],
    direction: 1,
    scale: "lg",
    travelVw: 14,
    travelPx: 24,
  },
  {
    index: "06",
    lines: [
      { highlight: "HONEST" },
      { before: "Recommendations" },
    ] satisfies BenefitLine[],
    direction: -1,
    scale: "md",
    travelVw: 12,
    travelPx: 22,
  },
] as const;

function renderLine(line: BenefitLine) {
  return (
    <>
      {line.before}
      {line.highlight ? <em>{line.highlight}</em> : null}
      {line.after}
    </>
  );
}

export default function BetterExperience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isLegacyCss()) return;
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      section.classList.add("is-in");
      return;
    }

    section.classList.add("experience-pending");

    const intro = section.querySelector(".experience-intro");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-in");
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -18% 0px" },
    );

    observer.observe(intro ?? section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (isLegacyCss()) return;
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const rows = [...section.querySelectorAll<HTMLElement>(".experience-row")];
    if (rows.length !== BENEFITS.length) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        rows.forEach((row) => {
          gsap.set(row, { x: 0, opacity: 1 });
          row.style.setProperty("--exp-ink", "1");
        });
      });

      const bind = (mode: "mobile" | "desktop") => {
        rows.forEach((row, index) => {
          const item = BENEFITS[index];
          const startX =
            mode === "mobile"
              ? -item.direction * item.travelPx
              : `${-item.direction * item.travelVw}vw`;
          const start = mode === "mobile" ? "top 80%" : "top 60%";
          const end = mode === "mobile" ? "top 50%" : "top 47%";

          gsap.set(row, { x: startX, opacity: 0.78 });
          row.style.setProperty("--exp-ink", "0");

          gsap.fromTo(
            row,
            { x: startX, opacity: 0.78 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              immediateRender: true,
              force3D: true,
              scrollTrigger: {
                trigger: row,
                start,
                end,
                scrub: mode === "mobile" ? true : 0.95,
                invalidateOnRefresh: true,
                onToggle: (self) => {
                  row.style.willChange = self.isActive ? "transform" : "auto";
                },
              },
              onUpdate() {
                row.style.setProperty("--exp-ink", String(this.progress()));
              },
            },
          );
        });
      };

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 1023.98px)",
        () => bind("mobile"),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        () => bind("desktop"),
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="better-experience"
      className="experience"
      aria-labelledby="experience-heading"
    >
      <div className="experience-shell">
        <header className="experience-intro">
          <p className="experience-eyebrow">Why homeowners choose Revive</p>
          <h2 id="experience-heading" className="experience-title">
            <span className="experience-title-lead">A Better </span>
            <em>Experience</em>.
          </h2>
        </header>

        <ul className="experience-rows">
          {BENEFITS.map((item) => (
            <li
              key={item.index}
              className={`experience-row experience-row--${item.scale} experience-row--${item.direction > 0 ? "ltr" : "rtl"}`}
            >
              <span className="experience-index" aria-hidden="true">
                {item.index}
              </span>
              <p className="experience-copy">
                <span className="experience-line">{renderLine(item.lines[0])}</span>
                <span className="experience-line-gap"> </span>
                <span className="experience-line">{renderLine(item.lines[1])}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
