---
name: series-add
description: Use when the user wants to add a published LinkedIn series to /series on the website. Triggers on phrases like "add the [topic] series to the site", "publish [topic] on /series", "sync new series", "the [topic] series is ready", "the [topic] analytics are in". Reads brand-repo state, runs pnpm series:add, walks through the missing fields conversationally, verifies the build, and reminds about the cross-link from the matching synthesis essay on /posts.
---

# Adding a published LinkedIn series to the website

Use this skill when Pascal says any of:
- "Add the [topic] series to the site"
- "Publish [topic] on /series"
- "Sync the new series"
- "The [topic] series is ready"
- "The [topic] analytics are in, let's add it"

## Steps

1. **Confirm the brand repo is configured.**
   Check `scripts/series-config.json` exists. If not, ask Pascal for the path and create it. Default expected: `/Users/pascalgiessler/Developer/02_Personal/07_Brand` (Brand-OS; series source lives in `07_content/topics/`, exposed via the root `topics/` symlink). The legacy `04_LinkedinBrand` repo is archived as of 2026-05-20.

2. **List pending topics.**
   Run `pnpm series:list-pending` and report what's available. If Pascal already named a topic, validate it appears. If not, ask which one.

3. **Run sync.**
   Run `pnpm series:add <topic>` (without `--force` first). If the topic has empty analytics but Pascal confirms it IS published on LinkedIn, re-run with `--force`. Report what was synced (atom counts) and what was skipped (atoms with no matching analytics — typically unpublished drafts).

4. **Refine `_series.md` conversationally.**
   Read the generated `src/content/series/<topic>/_series.md`. Walk through:
   - **title**: suggest a polished version of the auto-generated title (Title Case, drop hyphens). Confirm with Pascal.
   - **italic_word**: default to the last word of the title. Pascal can override (e.g., "for Leadership" is two words).
   - **position**: keep the auto-incremented value unless Pascal wants reordering.
   - **synthesis_post**: check `src/content/post/` for an essay matching the topic. If a match exists, fill it in. Otherwise leave as `TODO` or remove the field entirely (the schema has it as optional).
   - **thesis**: if the auto-extracted thesis from `narrative-arc.md` reads roughly, draft a 2–3 sentence version with Pascal.
   - **published_at**: must be quoted (e.g., `published_at: "2026-04-24"`) — Astro's YAML parser otherwise reads bare dates as Date objects and the schema rejects them.

5. **Replace `linkedin_url: TODO` per atom.**
   List all atoms in the new series with `linkedin_url: TODO`. For each, ask Pascal for the LinkedIn URL one at a time. Edit the frontmatter line. If Pascal doesn't have a URL ready, either leave as TODO (footer attribution line is omitted) or set to `""` (same result). Don't fabricate URLs.

6. **Verify the build.**
   Run `pnpm astro check`. If errors, fix them (most likely a frontmatter type mismatch — check the zod schema in `src/content.config.js`).
   Ask Pascal to visit `/series` in the dev server to confirm the new section renders.

7. **Cross-link reminder.**
   If `synthesis_post` was set, remind Pascal:
   > The synthesis essay at `/post/<slug>` doesn't currently link back to `/series#<topic>`. That's a separate, lower-priority change — out of scope for this skill but worth noting.

8. **Commit suggestion (don't auto-commit).**
   Suggest a commit message:
   ```
   feat(series): add <Topic Title> series

   <N> atoms, <EN|DE>, synthesizes <synthesis-post-slug-or-none>.
   ```

## When sync output flags skipped atoms

The script reports atoms it skipped due to missing analytics matches:

```
4 atoms skipped (no matching analytics, treated as unpublished drafts):
  - 06-prototype-production-cliff-v2.md
  - 06-prototype-production-cliff.md
  - 07-agentic-graveyard-2026.md
  - 08-the-model-swap-test.md
Use --force to include them anyway.
```

If Pascal confirms any of those atoms ARE published but unmeasured, re-run with `--force`. Otherwise leave them out — they'll auto-appear next time their analytics file lands and you re-run the sync.

## Skill is a wrapper, not a replacement

If anything fails, the spec at `docs/superpowers/specs/2026-05-06-series-page-design.md` §9 is the authoritative manual checklist.
