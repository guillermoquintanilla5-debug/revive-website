import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CSSProperties, ReactNode } from "react";

export type WaveWord = { text: string; bold?: boolean };

function waveStops(count: number, from: number, to: number) {
  if (count <= 1) return [from];
  return Array.from(
    { length: count },
    (_, i) => from + ((to - from) * i) / (count - 1),
  );
}

function flattenChars(words: WaveWord[]) {
  const chars: { ch: string; hold?: boolean }[] = [];
  words.forEach((word, i) => {
    if (i > 0) chars.push({ ch: " " });
    for (const ch of word.text) {
      chars.push({ ch, hold: word.bold });
    }
  });
  return chars;
}

export function WaveLine({
  words,
  from,
  to,
}: {
  words: WaveWord[];
  from: number;
  to: number;
}) {
  const chars = flattenChars(words);
  const stops = waveStops(chars.length, from, to);
  const nodes: ReactNode[] = [];

  for (let i = 0; i < chars.length; ) {
    if (chars[i].hold) {
      const start = i;
      while (i < chars.length && chars[i].hold) i += 1;
      nodes.push(
        <strong key={`hold-${start}`}>
          {chars.slice(start, i).map((char, j) => (
            <span
              key={`${start}-${j}`}
              className="alt-wave-char alt-wave-char--hold"
              style={{ "--alt-wave-i": stops[start + j] } as CSSProperties}
            >
              {char.ch}
            </span>
          ))}
        </strong>,
      );
      continue;
    }

    nodes.push(
      <span
        key={`c-${i}`}
        className="alt-wave-char"
        style={{ "--alt-wave-i": stops[i] } as CSSProperties}
      >
        {chars[i].ch}
      </span>,
    );
    i += 1;
  }

  return <>{nodes}</>;
}

export function attachGradientWave(
  copy: HTMLElement,
  ids: { compact: string; tablet: string; desktop: string },
) {
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      copy.style.setProperty("--alt-wave", "1");
    });

    const bindWave = (id: string, start: string, end: string, scrub: number) => {
      const state = { p: 0 };
      const apply = () => {
        copy.style.setProperty("--alt-wave", String(state.p));
      };

      copy.style.setProperty("--alt-wave", "0");
      apply();

      const animation = gsap.timeline({ defaults: { ease: "none" } });
      animation.fromTo(
        state,
        { p: 0 },
        {
          p: 1,
          duration: 1,
          ease: "none",
          immediateRender: true,
          onUpdate: apply,
        },
        0,
      );

      ScrollTrigger.create({
        id,
        animation,
        trigger: copy,
        start,
        end,
        scrub,
        pin: false,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          state.p = self.progress;
          apply();
        },
      });

      return () => {
        ScrollTrigger.getById(id)?.kill();
        animation.kill();
      };
    };

    mm.add(
      "(prefers-reduced-motion: no-preference) and (max-width: 539.98px)",
      () => bindWave(ids.compact, "top 68%", "bottom 64%", 0.65),
    );

    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 540px) and (max-width: 1023.98px)",
      () => bindWave(ids.tablet, "top 72%", "bottom 52%", 0.7),
    );

    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
      () => bindWave(ids.desktop, "top 70%", "bottom 42%", 0.7),
    );
  }, copy);

  return () => ctx.revert();
}
