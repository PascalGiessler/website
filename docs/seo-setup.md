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

**Sanity check after build:**

```bash
grep -c "<loc>" dist/sitemap-0.xml   # current count: 26
grep -c "/de/post/" dist/sitemap-0.xml   # should be 0 — those routes don't exist
```

The `i18n/ui.ts:hasLocalizedMirror` guard is what keeps `/de/post/...` and `/de/series/[topic]/[atom]/` out of the sitemap.

---

## 4. OG card regeneration

The Open Graph card at `public/assets/images/og-card.png` is rendered from `scripts/og-card-template.svg` via:

```bash
pnpm og-card
```

Requires `rsvg-convert` (`brew install librsvg`). Edit the template if you want to change layout, then re-run.

The card is referenced from `src/layouts/main.astro:32` as `https://pascal-giessler.de/assets/images/og-card.png` and used for all Open Graph + Twitter Card unfurls.

After regeneration, validate via:
- Twitter card validator: `https://cards-dev.twitter.com/validator`
- LinkedIn post inspector: `https://www.linkedin.com/post-inspector/`
- Facebook sharing debugger: `https://developers.facebook.com/tools/debug/`
