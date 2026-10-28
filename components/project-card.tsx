import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";
import { Chip, cn } from "@/components/ui";
import { ProjectVisual } from "@/components/covers";

// Pattern 3: hover lift, cover slow zoom, arrow nudge. Whole card is one link.
export function ProjectCard({ project, wide }: { project: Project; wide?: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-border bg-surface transition-[transform,border-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-fg/25",
        wide && "lg:flex-row",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden border-b border-border bg-[radial-gradient(120%_80%_at_80%_0%,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_60%)] p-5 sm:p-7",
          wide ? "aspect-[16/10] lg:aspect-auto lg:w-[60%] lg:border-b-0 lg:border-r" : "aspect-[16/10]",
        )}
      >
        <div className="h-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]">
          <ProjectVisual
            project={project}
            priority={wide}
            sizes={wide ? "(min-width: 1024px) 680px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
          />
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", wide && "lg:justify-between lg:p-9")}>
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="label">{project.kicker}</p>
            {project.status && (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent/12 px-2.5 py-1 font-mono text-[0.68rem] text-accent">
                <span className="size-1.5 rounded-full bg-accent" />
                {project.status}
              </span>
            )}
          </div>
          <h3 className={cn("font-serif leading-[1.1] tracking-[-0.01em]", wide ? "text-4xl lg:text-5xl" : "text-3xl")}>
            {project.title}
          </h3>
          <p className="mt-3 text-muted">{project.summary}</p>
          {wide && project.highlights && (
            <ul className="mt-6 grid gap-2 text-[0.95rem]">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-7 flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, wide ? 4 : 3).map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition-[transform,background-color,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-accent group-hover:text-accent-ink">
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
            <span className="sr-only">Read the {project.title} case study</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
