# /series Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/series` (and `/de/series`) — a page that surfaces three published LinkedIn-atom series as stacked sections of hook-forward tiles, with each atom rendering on-site at `/series/[topic]/[atom-slug]`. Plus a sync script and skill that turns "add the next series" into a one-command workflow.

**Architecture:** Two new Astro content collections (`series` for `_series.md` metadata, `atom` for numbered atom files). Two index pages (mirror `/posts` ↔ `/de/posts` pattern). One dynamic atom route at `/series/[topic]/[atom]` (single URL space, matching the existing single-route `/post/[slug]` convention — NOT mirrored to `/de/series/[topic]/[atom]`). A Node script `scripts/sync-series.mjs` for stripping LinkedIn-only sections and copying atoms from the brand repo. A project-local skill at `.claude/skills/series-add/SKILL.md` that wraps the workflow.

**Tech Stack:** Astro 6, Tailwind CSS 4, content collections (`astro:content`), zod schema validation, Node 22's built-in `node:test` runner for the sync script's pure functions, pnpm scripts.

---

## Deviation from spec (intentional)

**Spec §2 says** atom URLs are `/series/[topic]/[atom-slug]` AND `/de/series/[topic]/[atom-slug]`. **The plan implements only the unmirrored URL** (`/series/[topic]/[atom]`), matching the existing `/post/[slug]` pattern (single URL per piece of content, language indicated by badge). Rationale: the existing site has no `/de/post/` mirror; introducing a `/de/series/` mirror for atoms would be inconsistent with how posts work, and would double the route complexity for no reader benefit. Index pages (`/series` and `/de/series`) ARE mirrored, matching `/posts` ↔ `/de/posts`.

This deviation should be reviewed during the user-review-gate after Task 1.

---

## File structure

### New files

| Path | Responsibility |
|---|---|
| `src/content.config.js` (modify) | Add `series` and `atom` collections with zod schemas |
| `src/content/series/<topic>/_series.md` (×3) | Series metadata: title, italic_word, position, language, thesis, synthesis_post |
| `src/content/series/<topic>/[NN]-<slug>.md` (×~14) | Atom content: title, position, linkedin_url + HOOK/BODY/CTA sections |
| `src/components/series-tile.astro` | Single atom tile (position, hook, arrow + Level-2 hover) |
| `src/components/series-section.astro` | Series header + tile row |
| `src/pages/series.astro` | English `/series` index |
| `src/pages/de/series.astro` | German `/de/series` index |
| `src/pages/series/[topic]/[atom].astro` | Dynamic atom route + getStaticPaths |
| `src/layouts/atom.astro` | Atom page layout (HOOK as italic Cormorant pull-quote, BODY prose, footer with LinkedIn attribution + prev/next) |
| `src/lib/series.ts` | Pure helpers: `slugFromFilename`, `parseAtomBody`, `topicFromId` (importable + testable) |
| `scripts/sync-series.mjs` | CLI: `list-pending` and `add <topic>` commands |
| `scripts/sync-series.test.mjs` | `node:test` cases for the strip/parse logic |
| `scripts/series-config.json` | `{ "brand_repo_path": "..." }` (gitignored — local override) |
| `.claude/skills/series-add/SKILL.md` | Conversational wrapper around the sync script |

### Modified files

| Path | Change |
|---|---|
| `src/collections/menu.json` | Add `{ "key": "series", "url": "/series" }` (en) and `{ "key": "series", "url": "/de/series" }` (de) |
| `src/i18n/ui.ts` | Add `nav.series`, plus series-page strings (`series.eyebrow`, `series.heroTitle`, `series.heroBody`, `atom.linkedinAttribution`, `atom.backToSeries`, `atom.nextAtom`, `atom.synthesis`) |
| `src/assets/css/main.css` | Add `.series-tile`, `.series-section`, `.atom-page` styles + Level-2 hover (gold-dot motif) |
| `package.json` | Add `series:list-pending` and `series:add` scripts; add `"test:scripts": "node --test scripts/"` |
| `.gitignore` | Add `scripts/series-config.json` (per-machine path) |

---

## Task list

### Task 1: Spec deviation review gate

**Files:** None (review checkpoint)

- [ ] **Step 1: Surface the deviation to the user**

Show the user this paragraph and wait for explicit approval before proceeding:

> **Plan deviates from spec §2:** atom URLs will be `/series/[topic]/[atom]` only (single URL space), not mirrored to `/de/series/[topic]/[atom]`. This matches the existing `/post/[slug]` convention. Index pages (`/series` + `/de/series`) ARE mirrored. Approve to continue, or request the spec/plan be revised to mirror atom routes.

If user requests mirroring instead, the plan needs Task 11b added (`src/pages/de/series/[topic]/[atom].astro` mirror route with the same `getStaticPaths` body); §6 collection schema is unaffected.

- [ ] **Step 2: Capture the decision**

Add a one-line note to the spec (`docs/superpowers/specs/2026-05-06-series-page-design.md`) under §2 reflecting the chosen URL strategy. Commit:

```bash
git add docs/superpowers/specs/2026-05-06-series-page-design.md
git commit -m "docs(series): record atom URL strategy decision per implementation review"
```

---

### Task 2: Define content collections

**Files:**
- Modify: `src/content.config.js`

- [ ] **Step 1: Update content.config.js**

Replace contents:

```js
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/post" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    dateFormatted: z.string(),
    lang: z.enum(["en", "de"]).default("en"),
  }),
});

// Series metadata: one _series.md per topic directory
const seriesCollection = defineCollection({
  loader: glob({ pattern: "*/_series.md", base: "./src/content/series" }),
  schema: z.object({
    title: z.string(),
    italic_word: z.string(),
    position: z.number().int().positive(),
    language: z.enum(["en", "de"]),
    published_at: z.string(),
    atom_count: z.number().int().positive(),
    thesis: z.string(),
    synthesis_post: z.string().optional(),
  }),
});

// Atoms: numbered markdown files inside each topic directory
const atomCollection = defineCollection({
  loader: glob({ pattern: "*/[0-9]*-*.md", base: "./src/content/series" }),
  schema: z.object({
    title: z.string(),
    position: z.number().int().positive(),
    linkedin_url: z.string().optional(),
    series: z.string(),
  }).passthrough(),
});

export const collections = {
  post: postCollection,
  series: seriesCollection,
  atom: atomCollection,
};
```

The `.passthrough()` on `atomCollection` accepts the extra fields the brand repo uses (`style`, `series_type`, `word_count_target`, etc.) without listing them all.

- [ ] **Step 2: Verify Astro picks up the new collections**

Run: `pnpm astro sync`
Expected: completes without error. The `.astro/types.d.ts` regenerates with `series` and `atom` types.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.js
git commit -m "feat(series): add series and atom content collections"
```

---

### Task 3: Build the strip-atom-body helper with TDD

**Files:**
- Create: `src/lib/series.ts`
- Create: `scripts/sync-series.test.mjs`

This pure function is the only piece of the implementation that warrants real unit tests — it transforms LinkedIn atom markdown into website atom markdown by stripping internal sections.

- [ ] **Step 1: Write the failing test file**

Create `scripts/sync-series.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { stripLinkedInSections, slugFromFilename, parseAtomFrontmatter } from "../src/lib/series.ts";

test("stripLinkedInSections removes HASHTAGS, FIRST COMMENT, ENGAGEMENT STRATEGY, Visual", () => {
  const input = `---
title: Foo
---

## HOOK

The hook line.

## BODY

The body paragraph.

## CTA

The cta question.

## HASHTAGS

#One #Two

## FIRST COMMENT

Internal note.

## ENGAGEMENT STRATEGY

- Bullet

## Visual

\`\`\`yaml
image_type: quote-card
\`\`\`
`;
  const out = stripLinkedInSections(input);
  assert.match(out, /## HOOK/);
  assert.match(out, /## BODY/);
  assert.match(out, /## CTA/);
  assert.doesNotMatch(out, /## HASHTAGS/);
  assert.doesNotMatch(out, /## FIRST COMMENT/);
  assert.doesNotMatch(out, /## ENGAGEMENT STRATEGY/);
  assert.doesNotMatch(out, /## Visual/);
  assert.doesNotMatch(out, /image_type: quote-card/);
});

test("stripLinkedInSections preserves frontmatter intact", () => {
  const input = `---
title: Foo
position: 1
linkedin_url: https://example.com
---

## HOOK
Body.
`;
  const out = stripLinkedInSections(input);
  assert.match(out, /^---\ntitle: Foo\nposition: 1\nlinkedin_url: https:\/\/example.com\n---/);
});

test("stripLinkedInSections is idempotent", () => {
  const input = `---
title: X
---

## HOOK

Hook.

## BODY

Body.
`;
  assert.equal(stripLinkedInSections(input), stripLinkedInSections(stripLinkedInSections(input)));
});

test("slugFromFilename strips leading digits and dash", () => {
  assert.equal(slugFromFilename("01-the-paradox.md"), "the-paradox");
  assert.equal(slugFromFilename("12-foo-bar.md"), "foo-bar");
});

test("slugFromFilename throws on filename without numeric prefix", () => {
  assert.throws(() => slugFromFilename("no-prefix.md"), /numeric prefix/);
});

test("parseAtomFrontmatter extracts position and title", () => {
  const md = `---
title: "The Paradox"
position: 1
series: "ai-cognitive-debt"
---

## HOOK
Body.
`;
  const fm = parseAtomFrontmatter(md);
  assert.equal(fm.title, "The Paradox");
  assert.equal(fm.position, 1);
  assert.equal(fm.series, "ai-cognitive-debt");
});
```

- [ ] **Step 2: Run the tests to confirm they fail (no source file yet)**

Run: `node --test scripts/sync-series.test.mjs`
Expected: FAIL — `Cannot find module ../src/lib/series.ts`

- [ ] **Step 3: Implement the helpers**

Create `src/lib/series.ts`:

```ts
const STRIP_HEADINGS = new Set([
  "HASHTAGS",
  "FIRST COMMENT",
  "ENGAGEMENT STRATEGY",
  "Visual",
]);

/**
 * Strip LinkedIn-only sections from an atom's markdown.
 * Keeps frontmatter, HOOK, BODY, CTA. Removes everything from a stripped
 * heading through the next H2 or end-of-file.
 */
export function stripLinkedInSections(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let skipping = false;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const heading = h2[1].trim();
      skipping = STRIP_HEADINGS.has(heading);
      if (skipping) continue;
    }
    if (!skipping) out.push(line);
  }

  // Trim trailing blank lines from removal
  while (out.length && out[out.length - 1] === "") out.pop();
  return out.join("\n") + "\n";
}

/**
 * Strip the leading `NN-` numeric prefix from an atom filename
 * to produce a clean URL slug.
 */
export function slugFromFilename(filename: string): string {
  const m = filename.match(/^(\d+)-(.+?)\.md$/);
  if (!m) {
    throw new Error(`Atom filename "${filename}" must have numeric prefix (e.g. 01-foo.md)`);
  }
  return m[2];
}

/**
 * Extract the topic slug and atom slug from a content-collection entry id.
 * "ai-cognitive-debt/01-the-paradox" -> { topic: "ai-cognitive-debt", atom: "the-paradox" }
 */
export function topicFromId(id: string): { topic: string; atom: string } {
  const idx = id.indexOf("/");
  if (idx < 0) throw new Error(`Atom id "${id}" must include topic directory`);
  const topic = id.slice(0, idx);
  const filename = id.slice(idx + 1);
  return { topic, atom: slugFromFilename(filename + ".md") };
}

/**
 * Parse an atom's frontmatter into a plain object.
 * Minimal YAML parser — handles only the formats the brand repo uses
 * (string, number, quoted-string, single-line lists).
 */
export function parseAtomFrontmatter(md: string): Record<string, unknown> {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    let value: unknown = raw.trim();
    if (typeof value === "string") {
      if (/^\d+$/.test(value)) value = Number.parseInt(value, 10);
      else if (/^".*"$/.test(value)) value = value.slice(1, -1);
      else if (/^\[.*\]$/.test(value)) value = value.slice(1, -1).split(",").map((s) => s.trim());
    }
    out[key] = value;
  }
  return out;
}

/**
 * Split an atom's body into named sections by H2 heading.
 * Returns { HOOK, BODY, CTA } as raw markdown strings.
 */
export function parseAtomBody(md: string): { hook: string; body: string; cta: string } {
  const after = md.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const sections: Record<string, string[]> = {};
  let current: string | null = null;
  for (const line of after.split("\n")) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      current = h2[1].trim().toUpperCase();
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  const join = (k: string) => (sections[k] ?? []).join("\n").trim();
  return { hook: join("HOOK"), body: join("BODY"), cta: join("CTA") };
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

Run: `node --test scripts/sync-series.test.mjs`
Expected: PASS — 6 tests passing.

Note: `node:test` does not natively run `.ts` imports. If the import fails, add a small JS shim — copy the helpers verbatim into `scripts/series-helpers.mjs` and import from there in BOTH the test and the source-of-truth. Resolution: keep `src/lib/series.ts` as the editable source for Astro, add `src/lib/series.mjs` that re-exports the same code in JS, import the `.mjs` in the test. Easier alternative: rename to `src/lib/series.mjs` and import directly into Astro components (Astro accepts `.mjs` imports). Choose the `.mjs` route — Astro doesn't need TS for these helpers.

If choosing the `.mjs` route: rename the file in Step 3 to `src/lib/series.mjs`, drop the type annotations, update imports.

- [ ] **Step 5: Commit**

```bash
git add src/lib/series.mjs scripts/sync-series.test.mjs
git commit -m "feat(series): add atom-stripping helpers with tests"
```

---

### Task 4: Add pnpm test script + run on CI of conscience

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add `test:scripts` script**

Edit `package.json`'s `scripts` section, add after `check`:

```json
"test:scripts": "node --test scripts/*.test.mjs",
```

- [ ] **Step 2: Run it**

Run: `pnpm test:scripts`
Expected: PASS — 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add pnpm test:scripts for node test runner"
```

---

### Task 5: Build sync-series.mjs `list-pending` command

**Files:**
- Create: `scripts/sync-series.mjs`
- Create: `scripts/series-config.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add config to gitignore**

Edit `.gitignore`, add at the end:

```
scripts/series-config.json
```

- [ ] **Step 2: Create the config file**

Create `scripts/series-config.json`:

```json
{
  "brand_repo_path": "/Users/pascalgiessler/Developer/02_Personal/04_LinkedinBrand"
}
```

- [ ] **Step 3: Create the script with the `list-pending` subcommand**

Create `scripts/sync-series.mjs`:

```js
#!/usr/bin/env node
// Sync LinkedIn atom series from the brand repo into src/content/series/.
//
// Usage:
//   pnpm series:list-pending      — show topics with analytics/ that aren't on the site
//   pnpm series:add <topic-slug>  — copy + strip atoms, scaffold _series.md

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import {
  stripLinkedInSections,
  parseAtomFrontmatter,
} from "../src/lib/series.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(ROOT, "scripts", "series-config.json");
const SITE_SERIES = join(ROOT, "src", "content", "series");

function loadConfig() {
  const fromEnv = process.env.BRAND_REPO_PATH;
  if (fromEnv) return { brand_repo_path: fromEnv };
  if (!existsSync(CONFIG_PATH)) {
    console.error(`Missing ${CONFIG_PATH}. Create it with { "brand_repo_path": "..." } or set BRAND_REPO_PATH.`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
}

function topicHasAnalytics(brandRoot, topic) {
  const analyticsDir = join(brandRoot, "topics", topic, "linkedin", "analytics");
  if (!existsSync(analyticsDir)) return false;
  return readdirSync(analyticsDir).length > 0;
}

function listAtomFiles(brandRoot, topic) {
  const scripts = join(brandRoot, "topics", topic, "linkedin", "scripts");
  if (!existsSync(scripts)) return [];
  return readdirSync(scripts)
    .filter((f) => /^\d+-.*\.md$/.test(f))
    .sort();
}

function topicLanguage(brandRoot, topic) {
  // Heuristic: look at first atom's frontmatter for language hint, else default en
  const atoms = listAtomFiles(brandRoot, topic);
  if (atoms.length === 0) return "en";
  const first = readFileSync(join(brandRoot, "topics", topic, "linkedin", "scripts", atoms[0]), "utf8");
  const fm = parseAtomFrontmatter(first);
  if (typeof fm.language === "string") return fm.language;
  // Fallback: filenames with German prefixes / titles
  if (/(souveraen|deutsch|german)/i.test(topic)) return "de";
  return "en";
}

function listPending() {
  const { brand_repo_path: brandRoot } = loadConfig();
  if (!existsSync(brandRoot)) {
    console.error(`Brand repo path does not exist: ${brandRoot}`);
    process.exit(1);
  }
  const topicsDir = join(brandRoot, "topics");
  const all = readdirSync(topicsDir).filter((t) => statSync(join(topicsDir, t)).isDirectory());
  const published = all.filter((t) => topicHasAnalytics(brandRoot, t));
  const onSite = existsSync(SITE_SERIES) ? readdirSync(SITE_SERIES) : [];

  const pending = published.filter((t) => !onSite.includes(t));
  if (pending.length === 0) {
    console.log("No pending series. All published series are on the site.");
    return;
  }
  console.log("Topics with populated analytics/ folders not yet on /series:");
  console.log("");
  for (const t of pending) {
    const atoms = listAtomFiles(brandRoot, t);
    const lang = topicLanguage(brandRoot, t);
    console.log(`  ${t.padEnd(40)} ${String(atoms.length).padStart(2)} atoms   ${lang.toUpperCase()}`);
  }
}

const cmd = process.argv[2];
if (cmd === "list-pending") {
  listPending();
} else if (cmd === "add") {
  // Stubbed in Task 6
  console.error("`add` not yet implemented");
  process.exit(1);
} else {
  console.error("Usage: sync-series.mjs <list-pending|add <topic>>");
  process.exit(1);
}
```

- [ ] **Step 4: Add pnpm scripts**

Edit `package.json`'s `scripts`:

```json
"series:list-pending": "node scripts/sync-series.mjs list-pending",
"series:add": "node scripts/sync-series.mjs add",
```

- [ ] **Step 5: Run list-pending, verify output**

Run: `pnpm series:list-pending`
Expected output (assuming brand repo path is correct):

```
Topics with populated analytics/ folders not yet on /series:

  ai-cognitive-debt                         5 atoms   EN
  generative-ai-strategy-leadership         5 atoms   EN
  ki-souveraenitaet                         4 atoms   DE
```

(`ki-souveraenitaet` will show `EN` if the topic-language heuristic doesn't trigger; that's acceptable — it gets corrected at sync time.)

- [ ] **Step 6: Commit**

```bash
git add scripts/sync-series.mjs package.json .gitignore
git commit -m "feat(series): add sync-series.mjs list-pending command"
```

---

### Task 6: Build sync-series.mjs `add` command

**Files:**
- Modify: `scripts/sync-series.mjs`

- [ ] **Step 1: Replace the `add` stub with the real implementation**

In `scripts/sync-series.mjs`, replace the `} else if (cmd === "add") { ... }` block with:

```js
} else if (cmd === "add") {
  const topic = process.argv[3];
  if (!topic) {
    console.error("Usage: sync-series.mjs add <topic-slug>");
    process.exit(1);
  }
  await addTopic(topic);
}
```

Then add the `addTopic` function above the command dispatch (just below `listPending`):

```js
async function addTopic(topic) {
  const { brand_repo_path: brandRoot } = loadConfig();
  if (!topicHasAnalytics(brandRoot, topic)) {
    console.error(`Topic "${topic}" has no populated analytics/ folder. Refusing to sync.`);
    process.exit(1);
  }

  const sourceDir = join(brandRoot, "topics", topic, "linkedin", "scripts");
  const targetDir = join(SITE_SERIES, topic);
  mkdirSync(targetDir, { recursive: true });

  // 1. Copy + strip atoms
  const atoms = listAtomFiles(brandRoot, topic);
  let copied = 0;
  let skipped = 0;
  for (const filename of atoms) {
    const src = readFileSync(join(sourceDir, filename), "utf8");
    const stripped = stripLinkedInSections(src);
    const targetPath = join(targetDir, filename);

    if (existsSync(targetPath)) {
      const existing = readFileSync(targetPath, "utf8");
      if (existing.includes("<!-- site-edited -->")) {
        console.log(`  skip ${filename} (site-edited sentinel present)`);
        skipped++;
        continue;
      }
    }

    // Ensure linkedin_url placeholder exists in frontmatter
    const fm = parseAtomFrontmatter(stripped);
    let final = stripped;
    if (!("linkedin_url" in fm)) {
      final = stripped.replace(/^---\n/, "---\nlinkedin_url: TODO\n");
    }

    writeFileSync(targetPath, final, "utf8");
    copied++;
  }

  // 2. Scaffold _series.md if absent
  const seriesPath = join(targetDir, "_series.md");
  if (!existsSync(seriesPath)) {
    const narrativeArc = join(brandRoot, "topics", topic, "narrative-arc.md");
    let thesis = "TODO write a 2-3 sentence thesis for this series.";
    if (existsSync(narrativeArc)) {
      const arc = readFileSync(narrativeArc, "utf8");
      const m = arc.match(/##\s+Kernthese\s*\n+([\s\S]*?)(?=\n##\s|$)/);
      if (m) thesis = m[1].trim();
    }
    const lang = topicLanguage(brandRoot, topic);
    const today = new Date().toISOString().slice(0, 10);
    const titleGuess = topic
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const positionGuess = await nextPosition();
    const seriesYaml = [
      "---",
      `title: "${titleGuess}"`,
      `italic_word: "${titleGuess.split(" ").pop()}"`,
      `position: ${positionGuess}`,
      `language: ${lang}`,
      `published_at: ${today}`,
      `atom_count: ${atoms.length}`,
      "thesis: |",
      ...thesis.split("\n").map((l) => `  ${l}`),
      "synthesis_post: TODO",
      "---",
      "",
    ].join("\n");
    writeFileSync(seriesPath, seriesYaml, "utf8");
    console.log(`  created _series.md (review and edit thesis + italic_word + synthesis_post)`);
  }

  console.log("");
  console.log(`Topic ${topic} synced.`);
  console.log(`  ${copied} atoms copied`);
  if (skipped) console.log(`  ${skipped} atoms skipped (site-edited)`);
  console.log("");
  console.log("Next steps (manual):");
  console.log(`  1. Edit src/content/series/${topic}/_series.md — confirm title, italic_word, position, synthesis_post`);
  console.log(`  2. For each atom, replace linkedin_url: TODO with the actual LinkedIn post URL`);
  console.log(`  3. Run: pnpm dev   and visit /series to verify`);
}

async function nextPosition() {
  if (!existsSync(SITE_SERIES)) return 1;
  const topics = readdirSync(SITE_SERIES).filter((d) => statSync(join(SITE_SERIES, d)).isDirectory());
  let max = 0;
  for (const t of topics) {
    const sp = join(SITE_SERIES, t, "_series.md");
    if (!existsSync(sp)) continue;
    const fm = parseAtomFrontmatter(readFileSync(sp, "utf8"));
    if (typeof fm.position === "number" && fm.position > max) max = fm.position;
  }
  return max + 1;
}
```

- [ ] **Step 2: Run the script for all three initial series**

Run sequentially:

```bash
pnpm series:add ai-cognitive-debt
pnpm series:add generative-ai-strategy-leadership
pnpm series:add ki-souveraenitaet
```

Expected: each prints `Topic <topic> synced.` and lists copied atom counts (5, 5, 4). Three new directories appear under `src/content/series/`.

- [ ] **Step 3: Verify atoms have HOOK/BODY/CTA only (no internal sections)**

Run: `grep -l "## HASHTAGS\|## FIRST COMMENT\|## ENGAGEMENT STRATEGY\|## Visual" src/content/series/*/[0-9]*.md`
Expected: empty output (no matches).

- [ ] **Step 4: Hand-edit each `_series.md` for accuracy**

Open each of the three `_series.md` files and adjust:

- `ai-cognitive-debt/_series.md` → `title: "AI Cognitive Debt"`, `italic_word: "Debt"`, `position: 1`, `synthesis_post: "the-invisible-bill-ai-cognitive-debt"`, `published_at: "2026-04-24"`, `thesis:` use the spec §3 copy ("Speed is the input. Understanding is still the job. ...")
- `generative-ai-strategy-leadership/_series.md` → `title: "Generative AI Strategy for Leadership"`, `italic_word: "for Leadership"`, `position: 2`, `synthesis_post: "the-37b-question-enterprise-ai-strategy"`, `published_at: "2026-04-09"`, `thesis:` "$37B spent. 80% no EBIT impact. Where boardroom AI strategy actually fails, and why architecture decisions are strategy decisions in disguise."
- `ki-souveraenitaet/_series.md` → `title: "KI-Souveränität"`, `italic_word: "Souveränität"`, `position: 3`, `language: de`, `synthesis_post:` (none — leave commented out or omit), `published_at: "2026-05-05"`, `thesis:` "Souveränität in KI ist eine Architekturfrage, keine Modellfrage und keine Hosting-Frage. Wer modular und exit-fähig baut, kontrolliert sein KI."

- [ ] **Step 5: Verify Astro types regenerate cleanly**

Run: `pnpm astro sync`
Expected: completes without error.

- [ ] **Step 6: Commit**

```bash
git add src/content/series/ scripts/sync-series.mjs
git commit -m "feat(series): sync three initial series and complete sync-series add command"
```

---

### Task 7: Build the series-tile component

**Files:**
- Create: `src/components/series-tile.astro`

- [ ] **Step 1: Create the component**

Create `src/components/series-tile.astro`:

```astro
---
import { parseAtomBody, slugFromFilename } from "../lib/series.mjs";

interface Props {
  entry: {
    id: string;
    body?: string;
    data: { title: string; position: number; series: string };
  };
}

const { entry } = Astro.props;
const { topic, atom: atomSlug } = (() => {
  const idx = entry.id.indexOf("/");
  return { topic: entry.id.slice(0, idx), atom: slugFromFilename(entry.id.slice(idx + 1) + ".md") };
})();
const { hook } = parseAtomBody(entry.body ?? "");
const positionStr = String(entry.data.position).padStart(2, "0");
const arrowText = entry.data.title.toUpperCase();
---

<a class="series-tile" href={`/series/${topic}/${atomSlug}`}>
  <span class="series-tile__pos">{positionStr}</span>
  <span class="series-tile__hook">{hook}</span>
  <span class="series-tile__arrow">{arrowText} →</span>
</a>
```

- [ ] **Step 2: Add tile styles to main.css**

Add to `src/assets/css/main.css` (append at the end):

```css
/* ── SERIES TILE ───────────────────────────────────── */
.series-tile {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
  padding: 18px 16px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  text-decoration: none;
  cursor: pointer;
  transition: border-color 220ms ease-out, background 220ms ease-out;
}

.series-tile__pos {
  position: relative;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold-dim);
  transition: padding-left 280ms cubic-bezier(0.16, 1, 0.3, 1), color 220ms ease-out;
}

.series-tile__pos::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gold);
  transform: translate(-12px, -50%) scale(0);
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.series-tile__hook {
  font-size: 0.78rem;
  color: var(--text);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.series-tile__arrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: var(--gold);
  margin-top: auto;
  transition: transform 220ms ease-out, color 220ms ease-out;
  display: inline-block;
}

.series-tile:hover {
  border-color: var(--border-gold);
  background: var(--surface-2);
}
.series-tile:hover .series-tile__pos { padding-left: 12px; color: var(--gold); }
.series-tile:hover .series-tile__pos::before { transform: translate(0, -50%) scale(1); }
.series-tile:hover .series-tile__arrow {
  transform: translateX(6px);
  color: var(--gold-light);
}

@media (prefers-reduced-motion: reduce) {
  .series-tile,
  .series-tile__pos,
  .series-tile__pos::before,
  .series-tile__arrow {
    transition: none !important;
  }
  .series-tile:hover .series-tile__pos { padding-left: 0; }
  .series-tile:hover .series-tile__pos::before { transform: translate(-12px, -50%) scale(0); }
  .series-tile:hover .series-tile__arrow { transform: none; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/series-tile.astro src/assets/css/main.css
git commit -m "feat(series): add series-tile component with Level-2 hover motion"
```

---

### Task 8: Build the series-section component

**Files:**
- Create: `src/components/series-section.astro`

- [ ] **Step 1: Create the component**

Create `src/components/series-section.astro`:

```astro
---
import SeriesTile from "./series-tile.astro";
import { getCollection } from "astro:content";

interface Props {
  series: {
    id: string;
    data: {
      title: string;
      italic_word: string;
      position: number;
      language: "en" | "de";
      published_at: string;
      atom_count: number;
      thesis: string;
      synthesis_post?: string;
    };
  };
  /** Resolved synthesis post entry (or null) for the cross-link. */
  synthesisLink?: { href: string; title: string } | null;
  lang: "en" | "de";
}

const { series, synthesisLink, lang } = Astro.props;
const topicSlug = series.id.replace(/\/_series$/, "");

const allAtoms = await getCollection("atom");
const atoms = allAtoms
  .filter((a) => a.id.startsWith(`${topicSlug}/`))
  .sort((a, b) => a.data.position - b.data.position);

// Render title with the italic word(s) wrapped in <em>. Match-from-end for safety.
const { title, italic_word } = series.data;
const titleHead = title.replace(new RegExp(`\\s*${italic_word.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\s*$`), "");

const positionStr = String(series.data.position).padStart(2, "0");
const seriesLabel = lang === "de" ? "SERIE" : "SERIES";
const atomLabel = lang === "de" ? "ATOME" : "ATOMS";
const synthLabel = lang === "de" ? "SYNTHESE" : "SYNTHESIS";
const publishedDate = new Date(series.data.published_at);
const monthYear = publishedDate.toLocaleString(lang === "de" ? "de-DE" : "en-US", { month: "short", year: "numeric" }).toUpperCase();
---

<section class="series-section">
  <header class="series-section__head">
    <p class="series-section__label">
      <span class="series-section__label-strong">{seriesLabel} {positionStr}</span>
      &nbsp;·&nbsp; {series.data.atom_count} {atomLabel} &nbsp;·&nbsp; {monthYear}
    </p>
    <h2 class="series-section__title">
      {titleHead}
      <em>{italic_word}</em>
      {series.data.language !== lang && <span class="post-lang-badge">{series.data.language.toUpperCase()}</span>}
    </h2>
    <p class="series-section__thesis">{series.data.thesis}</p>
    {synthesisLink && (
      <a class="series-section__synthesis" href={synthesisLink.href}>
        {synthLabel} · {synthesisLink.title} →
      </a>
    )}
  </header>

  <div class={`series-section__row series-section__row--${atoms.length}`}>
    {atoms.map((atom) => <SeriesTile entry={atom} />)}
  </div>
</section>
```

- [ ] **Step 2: Add section styles to main.css**

Append to `src/assets/css/main.css`:

```css
/* ── SERIES SECTION ────────────────────────────────── */
.series-section {
  margin-bottom: 72px;
}
.series-section:last-child { margin-bottom: 0; }

.series-section__head { margin-bottom: 28px; }

.series-section__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold-dim);
}
.series-section__label-strong { color: var(--gold); }

.series-section__title {
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--text);
  margin: 8px 0 14px;
}
.series-section__title em {
  font-style: italic;
  color: var(--gold-light);
}

.series-section__thesis {
  font-size: 0.85rem;
  color: var(--text-2);
  line-height: 1.65;
  max-width: 56ch;
  margin: 0 0 6px;
}

.series-section__synthesis {
  display: inline-block;
  margin-top: 6px;
  padding-bottom: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold-dim);
  border-bottom: 1px solid var(--border-gold);
  text-decoration: none;
  transition: color 220ms ease-out, border-color 220ms ease-out;
}
.series-section__synthesis:hover {
  color: var(--gold);
  border-color: var(--gold);
}

.series-section__row {
  display: grid;
  gap: 12px;
}
.series-section__row--3 { grid-template-columns: 1fr; }
.series-section__row--4 { grid-template-columns: 1fr; }
.series-section__row--5 { grid-template-columns: 1fr; }

@media (min-width: 640px) {
  .series-section__row--3,
  .series-section__row--4,
  .series-section__row--5 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .series-section__row--3 { grid-template-columns: repeat(3, 1fr); }
  .series-section__row--4 { grid-template-columns: repeat(4, 1fr); }
  .series-section__row--5 { grid-template-columns: repeat(5, 1fr); }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/series-section.astro src/assets/css/main.css
git commit -m "feat(series): add series-section component"
```

---

### Task 9: Build the English `/series` index page

**Files:**
- Create: `src/pages/series.astro`
- Modify: `src/i18n/ui.ts` (add series-page strings)

- [ ] **Step 1: Add i18n strings**

In `src/i18n/ui.ts`, add to BOTH the `en` and `de` blocks. Insert these keys after `'nav.publications'`:

For `en`:
```ts
'nav.series': 'Series',
'series.eyebrow': 'Series',
'series.heroTitle': 'Three',
'series.heroTitleAccent': 'arcs',
'series.heroTitleTail': ', told in atoms.',
'series.heroBody': "Each series is a connected sequence of short LinkedIn posts, written across two weeks. They make an argument together that no single post can make alone. The long-form synthesis of each lives on Writing.",
'atom.linkedinAttribution': 'Originally on LinkedIn',
'atom.linkedinCta': 'Read & reply →',
'atom.backToSeries': '← Back to series',
'atom.nextAtom': 'Next atom',
'atom.synthesis': 'Synthesis',
'atom.allAtoms': (n: number) => `All ${n} atoms`,
```

For `de`:
```ts
'nav.series': 'Serien',
'series.eyebrow': 'Serien',
'series.heroTitle': 'Drei',
'series.heroTitleAccent': 'Bögen',
'series.heroTitleTail': ', erzählt in Atomen.',
'series.heroBody': "Jede Serie ist eine zusammenhängende Folge kurzer LinkedIn-Beiträge, geschrieben über zwei Wochen. Gemeinsam tragen sie ein Argument, das kein einzelner Beitrag tragen kann. Die ausführliche Synthese jeder Serie steht unter Schreiben.",
'atom.linkedinAttribution': 'Ursprünglich auf LinkedIn',
'atom.linkedinCta': 'Lesen & antworten →',
'atom.backToSeries': '← Zur Serie',
'atom.nextAtom': 'Nächstes Atom',
'atom.synthesis': 'Synthese',
'atom.allAtoms': (n: number) => `Alle ${n} Atome`,
```

Note the `atom.allAtoms` key is a function (returns localized count). The `useTranslations` helper currently assumes string values. Update `useTranslations` to allow function values:

In `src/i18n/ui.ts`, replace the `useTranslations` function:

```ts
export function useTranslations(lang: Lang) {
  return function t(key: UIKey, ...args: unknown[]): string {
    const v = ui[lang][key] ?? ui[defaultLang][key];
    return typeof v === "function" ? (v as (...a: unknown[]) => string)(...args) : v;
  };
}
```

The `UIKey` type also needs updating:

```ts
export type UIKey = keyof (typeof ui)[typeof defaultLang];
```

Already in place — the typeof picks up function values fine.

- [ ] **Step 2: Create the index page**

Create `src/pages/series.astro`:

```astro
---
import Layout from "../layouts/main.astro";
import SeriesSection from "../components/series-section.astro";
import { getCollection } from "astro:content";
import { getLangFromUrl, useTranslations } from "../i18n/ui";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const allSeries = await getCollection("series");
const allPosts = await getCollection("post");
const sorted = allSeries.sort((a, b) => a.data.position - b.data.position);

function synthesisLinkFor(seriesEntry: typeof sorted[number]) {
  const slug = seriesEntry.data.synthesis_post;
  if (!slug || slug === "TODO") return null;
  const post = allPosts.find((p) => p.id.replace(/\.md$/, "") === slug);
  if (!post) return null;
  return { href: `/post/${slug}`, title: post.data.title };
}
---

<Layout
  title={t("series.eyebrow")}
  description={t("series.heroBody")}
>
  <main class="relative z-10 max-w-[1080px] mx-auto px-8 pt-28 pb-32 lg:pt-36">

    <div class="mb-14 pb-12 border-b" style="border-color: var(--border);">
      <p class="section-label mb-3 fade-up delay-1">{t("series.eyebrow")}</p>
      <h1
        class="fade-up delay-2"
        style="font-family: 'Cormorant', Georgia, serif; font-size: clamp(2.4rem, 5.5vw, 3.4rem); font-weight: 300; line-height: 1.05; letter-spacing: -0.02em; color: var(--text); margin-bottom: 18px;"
      >
        {t("series.heroTitle")} <em style="font-style: italic; color: var(--gold-light);">{t("series.heroTitleAccent")}</em>{t("series.heroTitleTail")}
      </h1>
      <p
        class="fade-up delay-3 text-base leading-relaxed"
        style="color: var(--text-2); max-width: 56ch;"
      >
        {t("series.heroBody")}
      </p>
    </div>

    <div class="fade-up delay-4">
      {sorted.map((s) => (
        <SeriesSection
          series={s}
          synthesisLink={synthesisLinkFor(s)}
          lang={lang}
        />
      ))}
    </div>

  </main>
</Layout>
```

- [ ] **Step 3: Run dev server and visit /series**

Run: `pnpm dev` (in background or another terminal)
Open: http://localhost:4321/series
Expected:
- Page hero "Three arcs, told in atoms." with italic gold "arcs"
- Three series sections stacked, each with: label, title, thesis, synthesis link (where applicable), tile row
- Tile rows: 5/5/4 in lg breakpoint; collapse to 2/2/2 at md, 1/1/1 below
- Hover on any tile shows the gold dot animating in, surface lift, arrow nudge

If anything fails: `pnpm astro check` for type errors; check the browser console; verify atoms have `position` in their frontmatter.

- [ ] **Step 4: Run `astro check`**

Run: `pnpm astro check`
Expected: 0 errors, 0 warnings, 0 hints (or matches the count from before this branch).

- [ ] **Step 5: Commit**

```bash
git add src/pages/series.astro src/i18n/ui.ts
git commit -m "feat(series): add /series index page"
```

---

### Task 10: Build the German `/de/series` mirror

**Files:**
- Create: `src/pages/de/series.astro`

- [ ] **Step 1: Create the German mirror**

Create `src/pages/de/series.astro`:

```astro
---
import Layout from "../../layouts/main.astro";
import SeriesSection from "../../components/series-section.astro";
import { getCollection } from "astro:content";
import { getLangFromUrl, useTranslations } from "../../i18n/ui";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const allSeries = await getCollection("series");
const allPosts = await getCollection("post");
const sorted = allSeries.sort((a, b) => a.data.position - b.data.position);

function synthesisLinkFor(seriesEntry: typeof sorted[number]) {
  const slug = seriesEntry.data.synthesis_post;
  if (!slug || slug === "TODO") return null;
  const post = allPosts.find((p) => p.id.replace(/\.md$/, "") === slug);
  if (!post) return null;
  // /de/post/<slug> doesn't exist; fall back to /post/<slug> per current convention
  return { href: `/post/${slug}`, title: post.data.title };
}
---

<Layout
  title={t("series.eyebrow")}
  description={t("series.heroBody")}
>
  <main class="relative z-10 max-w-[1080px] mx-auto px-8 pt-28 pb-32 lg:pt-36">

    <div class="mb-14 pb-12 border-b" style="border-color: var(--border);">
      <p class="section-label mb-3 fade-up delay-1">{t("series.eyebrow")}</p>
      <h1
        class="fade-up delay-2"
        style="font-family: 'Cormorant', Georgia, serif; font-size: clamp(2.4rem, 5.5vw, 3.4rem); font-weight: 300; line-height: 1.05; letter-spacing: -0.02em; color: var(--text); margin-bottom: 18px;"
      >
        {t("series.heroTitle")} <em style="font-style: italic; color: var(--gold-light);">{t("series.heroTitleAccent")}</em>{t("series.heroTitleTail")}
      </h1>
      <p
        class="fade-up delay-3 text-base leading-relaxed"
        style="color: var(--text-2); max-width: 56ch;"
      >
        {t("series.heroBody")}
      </p>
    </div>

    <div class="fade-up delay-4">
      {sorted.map((s) => (
        <SeriesSection
          series={s}
          synthesisLink={synthesisLinkFor(s)}
          lang={lang}
        />
      ))}
    </div>

  </main>
</Layout>
```

(Body identical to `/series.astro`; the `useTranslations(lang)` produces the German strings because `getLangFromUrl` reads `/de/` from the URL.)

- [ ] **Step 2: Verify in dev server**

Open: http://localhost:4321/de/series
Expected:
- Hero: "Drei _Bögen_, erzählt in Atomen."
- Section labels say "SERIE" not "SERIES", "ATOME" not "ATOMS"
- Synthesis link says "SYNTHESE"

- [ ] **Step 3: Commit**

```bash
git add src/pages/de/series.astro
git commit -m "feat(series): add German /de/series mirror"
```

---

### Task 11: Add the `Series` nav menu item

**Files:**
- Modify: `src/collections/menu.json`

- [ ] **Step 1: Edit menu.json**

Replace contents:

```json
{
  "en": [
    { "key": "about", "url": "/about" },
    { "key": "writing", "url": "/posts" },
    { "key": "series", "url": "/series" },
    { "key": "publications", "url": "/links" }
  ],
  "de": [
    { "key": "about", "url": "/de/about" },
    { "key": "writing", "url": "/de/posts" },
    { "key": "series", "url": "/de/series" },
    { "key": "publications", "url": "/de/links" }
  ]
}
```

- [ ] **Step 2: Verify the nav renders correctly**

Open: http://localhost:4321/
Expected: nav shows "About · Writing · Series · Publications"

Open: http://localhost:4321/de/
Expected: nav shows "Über mich · Schreiben · Serien · Publikationen"

- [ ] **Step 3: Commit**

```bash
git add src/collections/menu.json
git commit -m "feat(series): add Series to main nav for both locales"
```

---

### Task 12: Build the atom layout

**Files:**
- Create: `src/layouts/atom.astro`

- [ ] **Step 1: Create the layout**

Create `src/layouts/atom.astro`:

```astro
---
import Layout from "./main.astro";
import { getLangFromUrl, useTranslations } from "../i18n/ui";

interface Props {
  atom: {
    data: {
      title: string;
      position: number;
      linkedin_url?: string;
      series: string;
    };
  };
  series: {
    data: {
      title: string;
      atom_count: number;
      synthesis_post?: string;
    };
  };
  hookText: string;
  prev: { href: string; title: string; position: number } | null;
  next: { href: string; title: string; position: number } | null;
  synthesisHref: string | null;
  synthesisTitle: string | null;
}

const { atom, series, hookText, prev, next, synthesisHref, synthesisTitle } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const positionStr = String(atom.data.position).padStart(2, "0");
const totalStr = String(series.data.atom_count).padStart(2, "0");
const ofLabel = lang === "de" ? "VON" : "OF";
const atomLabel = lang === "de" ? "ATOM" : "ATOM";
const seriesIndexHref = lang === "de" ? "/de/series" : "/series";

// Italicize the last word of the title
const words = atom.data.title.trim().split(/\s+/);
const lastWord = words.pop();
const titleHead = words.join(" ");

const linkedinUrl = atom.data.linkedin_url && atom.data.linkedin_url !== "TODO" ? atom.data.linkedin_url : null;
---

<Layout title={atom.data.title} description={hookText.split("\n")[0] ?? atom.data.title}>
  <main class="relative z-30 max-w-3xl mx-auto pb-24" style="padding-top: 7rem;">

    <div class="px-6 pb-10 mb-10 border-b lg:px-0" style="border-color: var(--border);">
      <p class="atom-page__crumb">
        <a href={seriesIndexHref}>{t("series.eyebrow")}</a> &nbsp;/&nbsp; <a href={`${seriesIndexHref}#${atom.data.series}`}>{series.data.title}</a>
      </p>
      <p class="atom-page__pos">{atomLabel} {positionStr} {ofLabel} {totalStr}</p>
      <h1 class="atom-page__title">
        {titleHead}{titleHead && " "}<em>{lastWord}</em>
      </h1>
      <p class="atom-page__hero-hook">{hookText}</p>
    </div>

    <article
      class="px-6 lg:px-0 prose prose-invert prose-sm lg:prose-base max-w-none"
      style="
        --tw-prose-body: var(--text);
        --tw-prose-headings: var(--text);
        --tw-prose-links: var(--gold-light);
        --tw-prose-bold: var(--text);
        --tw-prose-quotes: var(--text-2);
        --tw-prose-hr: var(--border);
      "
    >
      <slot />
    </article>

    <div class="atom-page__footer px-6 lg:px-0">
      {linkedinUrl && (
        <p class="atom-page__attribution">
          {t("atom.linkedinAttribution")} ·
          <a href={linkedinUrl} target="_blank" rel="noopener">{t("atom.linkedinCta")}</a>
        </p>
      )}
      {synthesisHref && synthesisTitle && (
        <p class="atom-page__attribution">
          {t("series.eyebrow")} · <a href={`${seriesIndexHref}#${atom.data.series}`}>{series.data.title}</a>
          &nbsp;·&nbsp;
          {t("atom.synthesis")} · <a href={synthesisHref}>{synthesisTitle}</a>
        </p>
      )}

      {(prev || next) && (
        <nav class="atom-page__nav grid grid-cols-2 gap-4" aria-label="Atom navigation">
          <div>
            {prev ? (
              <a href={prev.href} class="atom-page__step group">
                <p class="atom-page__step-label">{String(prev.position).padStart(2, "0")} ←</p>
                <p class="atom-page__step-title">{prev.title}</p>
              </a>
            ) : (
              <a href={seriesIndexHref} class="atom-page__step group">
                <p class="atom-page__step-label">{t("atom.backToSeries")}</p>
                <p class="atom-page__step-title">{t("atom.allAtoms", series.data.atom_count)}</p>
              </a>
            )}
          </div>
          <div class="text-right">
            {next && (
              <a href={next.href} class="atom-page__step group">
                <p class="atom-page__step-label">{t("atom.nextAtom")} · {String(next.position).padStart(2, "0")} →</p>
                <p class="atom-page__step-title">{next.title}</p>
              </a>
            )}
          </div>
        </nav>
      )}
    </div>

  </main>
</Layout>
```

- [ ] **Step 2: Add atom-page styles to main.css**

Append to `src/assets/css/main.css`:

```css
/* ── ATOM PAGE ─────────────────────────────────────── */
.atom-page__crumb {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold-dim);
  margin-bottom: 18px;
}
.atom-page__crumb a {
  color: var(--gold-dim);
  text-decoration: none;
  transition: color 220ms ease-out;
}
.atom-page__crumb a:hover { color: var(--gold); }

.atom-page__pos {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.25em;
  color: var(--gold);
  margin-bottom: 18px;
}

.atom-page__title {
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0 0 18px;
}
.atom-page__title em {
  font-style: italic;
  color: var(--gold-light);
}

.atom-page__hero-hook {
  font-family: 'Cormorant', Georgia, serif;
  font-style: italic;
  font-size: 1.4rem;
  line-height: 1.45;
  color: var(--gold-light);
  max-width: 32ch;
  margin: 18px 0 36px;
  white-space: pre-line;
}

.atom-page__footer {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.atom-page__attribution {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-3);
}
.atom-page__attribution a {
  color: var(--gold-light);
  border-bottom: 1px solid var(--border-gold);
  text-decoration: none;
  padding-bottom: 1px;
  transition: color 220ms ease-out, border-color 220ms ease-out;
}
.atom-page__attribution a:hover {
  color: var(--gold);
  border-color: var(--gold);
}

.atom-page__nav { margin-top: 24px; }

.atom-page__step {
  display: block;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 4px;
  padding: 14px;
  text-decoration: none;
  transition: border-color 220ms ease-out;
}
.atom-page__step:hover { border-color: var(--border-gold); }

.atom-page__step-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold-dim);
  margin-bottom: 6px;
}
.atom-page__step-title {
  font-family: 'Cormorant', Georgia, serif;
  font-size: 1.1rem;
  color: var(--text);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/atom.astro src/assets/css/main.css
git commit -m "feat(series): add atom page layout"
```

---

### Task 13: Build the atom dynamic route

**Files:**
- Create: `src/pages/series/[topic]/[atom].astro`

- [ ] **Step 1: Create the route**

Create `src/pages/series/[topic]/[atom].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import AtomLayout from "../../../layouts/atom.astro";
import { slugFromFilename, parseAtomBody } from "../../../lib/series.mjs";

export async function getStaticPaths() {
  const allAtoms = await getCollection("atom");
  const allSeries = await getCollection("series");
  const allPosts = await getCollection("post");

  const seriesByTopic = new Map(
    allSeries.map((s) => [s.id.replace(/\/_series$/, ""), s])
  );

  // Group atoms by topic, sorted by position
  const atomsByTopic = new Map<string, typeof allAtoms>();
  for (const a of allAtoms) {
    const slash = a.id.indexOf("/");
    const topic = a.id.slice(0, slash);
    if (!atomsByTopic.has(topic)) atomsByTopic.set(topic, []);
    atomsByTopic.get(topic)!.push(a);
  }
  for (const list of atomsByTopic.values()) list.sort((x, y) => x.data.position - y.data.position);

  const paths: Array<{ params: { topic: string; atom: string }; props: Record<string, unknown> }> = [];

  for (const [topic, atoms] of atomsByTopic) {
    const series = seriesByTopic.get(topic);
    if (!series) continue;

    for (let i = 0; i < atoms.length; i++) {
      const a = atoms[i];
      const filename = a.id.slice(a.id.indexOf("/") + 1) + ".md";
      const atomSlug = slugFromFilename(filename);
      const prev = i > 0 ? atoms[i - 1] : null;
      const next = i < atoms.length - 1 ? atoms[i + 1] : null;
      const prevSlug = prev ? slugFromFilename(prev.id.slice(prev.id.indexOf("/") + 1) + ".md") : null;
      const nextSlug = next ? slugFromFilename(next.id.slice(next.id.indexOf("/") + 1) + ".md") : null;

      const synthSlug = series.data.synthesis_post && series.data.synthesis_post !== "TODO" ? series.data.synthesis_post : null;
      const synthPost = synthSlug ? allPosts.find((p) => p.id.replace(/\.md$/, "") === synthSlug) : null;

      paths.push({
        params: { topic, atom: atomSlug },
        props: {
          atom: a,
          series,
          prev: prev && prevSlug ? { href: `/series/${topic}/${prevSlug}`, title: prev.data.title, position: prev.data.position } : null,
          next: next && nextSlug ? { href: `/series/${topic}/${nextSlug}`, title: next.data.title, position: next.data.position } : null,
          synthesisHref: synthPost ? `/post/${synthSlug}` : null,
          synthesisTitle: synthPost ? synthPost.data.title : null,
        },
      });
    }
  }

  return paths;
}

const { atom, series, prev, next, synthesisHref, synthesisTitle } = Astro.props;
const { hook, body, cta } = parseAtomBody(atom.body ?? "");

// Render only BODY + CTA via Astro's content rendering. We need a stripped-down
// version of the markdown for the slot; reconstruct it without HOOK.
const slotMd = `${body}\n\n${cta}`;
// Astro's render() is for the original entry; for partial render we use a small
// helper instead — the entry's body is already markdown, so we render via marked at runtime.
// Simpler: render the full entry and visually hide HOOK section in CSS, OR pre-render with marked.
// Choose marked for clarity.
import { marked } from "marked";
const articleHtml = marked.parse(slotMd);
---

<AtomLayout
  atom={atom}
  series={series}
  hookText={hook}
  prev={prev}
  next={next}
  synthesisHref={synthesisHref}
  synthesisTitle={synthesisTitle}
>
  <Fragment set:html={articleHtml} />
</AtomLayout>
```

- [ ] **Step 2: Add `marked` dependency**

Run: `pnpm add marked@^14`
Expected: `marked` added to `package.json` dependencies.

- [ ] **Step 3: Verify atom pages render**

Open: http://localhost:4321/series/ai-cognitive-debt/the-paradox

Expected:
- Crumb: "Series / AI Cognitive Debt"
- Position: "ATOM 01 OF 05" in gold
- Title: "The AI Productivity _Paradox_" with italic gold
- Hero hook: italic Cormorant pull-quote in gold-light
- Body: prose paragraphs
- Footer: "Originally on LinkedIn · Read & reply" (or omitted if `linkedin_url` is still TODO)
- Prev/next: prev = "Back to series · All 5 atoms" (since this is atom 01); next = "Next atom · 02 → The Evidence"

Try the German atom: http://localhost:4321/series/ki-souveraenitaet/modular-und-exit-faehig
Expected: same shape, German labels.

- [ ] **Step 4: Run astro check**

Run: `pnpm astro check`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/series/ package.json pnpm-lock.yaml
git commit -m "feat(series): add atom dynamic route at /series/[topic]/[atom]"
```

---

### Task 14: Replace `linkedin_url: TODO` placeholders

**Files:**
- Modify: `src/content/series/<topic>/[NN]-<slug>.md` (×~14)

This task is content work, not code. Pascal must paste in the actual LinkedIn post URL for each of the ~14 atoms.

- [ ] **Step 1: List atoms with TODO linkedin_url**

Run: `grep -l "linkedin_url: TODO" src/content/series/*/[0-9]*.md`
Expected: lists all atoms.

- [ ] **Step 2: For each atom, replace TODO with the URL**

For each file listed, edit the frontmatter line:

```yaml
linkedin_url: TODO
```

to:

```yaml
linkedin_url: "https://www.linkedin.com/posts/pgiessler_<actual-post-slug>"
```

Pascal sources each URL from his LinkedIn profile feed.

If a URL is genuinely unknown for some atom, change the value to `linkedin_url: ""` (empty string) and the footer line will be omitted instead of showing a broken link.

- [ ] **Step 3: Verify build picks up the URLs**

Run: `pnpm astro check`
Expected: 0 errors.

Open: http://localhost:4321/series/ai-cognitive-debt/the-paradox
Expected: footer now shows "Originally on LinkedIn · Read & reply →" linking out.

- [ ] **Step 4: Commit**

```bash
git add src/content/series/
git commit -m "content(series): populate linkedin_url for first three series"
```

---

### Task 15: Build the `series-add` skill

**Files:**
- Create: `.claude/skills/series-add/SKILL.md`

- [ ] **Step 1: Create the skill directory**

Run: `mkdir -p .claude/skills/series-add`
Expected: directory created.

- [ ] **Step 2: Create the skill file**

Create `.claude/skills/series-add/SKILL.md`:

```markdown
---
name: series-add
description: Use when the user wants to add a published LinkedIn series to /series on the website. Triggers on phrases like "add the [topic] series to the site", "publish [topic] on /series", "sync new series", "the [topic] series is ready", "the [topic] analytics are in". Reads brand-repo state, runs pnpm series:add, walks through the missing fields conversationally, verifies the build, and reminds about cross-link from the matching synthesis essay on /posts.
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
   Read `scripts/series-config.json`. If missing, ask Pascal for the path and create it. Default expected: `/Users/pascalgiessler/Developer/02_Personal/04_LinkedinBrand`.

2. **List pending topics.**
   Run `pnpm series:list-pending` and report what's available. If Pascal already named a topic, validate it appears. If not, ask which one.

3. **Run sync.**
   Run `pnpm series:add <topic>`. Report the output (atoms copied, _series.md created/skipped).

4. **Refine `_series.md` conversationally.**
   Read the generated `src/content/series/<topic>/_series.md`. Walk through:
   - **title**: suggest a polished version of the auto-generated title (Title Case, drop hyphens). Confirm with Pascal.
   - **italic_word**: default to the last word of the title. Pascal can override (e.g., "for Leadership" is two words).
   - **position**: keep the auto-incremented value unless Pascal wants reordering.
   - **synthesis_post**: check `src/content/post/` for an essay matching the topic. If a match exists, fill it in. Otherwise leave as `TODO` (the synthesis link will not render until populated).
   - **thesis**: if the auto-extracted thesis from `narrative-arc.md` looks rough, draft a 2–3 sentence version with Pascal.

5. **Replace `linkedin_url: TODO` per atom.**
   List all atoms in the new series with `linkedin_url: TODO`. For each, ask Pascal for the LinkedIn URL one at a time. Edit the frontmatter line. If Pascal doesn't have a URL, set `linkedin_url: ""` so the footer line is omitted (don't leave TODO — that breaks the build expectation).

6. **Verify the build.**
   Run `pnpm astro check`. If errors, fix them (most likely a frontmatter type mismatch — check zod schema in `src/content.config.js`).
   Run `pnpm dev` (or assume it's running) and ask Pascal to visit `/series` to confirm the new section renders.

7. **Cross-link reminder.**
   If `synthesis_post` was set, remind Pascal:
   > The synthesis essay at `/post/<slug>` doesn't currently link back to `/series#<topic>`. That's a separate, lower-priority change — out of scope for this skill but worth noting.

8. **Commit suggestion (don't auto-commit).**
   Suggest a commit message:
   ```
   feat(series): add <Topic Title> series

   <N> atoms, <EN|DE>, synthesizes <synthesis-post-slug-or-none>.
   ```

## Skill is a wrapper, not a replacement

If anything fails, the spec at `docs/superpowers/specs/2026-05-06-series-page-design.md` §9 is the authoritative manual checklist.
```

- [ ] **Step 3: Verify the skill loads (manual)**

Tell Pascal: try invoking it via natural language ("add the claude-code series to the site" — assuming claude-code has analytics). The skill should fire if registered correctly.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/series-add/
git commit -m "feat(series): add series-add skill for conversational sync workflow"
```

---

### Task 16: Update CLAUDE.md to reference the new pages and skill

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add a "Series" section to project instructions**

In `CLAUDE.md`, find the "Common Tasks" section and add:

```markdown
- Add a new published LinkedIn series: invoke the `series-add` skill, or run `pnpm series:list-pending` then `pnpm series:add <topic-slug>`. Spec: `docs/superpowers/specs/2026-05-06-series-page-design.md`.
- Update an atom (already on site): edit the file in `src/content/series/<topic>/`. Add `<!-- site-edited -->` anywhere in the file to protect from `pnpm series:add` overwrite.
```

In the "Key Files" section, append:

```markdown
- `src/content/series/` — series collection (one directory per topic, with `_series.md` metadata + numbered atom files)
- `src/pages/series.astro` — `/series` index (English)
- `src/pages/de/series.astro` — `/de/series` index (German)
- `src/pages/series/[topic]/[atom].astro` — atom dynamic route
- `scripts/sync-series.mjs` — sync script
- `.claude/skills/series-add/SKILL.md` — conversational wrapper
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document /series workflow in CLAUDE.md"
```

---

### Task 17: Final build + smoke verification

**Files:** None (verification)

- [ ] **Step 1: Full build**

Run: `pnpm build`
Expected: completes without error. Output goes to `dist/`.

- [ ] **Step 2: Verify atom pages exist in dist**

Run: `ls dist/series/ai-cognitive-debt/`
Expected: directories for each atom slug (the-paradox, the-evidence, the-hidden-cost, the-named-risk, the-shift), each containing `index.html`.

Run: `ls dist/series/`
Expected: `index.html` (the index page) plus directories for each topic.

Run: `ls dist/de/series/`
Expected: `index.html` (German index).

- [ ] **Step 3: Preview the build**

Run: `pnpm preview`
Open: http://localhost:4321/series and click through several atoms. Verify:
- All three sections render with correct atom counts (5/5/4)
- Hover behavior works (gold dot, surface lift, arrow nudge)
- Atom pages load with correct prev/next
- German page works at /de/series
- LinkedIn footer links open correctly (target=_blank)
- `prefers-reduced-motion: reduce` (test in DevTools) freezes hover transforms

- [ ] **Step 4: Run all checks**

Run in parallel:
```bash
pnpm astro check
pnpm test:scripts
pnpm check
```

Expected: all pass.

- [ ] **Step 5: Commit any small fixes uncovered**

If the smoke check turned up small issues, fix them in this commit. If everything is clean, this step is a no-op.

```bash
git status
# If clean: skip
# If dirty: git add … && git commit -m "fix(series): <small fix>"
```

---

## Self-review

After writing this plan, ran the checklist:

**Spec coverage:**
- §2 IA — Tasks 9, 10, 11, 13 ✓ (with one deviation flagged in Task 1)
- §3 Page composition — Task 9 ✓
- §4 Section header — Task 8 ✓
- §5 Tile anatomy + Level-2 motion — Task 7 ✓
- §6 Data model — Tasks 2, 6 ✓
- §7 Atom page — Tasks 12, 13 ✓
- §8 DESIGN.md cross-check — verified inline in Tasks 7, 8, 12 (no side-stripes, motion via transform/opacity/color only, prefers-reduced-motion honored)
- §9 Recurring workflow — Tasks 5, 6 (script), 15 (skill) ✓
- §10 Out of scope — respected (no /posts→/series cross-link, no analytics, no auto-publishing)

**Placeholder scan:** clean. The two `TODO` strings in the plan are deliberate — they refer to `linkedin_url: TODO` (a sentinel the script writes) and `synthesis_post: TODO` (a sentinel the script writes). Both are explicitly handled in Tasks 6 and 14.

**Type consistency:** `slugFromFilename`, `parseAtomBody`, `topicFromId`, `parseAtomFrontmatter`, `stripLinkedInSections` — names match across Task 3 (definition), Task 7 (consumption in tile), Task 13 (consumption in route).

**Single ambiguity caught and fixed:** Task 3 originally proposed `src/lib/series.ts`, but `node:test` doesn't run TS imports natively. Step 4 of Task 3 documents the resolution: rename to `.mjs`. Subsequent tasks all import from `series.mjs`.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-06-series-page.md`.**
