"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { site } from "@/lib/content";
import { ButtonLink, Container } from "@/components/ui";

// three.js only loads in the browser, after the text is on screen.
const HeroScene = dynamic(() => import("@/components/hero-scene"), { ssr: false });

// Start the 3D scene at the first sign of a person (pointer, scroll, touch, key), or once the page has been
// quiet for a few seconds, so three.js never competes with the headline for the first paint.
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

export function Hero() {
  const ready = useSceneReady();
  const [first, accentLine, last] = site.headline;

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-[40svh] md:items-center md:pb-0 md:pt-32">
      <div className="bg-grid absolute inset-0 -z-20" aria-hidden />
      <div className="fade-in absolute inset-0 -z-10" aria-hidden>
        {ready && <HeroScene />}
      </div>
      {/* Keep text readable: fade the scene out under the copy and at the bottom edge. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_45%,var(--bg)_92%)] md:bg-[linear-gradient(90deg,var(--bg)_0%,color-mix(in_srgb,var(--bg)_72%,transparent)_42%,transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-40 bg-[linear-gradient(to_bottom,transparent,var(--bg))] md:block"
        aria-hidden
      />

      <Container>
        <p className="label fade-in mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          <span className="font-semibold text-accent">{site.eyebrow}</span>
          <span aria-hidden>·</span>
          <span>
            {site.role} · {site.location}
          </span>
        </p>

        {/* The headline paints immediately: it is the largest element on the page. */}
        <h1 className="max-w-[17ch] font-serif text-[clamp(2.5rem,6.4vw,5.5rem)] leading-[1.02]">
          <span className="block">{first}</span>
          <span className="block text-accent">{accentLine}</span>
          <span className="block">{last}</span>
        </h1>

        <div className="fade-in" style={{ animationDelay: "0.35s" }}>
          <p className="mt-8 max-w-[56ch] text-lg text-muted">{site.lede}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#work">View the work</ButtonLink>
            <ButtonLink href="#ai" variant="secondary">
              See the Peregrine Protocol
            </ButtonLink>
          </div>

          {/* Stats joined by a cyan trace that ends on a magenta strike node. */}
          <div className="relative mt-14 pt-6">
            <span className="absolute inset-x-0 top-0 h-px bg-border lg:hidden" aria-hidden />
            <span className="trace-x absolute inset-x-0 top-0 hidden h-px lg:block" aria-hidden />
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
              {site.proof.map((p, i) => (
                <div key={p.label} className="relative flex flex-col-reverse">
                  <span
                    className={`absolute -top-[28px] left-0 hidden size-2 rounded-full ring-4 ring-bg lg:block ${
                      i === site.proof.length - 1 ? "bg-strike" : "bg-accent"
                    }`}
                    aria-hidden
                  />
                  <dt className="mt-2 max-w-[24ch] text-sm leading-snug text-muted">{p.label}</dt>
                  <dd className="font-serif text-4xl leading-none">{p.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
