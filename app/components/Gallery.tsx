"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const GALLERY_ITEMS = [
  {
    src: "/images/gallery-aerial-overview.jpg",
    alt: "Aerial overhead view of a residential roof after rejuvenation.",
    width: 1600,
    height: 1200,
  },
  {
    src: "/images/gallery-worker-application.jpg",
    alt: "Aerial view of a technician applying roof rejuvenation treatment along a residential roof.",
    width: 1600,
    height: 1200,
  },
  {
    src: "/images/gallery-shingle-comparison-1.jpg",
    alt: "Close-up of asphalt shingles comparing faded texture on one side with restored texture on the other.",
    width: 1600,
    height: 900,
  },
  {
    src: "/images/gallery-shingle-comparison-2.jpg",
    alt: "Close-up of asphalt shingles comparing faded color on one side with restored color on the other.",
    width: 1600,
    height: 900,
  },
  {
    src: "/images/gallery-before-during-after.jpg",
    alt: "Aerial roof showing restored shingles after treatment on the left, a technician working in the center, and faded shingles before treatment on the right.",
    width: 1600,
    height: 892,
  },
] as const;

const COUNT = GALLERY_ITEMS.length;
const SLIDES = [GALLERY_ITEMS[COUNT - 1], ...GALLERY_ITEMS, GALLERY_ITEMS[0]];

type Rect = { left: number; top: number; width: number; height: number };

function itemFromSlide(slideIndex: number) {
  if (slideIndex === 0) return COUNT - 1;
  if (slideIndex === COUNT + 1) return 0;
  return slideIndex - 1;
}

function wrapItem(index: number) {
  return ((index % COUNT) + COUNT) % COUNT;
}

function containRect(nw: number, nh: number, maxW: number, maxH: number): Rect {
  const ratio = nw / nh;
  let width = maxW;
  let height = width / ratio;
  if (height > maxH) {
    height = maxH;
    width = height * ratio;
  }
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  };
}

function paintedRect(img: HTMLImageElement): Rect {
  const box = img.getBoundingClientRect();
  const nw = img.naturalWidth || box.width;
  const nh = img.naturalHeight || box.height;
  const ir = nw / Math.max(1, nh);
  const cr = box.width / Math.max(1, box.height);
  if (ir > cr) {
    const height = box.width / ir;
    return {
      left: box.left,
      top: box.top + (box.height - height) / 2,
      width: box.width,
      height,
    };
  }
  const width = box.height * ir;
  return {
    left: box.left + (box.width - width) / 2,
    top: box.top,
    width,
    height: box.height,
  };
}

function isGalleryNarrow() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function lockLightboxScroll() {
  document.documentElement.classList.add("gallery-lb-open");
}

function unlockLightboxScroll() {
  document.documentElement.classList.remove("gallery-lb-open");
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const posRef = useRef(1);
  const stepRef = useRef(400);
  const reduceRef = useRef(false);
  const awayRef = useRef(false);
  const ignoreClickRef = useRef(false);
  const originRectRef = useRef<Rect | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const lbRootRef = useRef<HTMLDivElement>(null);
  const lbFrameRef = useRef<HTMLDivElement>(null);
  const lbTweenRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const lbBusyRef = useRef(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    lastX: number;
    lastT: number;
    vel: number;
    axis: "h" | "v" | null;
  } | null>(null);

  const [showPrev, setShowPrev] = useState(false);
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null);

  const applyPos = useCallback((pos: number) => {
    const track = trackRef.current;
    if (!track) return;
    gsap.set(track, { x: -pos * stepRef.current, force3D: true });
  }, []);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const first = track?.querySelector<HTMLElement>(".gallery-card");
    if (!viewport || !track || !first) return;
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 24;
    stepRef.current = first.offsetWidth + gap;
    applyPos(posRef.current);
  }, [applyPos]);

  const snapIfClone = useCallback(() => {
    if (posRef.current === 0) {
      posRef.current = COUNT;
      applyPos(COUNT);
    } else if (posRef.current === COUNT + 1) {
      posRef.current = 1;
      applyPos(1);
    }
  }, [applyPos]);

  const syncArrows = useCallback(() => {
    if (posRef.current !== 1) awayRef.current = true;
    setShowPrev(awayRef.current);
  }, []);

  const animateToPos = useCallback(
    (nextPos: number) => {
      const track = trackRef.current;
      if (!track) return;
      tweenRef.current?.kill();
      posRef.current = gsap.utils.clamp(0, COUNT + 1, nextPos);
      viewportRef.current?.classList.add("is-animating");
      const reduce = reduceRef.current;
      tweenRef.current = gsap.to(track, {
        x: -posRef.current * stepRef.current,
        duration: reduce ? 0.01 : 0.65,
        ease: reduce ? "none" : "power3.out",
        overwrite: true,
        onComplete: () => {
          snapIfClone();
          syncArrows();
          viewportRef.current?.classList.remove("is-animating");
          tweenRef.current = null;
        },
      });
    },
    [snapIfClone, syncArrows],
  );

  const clampX = useCallback((x: number) => {
    const step = Math.max(1, stepRef.current);
    return gsap.utils.clamp(-(COUNT + 1) * step, 0, x);
  }, []);

  const snapNearest = useCallback(
    (x: number, vel = 0) => {
      const step = Math.max(1, stepRef.current);
      const raw = -x / step - (vel * 180) / step;
      const nearest = gsap.utils.clamp(0, COUNT + 1, Math.round(raw));
      animateToPos(nearest);
    },
    [animateToPos],
  );

  const step = useCallback(
    (dir: number) => {
      if (lightbox) return;
      if (posRef.current <= 0) {
        posRef.current = COUNT;
        applyPos(COUNT);
      } else if (posRef.current >= COUNT + 1) {
        posRef.current = 1;
        applyPos(1);
      }
      animateToPos(posRef.current + dir);
    },
    [animateToPos, applyPos, lightbox],
  );

  const findReturnImage = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return null;
    const vr = viewport.getBoundingClientRect();
    const cards = [...track.querySelectorAll<HTMLElement>(".gallery-card")];
    let best: HTMLImageElement | null = null;
    let bestOverlap = 0;
    for (const card of cards) {
      if (card.dataset.item !== String(index)) continue;
      const img = card.querySelector<HTMLImageElement>(".gallery-photo");
      if (!img) continue;
      const r = img.getBoundingClientRect();
      const overlap = Math.max(
        0,
        Math.min(r.right, vr.right) - Math.max(r.left, vr.left),
      );
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        best = img;
      }
    }
    return bestOverlap > 40 ? best : null;
  }, []);

  const closeLightbox = useCallback(() => {
    if (!lightbox || lbBusyRef.current) return;
    const frame = lbFrameRef.current;
    const root = lbRootRef.current;
    const reduce = reduceRef.current;
    const opener = openerRef.current;
    const finish = () => {
      lbTweenRef.current?.kill();
      lbTweenRef.current = null;
      lbBusyRef.current = false;
      unlockLightboxScroll();
      document
        .querySelector(".gallery-card.is-expanded")
        ?.classList.remove("is-expanded");
      setLightbox(null);
      opener?.focus();
    };

    if (!frame || !root || reduce) {
      finish();
      return;
    }

    lbBusyRef.current = true;
    const backdrop = root.querySelector<HTMLElement>(".gallery-lb-backdrop");
    const returnImg = findReturnImage(lightbox.index);
    const tl = gsap.timeline({ onComplete: finish });
    lbTweenRef.current = tl;

    if (returnImg) {
      const from = paintedRect(returnImg);
      const now = frame.getBoundingClientRect();
      tl.to(
        frame,
        {
          x: from.left + from.width / 2 - (now.left + now.width / 2),
          y: from.top + from.height / 2 - (now.top + now.height / 2),
          scale: from.width / Math.max(1, now.width),
          duration: 0.6,
          ease: "power3.inOut",
        },
        0,
      );
    } else {
      tl.to(
        frame,
        { scale: 0.94, opacity: 0, duration: 0.42, ease: "power3.in" },
        0,
      );
    }

    if (backdrop) {
      tl.to(backdrop, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.05);
    }
    tl.to(
      root.querySelectorAll(".gallery-lb-ui"),
      { opacity: 0, duration: 0.22, ease: "power2.in" },
      0,
    );
  }, [findReturnImage, lightbox]);

  const openLightbox = useCallback((index: number, opener: HTMLElement) => {
    if (lbBusyRef.current || lightbox) return;
    const img = opener.querySelector<HTMLImageElement>(".gallery-photo");
    originRectRef.current = img ? paintedRect(img) : opener.getBoundingClientRect();
    openerRef.current = opener;
    opener.closest(".gallery-card")?.classList.add("is-expanded");
    lockLightboxScroll();
    setLightbox({ index });
  }, [lightbox]);

  const lightboxStep = useCallback(
    (dir: number) => {
      if (!lightbox || lbBusyRef.current) return;
      const frame = lbFrameRef.current;
      const reduce = reduceRef.current;
      const next = wrapItem(lightbox.index + dir);
      if (!frame || reduce) {
        originRectRef.current = null;
        setLightbox({ index: next });
        return;
      }
      lbBusyRef.current = true;
      lbTweenRef.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          lbBusyRef.current = false;
        },
      });
      lbTweenRef.current = tl;
      tl.to(frame, {
        x: dir * -40,
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
      });
      tl.add(() => {
        originRectRef.current = null;
        setLightbox({ index: next });
      });
      tl.fromTo(
        frame,
        { x: dir * 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.26, ease: "power2.out" },
      );
    },
    [lightbox],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const eyebrow = section.querySelector<HTMLElement>(".gallery-eyebrow");
    const title = section.querySelector<HTMLElement>(".gallery-title");
    const intro = section.querySelector<HTMLElement>(".gallery-intro");
    if (!eyebrow || !title) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([eyebrow, title], { opacity: 1, y: 0 });
        section.classList.add("is-in");
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set([eyebrow, title], { opacity: 0, y: 24 });
        const tl = gsap.timeline({
          defaults: { duration: 0.9, ease: "power3.out" },
          scrollTrigger: {
            id: "gallery-heading-enter",
            trigger: intro ?? eyebrow,
            start: "top 82%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
        tl.to(eyebrow, { opacity: 1, y: 0 }).to(
          title,
          { opacity: 1, y: 0 },
          0.12,
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    if (!section || !viewport) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceRef.current = reduceMq.matches;
    const onReduce = () => {
      reduceRef.current = reduceMq.matches;
    };

    measure();
    section.classList.add("is-ready");
    gsap.set(prevBtnRef.current, { autoAlpha: 0, x: -6 });

    const ro = new ResizeObserver(() => measure());
    ro.observe(viewport);
    reduceMq.addEventListener("change", onReduce);

    return () => {
      tweenRef.current?.kill();
      ro.disconnect();
      reduceMq.removeEventListener("change", onReduce);
    };
  }, [measure]);

  useLayoutEffect(() => {
    const prev = prevBtnRef.current;
    if (!prev) return;
    const reduce = reduceRef.current;
    gsap.to(prev, {
      autoAlpha: showPrev ? 1 : 0,
      x: showPrev ? 0 : -6,
      duration: reduce ? 0.01 : 0.3,
      ease: showPrev ? "power3.out" : "power2.in",
      overwrite: true,
    });
    prev.tabIndex = showPrev ? 0 : -1;
    prev.setAttribute("aria-hidden", showPrev ? "false" : "true");
  }, [showPrev]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const currentX = () => Number(gsap.getProperty(track, "x")) || 0;
    const SNAP_PX = 40;

    const detachWindow = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    const finishDrag = () => {
      const drag = dragRef.current;
      detachWindow();
      viewport.classList.remove("is-dragging");
      if (drag && viewport.hasPointerCapture(drag.pointerId)) {
        try {
          viewport.releasePointerCapture(drag.pointerId);
        } catch {
          /* already released */
        }
      }
      if (!drag) return;
      const narrow = isGalleryNarrow();
      const dx = drag.lastX - drag.startX;
      if (drag.axis !== "h") {
        if (drag.axis === "v" && !narrow) animateToPos(posRef.current);
        if (drag.axis || Math.abs(dx) > 10) ignoreClickRef.current = true;
        dragRef.current = null;
        return;
      }
      ignoreClickRef.current = true;
      const coast = performance.now() - drag.lastT > 80 ? 0 : drag.vel;
      if (narrow) {
        const passed = Math.abs(dx) >= SNAP_PX || Math.abs(coast) > 0.55;
        if (!passed) {
          animateToPos(posRef.current);
        } else {
          animateToPos(posRef.current + (dx + coast * 80 < 0 ? 1 : -1));
        }
      } else {
        snapNearest(currentX(), coast);
      }
      dragRef.current = null;
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      const narrow = isGalleryNarrow();
      if (!drag.axis) {
        const intent = narrow ? 12 : 8;
        if (Math.abs(dx) < intent && Math.abs(dy) < intent) return;
        if (narrow) {
          if (Math.abs(dx) > Math.abs(dy) * 1.2) {
            drag.axis = "h";
          } else {
            drag.axis = "v";
            return;
          }
        } else {
          drag.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? "h" : "v";
        }
        if (drag.axis === "h") {
          tweenRef.current?.kill();
          tweenRef.current = null;
          viewport.classList.add("is-dragging");
          try {
            viewport.setPointerCapture(event.pointerId);
          } catch {
            /* optional */
          }
        }
      }
      if (drag.axis !== "h") return;
      const now = performance.now();
      const dt = now - drag.lastT;
      if (dt > 8) {
        const inst = (event.clientX - drag.lastX) / dt;
        drag.vel = gsap.utils.clamp(-3.2, 3.2, inst);
        drag.lastT = now;
      }
      drag.lastX = event.clientX;
      gsap.set(track, { x: clampX(drag.originX + dx), force3D: true });
    };

    const onPointerUp = (event: PointerEvent) => {
      if (dragRef.current?.pointerId !== event.pointerId) return;
      finishDrag();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement | null)?.closest(".gallery-arrow")) return;
      if (!isGalleryNarrow()) {
        tweenRef.current?.kill();
        tweenRef.current = null;
      }
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: currentX(),
        lastX: event.clientX,
        lastT: performance.now(),
        vel: 0,
        axis: null,
      };
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    };

    let wheelIdle = 0;
    const onWheel = (event: WheelEvent) => {
      if (isGalleryNarrow()) {
        if (
          Math.abs(event.deltaX) <= Math.abs(event.deltaY) ||
          Math.abs(event.deltaX) < 10
        ) {
          return;
        }
        event.preventDefault();
        tweenRef.current?.kill();
        tweenRef.current = null;
        viewport.classList.add("is-animating");
        gsap.set(track, { x: clampX(currentX() - event.deltaX), force3D: true });
        window.clearTimeout(wheelIdle);
        wheelIdle = window.setTimeout(() => {
          snapNearest(currentX());
        }, 90);
        return;
      }
      const horizontal =
        event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) + 1;
      if (!horizontal) return;
      event.preventDefault();
      tweenRef.current?.kill();
      tweenRef.current = null;
      viewport.classList.add("is-animating");
      const dx =
        event.shiftKey && Math.abs(event.deltaX) < 1 ? event.deltaY : event.deltaX;
      gsap.set(track, { x: clampX(currentX() - dx), force3D: true });
      window.clearTimeout(wheelIdle);
      wheelIdle = window.setTimeout(() => {
        snapNearest(currentX());
      }, 90);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (dragRef.current?.axis === "h") event.preventDefault();
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.clearTimeout(wheelIdle);
      detachWindow();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("wheel", onWheel);
    };
  }, [animateToPos, clampX, snapNearest]);

  const lbSessionRef = useRef(false);

  useLayoutEffect(() => {
    if (!lightbox) {
      lbSessionRef.current = false;
      return;
    }
    const root = lbRootRef.current;
    const frame = lbFrameRef.current;
    if (!root || !frame) return;

    const item = GALLERY_ITEMS[lightbox.index];
    const to = containRect(
      item.width,
      item.height,
      window.innerWidth * 0.92,
      window.innerHeight * 0.88,
    );
    const firstOpen = !lbSessionRef.current;
    lbSessionRef.current = true;

    if (!firstOpen) {
      gsap.set(frame, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
      });
      return;
    }

    const origin = originRectRef.current;
    const backdrop = root.querySelector<HTMLElement>(".gallery-lb-backdrop");
    const ui = root.querySelectorAll<HTMLElement>(".gallery-lb-ui");
    const reduce = reduceRef.current;
    const closeBtn = root.querySelector<HTMLButtonElement>(".gallery-lb-close");

    gsap.set(frame, {
      left: to.left,
      top: to.top,
      width: to.width,
      height: to.height,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      transformOrigin: "center center",
    });

    if (origin && !reduce) {
      gsap.set(frame, {
        x: origin.left + origin.width / 2 - (to.left + to.width / 2),
        y: origin.top + origin.height / 2 - (to.top + to.height / 2),
        scale: origin.width / Math.max(1, to.width),
      });
      if (backdrop) gsap.set(backdrop, { opacity: 0 });
      gsap.set(ui, { opacity: 0 });
      const tl = gsap.timeline();
      lbTweenRef.current = tl;
      tl.to(
        frame,
        { x: 0, y: 0, scale: 1, duration: 0.65, ease: "power3.inOut" },
        0,
      );
      if (backdrop) {
        tl.to(backdrop, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.05);
      }
      tl.to(ui, { opacity: 1, duration: 0.28, ease: "power2.out" }, 0.28);
    } else if (backdrop) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(ui, { opacity: 1 });
    }

    closeBtn?.focus();
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const root = lbRootRef.current;
    if (!root) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        lightboxStep(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        lightboxStep(1);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...root.querySelectorAll<HTMLElement>(
          "button:not([tabindex='-1']), [href], [tabindex]:not([tabindex='-1'])",
        ),
      ].filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const swipe = {
      id: -1,
      x: 0,
      y: 0,
      axis: null as "h" | "v" | null,
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement | null)?.closest("button")) return;
      swipe.id = event.pointerId;
      swipe.x = event.clientX;
      swipe.y = event.clientY;
      swipe.axis = null;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== swipe.id) return;
      const dx = event.clientX - swipe.x;
      const dy = event.clientY - swipe.y;
      if (!swipe.axis && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        swipe.axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== swipe.id) return;
      const dx = event.clientX - swipe.x;
      const axis = swipe.axis;
      swipe.id = -1;
      if (axis === "h" && Math.abs(dx) > 48) {
        lightboxStep(dx < 0 ? 1 : -1);
        return;
      }
      if (
        !axis &&
        (event.target === root ||
          (event.target as HTMLElement).classList.contains("gallery-lb-backdrop"))
      ) {
        closeLightbox();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
    };
  }, [closeLightbox, lightbox, lightboxStep]);

  useEffect(() => {
    if (lightbox) return;
    unlockLightboxScroll();
  }, [lightbox]);

  useEffect(() => () => unlockLightboxScroll(), []);

  const onCardClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    event.preventDefault();
    openLightbox(index, event.currentTarget);
  };

  const activeItem = lightbox ? GALLERY_ITEMS[lightbox.index] : null;

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="gallery"
      aria-labelledby="gallery-heading"
      inert={lightbox ? true : undefined}
    >
      <div className="gallery-shell">
        <header className="gallery-intro">
          <p className="gallery-eyebrow">Gallery</p>
          <h2 id="gallery-heading" className="gallery-title">
            <span className="gallery-title-lead">See the </span>
            <em>difference</em>.
          </h2>
        </header>

        <div
          className="gallery-frame"
          onKeyDown={(event) => {
            if (lightbox) return;
            if (event.key === "ArrowLeft") {
              if (!showPrev) return;
              event.preventDefault();
              step(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              step(1);
            }
          }}
        >
          <button
            ref={prevBtnRef}
            type="button"
            className="gallery-arrow gallery-arrow--prev"
            aria-label="Previous gallery image"
            onClick={() => step(-1)}
          >
            <span className="gallery-arrow-mark">
              <ArrowLeft strokeWidth={1.6} />
            </span>
          </button>

          <div
            ref={viewportRef}
            className="gallery-viewport"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Project gallery"
          >
            <div ref={trackRef} className="gallery-track">
              {SLIDES.map((item, index) => {
                const itemIndex = itemFromSlide(index);
                return (
                  <article
                    key={`${item.src}-${index}`}
                    className="gallery-card"
                    data-item={itemIndex}
                  >
                    <button
                      type="button"
                      className="gallery-card-open"
                      aria-label="Open gallery image"
                      tabIndex={index === 0 || index === COUNT + 1 ? -1 : 0}
                      aria-hidden={index === 0 || index === COUNT + 1}
                      onClick={(event) => onCardClick(event, itemIndex)}
                    >
                      <span className="gallery-card-media">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          quality={80}
                          sizes="(min-width: 1024px) 55vw, 85vw"
                          className="gallery-photo"
                          draggable={false}
                        />
                      </span>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            ref={nextBtnRef}
            type="button"
            className="gallery-arrow gallery-arrow--next"
            aria-label="Next gallery image"
            onClick={() => step(1)}
          >
            <span className="gallery-arrow-mark">
              <ArrowRight strokeWidth={1.6} />
            </span>
          </button>
        </div>
      </div>

      {lightbox && activeItem
        ? createPortal(
            <div
              ref={lbRootRef}
              className="gallery-lb"
              role="dialog"
              aria-modal="true"
              aria-label="Gallery viewer"
            >
              <div className="gallery-lb-backdrop" />
              <div ref={lbFrameRef} className="gallery-lb-frame">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  quality={90}
                  sizes="94vw"
                  className="gallery-lb-photo"
                  draggable={false}
                  priority
                />
              </div>
              <button
                type="button"
                className="gallery-lb-close gallery-lb-ui"
                aria-label="Close gallery viewer"
                onClick={closeLightbox}
              >
                <X strokeWidth={1.6} />
              </button>
              <button
                type="button"
                className="gallery-arrow gallery-arrow--lb-prev gallery-lb-ui"
                aria-label="Previous gallery image"
                onClick={() => lightboxStep(-1)}
              >
                <span className="gallery-arrow-mark">
                  <ArrowLeft strokeWidth={1.6} />
                </span>
              </button>
              <button
                type="button"
                className="gallery-arrow gallery-arrow--lb-next gallery-lb-ui"
                aria-label="Next gallery image"
                onClick={() => lightboxStep(1)}
              >
                <span className="gallery-arrow-mark">
                  <ArrowRight strokeWidth={1.6} />
                </span>
              </button>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
