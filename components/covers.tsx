import Image from "next/image";
import type { Project, Shot } from "@/lib/content";

// Real screenshots in a minimal browser frame, with hand-built illustrative
// covers as the fallback for work that has no public UI. No real client figures.

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-bg shadow-[0_24px_60px_-30px_rgb(0_0_0/0.5)]">
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="ml-3 truncate font-mono text-[0.6rem] text-muted">{label}</span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

const bar = "rounded-full bg-fg/10";

function Rigsafe() {
  const kpis = ["Waiting", "Follow-ups", "To price", "To confirm"];
  const months = [38, 52, 44, 66, 58, 74, 62, 81, 70, 88, 76, 92];
  return (
    <Frame label="crm / dashboard">
      <div className="absolute inset-0 flex">
        <div className="hidden w-[22%] flex-col gap-2 border-r border-border bg-surface p-3 sm:flex">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-accent" />
            <span className={`${bar} h-1.5 w-12`} />
          </div>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={`${bar} h-1.5 ${i === 1 ? "w-[70%] bg-accent/60" : i % 3 === 0 ? "w-[45%]" : "w-[62%]"}`} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
          <div className="flex gap-1.5">
            {["FY", "All", "Projects", "Cranes", "Transport"].map((f, i) => (
              <span
                key={f}
                className={`rounded px-1.5 py-0.5 font-mono text-[0.5rem] ${i < 2 ? "bg-accent text-accent-ink" : "border border-border text-muted"}`}
              >
                {f}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {kpis.map((k, i) => (
              <div key={k} className="rounded-md border border-border bg-surface p-2">
                <div className={`mb-1.5 h-0.5 w-4 rounded ${i === 3 ? "bg-amber-500" : "bg-accent"}`} />
                <div className="font-mono text-[0.75rem] font-semibold">{[3, 5, 7, 12][i]}</div>
                <div className="truncate text-[0.5rem] text-muted">{k}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-end gap-1 rounded-md border border-border bg-surface p-2">
            {months.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col justify-end gap-px" style={{ height: "100%" }}>
                <div className="rounded-t-sm bg-accent/30" style={{ height: `${h * 0.35}%` }} />
                <div className="rounded-b-sm bg-accent" style={{ height: `${h * 0.55}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Ai() {
  const steps = ["Input", "AI draft", "Gate", "Human", "Approve", "Audit"];
  return (
    <Frame label="approval-queue">
      <div className="absolute inset-0 flex flex-col justify-center gap-3 p-4">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3" style={{ paddingLeft: `${(i % 3) * 8}%` }}>
            <span
              className={`grid size-5 place-items-center rounded-full font-mono text-[0.5rem] ${i === 2 ? "bg-accent text-accent-ink" : "border border-border text-muted"}`}
            >
              {i + 1}
            </span>
            <span className="font-mono text-[0.6rem]">{s}</span>
            <span className={`${bar} h-1 flex-1`} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Karate() {
  return (
    <Frame label="karateinstitute.au">
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex justify-between">
          <span className={`${bar} h-1.5 w-10`} />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`${bar} h-1.5 w-6`} />
            ))}
          </div>
        </div>
        <div>
          <div className="font-serif text-[1.35rem] leading-none">Free trial class</div>
          <span className={`${bar} mt-2 block h-1.5 w-[60%]`} />
          <span className="mt-3 inline-block rounded-full bg-accent px-2.5 py-1 font-mono text-[0.5rem] text-accent-ink">
            Book now
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-8 rounded border border-border bg-surface" />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Chito() {
  return (
    <Frame label="chitoryukaratedo / en">
      <div className="absolute inset-0 flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6rem]">Dojo directory</span>
          <span className="rounded-full border border-border px-1.5 font-mono text-[0.5rem] text-muted">EN · 日本語</span>
        </div>
        {["Australia", "Japan", "Canada", "United States", "Philippines"].map((c, i) => (
          <div key={c} className="flex items-center justify-between rounded border border-border bg-surface px-2 py-1">
            <span className="text-[0.6rem]">{c}</span>
            <span className={`${bar} h-1 ${i % 2 ? "w-8" : "w-12"}`} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function Screenshot({ shot, priority, sizes }: { shot: Shot; priority?: boolean; sizes: string }) {
  return (
    <Frame label={shot.label}>
      <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover object-left-top" />
    </Frame>
  );
}

// Real screenshot when we have one, illustrative UI otherwise.
export function ProjectVisual({ project, priority, sizes }: { project: Project; priority?: boolean; sizes: string }) {
  if (project.image) return <Screenshot shot={project.image} priority={priority} sizes={sizes} />;
  if (!project.cover) return null;
  const C = { rigsafe: Rigsafe, ai: Ai, karate: Karate, chito: Chito }[project.cover];
  return <C />;
}
