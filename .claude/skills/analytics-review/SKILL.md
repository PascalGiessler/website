---
name: analytics-review
description: Pull traffic data from the self-hosted OpenPanel instance, turn it into the metrics that matter for Pascal's DACH-AI positioning, and propose or apply concrete site changes. Use this whenever Pascal asks how the site is doing, what the traffic or analytics look like, which pages are working, why nobody is subscribing, whether the glossary or tools pages are pulling anyone in, how the German audience is developing, or asks to optimize/improve the site based on data. Also use it when he mentions OpenPanel, page views, visitors, bounce, referrers, or conversion, even if he does not say the word "analytics".
---

# Analytics review

Turn OpenPanel data into decisions about the site. The point is never the dashboard: it is the next edit to the site. A review that ends in a table has failed.

## What this site is trying to do

Optimizing without the goal in mind produces busywork. Everything here ladders to one line (`08_Content_Strategy/_strategy/positioning.md`):

> **The architect against Cognitive Debt — sovereign AI for regulated DACH organisations.**

So the site's job, in order:
1. **Be found in DACH** by people searching agentic-AI and sovereignty vocabulary. `/glossary/` and `/cognitive-debt/` are the nets.
2. **Prove the thesis** once they arrive: essays argue it, `/tools/` shows it built.
3. **Convert attention into audience**: the only real conversion this static site has is an **outbound click to Substack**. There is no form to measure beyond that, so treat Substack clicks as the north-star action and page depth as the leading indicator.

A traffic increase that does not move DACH share or Substack clicks is vanity.

## Step 1: Get the data

```bash
node .claude/skills/analytics-review/scripts/openpanel-report.mjs --days 30
```

Useful flags: `--days 7|30|90` (compare windows to see trend), `--json report.json` (machine-readable), `--probe` (dump one raw event when a field looks wrong or empty).

**Credentials.** The script needs a **read-mode** OpenPanel client. The site's tracking client is `write`-mode and the API refuses to export with it (`"Client is not allowed to export"`). If the script reports missing or rejected credentials, tell Pascal to create a read client in the OpenPanel dashboard (Project → Clients → mode: `read`) and drop it into `.claude/openpanel.local.json`:

```json
{
  "apiUrl": "https://analytics.continental.extrain.io/api",
  "clientId": "...",
  "clientSecret": "..."
}
```

That file is gitignored, and it must stay that way: the client secret is a live credential and this repo is public.

**Two honest limits, state them rather than fudging:**
- OpenPanel reports **referrers, not search keywords**. If a question is really about *which queries* people used, that is Search Console, not this (`docs/seo-setup.md`).
- Glossary terms are **anchors on one page**, so a term's individual popularity is not measurable. Only `/glossary/` as a whole is. If Pascal wants per-term data, that is an argument for splitting terms into pages, which is a real decision with a cost, not a quick fix.

## Step 2: Read the numbers like an analyst, not a reporter

Look for the gap between what the site is *supposed* to do and what it *is* doing. Some patterns and what they actually mean:

| What you see | What it probably means | The move |
|---|---|---|
| Good traffic, **low DACH share** | Ranking with the wrong audience: EN pages pulling US/global readers while the German pages stay invisible | Strengthen German surfaces: DE metadata, DE-language essays, internal links from EN → DE equivalents |
| **Glossary is a top entry page, high single-page rate** | The net works, the hook does not. People get their definition and leave | The term's `reads:` links in `src/data/glossary.ts` are the next step; make sure the entered term has them, and that the CTA is above where they stop reading |
| Traffic to essays, **near-zero Substack clicks** | The writing lands but never asks for anything | CTA placement/wording. It sits at the end of the article; consider whether the reader ever gets there |
| **Pillar page gets few entries** | `/cognitive-debt/` is not ranking for the term it owns | This is the flagship. Check GSC for impressions vs clicks: impressions but no clicks = title/description problem, no impressions = indexing/authority problem |
| A tool page is the **top entry** | The tools are the acquisition channel, not the essays | Lean in: link from tool pages into the pillar and the essays, not just out to GitHub |
| Search share high, **AI-assistant referrals zero** | Classic SEO works, GEO does not | The structured-data / canonical-FAQ work is the lever (`src/data/entity.ts`) |
| A page has views but **no onward navigation anywhere** | Dead end | Every page should offer the obvious next step. Check its cross-links |

Compare two windows (e.g. `--days 7` against `--days 30`) before calling anything a trend. With low traffic, most week-to-week movement is noise; say so instead of inventing a story. Small numbers deserve honesty: "12 sessions is too few to conclude anything" is a legitimate and useful finding.

## Step 3: Propose changes, then make them

Bring Pascal a short list of **specific edits**, each tied to an observation and ordered by expected impact. Not "improve the glossary" but "glossary is the #1 entry page with a 78% single-page rate, and 6 of its 30 terms have no `reads:` links; add them so the page routes people into the essays."

Then, once he picks:

- **Make the change** in the codebase. The relevant levers are almost always one of: page copy/metadata (`title`, `description`, `keywords`, the `jsonLd`/`image` props), internal links (`src/data/glossary.ts` `reads:`, cross-links in `src/content/post/*.md`), CTA placement (`src/components/subscribe-cta.astro`), nav (`src/collections/menu.json` + `src/i18n/ui.ts`), or new content.
- **Respect the house rules** in `CLAUDE.md`: trailing slashes on every internal link, language-scoped essay URLs, no hreflang on single-language pages, no `FAQPage` schema without the matching visible Q&A, no em-dashes in copy, dark/gold/Cormorant design language.
- **Verify**: `pnpm build` and `pnpm test:scripts` must pass, and the internal-link check must stay clean.
- **Record the baseline**: write the key numbers into the report so the next review can tell whether the change worked. A change nobody measures afterwards is a guess.

## Step 4: Close the loop

End with what to watch and when: "Glossary single-page rate is 78% today; re-run in two weeks and it should fall if the `reads:` links work. If it does not, the problem is the CTA, not the links."

Keep a dated report in `analytics-reports/` (gitignored) so successive reviews can be compared rather than re-derived.

## Report format

```markdown
# Analytics review — <window>

## What the data says
3-6 bullets. Numbers first, interpretation second. Flag anything too small to conclude from.

## What is working
Keep doing this.

## What is not, and why
The gap between intent and behaviour, with the evidence.

## Proposed changes
1. <specific edit> — because <observation>. Expect <effect>.
2. ...

## What to watch next
The metric, the direction, the horizon.
```
