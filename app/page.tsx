import { Hero } from "@/components/hero";
import { About, Ai, Contact, Experience, Stack, Work } from "@/components/sections";
import { site, skills } from "@/lib/content";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressRegion: "Bataan", addressCountry: "PH" },
  knowsAbout: skills.flatMap((g) => g.items).slice(0, 20),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <Hero />
      <Work />
      <Ai />
      <Experience />
      <Stack />
      <About />
      <Contact />
    </>
  );
}
