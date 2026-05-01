# TODO — pascal-giessler.de

Manual tasks that require your input, decisions, or external assets. Each item lists what's needed and why.

---

## Content & assets (need you)

### 1. OG social card image
- **What**: 1200×630 PNG at `public/assets/images/og-card.png`
- **Why**: Currently link previews on LinkedIn/Twitter use `photo_pascal_branded.png` which crops badly into the 1.91:1 ratio.
- **Wire-up after creation**: change the `ogImage` constant in `src/layouts/main.astro` line 11.
- **Suggested layout**: dark background, gold accent rule, "Dr. Pascal Giessler" in Cormorant, tagline "AI Principal · Cloud Architect · PhD" in Outfit, small portrait on the right.

### 2. Concrete outcome numbers in pillars and bio
- **What**: Replace abstract pillar proofs with real numbers. Examples:
  - Pillar 01: "Led X frontier AI initiatives at Haufe Akademie covering N learners"
  - Pillar 06 (Founder): "Fabricks: built Smart Factory components for X manufacturing clients"
  - Pillar 07 (Venture): "Board oversight of N portfolio companies"
- **Why**: Numbers are the difference between credible authority and generic claims.
- **Where**: `src/pages/index.astro` (pillar `pillar-proof` lines), `src/pages/about.astro` (Short Bio paragraphs).

### 3. Cross-links between articles
- **What**: At the end of each article in `src/content/post/*.md`, add a "Related reading" line that links to 1–2 of the other two posts.
- **Why**: Keeps readers on site, signals topical clustering to Google, increases pages-per-session.

### 4. GitHub link — restore when profile is ready
- **What**: GitHub link was removed from the footer + the Person JSON-LD `sameAs` array because the profile needs to be updated first.
- **Where to re-add**:
  - `src/components/footer.astro` — re-add the `<a>` block with the GitHub SVG between LinkedIn and Substack
  - `src/layouts/main.astro` — re-add `"https://github.com/PascalGiessler"` to the `sameAs` array in `personSchema`

### 5. Real Path to Scale URL when launched
- **What**: When `pathto.substack.com` goes live, search the codebase for "Path to Scale" and "coming soon", update links.
- **Where**: `src/pages/links.astro`, possibly footer or about section.

### 6. Speaker references / testimonials
- **What**: 2–3 short quotes from past speaking engagements or advisory clients.
- **Why**: Social proof drives speaking-invite conversions on the About page's new "Invite me to speak" CTA.
- **Where**: New block above the CTA in `src/pages/about.astro` "Speaking & Advisory" section.

---

## Substack sync workflow

When new Substack articles are ready to mirror:

```bash
pnpm sync:substack
```

This drops drafts in `drafts/substack/<slug>.md` (gitignored). Then:

1. Open each draft.
2. Strip Substack-specific markup: `<div class="captioned-image-container">`, `substackcdn.com` images, footer subscribe blocks.
3. Convert remaining HTML to clean markdown.
4. Rewrite intro/outro to match site voice (no email subject lines, no "If you liked this, subscribe" footers).
5. Move the cleaned file to `src/content/post/<slug>.md`.
6. Add it to "Related reading" links in the other posts (see item 3 above).
7. `pnpm build` to verify.

Drafts already published (file exists in `src/content/post/`) are skipped automatically.

---

## Other improvements I see

These are code/build tasks I can do whenever you want — listed here so they don't get lost.

### Quick wins
- **`prefers-reduced-motion`**: fade-up animations should be disabled for users with motion sensitivity. One CSS media query in `src/assets/css/main.css`.
- **Reading time on the `/posts` index**: currently only the post detail shows it. Show "X min read" alongside the date in `src/components/posts-loop.astro`.
- **Article-specific OG type and dates**: post pages currently inherit `og:type=website`. Adding `og:type=article` and `article:published_time` improves LinkedIn unfurl quality.
- **Custom 404 page**: `src/pages/404.astro` with brand styling — currently the Astro default 404 ships.
- **Site RSS feed**: generate `/rss.xml` from `src/content/post/*` so readers can subscribe to the site directly (independent of Substack).

### Medium effort
- **Per-post Article schema with dates**: `src/layouts/post.astro` already emits article JSON-LD but lacks `datePublished`/`dateModified`. Pass `dateFormatted` through and convert.
- **Lighthouse pass**: run lighthouse in production build, address any remaining LCP/CLS regressions.
- **Image optimization**: `photo_pascal_branded.png` is preloaded but unoptimized. Convert to AVIF/WebP via `astro:assets` and serve responsive sizes.
- **Newsletter inline form**: a one-line "subscribe to Principal Stack" inline form (Substack supports a lightweight embed) at the bottom of each article. Improves newsletter conversion vs the current "go visit Substack" link.

### Bigger / strategic
- **Speaking page** (`/speaking`): pull the speaking topics from About into a dedicated page with past talks, formats (keynote / workshop / panel), and an inquiry form.
- **Now page** (`/now`): one paragraph updated quarterly about what you're currently working on. Builds the personal-brand surface that LinkedIn doesn't.
- **Article tags / topics**: add a `tags` field to the content collection schema, render tag pills on each post, build `/topic/<tag>` index pages. Helps SEO clustering.
- **Search**: a small client-side search over titles + descriptions (Pagefind or a 5-line Fuse.js setup). Becomes valuable past ~10 articles.
