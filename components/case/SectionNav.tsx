"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Section = { id: string; label: string };

interface SectionNavProps {
  sections: Section[];
  project?: unknown;
}

/**
 * SectionNav — sticky in-page section navigator.
 * Tracks the most-in-view section via IntersectionObserver and slides an
 * accent underline (shared layoutId) between pills. Smooth-scrolls on click
 * using Lenis when available, otherwise native scrollIntoView.
 */
export default function SectionNav({ sections }: SectionNavProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  // Keep a live map of intersection ratios so we can pick the most-in-view id.
  const ratios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!sections.length) return;

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el != null);

    if (!els.length) return;

    const pickActive = () => {
      let bestId = "";
      let bestRatio = -1;
      for (const s of sections) {
        const r = ratios.current.get(s.id) ?? 0;
        if (r > bestRatio) {
          bestRatio = r;
          bestId = s.id;
        }
      }
      if (bestId && bestRatio > 0) {
        setActive((prev) => (prev === bestId ? prev : bestId));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }
        pickActive();
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -90 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!sections.length) return null;

  return (
    <nav
      className="sticky top-14 z-[40] glass-nav border-b"
      style={{
        borderColor: "var(--border)",
        background: "var(--glass-fill)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      aria-label="Section navigation"
    >
      <div className="container-pad">
        <ul className="no-scrollbar flex items-stretch gap-[6px] overflow-x-auto py-3">
          {sections.map((s, i) => {
            const isActive = active === s.id;
            const num = String(i + 1).padStart(2, "0");
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleClick(e, s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 transition-colors duration-300"
                  style={{
                    borderColor: isActive ? "var(--accent)" : "var(--border)",
                    background: isActive ? "var(--accent-dim)" : "transparent",
                  }}
                >
                  <span
                    className="text-[10px] font-semibold tabular-nums transition-colors duration-300"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text-dim)",
                    }}
                  >
                    {num}
                  </span>
                  <span
                    className="label-muted transition-colors duration-300 group-hover:text-[color:var(--accent)]"
                    style={
                      isActive
                        ? ({ color: "var(--accent)" } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {s.label}
                  </span>

                  {isActive ? (
                    <motion.span
                      layoutId="section-nav-active"
                      className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full"
                      style={{ background: "var(--accent)" }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 30 }
                      }
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
