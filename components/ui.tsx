import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-[clamp(1.25rem,4vw,3rem)]", className)}>{children}</div>;
}

export function SectionHeader({ index, title, lede }: { index: string; title: React.ReactNode; lede?: string }) {
  return (
    <div className="mb-12 grid gap-4 md:mb-16 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <p className="label mb-4">
          <span className="text-accent">{index}</span> <span aria-hidden>/</span>
        </p>
        <h2 className="font-serif text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.02em]">{title}</h2>
      </div>
      {lede && <p className="text-muted md:col-span-5 md:pb-2">{lede}</p>}
    </div>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-[0.72rem] tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

const btn = {
  primary: "bg-accent text-accent-ink hover:brightness-110",
  secondary: "border border-border text-fg hover:border-fg/40 hover:bg-surface",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
  download,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof btn;
  external?: boolean;
  download?: boolean;
}) {
  const cls = cn(
    "group inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[0.95rem] font-medium transition-[filter,background-color,border-color] duration-200",
    btn[variant],
  );
  const Icon = external || download ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      {children}
      <Icon
        size={16}
        strokeWidth={1.75}
        className="transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
        aria-hidden
      />
    </>
  );
  if (external || download)
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}>
        {inner}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
