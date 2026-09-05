import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let tween: gsap.core.Tween | null = null;
let locked = false;
const listeners: Array<["wheel" | "touchstart" | "pointerdown", EventListener]> =
  [];

const NAV_SECTION_IDS = new Set(["home", "how-it-works", "gallery", "contact"]);

const HOME_FORCE_Y = 100;
const BREATHING = 16;
const LINE_RATIO = 0.3;

export function resolveNavSection(id: string | null | undefined): string | null {
  if (!id) return null;
  return NAV_SECTION_IDS.has(id) ? id : null;
}

export function isSamePageNavLocked() {
  return locked;
}

export function samePageTarget(href: string): "top" | HTMLElement | null {
  if (href === "/" || href === "/#" || href === "#") return "top";
  const hash = href.includes("#") ? href.slice(href.indexOf("#") + 1) : "";
  if (!hash) return null;
  return document.getElementById(hash);
}

export function isSamePageHref(href: string, pathname: string) {
  if (href === "/" || href === "/#" || href === "#") return pathname === "/";
  if (href.startsWith("#")) return true;
  if (href.startsWith("/#")) return pathname === "/";
  return false;
}

export function sectionIdFromHref(href: string) {
  if (href === "/" || href === "/#" || href === "#") return "home";
  if (href.includes("#")) return href.slice(href.indexOf("#") + 1);
  if (href.startsWith("/")) return href.slice(1).split("/")[0] || "home";
  return "";
}

export function headerHeight() {
  const bar = document.querySelector(".nav-enter");
  if (bar instanceof HTMLElement && bar.offsetHeight > 0) {
    return bar.offsetHeight;
  }
  const nav = document.querySelector(".site-nav");
  if (nav instanceof HTMLElement && nav.offsetHeight > 0) {
    return Math.min(nav.offsetHeight, 120);
  }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-h")
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 72;
}

function flowBounds(el: HTMLElement) {
  const pinned = el.parentElement?.classList.contains("pin-spacer")
    ? el.parentElement
    : el;
  const rect = pinned.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
  };
}

function pinStartFor(el: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollTrigger.getAll !== "function") return null;
  for (const st of ScrollTrigger.getAll()) {
    if (!st.pin) continue;
    const trigger = st.trigger;
    if (!(trigger instanceof Element)) continue;
    if (el === trigger || el.contains(trigger) || trigger.contains(el)) {
      return st.start;
    }
  }
  return null;
}

function isFullBleedScene(el: HTMLElement) {
  return Boolean(
    el.id === "how-it-works" || el.querySelector(".hiw-viewport-stage"),
  );
}

function headingOffset(scene: HTMLElement) {
  const heading = scene.querySelector<HTMLElement>(
    "#hiw-heading, h1, h2, [id$='-heading']",
  );
  if (!heading) return null;
  const stage =
    scene.querySelector<HTMLElement>(".hiw-viewport-stage") ?? scene;
  return heading.getBoundingClientRect().top - stage.getBoundingClientRect().top;
}

function galleryLead() {
  const width = window.innerWidth;
  const vh = window.innerHeight;
  if (width < 768) {
    return Math.round(gsap.utils.clamp(52, 72, vh * 0.075));
  }
  if (width < 1024) {
    return 28;
  }
  return 0;
}

function destinationY(target: "top" | HTMLElement) {
  if (target === "top") return 0;

  const sceneTop = flowBounds(target).top;
  const headerH = headerHeight();

  if (target.id === "gallery") {
    return Math.max(0, Math.round(sceneTop - headerH - galleryLead()));
  }

  if (target.id === "contact") {
    return Math.max(0, Math.round(sceneTop - headerH));
  }

  const pinStart = pinStartFor(target);
  const start =
    pinStart ?? (isFullBleedScene(target) ? sceneTop : null);

  if (start != null) {
    const flush = start - headerH;
    const offset = headingOffset(target);
    const headingDest =
      offset == null ? flush : start + offset - headerH - BREATHING;
    const dest = Math.min(start, Math.max(headingDest, flush));
    return Math.max(0, Math.round(dest));
  }

  const offset = headingOffset(target);
  const top = offset == null ? sceneTop : sceneTop + offset;
  return Math.max(0, Math.round(top - headerH - BREATHING));
}

export function detectActiveSection(): string | null {
  const y = window.scrollY;
  if (y <= HOME_FORCE_Y) return "home";

  const headerH = headerHeight();
  const line = y + headerH + (window.innerHeight - headerH) * LINE_RATIO;
  const sections = [
    ...document.querySelectorAll<HTMLElement>("main section[id]"),
  ];

  let hit: HTMLElement | null = null;
  let hitTop = Number.NEGATIVE_INFINITY;
  for (const el of sections) {
    const bounds = flowBounds(el);
    if (bounds.top <= line && line < bounds.bottom && bounds.top >= hitTop) {
      hit = el;
      hitTop = bounds.top;
    }
  }

  if (!hit) {
    const first = sections[0];
    if (!first || flowBounds(first).top > line) return "home";
    return null;
  }

  return resolveNavSection(hit.id);
}

function durationFor(distance: number) {
  return gsap.utils.clamp(0.7, 1.3, 0.62 + distance / 3200);
}

function release() {
  locked = false;
  listeners.forEach(([type, fn]) => window.removeEventListener(type, fn));
  listeners.length = 0;
}

function isNavEvent(event: Event) {
  const node = event.target;
  return node instanceof Node && Boolean(document.querySelector(".site-nav")?.contains(node));
}

function armInterrupt() {
  const stop = () => {
    tween?.kill();
    tween = null;
    release();
  };
  const onWheel = () => stop();
  const onTouch = (event: Event) => {
    if (isNavEvent(event)) return;
    stop();
  };
  const onPointer = (event: Event) => {
    if (isNavEvent(event)) return;
    if (
      event instanceof PointerEvent &&
      event.pointerType === "mouse" &&
      event.buttons === 0
    ) {
      return;
    }
    stop();
  };
  listeners.push(["wheel", onWheel], ["touchstart", onTouch], ["pointerdown", onPointer]);
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouch, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
}

export function scrollToSamePage(
  target: "top" | HTMLElement,
  hash: string,
  opts?: {
    instant?: boolean;
    updateHash?: boolean;
    onComplete?: () => void;
    onInterrupt?: () => void;
  },
) {
  if (
    target instanceof HTMLElement &&
    (target.id === "gallery" || target.id === "contact")
  ) {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollTrigger.refresh === "function") {
      ScrollTrigger.refresh();
    }
  }

  const dest = destinationY(target);
  const from = window.scrollY;
  const reduce =
    opts?.instant ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  tween?.kill();
  tween = null;
  locked = true;
  document.documentElement.classList.remove("nav-locked");

  const finish = () => {
    window.scrollTo(0, dest);
    if (opts?.updateHash !== false) {
      if (hash) history.pushState(null, "", hash);
      else history.pushState(null, "", window.location.pathname || "/");
    }
    release();
    opts?.onComplete?.();
  };

  if (reduce || Math.abs(dest - from) < 2) {
    finish();
    return;
  }

  const state = { y: from };
  armInterrupt();
  tween = gsap.to(state, {
    y: dest,
    duration: durationFor(Math.abs(dest - from)),
    ease: "power3.inOut",
    overwrite: true,
    onUpdate: () => {
      window.scrollTo(0, state.y);
    },
    onComplete: finish,
    onInterrupt: () => {
      release();
      opts?.onInterrupt?.();
    },
  });
}
