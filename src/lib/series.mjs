// Exact heading matches (case-sensitive) to strip
const STRIP_HEADINGS_EXACT = new Set([
  "HASHTAGS",
  "Hashtags",
  "FIRST COMMENT",
  "ENGAGEMENT STRATEGY",
  "Visual",
]);

// Prefix matches: any H2 whose text starts with one of these strings is stripped
const STRIP_HEADINGS_PREFIX = [
  "Visual prompt",
  "Visual ",
  "Self-audit",
  "Bridge note",
  "Notizen",
  "Pre-publish",
  "Risk flags",
];

function shouldStripHeading(heading) {
  if (STRIP_HEADINGS_EXACT.has(heading)) return true;
  return STRIP_HEADINGS_PREFIX.some((p) => heading.startsWith(p));
}

/**
 * Strip LinkedIn-only sections from an atom's markdown.
 * Keeps frontmatter, HOOK/Hook, BODY/Body, CTA, Close. Removes LinkedIn-only
 * sections (hashtags, first comment, engagement strategy, visuals, self-audit,
 * bridge notes, internal notes) for both EN and DE atom formats.
 */
export function stripLinkedInSections(md) {
  const lines = md.split("\n");
  const out = [];
  let skipping = false;
  let inCodeBlock = false;

  for (const line of lines) {
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      if (!skipping) out.push(line);
      continue;
    }

    if (!inCodeBlock) {
      const h2 = line.match(/^##\s+(.+?)\s*$/);
      if (h2) {
        const heading = h2[1].trim();
        skipping = shouldStripHeading(heading);
        if (skipping) continue;
      }
    }

    if (!skipping) out.push(line);
  }

  while (out.length && out[out.length - 1] === "") out.pop();
  return out.join("\n") + "\n";
}

/**
 * Strip the leading `NN-` numeric prefix from an atom filename
 * to produce a clean URL slug.
 */
export function slugFromFilename(filename) {
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
export function topicFromId(id) {
  const idx = id.indexOf("/");
  if (idx < 0) throw new Error(`Atom id "${id}" must include topic directory`);
  const topic = id.slice(0, idx);
  const filename = id.slice(idx + 1);
  return { topic, atom: slugFromFilename(filename + ".md") };
}

/**
 * Parse an atom's frontmatter into a plain object.
 *
 * INTENTIONALLY MINIMAL: this helper is for the sync script only, which reads
 * single-line scalar fields (position, linkedin_url, title, series). It does
 * NOT handle multi-line YAML (|, >), nested objects, or complex types.
 * Astro's content-collection zod schema handles full YAML parsing for the
 * site's runtime; this helper exists only because the sync script runs
 * outside Astro and must read frontmatter without spinning up a full parser.
 */
export function parseAtomFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    let value = raw.trim();
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
 * Returns { hook, body, cta } as raw markdown strings.
 */
export function parseAtomBody(md) {
  const after = md.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const sections = {};
  let current = null;
  for (const line of after.split("\n")) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      current = h2[1].trim().toUpperCase();
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  const join = (k) => (sections[k] ?? []).join("\n").trim();
  return { hook: join("HOOK"), body: join("BODY"), cta: join("CTA") };
}
