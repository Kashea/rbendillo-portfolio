import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { modules } from "@/lib/content";
import { CommandDeck } from "@/components/jarvis/command-deck";

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
  return <CommandDeck initial={slug} />;
}
