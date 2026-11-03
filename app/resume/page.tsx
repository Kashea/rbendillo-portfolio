import type { Metadata } from "next";
import { Download } from "lucide-react";
import { earlier, education, experience, resume, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${site.name}, ${site.role}. One-page résumé with experience, projects and skills.`,
};

const years = (d: string) => d.replace("—", "to");

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-[0.3em] mt-[0.75em] border-b border-black pb-[0.1em] text-[1em] font-bold uppercase tracking-[0.04em]">
      {children}
    </h2>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="ml-[1.1em] list-disc">
      {items.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
}

// Plain single-column layout on purpose: it parses cleanly in applicant tracking systems.
export default function ResumePage() {
  return (
    <div className="px-4 pb-16 pt-24 print:p-0">
      <div className="mx-auto mb-4 flex max-w-[210mm] justify-end print:hidden">
        <a
          href={site.cv}
          download
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-ink"
        >
          <Download size={15} strokeWidth={1.75} aria-hidden /> Download PDF
        </a>
      </div>
      <article className="mx-auto max-w-[210mm] bg-white p-[clamp(1.25rem,5vw,3rem)] text-[0.82rem] leading-[1.32] text-black shadow-[0_24px_60px_-30px_rgb(0_0_0/0.5)] print:max-w-none print:p-0 print:text-[8.9pt] print:shadow-none">
        <header className="text-center">
          <h1 className="text-[1.75em] font-bold uppercase tracking-[0.06em]">{site.name}</h1>
          <p className="font-medium">{site.role}</p>
          <p className="mt-[0.2em]">
            {site.location} | {site.phone} | {site.email} | {site.github} | {site.web}
          </p>
        </header>

        <Heading>Summary</Heading>
        <p>{resume.summary}</p>

        <Heading>Technical Skills</Heading>
        {resume.skills.map((s) => (
          <p key={s.label}>
            <strong>{s.label}:</strong> {s.items}
          </p>
        ))}

        <Heading>Professional Experience</Heading>
        <div className="grid gap-[0.4em]">
          {experience.map((r) => (
            <section key={r.org + r.role}>
              <p className="flex flex-wrap justify-between gap-x-4">
                <span>
                  <strong>{r.org}</strong> • {r.role}
                </span>
                <span>{years(r.dates)}</span>
              </p>
              <Bullets items={r.bullets} />
            </section>
          ))}
          <section>
            <p>
              <strong>Earlier career in infrastructure and support</strong>
            </p>
            <Bullets items={earlier.map((r) => `${r.role}, ${r.org} (${years(r.dates)}): ${r.bullets[0]}`)} />
          </section>
        </div>

        <Heading>Projects</Heading>
        <div className="grid gap-[0.3em]">
          {resume.projects.map((p) => (
            <section key={p.name}>
              <p>
                <strong>{p.name}:</strong> {p.what}
                {p.link ? ` • ${p.link}` : ""}
              </p>
              <Bullets items={p.bullets} />
            </section>
          ))}
        </div>

        <Heading>Education</Heading>
        {education.map((e) => (
          <p key={e.title} className="flex flex-wrap justify-between gap-x-4">
            <span>
              <strong>{e.title}</strong> • {e.org}
            </span>
            <span>{years(e.dates)}</span>
          </p>
        ))}
      </article>
    </div>
  );
}
