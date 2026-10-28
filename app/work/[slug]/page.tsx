import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/content";
import { ButtonLink, Chip, Container } from "@/components/ui";
import { ProjectVisual, Screenshot } from "@/components/covers";
import { FadeIn, Reveal } from "@/components/motion";

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = caseStudies.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.summary };
}

// params is URL data: read it inside Suspense so the shell stays instant.
// Every slug is still prerendered through generateStaticParams.
export default function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[100svh]" />}>
      <CaseStudy params={params} />
    </Suspense>
  );
}

async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = caseStudies.findIndex((x) => x.slug === slug);
  const p = caseStudies[i];
  if (!p) notFound();
  const next = caseStudies[(i + 1) % caseStudies.length]!;
  const prev = caseStudies[(i - 1 + caseStudies.length) % caseStudies.length]!;

  return (
    <article className="pb-24 pt-32">
      <Container>
        <Link href="/#work" className="label inline-flex items-center gap-2 hover:text-fg">
          <ArrowLeft size={14} aria-hidden /> All work
        </Link>

        <FadeIn className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="label mb-4">{p.kicker}</p>
            <h1 className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] tracking-[-0.03em]">{p.title}</h1>
            <p className="mt-6 max-w-[60ch] text-lg text-muted">{p.summary}</p>
          </div>
          <dl className="grid h-fit grid-cols-2 gap-6 border-t border-border pt-6 lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <dt className="label">Role</dt>
              <dd className="mt-1">{p.role}</dd>
            </div>
            <div>
              <dt className="label">Year</dt>
              <dd className="mt-1">{p.year}</dd>
            </div>
            {p.status && (
              <div>
                <dt className="label">Status</dt>
                <dd className="mt-1 text-accent">{p.status}</dd>
              </div>
            )}
            {p.url && (
              <div>
                <ButtonLink href={p.url} variant="secondary" external>
                  Visit site
                </ButtonLink>
              </div>
            )}
          </dl>
        </FadeIn>

        <FadeIn
          delay={0.15}
          className="mt-14 aspect-[16/9] rounded-[18px] border border-border bg-[radial-gradient(120%_80%_at_80%_0%,color-mix(in_oklch,var(--accent)_18%,transparent),transparent_60%)] bg-surface p-4 sm:p-10"
        >
          <ProjectVisual project={p} priority sizes="(min-width: 1200px) 1100px, 100vw" />
        </FadeIn>
        <p className="label mt-3">{p.image ? p.imageNote : "Illustrative interface. Sample data only."}</p>

        {p.gallery && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {p.gallery.map((g) => (
              <Reveal key={g.src} className="aspect-[16/9] rounded-[14px] border border-border bg-surface p-3 sm:p-5">
                <Screenshot shot={g} sizes="(min-width: 1200px) 540px, (min-width: 640px) 50vw, 100vw" />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <p className="label mb-3">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
          </aside>
          <div className="space-y-14 lg:col-span-8">
            {p.sections?.map((s) => (
              <Reveal key={s.heading}>
                <section>
                  <h2 className="font-serif text-3xl tracking-[-0.01em]">{s.heading}</h2>
                  {s.bullets && (
                    <ul className="mt-5 grid gap-3">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-4">
                          <span className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" aria-hidden />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.body && <p className="mt-5 text-muted">{s.body}</p>}
                </section>
              </Reveal>
            ))}
          </div>
        </div>

        <nav aria-label="More case studies" className="mt-24 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
          <Link href={`/work/${prev.slug}`} className="group rounded-[14px] border border-border p-6 hover:border-fg/25">
            <p className="label flex items-center gap-2">
              <ArrowLeft size={14} aria-hidden /> Previous
            </p>
            <p className="mt-2 font-serif text-2xl">{prev.title}</p>
          </Link>
          <Link href={`/work/${next.slug}`} className="group rounded-[14px] border border-border p-6 text-right hover:border-fg/25">
            <p className="label flex items-center justify-end gap-2">
              Next <ArrowRight size={14} aria-hidden />
            </p>
            <p className="mt-2 font-serif text-2xl">{next.title}</p>
          </Link>
        </nav>
      </Container>
    </article>
  );
}
