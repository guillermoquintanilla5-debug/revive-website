"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isLegacyCss } from "../lib/cssMode";

const LOCATIONS = [
  { id: "ottawa", index: "01", name: "Ottawa, ON" },
  { id: "gatineau", index: "02", name: "Gatineau, QC" },
  { id: "region", index: "03", name: "Surrounding Areas" },
] as const;

const MAP_SRC =
  "https://maps.google.com/maps?q=45.45,-75.70&z=10&hl=en&output=embed";

const LOC_MUTED = "rgba(245, 245, 245, 0.72)";
const LOC_GREEN = "#088635";
const LOC_INDEX_MUTED = "rgba(8, 134, 53, 0.7)";
const LOC_MUTED_OPACITY = 0.42;

export default function ServiceArea() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const activateRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    if (isLegacyCss()) return;
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      section.classList.add("is-in");
      return;
    }

    section.classList.add("service-pending");

    const intro = section.querySelector(".service-intro");
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

    const eyebrow = section.querySelector<HTMLElement>(".service-eyebrow");
    const title = section.querySelector<HTMLElement>(".service-title");
    const copy = section.querySelector<HTMLElement>(".service-copy");
    const rows = [...section.querySelectorAll<HTMLElement>(".service-loc")];
    const names = rows.map(
      (row) => row.querySelector<HTMLElement>(".service-loc-name"),
    );
    const indexes = rows.map(
      (row) => row.querySelector<HTMLElement>(".service-loc-index"),
    );
    const chip = chipRef.current;

    gsap.registerPlugin(ScrollTrigger);

    let mapIndex = -1;
    const setMapFocus = (index: number) => {
      if (index === mapIndex) return;
      mapIndex = index;
      section.dataset.focus = LOCATIONS[index].id;
      if (chip) chip.textContent = LOCATIONS[index].name;
    };
    activateRef.current = setMapFocus;

    const paintRow = (index: number, active: boolean) => {
      const row = rows[index];
      const name = names[index];
      const num = indexes[index];
      if (row) {
        gsap.set(row, { opacity: active ? 1 : LOC_MUTED_OPACITY });
        if (row instanceof HTMLButtonElement) {
          row.setAttribute("aria-pressed", active ? "true" : "false");
        }
      }
      if (name) gsap.set(name, { color: active ? LOC_GREEN : LOC_MUTED });
      if (num) gsap.set(num, { color: active ? LOC_GREEN : LOC_INDEX_MUTED });
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([eyebrow, title, copy].filter(Boolean), { opacity: 1, y: 0 });
        section.classList.add("is-in");
        rows.forEach((row) => row.classList.add("is-readable"));
      });

      mm.add("(min-width: 1024px)", () => {
        rows.forEach((row) => row.classList.remove("is-active"));

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          [0, 1, 2].forEach((i) => paintRow(i, true));
          setMapFocus(2);
          return;
        }

        gsap.set(rows, { opacity: LOC_MUTED_OPACITY });
        gsap.set(names.filter(Boolean), { color: LOC_MUTED });
        gsap.set(indexes.filter(Boolean), { color: LOC_INDEX_MUTED });
        rows.forEach((row) => {
          if (row instanceof HTMLButtonElement) {
            row.setAttribute("aria-pressed", "false");
          }
        });
        setMapFocus(0);

        const locTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "service-locs-progress",
            trigger: section,
            start: "top 68%",
            end: "bottom 78%",
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              setMapFocus(p >= 0.72 ? 2 : p >= 0.45 ? 1 : 0);
              rows.forEach((row, i) => {
                if (row instanceof HTMLButtonElement) {
                  const gate = i === 0 ? 0.15 : i === 1 ? 0.45 : 0.72;
                  row.setAttribute(
                    "aria-pressed",
                    p >= gate ? "true" : "false",
                  );
                }
              });
            },
          },
        });

        const reveal = (index: number, at: number, duration: number) => {
          locTl.fromTo(
            rows[index],
            { opacity: LOC_MUTED_OPACITY },
            { opacity: 1, duration },
            at,
          );
          if (names[index]) {
            locTl.fromTo(
              names[index],
              { color: LOC_MUTED },
              { color: LOC_GREEN, duration },
              at,
            );
          }
          if (indexes[index]) {
            locTl.fromTo(
              indexes[index],
              { color: LOC_INDEX_MUTED },
              { color: LOC_GREEN, duration },
              at,
            );
          }
        };

        reveal(0, 0.15, 0.15);
        reveal(1, 0.45, 0.15);
        reveal(2, 0.72, 0.12);
        locTl.add(() => {}, 1);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const unlockMap = () => {
    mapRef.current?.classList.add("is-unlocked");
  };

  return (
    <section
      ref={sectionRef}
      id="service-area"
      className="service"
      data-focus="ottawa"
      aria-labelledby="service-heading"
    >
      <div className="service-shell">
        <header className="service-intro">
          <p className="service-eyebrow">Service Area</p>
          <h2 id="service-heading" className="service-title">
            <span className="service-title-lead">Roof Rejuvenation in</span>
            <span className="service-title-place">Ottawa &amp; Gatineau</span>
          </h2>
          <p className="service-copy">
            Professional roof rejuvenation, roof repairs, and exterior
            maintenance services throughout Ottawa, Gatineau, and surrounding
            communities.
          </p>
        </header>

        <div className="service-map" ref={mapRef}>
          <iframe
            className="service-map-frame"
            title="Revive Roof Solutions service area covering Ottawa, Gatineau, and surrounding communities"
            src={MAP_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="service-map-hud" aria-hidden="true">
            <span className="service-map-chip" ref={chipRef}>
              Ottawa, ON
            </span>
          </div>
          <div className="service-map-veil" aria-hidden="true">
            <span className="service-map-veil-layer service-map-veil-layer--ottawa" />
            <span className="service-map-veil-layer service-map-veil-layer--gatineau" />
            <span className="service-map-veil-layer service-map-veil-layer--region" />
          </div>
          <button
            type="button"
            className="service-map-unlock"
            onClick={unlockMap}
          >
            Tap map to explore
          </button>
        </div>

        <ol className="service-locs">
          {LOCATIONS.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className="service-loc"
                data-loc={item.id}
                aria-pressed="false"
                onClick={() => activateRef.current(index)}
              >
                <span className="service-loc-index" aria-hidden="true">
                  {item.index}
                </span>
                <span className="service-loc-name">{item.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
