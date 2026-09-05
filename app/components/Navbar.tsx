"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  detectActiveSection,
  isSamePageHref,
  isSamePageNavLocked,
  resolveNavSection,
  samePageTarget,
  scrollToSamePage,
  sectionIdFromHref,
} from "../lib/samePageNav";
import QuoteCta from "./QuoteCta";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
];

const mobileNavLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
];

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 8 16"
      className="h-[clamp(12px,1.05vw,18px)] w-auto text-revive-ink"
      fill="none"
    >
      {direction === "left" ? (
        <path d="M6.6 1 1.4 8l5.2 7" stroke="currentColor" strokeWidth="1.35" />
      ) : (
        <path d="M1.4 1 6.6 8l-5.2 7" stroke="currentColor" strokeWidth="1.35" />
      )}
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [shifted, setShifted] = useState(false);
  const [shiftPx, setShiftPx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [spySection, setSpySection] = useState<string | null>("home");
  const headerRef = useRef<HTMLElement>(null);
  const menuOpenRef = useRef(false);
  const spyHoldRef = useRef(false);
  const inkPrimedRef = useRef(false);
  const trackRef = useRef<HTMLUListElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeSection =
    pathname === "/" ? spySection : sectionIdFromHref(pathname);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const items = [...track.querySelectorAll("li")] as HTMLElement[];
    const first = items[0];
    const contact = items.find((item) => {
      const href = item.querySelector("a")?.getAttribute("href");
      return href === "/contact" || href === "/#contact";
    });
    if (!first || !contact) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    setShiftPx(first.offsetWidth + gap);

    // Viewport ends at CONTACT so BLOG is clipped; the right chevron overlays CONTACT.
    const width = contact.offsetLeft + contact.offsetWidth - first.offsetLeft;
    viewport.style.width = `${width}px`;
  }, []);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    void document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, [measure]);

  const unlockPage = useCallback(() => {
    const html = document.documentElement;
    html.classList.remove("nav-locked");
    html.style.removeProperty("overflow");
    document.body.classList.remove("nav-locked");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("touch-action");
    document.body.style.removeProperty("overscroll-behavior");
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    unlockPage();
  }, [unlockPage]);

  useEffect(() => () => unlockPage(), [unlockPage]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const TOP = 50;
    const DEAD = 10;
    let lastY = window.scrollY;
    let hidden = false;
    let ticking = false;

    const paint = (hide: boolean, scrolled: boolean) => {
      header.classList.toggle("is-nav-hidden", hide);
      header.classList.toggle("is-nav-scrolled", scrolled);
    };

    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);

      if (menuOpenRef.current || isSamePageNavLocked() || y <= TOP) {
        hidden = false;
        lastY = y;
        paint(false, y > TOP);
        return;
      }

      const dy = y - lastY;
      if (dy > DEAD) hidden = true;
      else if (dy < -DEAD) hidden = false;

      if (Math.abs(dy) >= DEAD) lastY = y;
      paint(hidden, true);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    paint(false, lastY > TOP);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      unlockPage();
      return;
    }

    headerRef.current?.classList.remove("is-nav-hidden");
    document.documentElement.classList.add("nav-locked");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [
        toggleRef.current,
        ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a") ?? []),
      ].filter((node): node is HTMLElement => Boolean(node));

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

    const media = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => {
      if (media.matches) closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onDesktop);

    return () => {
      unlockPage();
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onDesktop);
    };
  }, [closeMenu, menuOpen, unlockPage]);

  const releaseSpy = useCallback(() => {
    spyHoldRef.current = false;
    if (pathname === "/") setSpySection(detectActiveSection());
  }, [pathname]);

  const goToHref = useCallback(
    (href: string, event?: { preventDefault: () => void; detail?: number }) => {
      if (!isSamePageHref(href, pathname)) return false;
      const target = samePageTarget(href);
      if (!target) return false;

      event?.preventDefault();
      const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
      const section = resolveNavSection(sectionIdFromHref(href));
      spyHoldRef.current = true;
      setSpySection(section);
      if (hash) history.pushState(null, "", hash);
      else history.pushState(null, "", pathname || "/");
      closeMenu();
      headerRef.current?.classList.remove("is-nav-hidden");

      const run = () => {
        unlockPage();
        scrollToSamePage(target, hash, {
          updateHash: false,
          onComplete: releaseSpy,
          onInterrupt: releaseSpy,
        });
        if (event && event.detail === 0 && target !== "top") {
          const heading =
            target.querySelector<HTMLElement>("h1, h2, [id$='-heading']") ??
            target;
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
      };

      requestAnimationFrame(() => requestAnimationFrame(run));
      return true;
    },
    [closeMenu, pathname, releaseSpy, unlockPage],
  );

  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash;
    const section = hash ? hash.slice(1) : "home";
    const next = resolveNavSection(section || "home");
    queueMicrotask(() => {
      setSpySection((cur) => (cur === next ? cur : next));
    });
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    spyHoldRef.current = true;
    let cancelled = false;
    const jump = () => {
      if (cancelled || !el.isConnected) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh();
      scrollToSamePage(el, hash, {
        instant: true,
        updateHash: false,
        onComplete: releaseSpy,
        onInterrupt: releaseSpy,
      });
    };

    const onLoad = () => {
      requestAnimationFrame(() => requestAnimationFrame(jump));
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const late = window.setTimeout(jump, 480);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      window.clearTimeout(late);
    };
  }, [pathname, releaseSpy]);

  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash;
      const section = hash ? hash.slice(1) : "home";
      spyHoldRef.current = true;
      setSpySection(resolveNavSection(section || "home"));
      if (pathname !== "/") {
        spyHoldRef.current = false;
        return;
      }
      if (!hash) {
        scrollToSamePage("top", "", {
          updateHash: false,
          onComplete: releaseSpy,
          onInterrupt: releaseSpy,
        });
        return;
      }
      const el = document.getElementById(hash.slice(1));
      if (el) {
        scrollToSamePage(el, hash, {
          updateHash: false,
          onComplete: releaseSpy,
          onInterrupt: releaseSpy,
        });
      } else {
        spyHoldRef.current = false;
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [pathname, releaseSpy]);

  useLayoutEffect(() => {
    if (pathname !== "/") return;

    gsap.registerPlugin(ScrollTrigger);
    const sync = () => {
      if (spyHoldRef.current || isSamePageNavLocked()) return;
      const next = detectActiveSection();
      setSpySection((cur) => (cur === next ? cur : next));
    };

    const spy = ScrollTrigger.create({
      id: "nav-section-spy",
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      onUpdate: sync,
    });

    ScrollTrigger.addEventListener("refresh", sync);
    sync();

    return () => {
      ScrollTrigger.removeEventListener("refresh", sync);
      spy.kill();
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const ink = inkRef.current;
    if (!track || !ink) return;

    const align = (animate: boolean) => {
      const active = track.querySelector<HTMLElement>("a[aria-current='page']");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = !animate || reduce ? 0 : 0.32;

      if (!active) {
        gsap.to(ink, {
          autoAlpha: 0,
          duration: reduce ? 0 : 0.22,
          ease: "power3.out",
          overwrite: true,
        });
        return;
      }

      const vars = {
        x: active.getBoundingClientRect().left - track.getBoundingClientRect().left,
        width: active.offsetWidth,
        autoAlpha: 1,
        ease: "power3.out",
        overwrite: true,
      };

      if (!inkPrimedRef.current) {
        inkPrimedRef.current = true;
        gsap.set(ink, vars);
        return;
      }

      gsap.to(ink, { ...vars, duration });
    };

    align(true);
    let refreshTimer = 0;
    const onResize = () => {
      align(false);
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 180);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [activeSection, shifted, shiftPx, pathname]);

  const isLinkActive = (href: string) => {
    const section = sectionIdFromHref(href);
    if (pathname === "/") return Boolean(activeSection) && activeSection === section;
    if (href === "/") return false;
    return (
      pathname === href ||
      (href !== "/" && !href.includes("#") && pathname.startsWith(href))
    );
  };

  return (
    <header
      ref={headerRef}
      className={`site-nav${menuOpen ? " is-nav-menu-open" : ""}`}
    >
      <div className="nav-enter relative z-50 h-[var(--header-h)] w-full bg-white">
      <div className="relative flex h-full w-full items-center justify-end px-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-0">
        <Link
          href="/"
          onClick={(event) => {
            if (!goToHref("/", event)) closeMenu();
          }}
          className="absolute top-1/2 left-1/2 z-10 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:static lg:z-auto lg:min-h-0 lg:min-w-0 lg:translate-x-0 lg:translate-y-0 lg:justify-self-center"
        >
          <Image
            src="/images/logo.png"
            alt="Revive Roof Solutions"
            width={1192}
            height={560}
            sizes="(min-width: 1024px) 180px, 140px"
            className="h-10 w-auto max-lg:h-[var(--nav-logo-h)] lg:h-[clamp(38px,3.3vw,58px)]"
            priority
          />
        </Link>

        <nav className="relative hidden text-[clamp(11.5px,0.979vw,17px)] leading-none lg:flex">
          {shifted && (
            <button
              type="button"
              aria-label="Show previous navigation items"
              onClick={() => setShifted(false)}
              className="nav-chevron nav-chevron-left absolute top-0 left-0 z-10 flex h-[1em] w-4 items-center justify-start bg-white"
            >
              <Chevron direction="left" />
            </button>
          )}

          <div ref={viewportRef} className="max-w-[46.5vw] overflow-hidden">
            <ul
              ref={trackRef}
              className="relative flex w-max items-start gap-[clamp(24px,3.97vw,68px)] will-change-transform"
              style={{
                transform: shifted
                  ? `translateX(-${shiftPx > 0 ? `${shiftPx}px` : "8.8vw"})`
                  : "translateX(0)",
                transition: "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={(event) => {
                        goToHref(link.href, event);
                      }}
                      className="relative inline-flex flex-col items-center pb-[5px] font-light tracking-[0.125em] whitespace-nowrap text-revive-ink transition-colors hover:text-revive-green"
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="-mr-[0.125em] inline-block">
                        {link.label.toUpperCase()}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <span ref={inkRef} className="nav-underline-bar" aria-hidden="true" />
            </ul>
          </div>

          {!shifted && (
            <button
              type="button"
              aria-label="Show next navigation items"
              onClick={() => setShifted(true)}
              className="nav-chevron nav-chevron-right absolute top-0 right-0 z-10 flex h-[1em] w-4 items-center justify-end bg-white"
            >
              <Chevron direction="right" />
            </button>
          )}
        </nav>

        <div className="relative z-20 flex h-full items-center justify-self-end lg:justify-self-center">
          <QuoteCta size="nav">Free Quote</QuoteCta>

          <button
            ref={toggleRef}
            type="button"
            className="flex size-11 items-center justify-center text-revive-ink max-lg:size-[var(--nav-burger)] lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => {
              if (menuOpen) {
                closeMenu();
                return;
              }
              menuOpenRef.current = true;
              headerRef.current?.classList.remove("is-nav-hidden");
              headerRef.current?.classList.add("is-nav-menu-open");
              setMenuOpen(true);
            }}
          >
            {menuOpen ? (
              <svg className="size-[18px]" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 2l14 14M16 2 2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-[16px] w-[22px] max-lg:h-[36%] max-lg:w-[50%]" viewBox="0 0 22 16" fill="none" aria-hidden="true">
                <path d="M1 1.5h20M1 8h20M1 14.5h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
      </div>

      <div
        ref={panelRef}
        id="mobile-nav"
        className={`mobile-nav-panel lg:hidden ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen ? true : undefined}
      >
        <nav className="mobile-nav-inner" aria-label="Mobile">
          <ul className="mobile-nav-list">
            {mobileNavLinks.map((link) => {
              const isActive = isLinkActive(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(event) => {
                      if (!goToHref(link.href, event)) closeMenu();
                    }}
                    className="mobile-nav-link"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="-mr-[0.125em]">{link.label.toUpperCase()}</span>
                    <span aria-hidden="true" className={`nav-underline ${isActive ? "is-active" : ""}`} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mobile-nav-spacer" aria-hidden="true" />

          <QuoteCta size="navMobile" onClick={closeMenu}>
            Get Your Free Quote
          </QuoteCta>
        </nav>
      </div>
    </header>
  );
}
