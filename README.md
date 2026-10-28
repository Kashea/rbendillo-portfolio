# rbendillo-portfolio

Personal portfolio of **Rossrival M. Bendillo**, Full-Stack Developer & AI Engineer.

Selected work, case studies (including the Rigsafe CRM), experience and toolkit, on a single fast page with a three.js hero.

## Stack

- [Next.js 16](https://nextjs.org) App Router with Cache Components, TypeScript (strict)
- Tailwind CSS v4 (CSS-first tokens in `app/globals.css`)
- three.js via `@react-three/fiber` with a custom GLSL point field
- Framer Motion (`motion/react`), limited to a small set of reduced-motion-safe patterns
- `next/font` (Geist, Geist Mono, Instrument Serif), `lucide-react`

## Structure

```
app/                 routes: home, /work/[slug], sitemap, robots, icon
components/          sections, nav, hero + three.js scene, project cards, covers
lib/content.ts       every word on the site: projects, experience, skills
public/images/work/  project screenshots (WebP)
public/cv/           downloadable CV
```

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
