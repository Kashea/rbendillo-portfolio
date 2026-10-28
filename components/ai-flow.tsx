"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/components/motion";

const nodes = [
  { label: "Input", sub: "email · doc · chat", x: 20, y: 40 },
  { label: "AI reasoning", sub: "draft + score", x: 220, y: 40 },
  { label: "Confidence / risk gate", sub: "route by threshold", x: 420, y: 40 },
  { label: "Human edit", sub: "edit before send", x: 420, y: 190 },
  { label: "Approve or block", sub: "explicit decision", x: 220, y: 190 },
  { label: "Audit log", sub: "every state recorded", x: 20, y: 190 },
];
const W = 160;
const H = 76;

const paths = [
  "M180 78 H220",
  "M380 78 H420",
  "M500 116 V190",
  "M420 228 H380",
  "M220 228 H180",
];

// Pattern 5: path draw in sequence when in view. Fully readable with motion off.
export function AiFlow() {
  const reduce = useReducedMotion();
  return (
    <figure className="w-full">
      <svg viewBox="0 0 600 300" className="h-auto w-full" role="img" aria-labelledby="ai-flow-title">
        <title id="ai-flow-title">Human-in-the-loop AI approval flow</title>
        <defs>
          <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--accent)" />
          </marker>
        </defs>
        {/* bypass: high confidence, low risk goes straight to approval */}
        <motion.path
          d="M580 78 H592 V288 H300 V272"
          markerEnd="url(#arrow)"
          fill="none"
          stroke="var(--muted)"
          strokeDasharray="3 5"
          strokeWidth={1}
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        />
        {paths.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
            markerEnd="url(#arrow)"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.35, ease, delay: 0.25 + i * 0.3 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g
            key={n.label}
            initial={{ opacity: reduce ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: i * 0.3 }}
          >
            <rect
              x={n.x}
              y={n.y}
              width={W}
              height={H}
              rx={12}
              fill="var(--surface)"
              stroke={i === 2 ? "var(--accent)" : "var(--border)"}
              strokeWidth={i === 2 ? 1.5 : 1}
            />
            <text x={n.x + 14} y={n.y + 22} fill="var(--accent)" fontSize="10" fontFamily="var(--font-geist-mono)">
              {String(i + 1).padStart(2, "0")}
            </text>
            <text x={n.x + 14} y={n.y + 44} fill="var(--text)" fontSize="13" fontWeight="500">
              {n.label}
            </text>
            <text x={n.x + 14} y={n.y + 62} fill="var(--muted)" fontSize="10.5">
              {n.sub}
            </text>
          </motion.g>
        ))}
      </svg>
      <figcaption className="label mt-4">Dashed: high-confidence, low-risk items skip straight to approval</figcaption>
    </figure>
  );
}
