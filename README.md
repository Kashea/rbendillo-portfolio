# rbendillo-portfolio

Personal portfolio of **Rossrival M. Bendillo** (Ross Bendillo), AI Engineer & Full-Stack Developer, signing as **Rival Peregrine**.

Selected work, case studies with trade-offs, measurement and failure modes, the Peregrine Protocol, a one-page resume, and a three.js hero with a procedural mech peregrine falcon.

## Stack

- [Next.js 16](https://nextjs.org) App Router with Cache Components, TypeScript (strict)
- Tailwind CSS v4 (CSS-first tokens in `app/globals.css`)
- three.js via `@react-three/fiber`: a procedural mech peregrine (no model files) over a custom GLSL point field, loaded after first paint
- Framer Motion (`motion/react`), limited to a small set of reduced-motion-safe patterns
- `next/font` (Geist, Geist Mono), `lucide-react`
- Light theme by default; Rival Mode is the opt-in dark cyberpunk theme

## Structure

```
app/                 routes: home, /work/[slug], /resume, sitemap, robots, icon
components/          sections, nav, hero + three.js scene, project cards, covers
lib/content.ts       every word on the site: projects, experience, skills
public/images/work/  project screenshots (WebP)
public/cv/           one-page CV PDF, printed from /resume
public/brand/        Rival Peregrine mark, icon and lockups
scripts/             brand-assets.mjs renders favicon, apple and manifest icons from the brand SVGs
```

To update the CV, edit `lib/content.ts`, print `/resume` to PDF (A4, no headers or footers) and replace the file in `public/cv/`.

To add or hide a project, edit `lib/content.ts` and set `visibility` to `featured`, `listed` or `hidden`.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Import the repo in Vercel (framework preset: Next.js). No environment variables are required.
Optionally set `NEXT_PUBLIC_SITE_URL` to the custom domain once it is connected, so canonical URLs, the sitemap and Open Graph links use it.
