#!/usr/bin/env node
// Fetches Substack RSS, scaffolds draft .md files in drafts/substack/.
// Drafts are gitignored — review, clean up, and copy into src/content/post/ to publish.
//
// Usage:  pnpm sync:substack
// Override feed:  SUBSTACK_FEED=https://other.substack.com/feed pnpm sync:substack

import { mkdirSync, existsSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const FEED_URL = process.env.SUBSTACK_FEED || "https://principalstack.substack.com/feed";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRAFT_DIR = join(ROOT, "drafts", "substack");
const PUBLISHED_DIR = join(ROOT, "src", "content", "post");

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(d) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${ordinal(d.getDate())}, ${d.getFullYear()}`;
}

function slugFromUrl(url) {
  const m = url.match(/\/p\/([^/?#]+)/);
  return m ? m[1] : null;
}

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function pick(xml, tag) {
  const re = new RegExp(`<${tag.replace(":", "\\:")}[^>]*>([\\s\\S]*?)</${tag.replace(":", "\\:")}>`, "i");
  const m = xml.match(re);
  return m ? decodeEntities(m[1]).trim() : "";
}

function parseItems(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) items.push(m[1]);
  return items.map((it) => ({
    title: pick(it, "title"),
    link: pick(it, "link"),
    pubDate: pick(it, "pubDate"),
    description: pick(it, "description"),
    content: pick(it, "content:encoded") || pick(it, "description"),
  }));
}

function buildDraft(post) {
  const desc = post.description
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
  const date = new Date(post.pubDate);
  return [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `description: ${JSON.stringify(desc || post.title)}`,
    `dateFormatted: ${JSON.stringify(formatDate(date))}`,
    "---",
    "",
    "<!--",
    `  DRAFT — imported from Substack on ${new Date().toISOString()}`,
    `  Source: ${post.link}`,
    "  Steps before publishing:",
    "    1. Convert raw HTML to clean markdown (remove substack image hosts, callout divs, etc.)",
    "    2. Strip email subject lines, infographic YAML, and image-generation specs",
    "    3. Rewrite intro/outro to match the site's voice",
    "    4. Move the file into src/content/post/<slug>.md",
    "-->",
    "",
    post.content,
    "",
  ].join("\n");
}

console.log(`Fetching ${FEED_URL}…`);
const res = await fetch(FEED_URL);
if (!res.ok) {
  console.error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const xml = await res.text();
const items = parseItems(xml);
console.log(`Feed has ${items.length} item(s).`);

mkdirSync(DRAFT_DIR, { recursive: true });

const publishedSlugs = new Set(
  existsSync(PUBLISHED_DIR)
    ? readdirSync(PUBLISHED_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""))
    : [],
);

let created = 0;
let skippedPublished = 0;
let skippedDraft = 0;
let skippedNoSlug = 0;

for (const item of items) {
  const slug = slugFromUrl(item.link);
  if (!slug) {
    skippedNoSlug++;
    console.warn(`  skip (no slug): ${item.title}`);
    continue;
  }
  if (publishedSlugs.has(slug)) {
    skippedPublished++;
    continue;
  }
  const out = join(DRAFT_DIR, `${slug}.md`);
  if (existsSync(out)) {
    skippedDraft++;
    continue;
  }
  writeFileSync(out, buildDraft(item), "utf8");
  console.log(`  drafted: drafts/substack/${slug}.md  —  ${item.title}`);
  created++;
}

console.log("");
console.log(`Created: ${created}`);
console.log(`Skipped (already published): ${skippedPublished}`);
console.log(`Skipped (draft already exists): ${skippedDraft}`);
if (skippedNoSlug) console.log(`Skipped (no slug): ${skippedNoSlug}`);
console.log("");
if (created > 0) {
  console.log("Next: review drafts/substack/, clean up, then move into src/content/post/.");
}
