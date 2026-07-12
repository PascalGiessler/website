# CLAUDE.md — pascal-giessler.de

## Project
Personal portfolio website for Dr. Pascal Giessler. Built with Astro + Tailwind CSS. Hosted on GitHub Pages (static output, no server-side). Site URL: https://pascal-giessler.de (apex canonical; www auto-redirects).

## Brand Context
Brand-OS Source-of-Truth: `/Users/pascalgiessler/Developer/02_Personal/07_Brand/` (canonical seit 2026-05-18).
- Personality + Tone-of-Voice: `07_Brand/01_identity/`
- Bio-Varianten (DE+EN, short/medium/long): `07_Brand/01_identity/bio/`
- Visual-Identity (OKLCH-Palette, Typo, etc.): `07_Brand/02_visual-identity/design-system.md`
- Channel-Strategie + kanonische Substack-Namen: `07_Brand/03_channels/overview.md`
- Year-End-OKR + Pillars + Red-Lines: `07_Brand/00_north-star/`

Lokales PRODUCT.md + DESIGN.md beschreiben die Web-spezifische Implementierung; bei Konflikt gewinnt 07_Brand.

`04_LinkedinBrand/brand-profile.md` (alte SoT) ist seit 2026-05-18 deprecated und enthält jetzt nur noch via `make sync-personality`/`make sync-red-lines` aus 07 synchronisierte Inhalte.

## Tech Stack
- **Framework**: Astro (static)
- **Styling**: Tailwind CSS + custom OKLCH CSS variables in `src/assets/css/main.css`
- **Typography**: Google Fonts — Cormorant (display), Outfit (body), JetBrains Mono (labels)
- **Deployment**: GitHub Pages, branch `main`, static output via `astro build`
- **Package manager**: pnpm

## Key Files
- `src/layouts/main.astro` — root layout, Google Fonts, dark mode init
- `src/layouts/atom.astro` — atom page layout (HOOK pull-quote + BODY/CTA prose + prev/next)
- `src/assets/css/main.css` — brand CSS variables and custom component classes
- `src/collections/experiences.json` — Pascal's work history (update with real roles)
- `src/collections/menu.json` — navigation items
- `src/content/post/` — long-form essay collection
- `src/content/series/` — LinkedIn-atom series collection (one directory per topic, with `_series.md` metadata + numbered atom files)
- `src/lib/series.mjs` — pure helpers for atom parsing (stripLinkedInSections, parseAtomBody, slugFromFilename, etc.)
- `src/pages/index.astro` — homepage hero
- `src/pages/about.astro` — bio and experience timeline
- `src/pages/series.astro` + `src/pages/de/series.astro` — `/series` index pages (mirrored)
- `src/pages/series/[topic]/[atom].astro` — atom dynamic route (single URL space, not mirrored to /de/)
- `scripts/sync-series.mjs` — sync script (`pnpm series:list-pending`, `pnpm series:add <topic> [--force]`)
- `.claude/skills/series-add/SKILL.md` — conversational wrapper around the sync workflow
- `public/assets/images/` — profile photos and brand assets
- **`src/data/entity.ts`** — SINGLE SOURCE OF TRUTH for the machine identity: Person schema, `knowsAbout` anchors, `sameAs`, the canonical FAQ, breadcrumb helper. Mirrors `08_Content_Strategy/_strategy/geo/entity-profile.md` + `geo/faq.md`. **Never let them diverge**: entity confidence comes from asserting identical claims across every surface.
- `src/data/cognitive-debt.ts` + `src/pages/cognitive-debt/` (+ `/de/`) — the pillar page. The definitive resource for Cognitive Debt + the CDMM.
- `src/data/glossary.ts` + `src/pages/glossary/` (+ `/de/`) — 30-term agentic-AI glossary, `DefinedTermSet` schema. Top-of-funnel search net.
- `src/data/tools.ts` + `src/pages/tools/` (+ `/de/`) — AI Radar, Idea Assessor.
- `src/lib/posts.mjs` — post routing (see URL rules below).
- `src/components/analytics.astro` — self-hosted OpenPanel (own infra, cookieless, honours DNT/GPC). Client ID is public; the client SECRET must never enter this repo.

## SEO / URL Rules (breaking these silently costs rankings)
1. **`trailingSlash: 'always'`.** Every internal link MUST end in `/`. GitHub Pages 301-redirects the no-slash form, and Search Console then files it as "Page with redirect / not indexed".
2. **Essays live in the language they are written in**: German at `/de/post/<slug>/`, English at `/post/<slug>/`, routed by frontmatter `lang` via `src/lib/posts.mjs`. They are NOT translation pairs.
3. Essays and series atoms are **single-language**, so they emit **no hreflang alternates at all** (`isSingleLanguageRoute` in `src/i18n/ui.ts`). Pointing at a counterpart that does not exist is worse than pointing nowhere. Structural pages (home, about, posts, series, tools, glossary, cognitive-debt) are fully mirrored and do emit en/de/x-default.
4. **`FAQPage` schema is only ever emitted alongside the same Q&A visible on the page.** Google requires visible content for FAQ rich results; schema-only is a violation.
5. Page-specific structured data goes through the layout's `jsonLd` prop (object or array); a per-page OG card goes through the `image` prop (`pnpm og-cards`).
6. Full detail: `docs/seo-setup.md`.

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
- **Substack DE ("Stack und Haltung")**: https://pascalgiessler.substack.com/ — canonical, primärer Sprint-Kanal (Cadence: Mi 08:00 CET)
- **Substack EN ("Principal Stack")**: https://pathto.substack.com/ — monthly EN Field-Notes
- _(deprecated 2026-05-18: "The Engineer's Library" / "Path to Scale" — SoT für Naming ist `07_Brand/03_channels/overview.md`)_
- **PhD**: Computer Science, KIT Karlsruhe (WASA group, 8+ years)
- **Certifications**: Azure Solutions Architect Expert (Microsoft Certified)
- **Former**: 9-year CTO tenure at a DACH engineering services consultancy, board role in a venture-building environment (2017-2022), Industry Fellow at 42 Wolfsburg
- **Education**: MIT Technology and Innovation (2023), Patrick Kua Technical Leadership Masterclass

## Common Tasks
- Add new blog posts: create `.md` files in `src/content/post/`
- Add a published LinkedIn series: invoke the `series-add` skill, or run `pnpm series:list-pending` then `pnpm series:add <topic-slug>` (add `--force` for series whose analytics aren't exported yet). Spec: `docs/superpowers/specs/2026-05-06-series-page-design.md`.
- Update an atom (already on site): edit the file in `src/content/series/<topic>/`. Add `<!-- site-edited -->` anywhere in the file to protect from `pnpm series:add` overwrite.
- Update nav: edit `src/collections/menu.json`
- Update experience timeline: edit `src/collections/experiences.json`
- Build: `pnpm build` — output in `dist/`
- Dev server: `pnpm dev` (port 4321 by default)
- Tests: `pnpm test:scripts` (covers the sync script's pure functions only; no Astro component tests)
