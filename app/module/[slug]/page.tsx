import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { modules } from "@/lib/content";
import { Container } from "@/components/ui";
import { PeregrineConsole } from "@/components/peregrine-console";

const slugs = [...modules.map((m) => m.slug), "protocol"];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/module/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "protocol") {
    return { title: "The Peregrine Protocol", description: "Five stages every build goes through, from first map to the audit trail." };
  }
  const m = modules.find((x) => x.slug === slug);
  if (!m) return {};
  return { title: m.title, description: m.summary };
}

// A shareable address for every console module. It renders the same console with that module open.
export default function ModulePage({ params }: PageProps<"/module/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[100svh]" />}>
      <ModuleView params={params} />
    </Suspense>
  );
}

async function ModuleView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();
  return (
    <section className="pb-24 pt-28">
      <Container>
        <Link href="/#console" className="label inline-flex items-center gap-2 hover:text-fg">
          <ArrowLeft size={14} aria-hidden /> Home
        </Link>
        <h1 className="mt-6 mb-8 font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em]">
          The Peregrine <em className="text-fire">Console</em>
        </h1>
        <PeregrineConsole initial={slug} />
      </Container>
    </section>
  );
}
