"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { RevealHeading, RevealText } from "@/components/case/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface SectionShellProps {
  id: string;
  number?: string | number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  intro?: React.ReactNode;
  contentClassName?: string;
  compact?: boolean;
}

export default function SectionShell({
  id,
  number,
  title,
  subtitle,
  children,
  intro,
  contentClassName,
  compact,
}: SectionShellProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.6, 0.35]);
  const ghostY = reduce ? 0 : rawY;
  const ghostOpacity = reduce ? 0.5 : rawOpacity;

  const ghostLabel =
    number === undefined || number === null ? "" : String(number);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border scroll-mt-24"
    >
      {/* Ghost number watermark */}
      {ghostLabel && (
        <motion.span
          aria-hidden="true"
          className="font-display font-black select-none pointer-events-none absolute right-0 top-0 z-0"
          style={{
            fontSize: "clamp(8rem, 22vw, 18rem)",
            color: "var(--border)",
            opacity: ghostOpacity,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            y: ghostY,
          }}
        >
          {ghostLabel}
        </motion.span>
      )}

      {/* Header block */}
      <div className={`container-pad relative z-10 pt-20 ${compact ? 'pb-4' : 'pb-12'}`}>
        {ghostLabel && (
          <motion.div
            className="label"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {ghostLabel}
          </motion.div>
        )}

        <RevealHeading
          text={title}
          as="h2"
          className="display-md mt-3"
        />

        {subtitle && (
          <RevealText
            className="text-sm mt-4 max-w-2xl"
            style={{ color: "var(--text-dim)" }}
            delay={0.1}
          >
            {subtitle}
          </RevealText>
        )}

        {/* Accent rule */}
        <motion.div
          className="h-px w-full mt-8 origin-left"
          style={{
            background:
              "linear-gradient(to right, var(--accent), transparent 55%)",
          }}
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={reduce ? undefined : { scaleX: 1 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.8, ease: EASE }}
        />

        {intro && <div className="mt-8">{intro}</div>}
      </div>

      {/* Children area — light in-view group fade */}
      <motion.div
        className="relative z-10"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {contentClassName ? (
          <div className={contentClassName}>{children}</div>
        ) : (
          children
        )}
      </motion.div>
    </section>
  );
}
