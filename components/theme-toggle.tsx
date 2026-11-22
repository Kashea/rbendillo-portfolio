"use client";

import { useSyncExternalStore } from "react";
import { PeregrineMark } from "@/components/peregrine-mark";
import { cn } from "@/components/ui";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

// Rival Mode: the opt-in dark cyberpunk theme.
export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      aria-pressed={dark}
      title="Rival Mode"
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-3 font-mono text-[0.7rem] uppercase tracking-[0.08em] transition-colors",
        dark
          ? "border-accent/60 text-accent shadow-[0_0_18px_-6px_var(--accent)]"
          : "border-border text-muted hover:text-fg",
      )}
    >
      <PeregrineMark size={16} id="toggle" />
      <span className="hidden sm:inline">Rival Mode</span>
    </button>
  );
}
