# Design — DACH-AI positioning expansion (tools, glossary, articles, SEO)

**Date:** 2026-07-11
**Branch:** `feat/dach-ai-seo-expansion`
**Goal:** Position Dr. Pascal Giessler as a top DACH voice on AI. Add pages for two launched tools (AI Radar, Idea Assessor), an Agentic-AI/Harness glossary as a top-of-funnel search net, surface newly published Substack essays, and tighten SEO / Google indexing. Everything ladders to the one positioning line: **"Der Architekt gegen Cognitive Debt — souveräne AI."**

## Strategic frame (source: `08_Content_Strategy/_strategy/positioning.md` + `geo/`)
- **Feindbild** — Cognitive Debt (organisations outsource judgment to opaque AI).
- **Mechanismus** — souveräne AI: nachvollziehbar, exit-fähig, resilient.
- **Beweis** — the two tools are *proof* of the thesis; the glossary is the *entity net* that makes Pascal the citable source for agentic-AI vocabulary in DACH.
- Canonical entity language + `knowsAbout` anchors come from `geo/entity-profile.md`; canonical Q&A from `geo/faq.md` (reused verbatim for `FAQPage` JSON-LD consistency across surfaces — that consistency is what LLMs extract).

## Already shipped in this branch (SEO quick-fixes)
1. **`/posts` "Page with redirect"** — root cause: internal links used no-slash URLs that GitHub Pages 301-redirects to `/…/`. Fixed by `trailingSlash:'always'` in `astro.config.mjs`, trailing-slash normalization in `getLocalizedPath`, and slash-terminating every internal link (menu.json, footer, index, 404, post/atom layouts, home/projects — EN + DE). Verified: built canonical/hreflang/nav/RSS all trailing-slash; zero no-slash internal hrefs remain.
2. **Google SERP thumbnail** — root cause: Google center-crops the 1200×630 OG card to a square, slicing the left-aligned title + top-right monogram. Fixed by re-centering `scripts/og-card-template.svg` into the middle safe zone; regenerated `og-card.png`. Verified via simulated square crop.

## Architecture

### New content collections (`src/content.config.js`)
- **`tool`** — glob `*.md` base `./src/content/tools`. Schema: `name`, `tagline`, `description`, `status` (enum: live/private/beta), `repo?`, `demo?`, `position:int`, `thesis` (Cognitive-Debt link), `stack?` (string[]), `category`. One file per tool, bilingual fields (`*_en`/`*_de`) OR two files — **decision: single file, `*_en`/`*_de` paired fields**, to keep DE/EN in sync (mirrors how tools promote identically in both languages).
- **`glossary`** — glob `*.md` base `./src/content/glossary`. Schema: `term`, `slug`, `category` (enum), `term_de?`, `definition_en`, `definition_de`, `related:string[]` (slugs), `position?`. Single source file per term holds both languages.

### Routes (follow existing EN-root / `/de/` mirror pattern)
- `/tools/` + `/de/tools/` — index (mirrors `projects.astro` shell).
- `/tools/ai-radar/` + `/de/tools/ai-radar/` — detail.
- `/tools/idea-assessor/` + `/de/tools/idea-assessor/` — detail.
- `/glossary/` + `/de/glossary/` — single-page glossary (all terms with `id` anchors; no per-term pages at launch — YAGNI).
- Nav: add `tools` + `glossary` keys to `menu.json` (both locales) and `nav.*` labels to `src/i18n/ui.ts` (both locales). These are fully mirrored, so **no** `ROUTES_WITHOUT_DE_MIRROR` entry needed (hreflang pairs emit correctly).

### Layout change (`src/layouts/main.astro`)
The layout only emits Person schema and has a named `head` slot. **Add a `jsonLd` prop (object | object[])**; when present, render one `<script type="application/ld+json">` per entry in `<head>`. Pages that use `main.astro` directly (tools, glossary, index pages) can then inject `SoftwareApplication` / `FAQPage` / `DefinedTermSet` without wrapping gymnastics. Post/atom layouts keep using the `head` slot as today (unchanged).

### Structured data plan
- **Tool pages** — `SoftwareApplication` (name, applicationCategory=DeveloperApplication, operatingSystem, offers=free/open-source where public, author=Person, url, codeRepository for AI Radar) + a small `FAQPage` (2–3 Q&A drawn from `geo/faq.md`, tool-specific).
- **Glossary** — one `DefinedTermSet` per language page, `hasDefinedTerm: [DefinedTerm …]` (name, description, `inDefinedTermSet`, `url` with `#slug`). Rich-result eligible; strong entity signal for `knowsAbout` terms.
- **Articles** — existing `Article` schema via `post.astro` (unchanged), with canonical Substack `url`/`sameAs`.

## Content

### Tool: AI Radar (public)
- Facts verified against live site `pascal-giessler.github.io/ai-tech-radar/` before writing copy. Live demo + MIT repo linked. Screenshot optional.
- Angle: living tech radar computed not curated — trending GitHub repos re-scanned every 30 min (SSE), categories emerge from embeddings (HDBSCAN + c-TF-IDF), adoption rings (Adopt/Trial/Assess/Hold) from momentum+maturity, self-hosted `docker compose up`, configurable scope. Thesis: closes the gap where orgs decide by hype instead of judgment (Cognitive Debt at tool-selection layer).

### Tool: Idea Assessor (repo private)
- **No public link** (user decision). CTA: "Code auf Anfrage / Release folgt." One-line change to add repo URL once public.
- Angle: forces judgment on ideas via fixed YC rubric (Problem, Markt & Timing, Lösung, Moat, Vertrieb), exactly 5 rounds, kill-rule (composite < 4 → discarded, no retry), dual-model review (Claude scores, Codex adversarially checks), local-first + full provenance (model, prompt-version, tokens, raw output), no telemetry. Stack described (SvelteKit + Postgres/Drizzle audit triggers, claim+lease worker, LISTEN/NOTIFY→SSE). Thesis: AI made refining ideas free, judging them not — the constraint is the product.

### Glossary (~24 terms, DE+EN)
Categories: **Agentic core** (Harness, Agentic AI, Agent, Tool Use, Orchestration, Multi-Agent System, Human-in-the-Loop, Context Window, Context Engineering, Guardrails, Eval), **Protocols & retrieval** (MCP, RAG, GraphRAG, Knowledge Graph, Embeddings, AI Gateway, Model Router), **Sovereignty & governance** (Sovereign AI / Souveräne AI, Cognitive Debt, Cognitive Debt Maturity Model, Provenance, Vendor Lock-in, EU AI Act, Adoption Rings, Prompt Injection). Definitions answer-first, ≤~60 words, Pascal-voice (dry, precise), no em-dashes. Terms tied back to Cognitive Debt / sovereignty where natural, and cross-linked to tools + posts.

### Articles (new on `/posts`)
- **Das Cognitive Debt Maturity Model** — 2026-06-29, DE, canonical `https://pascalgiessler.substack.com/p/das-cognitive-debt-maturity-model`. Introduces proprietary CDMM (Level 0 Black-Box-abhängig → Level 4 Souverän).
- **Compliance by Design** — 2026-06-17, DE. **OPEN: canonical Substack `/p/` URL not recorded in content repo — user must supply, else the post links only to the pillar and I omit the `sameAs`.**
- Both added as `src/content/post/*.md` with `dateFormatted`, `lang:"de"`, and a "Related reading" cross-link into glossary terms + tools.

## Testing / verification
- `pnpm build` succeeds; `pnpm test:scripts` green.
- New routes appear in `dist/sitemap-0.xml` with trailing slashes + hreflang pairs; no no-slash internal hrefs.
- JSON-LD validates (Rich Results Test / Schema validator): SoftwareApplication, FAQPage, DefinedTermSet.
- Nav renders new items EN+DE; language switcher pairs resolve.
- Dark-by-default, gold accent, Cormorant/Outfit/JBMono, no em-dashes, no gradient text — per project Design Rules.

## Out of scope (YAGNI)
Client-side search; per-term glossary pages; new design system/components; OG-image-per-page; automated content sync for tools/glossary.
