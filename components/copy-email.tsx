"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={`mailto:${email}`} className="break-all text-lg underline-offset-4 hover:text-accent hover:underline">
        {email}
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {}
        }}
        className="grid size-9 place-items-center rounded-full border border-border text-muted hover:text-fg"
        aria-label="Copy email address"
      >
        {copied ? <Check size={14} aria-hidden /> : <Copy size={14} strokeWidth={1.5} aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied" : ""}
      </span>
    </div>
  );
}
