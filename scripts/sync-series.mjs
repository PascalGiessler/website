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
