"use client";

import { motion, useReducedMotion } from "motion/react";

export const ease = [0.22, 1, 0.36, 1] as const;

// Pattern 2: fade up once when 20% in view.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// Pattern 1: hero headline lines rise once on load.
export function RiseLines({ lines, accent }: { lines: string[]; accent?: number }) {
  const reduce = useReducedMotion();
  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={i === accent ? "block italic text-accent" : "block"}
            initial={{ y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
