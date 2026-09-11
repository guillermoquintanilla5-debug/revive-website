"use client";

import type { ComponentPropsWithoutRef, MouseEvent, ReactNode, Ref } from "react";
import { withForwardedAttribution } from "../lib/attributionParams";

export const QUOTE_HREF = "https://revive-quote-app.vercel.app/quote-request";

export type QuoteCtaSize =
  | "hero"
  | "heroMobile"
  | "section"
  | "qualify"
  | "article"
  | "nav"
  | "navMobile";

type QuoteCtaProps = {
  size: QuoteCtaSize;
  href?: string;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

function QuoteArrow() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.2 7h9.2M8.1 3.4 11.8 7 8.1 10.6"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function QuoteCta({
  size,
  href = QUOTE_HREF,
  className,
  children,
  ref,
  onClick,
  ...rest
}: QuoteCtaProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    const anchor = event.currentTarget;
    anchor.href = withForwardedAttribution(anchor.href);
  }

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      className={["quote-cta", `quote-cta--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span className="quote-cta-label">
        <span>
          {children}
          <span className="quote-cta-mark" aria-hidden="true">
            →
          </span>
        </span>
        <span aria-hidden="true">{children}</span>
      </span>
      <span className="quote-cta-orb" aria-hidden="true">
        <span className="quote-cta-arrow">
          <QuoteArrow />
        </span>
      </span>
    </a>
  );
}
