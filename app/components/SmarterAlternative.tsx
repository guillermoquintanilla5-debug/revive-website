"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachGradientWave, WaveLine, type WaveWord } from "./GradientWaveText";
import { isLegacyCss } from "../lib/cssMode";

const PARA_1: WaveWord[] = [
  { text: "Think" },
  { text: "of" },
  { text: "it" },
  { text: "as" },
  { text: "conditioning", bold: true },
  { text: "for" },
  { text: "your" },
  { text: "roof." },
  { text: "As" },
  { text: "asphalt" },
  { text: "shingles" },
  { text: "age," },
  { text: "they" },
  { text: "become" },
  { text: "drier" },
  { text: "and" },
  { text: "less" },
  { text: "flexible." },
];

const PARA_2: WaveWord[] = [
  { text: "Roof" },
  { text: "rejuvenation" },
  { text: "helps" },
  { text: "revitalize", bold: true },
  { text: "aging" },
  { text: "shingles" },
  { text: "from" },
  { text: "within," },
  { text: "improving" },
  { text: "their" },
  { text: "condition" },
  { text: "and" },
  { text: "helping" },
  { text: "them" },
  { text: "continue" },
  { text: "performing" },
  { text: "as" },
  { text: "intended." },
];

export default function SmarterAlternative() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLSpanElement>(null);
  const afterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isLegacyCss()) return;
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      section.classList.add("is-in");
      return;
    }

    section.classList.add("alt-pending");

    const desktop = window.matchMedia("(min-width: 1024px)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-in");
        observer.disconnect();
      },
      desktop.matches
        ? { threshold: 0, rootMargin: "0px" }
        : { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (isLegacyCss()) return;
    const copy = copyRef.current;
    if (!copy) return;
    return attachGradientWave(
      copy,
      {
        compact: "alt-copy-wave-compact",
        tablet: "alt-copy-wave-tablet",
        desktop: "alt-copy-wave-desktop",
      },
      { desktop: "top 92%" },
    );
  }, []);

  useLayoutEffect(() => {
    if (isLegacyCss()) return;
    const figure = figureRef.current;
    const reveal = revealRef.current;
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!figure || !reveal || !before || !after) return;

    const photo = reveal.querySelector(".alt-photo");
    if (!(photo instanceof HTMLElement)) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(reveal, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(photo, { scale: 1 });
        gsap.set([before, after], { opacity: 1, x: 0 });
      });

      const bindReveal = (
        id: string,
        start: string,
        end: string,
        scrub: number | boolean,
      ) => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
        });

        timeline
          .fromTo(
            reveal,
            { clipPath: "inset(0% 49.5% 0% 49.5%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
          )
          .fromTo(photo, { scale: 1.03 }, { scale: 1, duration: 1 }, 0)
          .fromTo(
            before,
            { opacity: 0, x: 8 },
            { opacity: 1, x: 0, duration: 0.42 },
            0.45,
          )
          .fromTo(
            after,
            { opacity: 0, x: -8 },
            { opacity: 1, x: 0, duration: 0.42 },
            0.45,
          );

        ScrollTrigger.create({
          id,
          animation: timeline,
          trigger: figure,
          start,
          end,
          scrub,
          pin: false,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            reveal.style.willChange = self.isActive ? "clip-path" : "auto";
          },
        });

        return () => {
          reveal.style.willChange = "auto";
          ScrollTrigger.getById(id)?.kill();
          timeline.kill();
        };
      };

      mm.add("(max-width: 1023.98px)", () =>
        bindReveal("alt-compare-reveal-compact", "top 90%", "top 42%", true),
      );

      mm.add("(min-width: 1024px)", () =>
        bindReveal("alt-compare-reveal-desktop", "top 90%", "top 36%", 0.7),
      );
    }, figure);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="smarter-alternative"
      className="alt"
      aria-labelledby="alt-heading"
    >
      <div className="alt-shell">
        <h2 id="alt-heading" className="alt-title">
          <span className="alt-title-lead">
            A <em>Smarter Alternative</em>
          </span>
          <span className="alt-title-rest">to Roof Replacement</span>
        </h2>

        <figure ref={figureRef} className="alt-figure">
          <div className="alt-pills">
            <span ref={beforeRef} className="alt-pill alt-pill--before">
              Before
            </span>
            <span ref={afterRef} className="alt-pill alt-pill--after">
              After
            </span>
          </div>
          <div className="alt-frame">
            <div ref={revealRef} className="alt-reveal">
              <Image
                src="/images/shingle-before-after.jpg"
                alt="The same asphalt shingles, faded and dry on the left, darkened and conditioned on the right after rejuvenation."
                width={1024}
                height={1024}
                sizes="(min-width: 1024px) 31.25rem, (min-width: 540px) min(100vw, 24rem), 275px"
                quality={80}
                className="alt-photo"
              />
            </div>
          </div>
        </figure>

        <div ref={copyRef} className="alt-copy">
          <p>
            <WaveLine words={PARA_1} from={0.1} to={0.48} />
          </p>
          <p>
            <WaveLine words={PARA_2} from={0.42} to={0.72} />
          </p>
        </div>
      </div>
    </section>
  );
}
