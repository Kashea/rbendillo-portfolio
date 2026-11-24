"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Download,
  GraduationCap,
  Mail,
  Route,
  Send,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import {
  capabilities,
  education,
  experience,
  featured,
  modules,
  projects,
  protocol,
  site,
  skills,
} from "@/lib/content";
import { lessons } from "@/lib/lessons";
import type { FalconPhase, Stage } from "./falcon-scene";

const FalconScene = dynamic(() => import("./falcon-scene"), { ssr: false });

// ---------------------------------------------------------------------------
// Reactor geometry (SVG, viewBox −300..300). Rounded so server and browser agree.
// ---------------------------------------------------------------------------
const N = modules.length;
const R_OUT = 246;
const R_IN = 170;
const R_LABEL = 208;
const GAP = 1.4;
const STEP = 360 / N;
const r2 = (n: number) => Math.round(n * 100) / 100;
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (r: number, d: number) => [r2(r * Math.cos(rad(d))), r2(r * Math.sin(rad(d)))] as const;

function sector(a0: number, a1: number, ro = R_OUT, ri = R_IN) {
  const [x0, y0] = pt(ro, a0);
  const [x1, y1] = pt(ro, a1);
  const [x2, y2] = pt(ri, a1);
  const [x3, y3] = pt(ri, a0);
  return `M ${x0} ${y0} A ${ro} ${ro} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${ri} ${ri} 0 0 0 ${x3} ${y3} Z`;
}
function arcPath(r: number, a0: number, a1: number) {
  const mid = (a0 + a1) / 2;
  const bottom = mid > 0 && mid < 180;
  const [sx, sy] = pt(r, bottom ? a1 : a0);
  const [ex, ey] = pt(r, bottom ? a0 : a1);
  return `M ${sx} ${sy} A ${r} ${r} 0 0 ${bottom ? 0 : 1} ${ex} ${ey}`;
}
const segs = modules.map((m, i) => {
  const a0 = -90 - STEP / 2 + i * STEP + GAP / 2;
  const a1 = a0 + STEP - GAP;
  return { m, i, a0, a1, d: sector(a0, a1), arc: arcPath(R_LABEL, a0, a1), mid: (a0 + a1) / 2 };
});
const ticks = Array.from({ length: 120 }, (_, i) => i * 3);
const bolts = Array.from({ length: 16 }, (_, i) => i * 22.5 + 11.25);
// Outer telemetry: real numbers only.
const telemetry = ["TESTS 40/40", "FLOWS 27", "RUNBOOKS 15", "IT YEARS 15"];

// ---------------------------------------------------------------------------
type Dock = "highlights" | "work" | "experience" | "toolkit" | "credentials" | "contact";
type Open = string | null; // module slug | "protocol" | `dock:${Dock}`

const dock: { id: Dock; label: string; icon: typeof Sparkles }[] = [
  { id: "highlights", label: "Highlights", icon: Sparkles },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "experience", label: "Flight path", icon: Route },
  { id: "toolkit", label: "Toolkit", icon: Wrench },
  { id: "credentials", label: "Credentials", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Send },
];

// Modules get a shareable address; dock panels stay on the home page.
function setUrl(next: Open) {
  const url = next && !next.startsWith("dock:") ? `/module/${next}` : "/";
  if (window.location.pathname !== url) window.history.pushState(null, "", url);
}

const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

// Start three.js at the first sign of a person, or after the page has been quiet, so it never delays the first paint.
function useSceneReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const events = ["pointermove", "scroll", "touchstart", "keydown"] as const;
    const go = () => {
      if (done) return;
      done = true;
      setReady(true);
      events.forEach((e) => window.removeEventListener(e, go));
    };
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const idle = () => ("requestIdleCallback" in window ? window.requestIdleCallback(go, { timeout: 1500 }) : go());
    const timer = window.setTimeout(idle, 6000);
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, go));
    };
  }, []);
  return ready;
}

export function CommandDeck({ initial = null }: { initial?: Open }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const ready = useSceneReady();
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.classList.contains("dark"), () => false);
  const still = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCE).matches, () => false);

  const [open, setOpen] = useState<Open>(initial);
  const [hover, setHover] = useState<number | null>(null);
  const [phase, setPhase] = useState<FalconPhase>("orbit");
  const [flash, setFlash] = useState(0);
  const [stage, setStage] = useState<Stage>({ x: 0, y: 0, r: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<SVGSVGElement>(null);
  const timers = useRef<number[]>([]);
  const standalone = initial !== null;

  // Track where the dial sits inside the stage, so the falcon flies around it wherever it moves.
  useEffect(() => {
    const s = stageRef.current;
    const d = dialRef.current;
    if (!s || !d) return;
    let raf = 0;
    const measure = () => {
      const a = s.getBoundingClientRect();
      const b = d.getBoundingClientRect();
      setStage({ x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2, r: (b.width / 600) * R_OUT });
    };
    // Follow the dial during its slide (CSS transition), then settle.
    const follow = (ms: number) => {
      const end = performance.now() + ms;
      const tick = () => {
        measure();
        if (performance.now() < end) raf = requestAnimationFrame(tick);
      };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(() => follow(700));
    ro.observe(s);
    ro.observe(d);
    d.addEventListener("transitionrun", () => follow(800));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const t = timers.current;
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
      t.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Choose a module: the falcon stoops into the reactor core, the core flares, the panel opens and the falcon bursts back out.
  const select = useCallback(
    (next: Open) => {
      if (next === null) {
        if (standalone) {
          router.push("/");
          return;
        }
        setOpen(null);
        setUrl(null);
        return;
      }
      timers.current.forEach((id) => window.clearTimeout(id));
      const animate = ready && !still && !reduce;
      if (!animate) {
        setOpen(next);
        setUrl(next);
        return;
      }
      setPhase("dive");
      timers.current = [
        window.setTimeout(() => {
          setFlash((f) => f + 1);
          setOpen(next);
          setUrl(next);
          setPhase("emerge");
        }, 820),
        window.setTimeout(() => setPhase("orbit"), 2000),
      ];
    },
    [ready, still, reduce, router, standalone],
  );

  const idx = modules.findIndex((m) => m.slug === open);
  const active = hover ?? (idx >= 0 ? idx : null);
  const coreTitle = active !== null ? modules[active]!.name : open === "protocol" ? "Protocol" : "Rival Peregrine";
  const isOpen = open !== null;

  return (
    <section id="deck" className="jv-deck relative isolate overflow-hidden pt-16">
      <div className="jv-bg absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[minmax(0,1fr)] gap-4 px-[clamp(1rem,2.5vw,2rem)] pb-4 pt-4 lg:h-[calc(100svh-4rem)] lg:min-h-[640px] lg:grid-cols-[340px_1fr] lg:grid-rows-[1fr_auto]">
        {/* ---------------- Identity panel ---------------- */}
        <aside className="jv-panel jv-corners relative flex min-w-0 flex-col overflow-hidden p-6 lg:row-span-1">
          <p className="jv-mono flex items-center gap-2 text-[0.7rem] text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            PILOT PROFILE · ONLINE
          </p>
          <p className="jv-mono mt-5 text-[0.7rem] text-fire">{site.eyebrow}</p>
          <h1 className="mt-2 font-serif text-[clamp(2rem,3.1vw,2.6rem)] leading-[1.02] tracking-[-0.02em]">
            {site.headline[0]} <span className="text-accent">{site.headline[1]}</span> {site.headline[2]}
          </h1>
          <p className="mt-3 text-sm font-semibold">
            {site.short} <span className="text-muted">· {site.role}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{site.lede}</p>

          <dl className="mt-5 grid grid-cols-2 gap-2">
            {site.proof.map((p) => (
              <div key={p.label} className="jv-stat">
                <dd className="font-serif text-2xl leading-none text-fg">{p.value}</dd>
                <dt className="mt-1 text-[0.68rem] leading-snug text-muted">{p.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <a href={site.cv} download className="jv-btn jv-btn-primary">
              <Download size={14} aria-hidden /> Download CV
            </a>
            <button type="button" onClick={() => select("dock:contact")} className="jv-btn">
              <Mail size={14} aria-hidden /> Let&apos;s talk
            </button>
          </div>
        </aside>

        {/* ---------------- Stage: reactor, falcon, panel ---------------- */}
        <div ref={stageRef} className="jv-panel jv-corners relative min-h-[560px] min-w-0 overflow-hidden lg:min-h-0">
          <div className="jv-mono pointer-events-none absolute inset-x-4 top-3 z-20 flex justify-between text-[0.66rem] text-muted">
            <span>
              RP-OS · <span className="text-accent">COMMAND DECK</span>
            </span>
            <span className="hidden sm:inline">
              SYS <span className="text-accent">●</span> NOMINAL · HUMAN ON THE TRIGGER
            </span>
          </div>

          <div className="jv-mono pointer-events-none absolute inset-x-4 bottom-3 z-20 hidden justify-between text-[0.62rem] text-muted sm:flex" aria-hidden>
            {telemetry.map((x) => (
              <span key={x}>
                <span className="text-fire">▸</span> {x}
              </span>
            ))}
          </div>

          {/* Radar sweep behind the reactor */}
          <div
            className={`jv-sweep pointer-events-none absolute top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 transition-[left,width] duration-700 ${
              isOpen ? "left-[50%] w-[92%] lg:left-[27%] lg:w-[50%]" : "left-1/2 w-[92%] lg:w-[min(78%,88vh)]"
            }`}
            aria-hidden
          />

          {/* The reactor dial */}
          <svg
            ref={dialRef}
            viewBox="-300 -300 600 600"
            role="group"
            aria-label="Rival Peregrine reactor: choose a module"
            className={`absolute top-1/2 z-10 aspect-square -translate-x-1/2 -translate-y-1/2 transition-[left,width] duration-700 ease-out ${
              isOpen
                ? "left-1/2 w-[92%] max-lg:top-[33%] lg:left-[27%] lg:w-[min(50%,74vh)]"
                : "left-1/2 w-[92%] max-lg:top-1/2 lg:w-[min(74%,78vh)]"
            }`}
          >
            <defs>
              <radialGradient id="jv-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.95" />
                <stop offset="30%" stopColor="var(--fire)" stopOpacity="0.75" />
                <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="jv-plate" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--jv-plate-hi)" />
                <stop offset="55%" stopColor="var(--jv-plate)" />
                <stop offset="100%" stopColor="var(--jv-plate-lo)" />
              </linearGradient>
              <linearGradient id="jv-plate-on" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="color-mix(in srgb, var(--fire) 55%, var(--jv-plate-hi))" />
                <stop offset="100%" stopColor="color-mix(in srgb, var(--fire) 25%, var(--jv-plate-lo))" />
              </linearGradient>
              <filter id="jv-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="jv-hex" width="14" height="24.25" patternUnits="userSpaceOnUse" patternTransform="scale(0.7)">
                <path d="M7 0 L14 4 L14 12 L7 16 L0 12 L0 4 Z M7 16 L7 24.25" fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Outer housing */}
            <circle r={292} fill="none" stroke="var(--border)" strokeWidth={1} />
            <g className={reduce ? "" : "jv-spin-80"} aria-hidden>
              <circle r={282} fill="none" stroke="var(--accent)" strokeOpacity={0.5} strokeWidth={2.5} strokeDasharray="60 10 4 10 20 26" />
            </g>
            <g className={reduce ? "" : "jv-spin-rev-120"} aria-hidden>
              {ticks.map((d) => {
                const long = d % 30 === 0;
                const [x0, y0] = pt(272, d);
                const [x1, y1] = pt(long ? 258 : 265, d);
                return <line key={d} x1={x0} y1={y0} x2={x1} y2={y1} stroke={long ? "var(--fire)" : "var(--muted)"} strokeOpacity={long ? 0.9 : 0.45} strokeWidth={long ? 2 : 1} />;
              })}
            </g>
            {bolts.map((d) => {
              const [x, y] = pt(254, d);
              return <circle key={d} cx={x} cy={y} r={2.2} fill="var(--muted)" fillOpacity={0.5} aria-hidden />;
            })}

            {/* Module ring */}
            {segs.map(({ m, i, d, arc, mid }) => {
              const on = active === i;
              const [nx, ny] = pt(R_IN + 14, mid);
              const [lx, ly] = pt(R_OUT + 4, mid);
              // SVG link: the click opens in place; the href is the no-JS fallback.
              return (
                <a
                  key={m.slug}
                  href={`/module/${m.slug}`}
                  aria-label={`${m.name.toUpperCase()} ${m.label}: open module, ${m.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    select(m.slug);
                  }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="jv-seg outline-none"
                  style={{ transformOrigin: "0 0", transform: on ? `translate(${r2(Math.cos(rad(mid)) * 6)}px, ${r2(Math.sin(rad(mid)) * 6)}px)` : undefined }}
                >
                  <path d={d} fill={on ? "url(#jv-plate-on)" : "url(#jv-plate)"} stroke={on ? "var(--fire)" : "var(--jv-edge)"} strokeWidth={on ? 2.5 : 1.2} filter={on ? "url(#jv-glow)" : undefined} />
                  <path d={sector(segs[i]!.a0 + 1.5, segs[i]!.a1 - 1.5, R_OUT - 5, R_OUT - 9)} fill={on ? "var(--fire)" : "var(--accent)"} fillOpacity={on ? 0.95 : 0.35} />
                  <path id={`jv-arc-${i}`} d={arc} fill="none" stroke="none" />
                  <text className="jv-label" fill={on ? "#fff3d1" : "var(--text)"}>
                    <textPath href={`#jv-arc-${i}`} startOffset="50%" textAnchor="middle" dominantBaseline="middle">
                      {m.name.toUpperCase()}
                    </textPath>
                  </text>
                  <text x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" className="jv-num" fill={on ? "var(--fire)" : "var(--accent)"}>
                    {m.label}
                  </text>
                  {on && <circle cx={lx} cy={ly} r={4} fill="var(--fire)" filter="url(#jv-glow)" />}
                </a>
              );
            })}

            {/* Inner machinery */}
            <g className={reduce ? "" : "jv-spin-rev-60"} aria-hidden>
              <circle r={160} fill="none" stroke="var(--accent)" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="2 6" />
              {Array.from({ length: 12 }, (_, i) => {
                const [x0, y0] = pt(150, i * 30);
                const [x1, y1] = pt(138, i * 30);
                return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--accent)" strokeOpacity={0.7} strokeWidth={2} />;
              })}
            </g>
            <g className={reduce ? "" : "jv-spin-40"} aria-hidden>
              <path d={sector(-80, 10, 132, 126)} fill="var(--fire)" fillOpacity={0.6} />
              <path d={sector(100, 190, 132, 126)} fill="var(--accent)" fillOpacity={0.5} />
              <path d={sector(220, 250, 132, 126)} fill="var(--fire)" fillOpacity={0.4} />
            </g>

            {/* Core */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- SVG link; the click opens in place */}
            <a
              href="/module/protocol"
              aria-label="Open the core: the Peregrine Protocol"
              onClick={(e) => {
                e.preventDefault();
                select("protocol");
              }}
              className="jv-seg outline-none"
            >
              <circle r={118} fill="var(--jv-core-bg)" stroke="var(--jv-edge)" strokeWidth={1.5} />
              <circle r={112} fill="url(#jv-hex)" />
              <circle key={flash} r={110} fill="url(#jv-core)" className={flash ? "jv-flare" : "jv-breathe"} />
              <circle r={70} fill="none" stroke="var(--fire)" strokeOpacity={0.55} strokeWidth={1} strokeDasharray="3 5" className={reduce ? "" : "jv-spin-40"} />
              <text y={-26} textAnchor="middle" className="jv-num" fill="var(--fire)">
                {active !== null ? `MODULE ${modules[active]!.label}` : "CORE"}
              </text>
              <text y={6} textAnchor="middle" className="jv-core" fill="var(--text)">
                {coreTitle}
              </text>
              <text y={32} textAnchor="middle" className="jv-num" fill="var(--muted)">
                {active !== null ? "ENGAGE" : "THE PROTOCOL"}
              </text>
            </a>
          </svg>

          {/* The falcon, over the reactor */}
          <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
            {ready && stage.r > 0 && <FalconScene dark={dark} phase={phase} stage={{ ...stage, compact: isOpen }} still={still} />}
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                key={open}
                initial={{ opacity: 0, x: reduce ? 0 : 60, filter: reduce ? "none" : "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: reduce ? 0 : 30 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="jv-glass absolute inset-x-3 bottom-3 top-[64%] z-30 overflow-y-auto p-5 lg:inset-y-10 lg:left-auto lg:right-4 lg:top-10 lg:w-[52%] lg:p-7"
              >
                <Panel open={open} select={select} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------------- Dock ---------------- */}
        <nav aria-label="Command deck" className="jv-panel relative min-w-0 lg:col-span-2">
          <ul className="flex gap-1 overflow-x-auto p-1.5 lg:justify-center">
            {dock.map(({ id, label, icon: Icon }) => {
              const on = open === `dock:${id}`;
              return (
                <li key={id} className="shrink-0">
                  <button type="button" onClick={() => select(on ? null : `dock:${id}`)} className={`jv-dock ${on ? "jv-dock-on" : ""}`} aria-pressed={on}>
                    <Icon size={14} aria-hidden /> {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------------
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function Head({ kicker, title, select, nav }: { kicker: string; title: string; select: (o: Open) => void; nav?: [Open, Open] }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="jv-mono text-[0.7rem] text-accent">{kicker}</p>
        <div className="flex items-center gap-1.5">
          {nav && (
            <>
              <button type="button" aria-label="Previous" onClick={() => select(nav[0])} className="jv-icon">
                <ArrowLeft size={14} aria-hidden />
              </button>
              <button type="button" aria-label="Next" onClick={() => select(nav[1])} className="jv-icon">
                <ArrowRight size={14} aria-hidden />
              </button>
            </>
          )}
          <button type="button" onClick={() => select(null)} className="jv-btn !py-1.5">
            <X size={13} aria-hidden /> Return
          </button>
        </div>
      </div>
      <h2 className="mt-4 font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.05] tracking-[-0.02em]">{title}</h2>
    </>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <motion.ul variants={stagger} initial="hidden" animate="show" className="mt-5 grid gap-2.5">
      {children}
    </motion.ul>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return (
    <motion.li variants={item} className="jv-row">
      {children}
    </motion.li>
  );
}

function Panel({ open, select }: { open: string; select: (o: Open) => void }) {
  if (open === "protocol") {
    return (
      <div>
        <Head kicker="CORE · THE METHOD" title="The Peregrine Protocol" select={select} />
        <p className="mt-2 text-muted">Five stages every build goes through, from first map to the audit trail.</p>
        <List>
          {protocol.map((s) => (
            <Row key={s.id}>
              <p className="jv-mono text-[0.7rem] text-fire">
                {s.label} · {s.name.toUpperCase()}
              </p>
              <p className="mt-1">{s.engineering}</p>
            </Row>
          ))}
        </List>
      </div>
    );
  }

  if (open.startsWith("dock:")) return <DockPanel id={open.slice(5) as Dock} select={select} />;

  const i = modules.findIndex((m) => m.slug === open);
  const m = modules[i];
  if (!m) return null;
  const prev = modules[(i - 1 + N) % N]!.slug;
  const next = modules[(i + 1) % N]!.slug;
  const work = m.work.map((s) => projects.find((p) => p.slug === s)).filter((p) => p?.sections?.length);
  return (
    <div>
      <Head kicker={`MODULE ${m.label} / ${String(N).padStart(2, "0")} · ${m.name.toUpperCase()}`} title={m.title} select={select} nav={[prev, next]} />
      <p className="mt-2 text-muted">{m.summary}</p>
      {m.slug === "teaching" && (
        <>
          <p className="jv-mono mt-6 text-[0.7rem] text-muted">LATEST LESSONS</p>
          <List>
            {lessons.slice(0, 4).map((l) => (
              <Row key={l.url}>
                <a href={l.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-3">
                  <span>
                    <span className="jv-mono block text-[0.66rem] text-fire">
                      {l.day ? `DAY ${l.day}/100` : "REEL"} · {l.date}
                    </span>
                    <span className="mt-0.5 block group-hover:text-fire">{l.title}</span>
                  </span>
                  <ArrowUpRight size={15} className="mt-1 shrink-0 text-muted group-hover:text-fire" aria-hidden />
                </a>
              </Row>
            ))}
          </List>
        </>
      )}
      <p className="jv-mono mt-6 text-[0.7rem] text-muted">PROOF</p>
      <List>
        {m.proof.map((x) => (
          <Row key={x}>
            <span className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fire" aria-hidden />
              {x}
            </span>
          </Row>
        ))}
      </List>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {m.stack.map((s) => (
          <span key={s} className="jv-chip">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {work.map((p) => (
          <Link key={p!.slug} href={`/work/${p!.slug}`} className="jv-btn jv-btn-primary">
            {p!.title} case study <ArrowUpRight size={14} aria-hidden />
          </Link>
        ))}
        {m.link && (
          <a href={m.link.href} target="_blank" rel="noreferrer" className="jv-btn">
            {m.link.label} <ArrowUpRight size={14} aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}

function DockPanel({ id, select }: { id: Dock; select: (o: Open) => void }) {
  if (id === "highlights")
    return (
      <div>
        <Head kicker="DOCK · HIGHLIGHTS" title="Career highlights" select={select} />
        <List>
          {site.proof.map((p) => (
            <Row key={p.label}>
              <p className="font-serif text-3xl leading-none text-fire">{p.value}</p>
              <p className="mt-1 text-sm text-muted">{p.label}</p>
            </Row>
          ))}
          {capabilities.slice(0, 4).map((c) => (
            <Row key={c.area}>
              <p className="jv-mono text-[0.7rem] text-accent">{c.area.toUpperCase()}</p>
              <p className="mt-1 text-sm">{c.proof.join(" · ")}</p>
            </Row>
          ))}
        </List>
      </div>
    );
  if (id === "work")
    return (
      <div>
        <Head kicker="DOCK · WORK" title="Selected work" select={select} />
        <List>
          {featured.map((p) => (
            <Row key={p.slug}>
              <p className="jv-mono text-[0.7rem] text-accent">{p.kicker.toUpperCase()}</p>
              <p className="mt-1 font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-muted">{p.summary}</p>
              {p.sections?.length ? (
                <Link href={`/work/${p.slug}`} className="mt-2 inline-flex items-center gap-1 text-sm text-fire hover:underline">
                  Open case study <ArrowUpRight size={13} aria-hidden />
                </Link>
              ) : null}
            </Row>
          ))}
        </List>
      </div>
    );
  if (id === "experience")
    return (
      <div>
        <Head kicker="DOCK · FLIGHT PATH" title="Experience" select={select} />
        <List>
          {experience.map((r) => (
            <Row key={r.org + r.role}>
              <p className="jv-mono text-[0.7rem] text-muted">{r.dates}</p>
              <p className="mt-1 font-semibold">
                {r.role} <span className="text-muted">· {r.org}</span>
              </p>
              {r.bullets[0] && <p className="mt-1 text-sm text-muted">{r.bullets[0]}</p>}
            </Row>
          ))}
        </List>
      </div>
    );
  if (id === "toolkit")
    return (
      <div>
        <Head kicker="DOCK · TOOLKIT" title="Tools and technology" select={select} />
        <List>
          {skills.map((g) => (
            <Row key={g.group}>
              <p className="jv-mono text-[0.7rem] text-accent">{g.group.toUpperCase()}</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {g.items.map((s) => (
                  <span key={s} className="jv-tile">
                    {s}
                  </span>
                ))}
              </div>
            </Row>
          ))}
        </List>
      </div>
    );
  if (id === "credentials")
    return (
      <div>
        <Head kicker="DOCK · CREDENTIALS" title="Education and foundations" select={select} />
        <List>
          {education.map((e) => (
            <Row key={e.title}>
              <p className="jv-mono text-[0.7rem] text-muted">{e.dates}</p>
              <p className="mt-1 font-semibold">{e.title}</p>
              <p className="text-sm text-muted">{e.org}</p>
            </Row>
          ))}
          <Row>
            <p className="jv-mono text-[0.7rem] text-accent">FOUNDATIONS</p>
            <p className="mt-1 text-sm">{capabilities.find((c) => c.area === "Foundations")?.proof.join(" · ")}</p>
          </Row>
        </List>
      </div>
    );
  return (
    <div>
      <Head kicker="DOCK · CONTACT" title="Open a channel" select={select} />
      <p className="mt-2 text-muted">{site.availability}</p>
      <List>
        <Row>
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-fire">
            <Mail size={15} aria-hidden /> {site.email}
          </a>
        </Row>
        <Row>
          <a href={`https://${site.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-fire">
            <ArrowUpRight size={15} aria-hidden /> {site.github}
          </a>
        </Row>
        <Row>
          <a href={site.cv} download className="flex items-center gap-2 hover:text-fire">
            <Download size={15} aria-hidden /> Download CV (PDF)
          </a>
        </Row>
      </List>
    </div>
  );
}
