import { site } from "@/lib/content";
import { Container } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 {site.name}
        </p>
        <p className="label">Built with Next.js, three.js and Framer Motion</p>
        <a href="#main" className="hover:text-fg">
          Back to top ↑
        </a>
      </Container>
    </footer>
  );
}
