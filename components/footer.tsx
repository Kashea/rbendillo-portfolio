import { identity } from "@/lib/content";
import { Container } from "@/components/ui";
import { PeregrineMark } from "@/components/peregrine-mark";

export function Footer() {
  return (
    <footer className="border-t border-border py-10 print:hidden">
      <Container className="flex flex-col gap-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <PeregrineMark size={24} id="footer" />
          <p>
            © 2026 Ross Bendillo · {identity.alterEgo} · Bataan, PH · Remote for AU, UK and global teams
          </p>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">{identity.mantra}</p>
        <a href="#main" className="hover:text-fg">
          Back to top ↑
        </a>
      </Container>
    </footer>
  );
}
