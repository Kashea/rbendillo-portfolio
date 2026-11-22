import { ButtonLink, Container } from "@/components/ui";
import { PeregrineMark } from "@/components/peregrine-mark";

export default function NotFound() {
  return (
    <Container className="flex min-h-[80svh] flex-col justify-center pt-24">
      <PeregrineMark size={72} id="notfound" glow />
      <p className="label mt-8">404 // 0xRIVAL</p>
      <h1 className="mt-4 font-serif text-[clamp(2.5rem,6.4vw,5rem)] leading-none">
        Target not <em className="text-accent">acquired.</em>
      </h1>
      <p className="mt-6 max-w-[48ch] text-muted">The page you were looking for is not here. The rest of the site is.</p>
      <div className="mt-10">
        <ButtonLink href="/">Back home</ButtonLink>
      </div>
    </Container>
  );
}
