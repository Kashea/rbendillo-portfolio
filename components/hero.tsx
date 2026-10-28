"use client";

import dynamic from "next/dynamic";
import { site } from "@/lib/content";
import { ButtonLink, Container } from "@/components/ui";
import { FadeIn, RiseLines } from "@/components/motion";

// three.js only loads in the browser, after the text is on screen.
const HeroScene = dynamic(() => import("@/components/hero-scene"), { ssr: false });

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 md:items-center md:pb-0">
      <div className="bg-grid absolute inset-0 -z-20" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 top-[30%] -z-10 opacity-90 md:top-[18%]" aria-hidden>
        <HeroScene />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--bg)_8%,transparent_45%,transparent_70%,var(--bg))]"
        aria-hidden
      />

      <Container>
        <FadeIn>
          <p className="label mb-6 flex items-center gap-3">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {site.role} · {site.location}
          </p>
        </FadeIn>

        <h1 className="max-w-[16ch] font-serif text-[clamp(2.75rem,7vw,6rem)] leading-[1.02] tracking-[-0.03em]">
          <RiseLines lines={site.headline} accent={1} />
        </h1>

        <FadeIn delay={0.5}>
          <p className="mt-8 max-w-[56ch] text-lg text-muted">{site.lede}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#work">View selected work</ButtonLink>
            <ButtonLink href={site.cv} variant="secondary" download>
              Download CV
            </ButtonLink>
          </div>
          <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6">
            {site.proof.map((p, i) => (
              <li key={p} className="label flex items-center gap-6">
                {i > 0 && <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />}
                {p}
              </li>
            ))}
          </ul>
        </FadeIn>
      </Container>
    </section>
  );
}
