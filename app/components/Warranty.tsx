"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachGradientWave, WaveLine, type WaveWord } from "./GradientWaveText";

const WARRANTY_COPY: WaveWord[] = [
  { text: "Every" },
  { text: "qualifying" },
  { text: "roof" },
  { text: "rejuvenation" },
  { text: "project" },
  { text: "is" },
  { text: "backed" },
  { text: "by" },
  { text: "our" },
  { text: "5-year" },
  { text: "warranty," },
  { text: "reflecting" },
  { text: "our" },
  { text: "commitment" },
  { text: "to" },
  { text: "quality" },
  { text: "and" },
  { text: "lasting" },
  { text: "results." },
];

export default function Warranty() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const reveal = revealRef.current;
    const motion = motionRef.current;
    const halo = haloRef.current;
    if (!section || !reveal || !motion || !halo) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.classList.add("is-in");
        gsap.set(reveal, { opacity: 1, scale: 1, y: 0 });
        gsap.set(motion, { opacity: 1, scale: 1, y: 0 });
        gsap.set(halo, { opacity: 0, scale: 1 });
      });

      const bind = (
        id: string,
        loopScale: number,
        loopY: number,
        fromScale: number,
        fromY: number,
      ) => {
        section.classList.add("warranty-pending");
        const title = section.querySelector<HTMLElement>(".warranty-title");
        if (title) gsap.set(title, { opacity: 0, y: 24 });
        gsap.set(reveal, { opacity: 0, scale: fromScale, y: fromY });
        gsap.set(halo, { opacity: 0, scale: 0.9 });

        const loopTweens: gsap.core.Tween[] = [];
        let looping = false;

        const stopLoop = () => {
          loopTweens.forEach((tween) => tween.kill());
          loopTweens.length = 0;
          looping = false;
          motion.style.willChange = "auto";
          gsap.set(motion, { scale: 1, y: 0 });
        };

        const startLoop = () => {
          if (looping || window.matchMedia("(max-width: 767.98px)").matches) {
            return;
          }
          looping = true;
          motion.style.willChange = "transform";
          loopTweens.push(
            gsap.to(motion, {
              scale: loopScale,
              y: loopY,
              duration: 1.55,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            }),
            gsap.to(halo, {
              opacity: 0.16,
              scale: 1.15,
              duration: 1.55,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            }),
          );
        };

        const headingTween = title
          ? gsap.fromTo(
              title,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                paused: true,
              },
            )
          : null;

        const reset = () => {
          gsap.killTweensOf(reveal);
          stopLoop();
          gsap.set(reveal, { opacity: 0, scale: fromScale, y: fromY });
          gsap.set(halo, { opacity: 0, scale: 0.9 });
          headingTween?.pause();
          if (title) gsap.set(title, { opacity: 0, y: 24 });
          section.classList.remove("is-in");
        };

        const play = () => {
          reset();
          gsap.to(reveal, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            overwrite: true,
            onComplete: startLoop,
          });
          headingTween?.restart();
          section.classList.remove("is-in");
          void section.offsetWidth;
          section.classList.add("is-in");
        };

        ScrollTrigger.create({
          id,
          trigger: section,
          start: "top 98%",
          end: "bottom top",
          onEnter: play,
          onEnterBack: play,
          onLeave: reset,
          onLeaveBack: reset,
          invalidateOnRefresh: true,
        });

        return () => {
          reset();
          headingTween?.kill();
          ScrollTrigger.getById(id)?.kill();
        };
      };

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 539.98px)",
        () => bind("warranty-enter-compact", 1.025, -3, 0.88, 16),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 540px)",
        () => bind("warranty-enter-desktop", 1.035, -5, 0.86, 20),
      );
    }, section);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    return attachGradientWave(copy, {
      compact: "warranty-copy-wave-compact",
      tablet: "warranty-copy-wave-tablet",
      desktop: "warranty-copy-wave-desktop",
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="warranty"
      className="warranty"
      aria-labelledby="warranty-heading"
    >
      <div className="warranty-shell">
        <div className="warranty-badge-wrap">
          <div ref={revealRef} className="warranty-badge-reveal">
            <div ref={haloRef} className="warranty-halo" aria-hidden="true" />
            <div ref={motionRef} className="warranty-badge-motion">
              <Image
                src="/images/badge-warranty.png"
                alt="5-Year Warranty badge"
                width={1425}
                height={1065}
                quality={80}
                sizes="(min-width: 1024px) 13.75rem, (min-width: 540px) 11.8125rem, 10.25rem"
                className="warranty-badge"
              />
            </div>
          </div>
        </div>
        <h2 id="warranty-heading" className="warranty-title">
          5-Year <em>Warranty</em>
        </h2>
        <p ref={copyRef} className="warranty-copy">
          <WaveLine words={WARRANTY_COPY} from={0.1} to={0.72} />
        </p>
      </div>
    </section>
  );
}
