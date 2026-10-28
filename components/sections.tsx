import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, FileText } from "lucide-react";
import { about, earlier, education, experience, featured, listed, site, skills, type Role } from "@/lib/content";
import { ButtonLink, Chip, Container, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { ProjectCard } from "@/components/project-card";
import { AiFlow } from "@/components/ai-flow";
import { CopyEmail } from "@/components/copy-email";

const pad = "py-[clamp(5rem,12vw,9rem)]";

export function Work() {
  const [lead, ...rest] = featured;
  return (
    <section id="work" className={pad}>
      <Container>
        <SectionHeader
          index="01"
          title={
            <>
              Selected <em className="text-accent">work</em>
            </>
          }
          lede="Live client systems first. Each one has a short case study with what I built and why, and no invented numbers."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {lead && (
            <Reveal className="lg:col-span-3">
              <ProjectCard project={lead} wide />
            </Reveal>
          )}
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <h3 className="label mb-4">More builds</h3>
          <ul className="border-t border-border">
            {listed.map((p) => (
              <li key={p.slug} className="border-b border-border">
                <a
                  href={p.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 sm:grid-cols-[1.2fr_1.5fr_auto_auto]"
                >
                  <span className="text-lg font-medium">{p.title}</span>
                  <span className="hidden text-muted sm:block">{p.role}</span>
                  <span className="label hidden sm:block">{p.year}</span>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.5}
                    className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                  <span className="col-span-2 text-sm text-muted sm:hidden">{p.role}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

export function Ai() {
  return (
    <section id="ai" className={`${pad} border-y border-border bg-surface`}>
      <Container>
        <SectionHeader
          index="02"
          title={
            <>
              AI that <em className="text-accent">asks first</em>
            </>
          }
        />
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="text-lg">
              Every AI result carries a confidence and risk score. Safe, certain items move quickly. Anything else stops at a
              person, who can edit, approve or block it, and every state is written to an audit trail.
            </p>
            <p className="mt-5 text-muted">
              I use this pattern in n8n and Microsoft Teams automations, and inside Rigsafe, where AI drafts tenders from their
              documents and flags imported data for review instead of trusting it.
            </p>
            <ol className="sr-only">
              <li>Input arrives by email, document or chat.</li>
              <li>AI reasons and drafts, with a confidence and risk score.</li>
              <li>A gate routes by threshold.</li>
              <li>A human edits before sending.</li>
              <li>The human approves or blocks.</li>
              <li>Every state is written to an audit log.</li>
            </ol>
            <div className="mt-8 flex flex-wrap gap-1.5">
              {["Claude", "n8n", "Power Automate", "Microsoft Teams", "Entra ID"].map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </Reveal>
          <Reveal className="rounded-[14px] border border-border bg-bg p-5 sm:p-8 lg:col-span-7" delay={0.1}>
            <AiFlow />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function RoleItem({ r }: { r: Role }) {
  return (
    <li className="relative grid gap-2 pb-12 pl-8 md:grid-cols-12 md:gap-8 md:pl-0">
      <span className="absolute left-0 top-2.5 size-[9px] -translate-x-[4px] rounded-full border border-accent bg-bg md:left-[calc(25%-4px)] md:translate-x-0" />
      <p className="label pt-1 md:col-span-3 md:pr-10 md:text-right">{r.dates}</p>
      <div className="md:col-span-9 md:pl-8">
        <h3 className="text-xl font-medium">{r.role}</h3>
        <p className="text-muted">{r.org}</p>
        <ul className="mt-4 grid gap-2 text-[0.97rem] text-muted">
          {r.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-[0.75em] h-px w-3 shrink-0 bg-border" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Experience() {
  return (
    <section id="experience" className={pad}>
      <Container>
        <SectionHeader
          index="03"
          title={
            <>
              From infrastructure <em className="text-accent">to AI</em>
            </>
          }
          lede="Fifteen years across enterprise support, networks and cloud, then full-stack delivery and AI engineering."
        />
        <Reveal>
          <ol className="relative before:absolute before:bottom-12 before:left-0 before:top-3 before:w-px before:bg-border md:before:left-1/4">
            {experience.map((r) => (
              <RoleItem key={r.role + r.org} r={r} />
            ))}
          </ol>
          <details className="group rounded-[14px] border border-border bg-surface md:ml-[25%]">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-6 font-medium [&::-webkit-details-marker]:hidden">
              Earlier career in infrastructure and support
              <span className="text-xl text-muted transition-transform group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <ul className="grid gap-6 border-t border-border px-6 py-6">
              {earlier.map((r) => (
                <li key={r.org}>
                  <p className="label">{r.dates}</p>
                  <p className="mt-1 font-medium">
                    {r.role} <span className="font-normal text-muted">· {r.org}</span>
                  </p>
                  <p className="mt-1 text-[0.95rem] text-muted">{r.bullets[0]}</p>
                </li>
              ))}
            </ul>
          </details>
        </Reveal>
      </Container>
    </section>
  );
}

export function Stack() {
  return (
    <section id="stack" className={`${pad} border-t border-border`}>
      <Container>
        <SectionHeader
          index="04"
          title={
            <>
              The <em className="text-accent">toolkit</em>
            </>
          }
          lede="Consolidated from shipped work. No skill bars, just what I have used in production."
        />
        <div className="grid border-t border-border">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.03}>
              <div className="grid gap-4 border-b border-border py-6 md:grid-cols-12">
                <h3 className="font-medium md:col-span-3">{g.group}</h3>
                <div className="flex flex-wrap gap-2 md:col-span-9">
                  {g.items.map((s) => (
                    <Chip key={s} className="text-fg/85">
                      {s}
                    </Chip>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {education.map((e) => (
            <div key={e.title} className="rounded-[14px] border border-border p-5">
              <p className="label">{e.dates}</p>
              <p className="mt-1 font-medium">{e.title}</p>
              <p className="text-sm text-muted">{e.org}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className={`${pad} border-t border-border`}>
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label mb-4">
            <span className="text-accent">05</span> /
          </p>
          <h2 className="font-serif text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.02em]">
            Reliability is <em className="text-accent">the feature</em>
          </h2>
        </div>
        <Reveal className="space-y-5 text-lg lg:col-span-7">
          {about.map((p, i) => (
            <p key={i} className={i === 0 ? "" : "text-muted"}>
              {p}
            </p>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className={`${pad} border-t border-border`}>
      <Container>
        <Reveal>
          <p className="label mb-6">
            <span className="text-accent">06</span> / Contact
          </p>
          <h2 className="max-w-[14ch] font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] tracking-[-0.03em]">
            Have a system that needs <em className="text-accent">building?</em>
          </h2>
          <div className="mt-12 grid gap-8 border-t border-border pt-10 md:grid-cols-3">
            <div>
              <p className="label mb-3 flex items-center gap-2">
                <Mail size={14} strokeWidth={1.5} aria-hidden /> Email
              </p>
              <CopyEmail email={site.email} />
            </div>
            <div>
              <p className="label mb-3 flex items-center gap-2">
                <MapPin size={14} strokeWidth={1.5} aria-hidden /> Based in
              </p>
              <p>{site.location}</p>
              <p className="text-muted">{site.availability}</p>
            </div>
            <div>
              <p className="label mb-3 flex items-center gap-2">
                <FileText size={14} strokeWidth={1.5} aria-hidden /> Résumé
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={site.cv} download>
                  Download CV
                </ButtonLink>
                <Link href="/work/rigsafe-crm" className="inline-flex min-h-11 items-center text-muted underline-offset-4 hover:text-fg hover:underline">
                  Latest case study
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
