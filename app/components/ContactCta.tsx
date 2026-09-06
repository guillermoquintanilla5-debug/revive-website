"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import QuoteCta from "./QuoteCta";
import { isLegacyCss } from "../lib/cssMode";

export default function ContactCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (isLegacyCss()) return;
    const section = sectionRef.current;
    if (!section) return;

    const eyebrow = section.querySelector<HTMLElement>(".contact-eyebrow");
    const title = section.querySelector<HTMLElement>(".contact-title");
    const cta = section.querySelector<HTMLElement>(".contact-cta");
    const phone = section.querySelector<HTMLElement>(".contact-phone");
    const media = section.querySelector<HTMLElement>(".contact-media-img");

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([eyebrow, title, cta, phone].filter(Boolean), {
          opacity: 1,
          y: 0,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const parts = [eyebrow, title, cta, phone].filter(Boolean);
        gsap.set(parts, { opacity: 0, y: 20 });
        const tl = gsap.timeline({
          defaults: { duration: 0.85, ease: "power3.out" },
          scrollTrigger: {
            id: "contact-heading-enter",
            trigger: section,
            start: "top 82%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
        tl.to(eyebrow, { opacity: 1, y: 0 })
          .to(title, { opacity: 1, y: 0 }, 0.1)
          .to(cta, { opacity: 1, y: 0 }, 0.2)
          .to(phone, { opacity: 1, y: 0 }, 0.3);
      });

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        () => {
          if (!media) return;
          gsap.fromTo(
            media,
            { yPercent: -2.5 },
            {
              yPercent: 2.5,
              ease: "none",
              scrollTrigger: {
                id: "contact-media-parallax",
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact"
      aria-labelledby="contact-heading"
    >
      <div className="contact-media" aria-hidden="true">
        <Image
          src="/images/gallery-worker-application.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={80}
          className="contact-media-img"
        />
        <div className="contact-media-veil" />
      </div>

      <div className="contact-shell">
        <p className="contact-eyebrow">Ready to revive your roof?</p>
        <h2 id="contact-heading" className="contact-title">
          <span className="contact-title-lead">Book Your Free</span>
          <span className="contact-title-accent">Roof Inspection.</span>
        </h2>
        <div className="contact-cta">
          <QuoteCta size="section">Get Your Free Quote</QuoteCta>
        </div>
        <p className="contact-phone">
          <span className="contact-phone-lead">Prefer to talk? </span>
          <a href="tel:6137013088">613-701-3088</a>
        </p>
      </div>
    </section>
  );
}
