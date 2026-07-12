# SEO Setup — Search Console + Sitemap

One-time configuration for indexing on Google + Bing. Re-run only when verification tokens change.

---

## 1. Google Search Console — domain verification

`https://search.google.com/search-console` → Add property → choose **URL prefix** → enter `https://pascal-giessler.de` → pick **HTML tag** verification.

Google gives a meta tag like:

```html
<meta name="google-site-verification" content="abc123XyZ_kpgs56gIzABC..." />
```

Copy the `content` value.

### Wire it via env var (no secret in git)

The site reads `PUBLIC_GSC_VERIFY` at build time and only renders the tag when set (see `src/layouts/main.astro`).

**Local build:**

```bash
PUBLIC_GSC_VERIFY="abc123XyZ_kpgs56gIzABC..." pnpm build
```

**GitHub Actions (recommended):**

Add `PUBLIC_GSC_VERIFY` as a repository **Variable** (Settings → Secrets and variables → Actions → Variables) — variables, not secrets, since GSC tokens are technically public once the meta tag ships. Then in the deploy workflow:

```yaml
- run: pnpm build
  env:
    PUBLIC_GSC_VERIFY: ${{ vars.PUBLIC_GSC_VERIFY }}
    PUBLIC_BING_VERIFY: ${{ vars.PUBLIC_BING_VERIFY }}
```

After deploy, return to Search Console → click **Verify**. Should succeed within 30s.

### Submit sitemap

In Search Console → **Sitemaps** (left sidebar) → enter `sitemap-index.xml` → Submit. Coverage data starts populating in 1-3 days.

---

## 2. Bing Webmaster Tools

`https://www.bing.com/webmasters` → Add site → URL prefix `https://pascal-giessler.de` → choose **Meta tag** verification.

Same env var pattern: set `PUBLIC_BING_VERIFY` to the token value. The site reads it via `import.meta.env.PUBLIC_BING_VERIFY` and renders `<meta name="msvalidate.01" ...>` when present.

After verification, submit the sitemap at `https://pascal-giessler.de/sitemap-index.xml`.

---

## 3. Sitemap regeneration

Sitemap is auto-generated at build time by `@astrojs/sitemap` (configured in `astro.config.mjs`). After every `pnpm build`:

- `dist/sitemap-index.xml` — index pointing at `dist/sitemap-0.xml`
- `dist/sitemap-0.xml` — full URL list with i18n hreflang annotations

Every rendered HTML page also advertises the sitemap via `<link rel="sitemap" type="application/xml" href="/sitemap-index.xml">` in `<head>` (emitted by `src/layouts/main.astro`). Not required for Google/Bing — `robots.txt` is the authoritative discovery channel — but a valid hint for third-party crawlers and SEO auditors.

**Sanity check after build:**

```bash
grep -c "<loc>" dist/sitemap-0.xml   # current count: 26
grep -c "/de/post/" dist/sitemap-0.xml   # should be 0 — those routes don't exist
grep -l 'rel="sitemap"' dist/index.html dist/series/*/*.html | wc -l  # every page
```

The `i18n/ui.ts:hasLocalizedMirror` guard is what keeps `/de/post/...` and `/de/series/[topic]/[atom]/` out of the sitemap.

## 3a. Structured data (JSON-LD)

All schema is rendered server-side. The canonical entity claims live in **`src/data/entity.ts`** and are mirrored from `08_Content_Strategy/_strategy/geo/entity-profile.md` + `geo/faq.md`. **Never let the two diverge**: entity confidence comes from asserting the same claims in the same words on every surface, and that consistency is exactly what answer engines extract.

Pages pass page-specific schema via the layout's `jsonLd` prop (object or array).

| Schema | Where | Notes |
|---|---|---|
| **Person** | every page (`main.astro` → `entity.ts:personSchema`) | Carries `@id` (`/#person`), the real `knowsAbout` anchors (Cognitive Debt, Sovereign AI, Agentic Engineering/Harness, Loop Engineering, Context Engineering, AI-Native Transformation, …) and the full `sameAs` chain. Articles reference it by `@id` instead of duplicating an author blob. |
| **Article** | `/post/*`, `/de/post/*` (`post.astro`) | `datePublished`/`dateModified` + `inLanguage`. |
| **Article + isPartOf** | `/series/<topic>/<atom>/` (`atom.astro`) | Links each atom to its `CreativeWorkSeries`. |
| **DefinedTerm + CreativeWork + HowTo + FAQPage** | `/cognitive-debt/`, `/de/cognitive-debt/` | The pillar page. `DefinedTerm` = the term, `CreativeWork` = the CDMM framework (credited to Pascal), `HowTo` = the three application steps. |
| **FAQPage** | `/about/`, `/de/about/`, pillar, tool pages | **Only ever emitted alongside the same Q&A visible on the page** — Google requires visible content for FAQ rich results. |
| **DefinedTermSet + DefinedTerm ×30** | `/glossary/`, `/de/glossary/` | The agentic-AI vocabulary net. |
| **SoftwareApplication (+ VideoObject)** | `/tools/<slug>/` | VideoObject only where a clip exists (Idea Assessor). |
| **BreadcrumbList** | nested pages (tools, pillar) | |

Validate after changes via Google's [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/).

## 3b. Wikidata entity (open, needs Pascal)

The single strongest `sameAs` anchor is a Wikidata Q-ID. The procedure, **including an honest notability gate** (Wikidata deletes unsourced person items), is already written up at `08_Content_Strategy/_strategy/geo/wikidata-checklist.md`. Do not duplicate it here.

Once the Q-ID exists: add `https://www.wikidata.org/wiki/Q…` to `SAME_AS` in `src/data/entity.ts` and to `geo/entity-profile.md`.

---

## 4. OG card regeneration

**Identity card** (default for every page without its own): `public/assets/images/og-card.png`, rendered from `scripts/og-card-template.svg`:

```bash
pnpm og-card
```

**Per-page cards** (`/cognitive-debt`, `/glossary`, `/tools`, `/posts`): `public/assets/images/og/*.png`, rendered from the definitions in `scripts/og-cards.mjs`:

```bash
pnpm og-cards
```

Both require `rsvg-convert` (`brew install librsvg`). Pages opt in via the layout's `image` prop; anything without it falls back to the identity card.

**Composition rule:** Google center-crops the 1200×630 card to a square for its SERP thumbnail, while LinkedIn/X show the full landscape. Keep everything essential centered, inside roughly x 285–915, or it gets sliced. Check by cropping the middle square before shipping a new design.

After regeneration, validate via:
- Twitter card validator: `https://cards-dev.twitter.com/validator`
- LinkedIn post inspector: `https://www.linkedin.com/post-inspector/`
- Facebook sharing debugger: `https://developers.facebook.com/tools/debug/`

## 5. URL space and hreflang

- **`trailingSlash: 'always'`.** Every internal link must end in `/`, or GitHub Pages 301-redirects it and Search Console files it as "Page with redirect".
- **Essays live in the language they are written in**: German at `/de/post/<slug>/`, English at `/post/<slug>/` (routed by frontmatter `lang`, see `src/lib/posts.mjs`). They are not translation pairs.
- Because those pages exist in **one language only**, they emit **no `hreflang` alternates at all** (`isSingleLanguageRoute` in `src/i18n/ui.ts`). Pointing at a counterpart that does not exist is worse than pointing nowhere. Structural pages (home, about, posts, series, tools, glossary, cognitive-debt) are fully mirrored and do emit en/de/x-default.
