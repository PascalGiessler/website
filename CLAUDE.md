# CLAUDE.md — pascal-giessler.de

## Project
Personal portfolio website for Dr. Pascal Giessler. Built with Astro + Tailwind CSS. Hosted on GitHub Pages (static output, no server-side). Site URL: https://pascal-giessler.de (apex canonical; www auto-redirects).

## Brand Context
See PRODUCT.md and DESIGN.md at the project root. Brand profile source of truth is at `/Users/pascalgiessler/Developer/02_Personal/04_LinkedinBrand/brand-profile.md`.

## Tech Stack
- **Framework**: Astro (static)
- **Styling**: Tailwind CSS + custom OKLCH CSS variables in `src/assets/css/main.css`
- **Typography**: Google Fonts — Cormorant (display), Outfit (body), JetBrains Mono (labels)
- **Deployment**: GitHub Pages, branch `main`, static output via `astro build`
- **Package manager**: pnpm

## Key Files
- `src/layouts/main.astro` — root layout, Google Fonts, dark mode init
- `src/assets/css/main.css` — brand CSS variables and custom component classes
- `src/collections/experiences.json` — Pascal's work history (update with real roles)
- `src/collections/menu.json` — navigation items
- `src/pages/index.astro` — homepage hero
- `src/pages/about.astro` — bio and experience timeline
- `public/assets/images/` — profile photos and brand assets

## Design Rules
1. Always dark by default (html.dark class set in layout script)
2. Colors via CSS custom properties (OKLCH), not Tailwind color palette
3. No em dashes in copy — commas, colons, semicolons only
4. Font: Cormorant for display headings, Outfit for body, JetBrains Mono for labels
5. Gold accent (oklch(0.72 0.12 54)) is the identity color — use it intentionally
6. No gradient text, no glassmorphism, no side-stripe borders
7. GitHub Pages is static — no server-side APIs, no dynamic routes with server rendering

## Person Details (for copy)
- **Name**: Dr. Pascal Giessler
- **Role**: AI Principal & Tech Lead at Haufe Akademie
- **Location**: Freiburg, Germany
- **LinkedIn**: https://www.linkedin.com/in/pgiessler/
- **GitHub**: https://github.com/PascalGiessler
- **Substack (The Engineer's Library)**: https://pascalgiessler.substack.com/
- **Substack (Path to Scale)**: https://pathto.substack.com/ (coming soon)
- **PhD**: Computer Science, KIT Karlsruhe (WASA group, 8+ years)
- **Certifications**: Azure Solutions Architect Expert (Microsoft Certified)
- **Former**: CTO at SYNDIKAT7 (9 years), Board Member at SYNDIKAT7 Ventures, Industry Fellow at 42 Wolfsburg
- **Education**: MIT Technology and Innovation (2023), Patrick Kua Technical Leadership Masterclass

## Common Tasks
- Add new blog posts: create `.md` files in `src/content/post/`
- Update nav: edit `src/collections/menu.json`
- Update experience timeline: edit `src/collections/experiences.json`
- Build: `pnpm build` — output in `dist/`
- Dev server: `pnpm dev` (port 4321 by default)
