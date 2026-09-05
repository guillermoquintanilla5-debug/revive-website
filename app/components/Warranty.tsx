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

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        section.classList.add("warranty-pending");
        const title = section.querySelector<HTMLElement>(".warranty-title");
        if (title) gsap.set(title, { opacity: 0, y: 24 });
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            id: "warranty-heading-enter",
            trigger: title ?? section,
            start: "top 82%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => section.classList.add("is-in"),
          },
        });
      });

      const bind = (
        id: string,
        loopScale: number,
        loopY: number,
        fromScale: number,
        fromY: number,
        start: string,
        end: string,
      ) => {
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
          if (looping) return;
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

        const apply = (progress: number) => {
          const t = gsap.utils.clamp(0, 1, progress);
          gsap.set(reveal, {
            opacity: t,
            scale: fromScale + (1 - fromScale) * t,
            y: fromY * (1 - t),
          });

          if (t < 1) {
            if (looping) stopLoop();
            gsap.set(halo, {
              opacity: 0.08 * t,
              scale: 0.9,
            });
            return;
          }

          startLoop();
        };

        const state = { p: 0 };
        const applyFromState = () => apply(state.p);
        apply(0);

        const animation = gsap.timeline({ defaults: { ease: "none" } });
        animation.fromTo(
          state,
          { p: 0 },
          {
            p: 1,
            duration: 1,
            ease: "none",
            immediateRender: true,
            onUpdate: applyFromState,
          },
          0,
        );

        ScrollTrigger.create({
          id,
          animation,
          trigger: section,
          start,
          end,
          scrub: 0.55,
          pin: false,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            state.p = self.progress;
            apply(state.p);
          },
        });

        return () => {
          stopLoop();
          ScrollTrigger.getById(id)?.kill();
          animation.kill();
        };
      };

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 539.98px)",
        () =>
          bind(
            "warranty-badge-enter-compact",
            1.025,
            -3,
            0.88,
            16,
            "top 66%",
            "top 20%",
          ),
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 540px)",
        () =>
          bind(
            "warranty-badge-enter-desktop",
            1.035,
            -5,
            0.86,
            20,
            "top 68%",
            "top 22%",
          ),
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
        <h2 id="warranty-heading" className="warranty-title">
          5-Year <em>Warranty</em>
        </h2>
        <p ref={copyRef} className="warranty-copy">
          <WaveLine words={WARRANTY_COPY} from={0.1} to={0.72} />
        </p>
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
                sizes="(min-width: 1024px) 20.25rem, 13rem"
                className="warranty-badge"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
