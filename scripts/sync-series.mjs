#!/usr/bin/env node
// Sync LinkedIn atom series from the brand repo into src/content/series/.
//
// Usage:
//   pnpm series:list-pending              — show topics with analytics/ that aren't on the site
//   pnpm series:add <topic-slug> [--force] — copy + strip atoms, scaffold _series.md

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
import { execFileSync } from "node:child_process";
import {
  stripLinkedInSections,
  parseAtomFrontmatter,
} from "../src/lib/series.mjs";

/**
 * Extract the LinkedIn post URL from a single analytics .xlsx file.
 * The xlsx is a zip archive; we read xl/sharedStrings.xml via the system
 * `unzip` binary (available on macOS/Linux) and grep for the linkedin URL.
 */
function extractLinkedInUrl(xlsxPath) {
  try {
    const xml = execFileSync("unzip", ["-p", xlsxPath, "xl/sharedStrings.xml"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const m = xml.match(/<t[^>]*>(https:\/\/www\.linkedin\.com\/[^<]+)<\/t>/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/**
 * Look up the analytics xlsx for a given atom prefix and extract the URL.
 * Returns null if not found or extraction fails.
 */
function urlForAtomPrefix(brandRoot, topic, prefix) {
  const dir = join(brandRoot, "topics", topic, "linkedin", "analytics");
  if (!existsSync(dir)) return null;
  const match = readdirSync(dir).find((f) => f.startsWith(`${prefix}-`) && f.endsWith(".xlsx"));
  if (!match) return null;
  return extractLinkedInUrl(join(dir, match));
}

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
  let config;
  try {
    config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch (e) {
    console.error(`Failed to parse ${CONFIG_PATH}: ${e.message}`);
    process.exit(1);
  }
  if (!config.brand_repo_path || typeof config.brand_repo_path !== "string") {
    console.error(`Missing or invalid "brand_repo_path" in ${CONFIG_PATH}.`);
    process.exit(1);
  }
  return config;
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

function listAnalyticsFiles(brandRoot, topic) {
  const dir = join(brandRoot, "topics", topic, "linkedin", "analytics");
  if (!existsSync(dir)) return [];
  return readdirSync(dir);
}

/**
 * Return the set of atom number-prefixes (e.g. "01", "02") that have a
 * matching analytics file in the brand repo.
 */
function measuredAtomPrefixes(brandRoot, topic) {
  const out = new Set();
  for (const f of listAnalyticsFiles(brandRoot, topic)) {
    const m = f.match(/^(\d+)-/);
    if (m) out.add(m[1]);
  }
  return out;
}

function readForcePublishFlag(targetDir) {
  const seriesPath = join(targetDir, "_series.md");
  if (!existsSync(seriesPath)) return false;
  const fm = parseAtomFrontmatter(readFileSync(seriesPath, "utf8"));
  return fm.force_publish === true || fm.force_publish === "true";
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

async function addTopic(topic, { force }) {
  const { brand_repo_path: brandRoot } = loadConfig();
  const sourceDir = join(brandRoot, "topics", topic, "linkedin", "scripts");
  const targetDir = join(SITE_SERIES, topic);

  // Persistent force flag: if _series.md already has force_publish: true, honor it.
  const persistentForce = readForcePublishFlag(targetDir);
  const effectiveForce = force || persistentForce;

  if (!effectiveForce && !topicHasAnalytics(brandRoot, topic)) {
    console.error(`Topic "${topic}" has no populated analytics/ folder. Use --force if it IS published but analytics aren't exported yet.`);
    process.exit(1);
  }

  if (!existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });

  const allAtoms = listAtomFiles(brandRoot, topic);
  const measured = measuredAtomPrefixes(brandRoot, topic);

  let copied = 0;
  let skippedUnmeasured = 0;
  let skippedEdited = 0;
  const syncedFiles = [];
  const skippedFiles = [];

  for (const filename of allAtoms) {
    const prefix = filename.match(/^(\d+)-/)?.[1];
    const isMeasured = prefix && measured.has(prefix);

    if (!effectiveForce && !isMeasured) {
      skippedUnmeasured++;
      skippedFiles.push(filename);
      continue;
    }

    const src = readFileSync(join(sourceDir, filename), "utf8");
    const stripped = stripLinkedInSections(src);
    const targetPath = join(targetDir, filename);

    // Honor manual edits via sentinel
    if (existsSync(targetPath)) {
      const existing = readFileSync(targetPath, "utf8");
      if (existing.includes("<!-- site-edited -->")) {
        console.log(`  skip ${filename} (site-edited sentinel present)`);
        skippedEdited++;
        continue;
      }
    }

    // Resolve linkedin_url: prefer the URL embedded in the matching analytics
    // xlsx; fall back to TODO so the layout's footer line is gracefully omitted
    // (the existing _series.md / atom may already have a URL — preserve it).
    const fm = parseAtomFrontmatter(stripped);
    let final = stripped;
    const existingUrl = typeof fm.linkedin_url === "string" ? fm.linkedin_url : null;
    const extractedUrl = prefix ? urlForAtomPrefix(brandRoot, topic, prefix) : null;
    const resolvedUrl = (existingUrl && existingUrl !== "TODO" && existingUrl !== "")
      ? existingUrl
      : (extractedUrl || "TODO");

    if (existingUrl !== null) {
      // Replace the existing line in-place
      final = stripped.replace(/^linkedin_url:.*$/m, `linkedin_url: ${resolvedUrl}`);
    } else {
      // No existing field — prepend it
      final = stripped.replace(/^---\n/, `---\nlinkedin_url: ${resolvedUrl}\n`);
    }

    writeFileSync(targetPath, final, "utf8");
    syncedFiles.push(filename);
    copied++;
  }

  // Scaffold _series.md if absent
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
    const lines = [
      "---",
      `title: "${titleGuess}"`,
      `italic_word: "${titleGuess.split(" ").pop()}"`,
      `position: ${positionGuess}`,
      `language: ${lang}`,
      `published_at: "${today}"`,
      `atom_count: ${copied}`,
      "thesis: |",
      ...thesis.split("\n").map((l) => `  ${l}`),
      "synthesis_post: TODO",
    ];
    if (effectiveForce) {
      lines.push("force_publish: true");
    }
    lines.push("---", "");
    writeFileSync(seriesPath, lines.join("\n"), "utf8");
    console.log(`  created _series.md (review and edit thesis + italic_word + synthesis_post)`);
  }

  console.log("");
  console.log(`Topic ${topic} synced.`);
  console.log(`  ${copied} atoms copied`);
  if (skippedUnmeasured) {
    console.log(`  ${skippedUnmeasured} atoms skipped (no matching analytics, treated as unpublished drafts):`);
    for (const f of skippedFiles) console.log(`    - ${f}`);
    console.log(`    Use --force to include them anyway.`);
  }
  if (skippedEdited) console.log(`  ${skippedEdited} atoms skipped (site-edited sentinel)`);
  if (effectiveForce) console.log(`  force_publish=true (atom analytics check bypassed)`);
  console.log("");
  console.log("Next steps (manual):");
  console.log(`  1. Edit src/content/series/${topic}/_series.md — confirm title, italic_word, position, synthesis_post, thesis`);
  console.log(`  2. For each atom, replace linkedin_url: TODO with the actual LinkedIn post URL`);
  console.log(`  3. Run: pnpm dev   and visit /series to verify`);
}

const cmd = process.argv[2];
const flags = process.argv.slice(3).filter((a) => a.startsWith("--"));
const positional = process.argv.slice(3).filter((a) => !a.startsWith("--"));
const force = flags.includes("--force");

if (cmd === "list-pending") {
  listPending();
} else if (cmd === "add") {
  const topic = positional[0];
  if (!topic) {
    console.error("Usage: sync-series.mjs add <topic-slug> [--force]");
    process.exit(1);
  }
  await addTopic(topic, { force });
} else {
  console.error("Usage: sync-series.mjs <list-pending|add <topic> [--force]>");
  process.exit(1);
}
