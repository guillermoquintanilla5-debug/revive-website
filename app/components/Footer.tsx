"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone } from "lucide-react";
import { isLegacyCss } from "../lib/cssMode";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (isLegacyCss()) return;
    const footer = footerRef.current;
    if (!footer) return;

    const brand = footer.querySelector<HTMLElement>(".site-footer-brand");
    const contact = footer.querySelector<HTMLElement>(".site-footer-contact");
    const social = footer.querySelector<HTMLElement>(".site-footer-social");
    const mark = footer.querySelector<HTMLElement>(".site-footer-mark");

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([brand, contact, social, mark].filter(Boolean), {
          opacity: 1,
          y: 0,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const parts = [brand, contact, social, mark].filter(Boolean);
        gsap.set(parts, { opacity: 0, y: 18 });
        const tl = gsap.timeline({
          defaults: { duration: 0.85, ease: "power3.out" },
          scrollTrigger: {
            id: "footer-enter",
            trigger: footer,
            start: "top 86%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
        tl.to(brand, { opacity: 1, y: 0 })
          .to(contact, { opacity: 1, y: 0 }, 0.1)
          .to(social, { opacity: 1, y: 0 }, 0.2)
          .to(mark, { opacity: 1, y: 0 }, 0.28);
      });
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="site-footer-shell">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <div className="site-footer-logo-plate">
              <Image
                src="/images/logo.png"
                alt="Revive Roof Solutions"
                width={1192}
                height={560}
                sizes="188px"
                className="site-footer-logo site-footer-logo--on-light"
              />
              <Image
                src="/images/logo-white.png"
                alt="Revive Roof Solutions"
                width={1229}
                height={627}
                sizes="188px"
                className="site-footer-logo site-footer-logo--on-dark"
              />
            </div>
            <p className="site-footer-tagline">
              Roof Rejuvenation &amp; Exterior Services
            </p>
            <div className="site-footer-certs">
              <Image
                src="/images/badge-usda.png"
                alt="USDA Certified Biobased Product"
                width={640}
                height={305}
                sizes="140px"
                className="site-footer-badge site-footer-badge--usda"
              />
              <Image
                src="/images/badge-soy.png"
                alt="It's Sustainably Soy Certified"
                width={400}
                height={400}
                sizes="88px"
                className="site-footer-badge site-footer-badge--soy"
              />
            </div>
          </div>

          <div className="site-footer-info">
            <div className="site-footer-contact">
              <p className="site-footer-kicker">Contact</p>
              <ul className="site-footer-list">
                <li>
                  <a href="tel:6137013088" className="site-footer-line">
                    <Phone strokeWidth={1.75} aria-hidden="true" />
                    <span>613-701-3088</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@reviveroofing.ca"
                    className="site-footer-line"
                  >
                    <Mail strokeWidth={1.75} aria-hidden="true" />
                    <span>info@reviveroofing.ca</span>
                  </a>
                </li>
                <li>
                  <p className="site-footer-line">
                    <MapPin strokeWidth={1.75} aria-hidden="true" />
                    <span>Ottawa &amp; Surrounding Areas</span>
                  </p>
                </li>
              </ul>
            </div>

            <div className="site-footer-social">
              <p className="site-footer-kicker">Follow us</p>
              <ul className="site-footer-social-list">
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61590583869973"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-footer-social-link"
                  >
                    <span>Facebook</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/reviveroofsolutions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-footer-social-link"
                  >
                    <span>Instagram</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer-rule" aria-hidden="true" />

        <p className="site-footer-mark" aria-hidden="true">
          REVIVE
        </p>

        <div className="site-footer-legal">
          <p className="site-footer-copy">
            © 2026 Revive Roof Solutions.{" "}
            <span className="site-footer-copy-rest">All rights reserved.</span>
          </p>
          <p className="site-footer-policies">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
