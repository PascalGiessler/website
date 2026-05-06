# /series — Design Spec

**Status:** Approved (brainstorm complete, ready for implementation plan)
**Date:** 2026-05-06
**Author:** Pascal Giessler (with Claude as design partner)

## 1. Goal

Surface the published LinkedIn-atom series — the *evidence* of Pascal's writing — alongside the long-form syntheses that already live on `/posts`. The site is the hub; LinkedIn is the satellite. Readers should be able to read each atom on-site, with the original LinkedIn post linked in the footer.

Three published series qualify (any topic with a `linkedin/analytics/` folder under `04_LinkedinBrand/topics/<topic>/`):

- `ai-cognitive-debt` — 5 atoms (EN)
- `generative-ai-strategy-leadership` — 5 atoms (EN)
- `ki-souveraenitaet` — 4 atoms (DE)

Future series with analytics folders should appear automatically without manual routing.

## 2. Information architecture

### URLs

- `/series` — index page (English, default locale)
- `/de/series` — index page (German)
- `/series/[topic]/[atom-slug]` — individual atom page
- `/de/series/[topic]/[atom-slug]` — German atom page

### Navigation

`menu.json` gains a fourth item between *writing* and *publications*:

```json
{ "key": "series", "url": "/series" }
```

Final order: About · Writing · Series · Publications.

### Cross-links between /series and /posts

Each series has a 1:1 mapping to a long-form synthesis already on `/posts`:

- `ai-cognitive-debt` ↔ `the-invisible-bill-ai-cognitive-debt`
- `generative-ai-strategy-leadership` ↔ `the-37b-question-enterprise-ai-strategy`
- `ai-native-engineering` ↔ `the-engineers-playbook-ai-native-work` *(not yet published as series; future)*

Mapping is declared in the topic frontmatter (see §6). Each series section header on `/series` includes a `Synthesis · [title] →` link. Each existing synthesis on `/posts` gains a small "See the source series →" link in its footer (separate change, low priority — can ship after the index works).

### Bilingual handling

Both `/series` and `/de/series` show all three series, including the cross-locale one. The German series surfaces on `/series` (English page) with a `DE` language badge and a synthesis link to `/de/posts`. The two English series surface on `/de/series` with `EN` badges. Rationale: the bilingual brand should be visible from either entry point; there is no "English-only" reader for whom the German series is noise — they will either skip it or read it. The badge does the disclosure work.

## 3. Page composition: `/series` index

```
┌──── HERO ──────────────────────────────────────────┐
│  SERIES                                            │
│                                                    │
│  Three arcs, told in atoms.                        │  Cormorant 3.4rem, italic on "arcs"
│                                                    │
│  Each series is a connected sequence of short     │  Outfit 0.95rem, max-width 56ch
│  LinkedIn posts, written across two weeks. They   │
│  make an argument together that no single post    │
│  can make alone. The long-form synthesis of       │
│  each lives on Writing.                           │
└────────────────────────────────────────────────────┘
                  ── horizontal rule ──
┌──── SERIES SECTION (×3) ───────────────────────────┐
│  SERIES 01 · 5 ATOMS · APR 2026                    │  JBMono label, "01" in --gold
│                                                    │
│  AI Cognitive Debt                                 │  Cormorant 2.2rem, italic on "Debt"
│                                                    │
│  Speed is the input. Understanding is still       │  Outfit 0.85rem, max-width 56ch
│  the job. A five-post arc on the 83-point gap...  │
│                                                    │
│  SYNTHESIS · THE INVISIBLE BILL →                  │  JBMono link, gold-dim border-bottom
│                                                    │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                        │  5-up tile row
│  │01│ │02│ │03│ │04│ │05│                        │
│  └──┘ └──┘ └──┘ └──┘ └──┘                        │
└────────────────────────────────────────────────────┘
```

Three series sections stack vertically with 72px gap. The German series uses 4-up grid because it has 4 atoms (no padding tiles).

**Container:** `max-width: 1080px`, padding `56px 32px 80px`. Wider than `/posts` (`max-w-3xl`) because tile rows need horizontal space.

**Page heading copy:** `"Three arcs, told in atoms."` — lock for now, easy to revise post-launch.

## 4. Series section header

Per-series header structure, top to bottom:

1. **Label**: `SERIES 0N · M ATOMS · MMM YYYY` in JBMono uppercase, with the `0N` portion in `--gold`. German variant: `SERIE 0N · M ATOME · MMM YYYY`.
2. **Title**: Cormorant 2.2rem with italic accent on the last word (matches hero/about pattern). Examples: *AI Cognitive __Debt__*, *Generative AI Strategy __for Leadership__*, *KI-__Souveränität__*. The italic word is the series' identity word.
3. **Thesis paragraph**: 2–3 sentences in Outfit 0.85rem, `--text-2` color, max-width 56ch. Sourced from each topic's `narrative-arc.md` Kernthese / one-line argument. Maintained by hand in topic frontmatter (see §6).
4. **Synthesis link**: `SYNTHESIS · [Synthesis Title] →` in JBMono 0.62rem with a gold-dim `border-bottom`. Points to the matching `/posts` essay. Hover shifts color and border to `--gold`.

Section header has 28px gap before the tile row.

## 5. Tile anatomy

```
┌─────────────────────────┐
│ 01                      │  position label, JBMono 0.55rem, gold-dim
│                         │
│ 93% adoption.           │  HOOK as body, Outfit 0.72rem, --text
│ ~10% productivity gain. │  line-height 1.5
│ The 83-point gap is     │  line-clamp: 4
│ architectural.          │
│                         │
│ THE PARADOX →           │  atom-title-as-arrow, JBMono 0.58rem, --gold
└─────────────────────────┘
```

**Dimensions:**
- min-height: 200px
- padding: 18px 16px
- gap between elements: 12px
- border: 1px solid `--border`
- border-radius: 4px (matches `.writing-card`)
- background: `--surface`

**Content sourced from atom frontmatter + body:**
- `pos`: derived from filename prefix (`01-the-paradox.md` → `01`)
- `hook`: the `## HOOK` section's body text, joined with line breaks preserved (clamped to 4 lines visually)
- `arrow`: atom title in uppercase + `→`

**Hover state (Level 2 motion, locked):**
- border-color: `--border` → `--border-gold` (220ms ease-out)
- background: `--surface` → `--surface-2` (220ms)
- position label: gains 12px left padding + a 4px gold dot animates in to its left (280ms cubic-bezier(0.16, 1, 0.3, 1)). Reuses the `.experience-item::before` motif from `main.css`.
- position label color: `--gold-dim` → `--gold`
- arrow: `translateX(6px)` + color → `--gold-light` (220ms)

**Entrance state:**
- Inherits the existing `.fade-up` keyframe (0.7s cubic-bezier(0.16, 1, 0.3, 1)).
- Tiles within a row stagger 120ms left-to-right (delay-1 through delay-5).
- Section headers fade up before their tile rows.
- Scroll-triggered via `IntersectionObserver` (one-shot — never replays). Below-the-fold sections fade in as they enter the viewport. The hero and first series fade in on initial load.

**Reduced motion:** existing `@media (prefers-reduced-motion: reduce)` block in `main.css` already neutralizes `.fade-up`. Hover transforms are also gated by the same query for safety.

## 6. Data model

### Astro content collection

A new collection `series` lives at `src/content/series/`. Each topic is a directory:

```
src/content/series/
  ai-cognitive-debt/
    _series.md              # series metadata (frontmatter only, no body)
    01-the-paradox.md
    02-the-evidence.md
    03-the-hidden-cost.md
    04-the-named-risk.md
    05-the-shift.md
  generative-ai-strategy-leadership/
    _series.md
    01-roi-paradox.md
    ...
  ki-souveraenitaet/
    _series.md              # language: de
    01-modular-und-exit-faehig.md
    ...
```

### `_series.md` frontmatter (series-level)

```yaml
title: "AI Cognitive Debt"
italic_word: "Debt"
position: 1                 # SERIES 01
language: en                # en | de
published_at: 2026-04-24
atom_count: 5
thesis: |
  Speed is the input. Understanding is still the job. A five-post arc
  on the 83-point gap between AI adoption and organizational output,
  and the architecture move that closes it.
synthesis_post: "the-invisible-bill-ai-cognitive-debt"   # filename in src/content/post/
```

### Atom frontmatter (extends existing fields)

The existing atom files in `04_LinkedinBrand/topics/<topic>/linkedin/scripts/` already have `title`, `series`, `position`. New required field: nothing — we parse the existing structure (HOOK section as the tile hook, full body for the atom page).

Atom files are **copied** (not symlinked) from the brand repo into `src/content/series/<topic>/` at sync time. A small script `scripts/sync-series.mjs` (out of scope for this spec, but referenced) handles the copy + filters to topics that have an `analytics/` folder. For the first build it's fine to copy by hand.

### How the route knows what's published

The `/series` index iterates `_series.md` files where the topic directory exists. Adding a new series = creating a new topic directory with `_series.md` + atoms. No other site code changes.

## 7. Atom page: `/series/[topic]/[atom-slug]`

```
SERIES / AI Cognitive Debt                              ← breadcrumb, JBMono
ATOM 01 OF 05                                           ← position, gold
                                                        
The AI Productivity Paradox                             ← Cormorant 3rem
                                                        
   93% of engineers use AI coding tools.                ← HOOK as italic Cormorant
   Org-level productivity moved about 10%.              ← 1.4rem, --gold-light
   That 83-point gap is not a tooling problem.          ← max-width 32ch
   It's an architectural one.

I run Claude Code daily. I have for months.             ← BODY as Outfit 1rem prose
                                                        ← max-width 65ch
My subjective experience: I move faster...
[full BODY paragraphs]

[CTA paragraph if present]

──────────────────────────────────────────────────────
ORIGINALLY ON LINKEDIN · READ & REPLY →                ← JBMono footer link
SERIES · AI COGNITIVE DEBT · SYNTHESIS · THE INVISIBLE BILL →
                                                        
┌─ ← BACK TO SERIES ─┐  ┌─ NEXT ATOM · 02 → ─┐
│ All 5 atoms        │  │ The Evidence       │
└────────────────────┘  └────────────────────┘
```

**Sections rendered from atom markdown:**
- Title — frontmatter `title` (with the last word italicized via heuristic: `<em>{lastWord}</em>`)
- Hero hook — `## HOOK` body, italic Cormorant pull-quote, `--gold-light`, max-width 32ch
- Body prose — `## BODY` paragraphs, Outfit 1rem, line-height 1.75, max-width 65ch
- CTA — `## CTA` paragraph if present, rendered as a final body paragraph (no special styling — keeps editorial restraint)

**Sections NOT rendered on the atom page:**
- `## HASHTAGS` — LinkedIn-specific, no value on-site
- `## FIRST COMMENT` — internal posting note
- `## ENGAGEMENT STRATEGY` — internal
- `## Visual` — only relevant for the hero quote-card on LinkedIn; site does not render image generation YAML

**Footer:**
- "Originally on LinkedIn · Read & reply →" — links to the LinkedIn post URL stored in atom frontmatter (`linkedin_url`). If absent, the line is omitted. (For the first three series this URL needs to be populated by hand.)
- "Series · [name] · Synthesis · [synthesis title] →" — two links on one line.
- Prev/next: two cards. Prev is "← Back to series" if first atom; next is "Next atom · 0N+1 →" if not last.

**Canonical:** the atom page sets `<link rel="canonical">` to itself, not to LinkedIn. Rationale: LinkedIn does not compete in long-tail search the way articles do, and the atom rendered on-site has the better information architecture and prose presentation. The "Originally on LinkedIn" footer line provides honest attribution.

## 8. Constraints honored (DESIGN.md cross-check)

- ✅ Always dark — both pages inherit `html.dark`
- ✅ Gold at 30–40% surface — every tile has gold position label, gold arrow, gold hover dot, gold rule on hero, gold synthesis link border
- ✅ No side-stripe borders >1px — none used
- ✅ No gradient text — none
- ✅ No glassmorphism — none
- ✅ No hero-metric template — analytics deliberately excluded from tiles
- ✅ No identical card grids — each section header is distinctive prose; tile content is hook-driven (no placeholder copy)
- ✅ No em dashes in copy — verified in this spec
- ✅ Cormorant for display, Outfit for body, JBMono for labels — matches type stack
- ✅ Motion: fadeUp 0.7s + cubic-bezier(0.16, 1, 0.3, 1) + 120ms stagger — matches existing
- ✅ Hover: 200–280ms ease-out — matches "Hover: gold accent reveals, 200ms ease-out"
- ✅ Never animates layout properties — all motion is opacity/transform/color
- ✅ `prefers-reduced-motion` honored

## 9. Out of scope (intentional)

- **Cross-linking back from /posts syntheses to /series**: shipping the source series link inside each existing essay is a separate, lower-priority change. The /series page does not depend on it.
- **Sync script `scripts/sync-series.mjs`**: copying atoms from `04_LinkedinBrand/topics/` into `src/content/series/` is treated as a one-time manual operation for the first three series. Automation can come later.
- **Series-level analytics**: the brand repo has analytics summaries; they are deliberately not surfaced anywhere in the public site. If a future page wants to show "what landed," it gets its own spec.
- **Atom search / filtering / tags**: no taxonomy UI. Three series fit on one screen; UI for filtering 30+ atoms is a problem for when 30+ atoms exist.
- **OG images per atom**: site already has a generic OG strategy; per-atom OG is a polish item, not core.
- **RSS for series**: not added in this spec. The existing `rss.xml.js` covers /posts only.

## 10. Open questions left for implementation plan

- Does Astro's content collections handle the dual-locale routing cleanly with the existing `/de` setup, or does each language need its own collection? *(Implementation plan to verify against current `/de` post handling.)*
- How is the atom's `linkedin_url` populated? Manual, one-time, in atom frontmatter at sync time.
- What's the responsive breakpoint where 5-up collapses? Recommend: `lg:` 5-col, `md:` 2-col, default 1-col. Verify against existing breakpoints in `index.astro`.

---

**Approval:** brainstorm session approved by Pascal on 2026-05-06.
**Next step:** invoke `superpowers:writing-plans` to produce an implementation plan against this spec.
