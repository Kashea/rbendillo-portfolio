"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { PeregrineMark } from "@/components/peregrine-mark";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#ai", label: "AI" },
  { href: "/#experience", label: "Experience" },
  { href: "/#stack", label: "Stack" },
  { href: "/#about", label: "About" },
  { href: "/resume", label: "Résumé" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const items = [...menuRef.current.querySelectorAll<HTMLElement>("a,button")];
        const a = items[0];
        const z = items[items.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z?.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b print:hidden transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-border bg-bg/70 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-[clamp(1.25rem,4vw,3rem)]">
        <Link href="/" className="group relative flex items-center gap-2.5" aria-label="Ross Bendillo, Rival Peregrine, home">
          <PeregrineMark size={28} id="nav" glow className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          <span className="hidden text-sm font-semibold sm:block">Ross Bendillo</span>
          <span
            className="pointer-events-none absolute left-[38px] top-[calc(100%+2px)] hidden whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
            aria-hidden
          >
            Rival Peregrine
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/#contact"
            className="hidden min-h-10 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink md:inline-flex"
          >
            Contact
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-border md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex h-dvh flex-col bg-bg px-[clamp(1.25rem,4vw,3rem)] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-16 items-center justify-end">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full border border-border"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <ul className="mt-8 flex flex-col gap-2">
              {[...links, { href: "/#contact", label: "Contact" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block py-2 font-serif text-5xl">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
