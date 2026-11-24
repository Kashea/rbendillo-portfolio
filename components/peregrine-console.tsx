"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { modules, protocol, projects } from "@/lib/content";
import { ease } from "@/components/motion";

// The Peregrine Console: a radial dial of modules around the Protocol core.
// Each segment is a real link to /module/<slug>, so it works without JavaScript and is crawlable;
// with JavaScript it opens in place and updates the address bar.

const N = modules.length;
const R_OUT = 250;
const R_IN = 168;
const R_LABEL = 209;
const GAP = 1.6; // degrees between segments
const STEP = 360 / N;

const rad = (d: number) => (d * Math.PI) / 180;
// Rounded so server and browser produce identical attributes (their trig differs in the last digit).
const r2 = (n: number) => Math.round(n * 100) / 100;
const pt = (r: number, d: number) => [r2(r * Math.cos(rad(d))), r2(r * Math.sin(rad(d)))] as const;

function sector(a0: number, a1: number) {
  const [x0, y0] = pt(R_OUT, a0);
  const [x1, y1] = pt(R_OUT, a1);
  const [x2, y2] = pt(R_IN, a1);
  const [x3, y3] = pt(R_IN, a0);
  return `M ${x0} ${y0} A ${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${R_IN} ${R_IN} 0 0 0 ${x3} ${y3} Z`;
}

// Label arc: clockwise on the top half, reversed on the bottom half so text stays upright.
function labelArc(a0: number, a1: number) {
  const mid = (a0 + a1) / 2;
  const bottom = mid > 0 && mid < 180;
  const [sx, sy] = pt(R_LABEL, bottom ? a1 : a0);
  const [ex, ey] = pt(R_LABEL, bottom ? a0 : a1);
  return `M ${sx} ${sy} A ${R_LABEL} ${R_LABEL} 0 0 ${bottom ? 0 : 1} ${ex} ${ey}`;
}

// Segment 0 sits centred at the top (−90°).
const segs = modules.map((m, i) => {
  const a0 = -90 - STEP / 2 + i * STEP + GAP / 2;
  const a1 = a0 + STEP - GAP;
  return { m, i, a0, a1, d: sector(a0, a1), arc: labelArc(a0, a1) };
});

const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

type Open = string | null; // module slug, "protocol", or closed

export function PeregrineConsole({ initial = null }: { initial?: Open }) {
  const [open, setOpen] = useState<Open>(initial);
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const router = useRouter();
  const standalone = initial !== null;
  const go = useCallback((next: Open) => {
    // On a /module page, "Return" goes back to the console on the home page.
    if (next === null && standalone) {
      router.push("/#console");
      return;
    }
    setOpen(next);
    const url = next ? `/module/${next}` : "/#console";
    if (window.location.pathname + window.location.hash !== url) window.history.pushState(null, "", url);
  }, [router, standalone]);

  useEffect(() => {
    const onPop = () => {
      const m = window.location.pathname.match(/^\/module\/([^/]+)/);
      setOpen(m ? m[1]! : null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen((o) => (o ? null : o));
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const idx = modules.findIndex((m) => m.slug === open);
  const active = hover ?? (idx >= 0 ? idx : null);
  const coreLabel = active !== null ? modules[active]!.name : "Peregrine Engine";

  return (
    <div className="console-deck relative overflow-hidden rounded-2xl border border-border">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Dial */}
        <div
          className={`relative flex shrink-0 items-center justify-center p-6 transition-[flex-basis] duration-500 ease-out md:p-10 ${
            open ? "md:basis-[44%]" : "md:basis-full"
          }`}
        >
          <svg
            viewBox="-300 -300 600 600"
            className={`w-full transition-[max-width] duration-500 ${open ? "max-w-[420px]" : "max-w-[600px]"}`}
            role="group"
            aria-label="The Peregrine Console: choose a module"
          >
            <defs>
              <radialGradient id="pc-core" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="var(--fire)" stopOpacity="0.55" />
                <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
              </radialGradient>
              <filter id="pc-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Decorative machinery */}
            <g className={reduce ? "" : "pc-spin-slow"} aria-hidden>
              <circle r={286} fill="none" stroke="var(--border)" strokeWidth={1} />
              <circle r={272} fill="none" stroke="var(--accent)" strokeOpacity={0.35} strokeWidth={2} strokeDasharray="2 14 40 14" />
            </g>
            <g className={reduce ? "" : "pc-spin-rev"} aria-hidden>
              {ticks.map((d) => {
                const [x0, y0] = pt(158, d);
                const [x1, y1] = pt(d % 45 === 0 ? 146 : 152, d);
                return <line key={d} x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--muted)" strokeOpacity={0.5} strokeWidth={1.2} />;
              })}
            </g>

            {/* Module segments */}
            {segs.map(({ m, i, d, arc }) => {
              const on = active === i;
              const [nx, ny] = pt(R_OUT - 14, (segs[i]!.a0 + segs[i]!.a1) / 2);
              return (
                <a
                  key={m.slug}
                  href={`/module/${m.slug}`}
                  aria-label={`Open module ${m.label}: ${m.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(m.slug);
                  }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="pc-seg outline-none"
                >
                  <path
                    d={d}
                    fill={on ? "color-mix(in srgb, var(--fire) 22%, var(--raised))" : "var(--raised)"}
                    stroke={on ? "var(--fire)" : "var(--border)"}
                    strokeWidth={on ? 2.5 : 1.2}
                    filter={on ? "url(#pc-glow)" : undefined}
                    className="transition-[fill,stroke] duration-200"
                  />
                  <path id={`pc-arc-${i}`} d={arc} fill="none" stroke="none" />
                  <text className="pc-label" fill={on ? "var(--fire)" : "var(--text)"}>
                    <textPath href={`#pc-arc-${i}`} startOffset="50%" textAnchor="middle" dominantBaseline="middle">
                      {m.name.toUpperCase()}
                    </textPath>
                  </text>
                  <text x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" className="pc-num" fill="var(--accent)">
                    {m.label}
                  </text>
                </a>
              );
            })}

            {/* Core: the Peregrine Protocol. SVG <a>, not next/link: the click opens in place; the href is the no-JS fallback. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/module/protocol"
              aria-label="Open the core: the Peregrine Protocol"
              onClick={(e) => {
                e.preventDefault();
                go("protocol");
              }}
              className="pc-seg outline-none"
            >
              <circle r={128} fill="url(#pc-core)" />
              <circle r={104} fill="var(--surface)" stroke={open === "protocol" ? "var(--fire)" : "var(--accent)"} strokeOpacity={0.8} strokeWidth={2} />
              <circle r={92} fill="none" stroke="var(--fire)" strokeOpacity={0.45} strokeWidth={1} strokeDasharray="3 6" className={reduce ? "" : "pc-spin-rev"} />
              <text y={-30} textAnchor="middle" className="pc-num" fill="var(--fire)">
                RIVAL PEREGRINE
              </text>
              <text y={4} textAnchor="middle" className="pc-core" fill="var(--text)">
                {coreLabel.length > 18 ? coreLabel.split(" ").slice(0, 2).join(" ") : coreLabel}
              </text>
              <text y={34} textAnchor="middle" className="pc-num" fill="var(--muted)">
                {active !== null ? "OPEN MODULE" : "THE PROTOCOL"}
              </text>
            </a>
          </svg>
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key={open}
              initial={{ opacity: 0, x: reduce ? 0 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : 24 }}
              transition={{ duration: 0.35, ease }}
              className="relative min-w-0 flex-1 border-t border-border bg-surface/80 p-6 backdrop-blur md:border-l md:border-t-0 md:p-10"
            >
              <Panel open={open} go={go} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Panel({ open, go }: { open: string; go: (o: Open) => void }) {
  const close = (
    <button
      type="button"
      onClick={() => go(null)}
      className="label inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:border-fire hover:text-fg"
    >
      <X size={13} aria-hidden /> Return
    </button>
  );

  if (open === "protocol") {
    return (
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="label">Core · The method</p>
          {close}
        </div>
        <h3 className="mt-5 font-serif text-3xl tracking-[-0.02em] md:text-4xl">The Peregrine Protocol</h3>
        <p className="mt-3 max-w-[60ch] text-muted">Five stages every build goes through, from first map to the audit trail.</p>
        <ol className="mt-7 grid gap-4">
          {protocol.map((s) => (
            <li key={s.id} className="rounded-xl border border-border bg-raised/60 p-4">
              <p className="label text-fire">
                {s.label} · {s.name}
              </p>
              <p className="mt-1.5">{s.engineering}</p>
              <p className="mt-1 text-sm text-muted">{s.falcon}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const i = modules.findIndex((m) => m.slug === open);
  const m = modules[i];
  if (!m) return null;
  const prev = modules[(i - 1 + N) % N]!;
  const next = modules[(i + 1) % N]!;
  const work = m.work.map((s) => projects.find((p) => p.slug === s)).filter((p) => p !== undefined);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="label">
          Module {m.label} / {String(N).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Previous module: ${prev.title}`}
            onClick={() => go(prev.slug)}
            className="rounded-full border border-border p-1.5 hover:border-fire"
          >
            <ArrowLeft size={14} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Next module: ${next.title}`}
            onClick={() => go(next.slug)}
            className="rounded-full border border-border p-1.5 hover:border-fire"
          >
            <ArrowRight size={14} aria-hidden />
          </button>
          {close}
        </div>
      </div>

      <p className="mt-6 font-mono text-5xl font-bold text-fire/25" aria-hidden>
        {m.label}
      </p>
      <h3 className="-mt-6 font-serif text-3xl tracking-[-0.02em] md:text-4xl">{m.title}</h3>
      <p className="mt-3 max-w-[62ch] text-muted">{m.summary}</p>

      <p className="label mt-7">Proof</p>
      <ul className="mt-3 grid gap-2.5">
        {m.proof.map((x) => (
          <li key={x} className="flex gap-3 rounded-lg border border-border bg-raised/60 px-4 py-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fire" aria-hidden />
            <span>{x}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {m.stack.map((s) => (
          <span key={s} className="rounded-full border border-border px-3 py-1 text-sm text-muted">
            {s}
          </span>
        ))}
      </div>

      {(work.length > 0 || m.link) && (
        <div className="mt-7 flex flex-wrap gap-3">
          {work.map((p) =>
            p.sections?.length ? (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-sm text-bg hover:opacity-90"
              >
                {p.title} case study <ArrowUpRight size={14} aria-hidden />
              </Link>
            ) : null,
          )}
          {m.link && (
            <a
              href={m.link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-fire px-4 py-2 text-sm text-fire hover:bg-fire/10"
            >
              {m.link.label} <ArrowUpRight size={14} aria-hidden />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
