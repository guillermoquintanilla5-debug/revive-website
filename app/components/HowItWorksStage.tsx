"use client";

import { CircleDollarSign, Clock, House, PiggyBank } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isLegacyCss } from "../lib/cssMode";

/**
 * How It Works: desktop/tablet use a scrubbed --p timeline.
 * Mobile uses discrete open/close tweens so height is not tied to scroll.
 */
export default function HowItWorksStage({
  media,
  children,
}: {
  media: React.ReactNode;
  children: React.ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const card01Ref = useRef<HTMLElement>(null);
  const card02Ref = useRef<HTMLElement>(null);
  const card03Ref = useRef<HTMLElement>(null);
  const card04Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isLegacyCss()) return;
    const stage = stageRef.current;
    if (!stage) return;
    stage.querySelectorAll(".hiw-proto-collapsed").forEach((el) => {
      el.removeAttribute("aria-hidden");
    });
  }, []);

  useEffect(() => {
    if (isLegacyCss()) return;
    const stage = stageRef.current;
    if (!stage) return;

    const section = stage.closest<HTMLElement>(".hiw") ?? stage;
    const heading = stage.querySelector(".hiw-heading");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      section.classList.add("is-in");
      return;
    }

    section.classList.add("hiw-pending");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-in");
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -18% 0px" },
    );

    observer.observe(heading ?? stage);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (isLegacyCss()) return;
    const stage = stageRef.current;
    const card01 = card01Ref.current;
    const card02 = card02Ref.current;
    const card03 = card03Ref.current;
    const card04 = card04Ref.current;
    if (!stage || !card01 || !card02 || !card03 || !card04) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = [card01, card02, card03, card04];
      gsap.set(cards, { "--p": 0 });
      const content = stage.querySelector(".hiw-content");
      if (content instanceof HTMLElement) gsap.set(content, { clearProps: "y" });

      const next = document.getElementById("smarter-alternative");

      const bindScrub = (closed: number, start: string, smooth: boolean) => {
        const open = 0.2;
        const t1 = closed;
        const t2 = 0.27;
        const t3 = 0.44;
        const t4 = 0.61;
        const done = 0.81;
        const timeline = gsap.timeline({
          paused: true,
          defaults: { ease: "none", immediateRender: false },
        });
        timeline
          .to({}, { duration: closed })
          .fromTo(card01, { "--p": 0 }, { "--p": 1, duration: open }, t1)
          .fromTo(card02, { "--p": 0 }, { "--p": 1, duration: open }, t2)
          .fromTo(card03, { "--p": 0 }, { "--p": 1, duration: open }, t3)
          .fromTo(card04, { "--p": 0 }, { "--p": 1, duration: open }, t4)
          .to({}, { duration: Math.max(0.08, 1 - done) }, done);

        ScrollTrigger.create({
          id: "hiw-cards",
          animation: timeline,
          trigger: stage,
          start,
          endTrigger: next ?? stage,
          end: next ? "top 85%" : "bottom bottom",
          pin: false,
          scrub: smooth ? 0.65 : true,
          invalidateOnRefresh: true,
        });

        return () => {
          ScrollTrigger.getById("hiw-cards")?.kill();
          timeline.kill();
          gsap.set(cards, { "--p": 0 });
        };
      };

      const bindDiscrete = () => {
        const opened = [false, false, false, false];
        const gates = [0.12, 0.28, 0.45, 0.62];
        const tweens: gsap.core.Tween[] = [];
        const closeOrder = [3, 2, 1, 0];

        const setOpen = (index: number, open: boolean, delay = 0) => {
          if (opened[index] === open) return;
          opened[index] = open;
          tweens[index]?.kill();
          tweens[index] = gsap.to(cards[index], {
            "--p": open ? 1 : 0,
            duration: open ? 0.48 : 0.62,
            ease: open ? "power2.out" : "power2.inOut",
            delay: open ? 0 : delay,
            overwrite: true,
          });
        };

        const closeAll = () => {
          closeOrder.forEach((index, i) => setOpen(index, false, i * 0.06));
        };

        const sync = (progress: number) => {
          const shouldOpen = gates.map((gate) => progress >= gate);
          shouldOpen.forEach((open, index) => {
            if (open) setOpen(index, true);
          });
          closeOrder
            .filter((index) => opened[index] && !shouldOpen[index])
            .forEach((index, i) => setOpen(index, false, i * 0.06));
        };

        ScrollTrigger.create({
          id: "hiw-cards-mobile",
          trigger: stage,
          start: "top 70%",
          endTrigger: next ?? stage,
          end: next ? "top 85%" : "bottom bottom",
          pin: false,
          onUpdate: (self) => {
            if (self.isActive) sync(self.progress);
          },
          onLeave: closeAll,
          onLeaveBack: closeAll,
        });

        return () => {
          tweens.forEach((tween) => tween?.kill());
          ScrollTrigger.getById("hiw-cards-mobile")?.kill();
          gsap.set(cards, { "--p": 0 });
        };
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => bindScrub(0.1, "top 64%", true));
      mm.add(
        "(min-width: 768px) and (max-width: 1023.98px)",
        () => bindScrub(0.11, "top 66%", false),
      );
      mm.add("(max-width: 767.98px)", () => bindDiscrete());
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hiw-viewport-stage" ref={stageRef}>
      {media}

      <div className="hiw-content">
        {children}

        <div className="hiw-proto">
          <div className="hiw-stack" ref={stackRef}>
            <div className="hiw-card-stack">
              <div className="hiw-stack-item">
                <article
                  ref={card01Ref}
                  className="hiw-proto-card"
                  style={{ "--p": 0 } as React.CSSProperties}
                  aria-labelledby="hiw-card-01-label"
                >
                  <span className="hiw-proto-index">01</span>

                  <div className="hiw-proto-collapsed" aria-hidden="true">
                    <div className="hiw-proto-lead">
                      <span className="hiw-proto-icon">
                        <PiggyBank strokeWidth={1.75} />
                      </span>
                    </div>
                    <h3>Save on roof replacement</h3>
                  </div>

                  <div className="hiw-proto-expanded">
                    <div className="hiw-proto-visual">
                      <span className="hiw-proto-visual-bg">
                        <PiggyBank strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="hiw-proto-kicker" id="hiw-card-01-label">
                      Save up to
                    </p>
                    <p className="hiw-proto-stat">85%</p>
                    <p className="hiw-proto-support">
                      compared to roof <strong>replacement</strong>
                    </p>
                  </div>
                </article>
              </div>

              <div className="hiw-stack-item">
                <article
                  ref={card02Ref}
                  className="hiw-proto-card hiw-proto-card--money"
                  style={{ "--p": 0 } as React.CSSProperties}
                  aria-labelledby="hiw-card-02-label"
                >
                  <span className="hiw-proto-index">02</span>

                  <div className="hiw-proto-collapsed" aria-hidden="true">
                    <div className="hiw-proto-lead">
                      <span className="hiw-proto-icon">
                        <CircleDollarSign strokeWidth={1.75} />
                      </span>
                    </div>
                    <h3>Roof replacement cost</h3>
                  </div>

                  <div className="hiw-proto-expanded">
                    <div className="hiw-proto-visual">
                      <span className="hiw-proto-visual-bg">
                        <CircleDollarSign
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <p className="hiw-proto-kicker" id="hiw-card-02-label">
                      Typical cost
                    </p>
                    <p className="hiw-proto-stat">$15K–20K+</p>
                    <p className="hiw-proto-support">
                      for <strong>roof replacement</strong>
                    </p>
                  </div>
                </article>
              </div>

              <div className="hiw-stack-item">
                <article
                  ref={card03Ref}
                  className="hiw-proto-card hiw-proto-card--life"
                  style={{ "--p": 0 } as React.CSSProperties}
                  aria-labelledby="hiw-card-03-label"
                >
                  <span className="hiw-proto-index">03</span>

                  <div className="hiw-proto-collapsed" aria-hidden="true">
                    <div className="hiw-proto-lead">
                      <span className="hiw-proto-icon">
                        <House strokeWidth={1.75} />
                      </span>
                    </div>
                    <h3>Extend your roof life</h3>
                  </div>

                  <div className="hiw-proto-expanded">
                    <div className="hiw-proto-visual">
                      <span className="hiw-proto-visual-bg">
                        <House strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="hiw-proto-kicker" id="hiw-card-03-label">
                      Add between
                    </p>
                    <p className="hiw-proto-stat">5–15 YEARS</p>
                    <p className="hiw-proto-support">
                      to your <strong>roof life</strong>
                    </p>
                  </div>
                </article>
              </div>

              <div className="hiw-stack-item">
                <article
                  ref={card04Ref}
                  className="hiw-proto-card hiw-proto-card--hours"
                  style={{ "--p": 0 } as React.CSSProperties}
                  aria-labelledby="hiw-card-04-label"
                >
                  <span className="hiw-proto-index">04</span>

                  <div className="hiw-proto-collapsed" aria-hidden="true">
                    <div className="hiw-proto-lead">
                      <span className="hiw-proto-icon">
                        <Clock strokeWidth={1.75} />
                      </span>
                    </div>
                    <h3>Service time</h3>
                  </div>

                  <div className="hiw-proto-expanded">
                    <div className="hiw-proto-visual">
                      <span className="hiw-proto-visual-bg">
                        <Clock strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="hiw-proto-kicker" id="hiw-card-04-label">
                      Completed in
                    </p>
                    <p className="hiw-proto-stat">1–3 HOURS</p>
                    <p className="hiw-proto-support">
                      not <strong>days</strong>
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
