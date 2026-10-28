import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[80svh] flex-col justify-center pt-24">
      <p className="label">404</p>
      <h1 className="mt-4 font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-none">
        Nothing <em className="text-accent">here.</em>
      </h1>
      <div className="mt-10">
        <ButtonLink href="/">Back home</ButtonLink>
      </div>
    </Container>
  );
}
