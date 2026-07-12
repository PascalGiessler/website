#!/usr/bin/env node
/**
 * Renders the per-page Open Graph cards into public/assets/images/og/.
 *
 * Same crop-safe composition as the identity card (scripts/og-card-template.svg):
 * everything essential is centered, because Google square-crops the 1200x630 card
 * for its SERP thumbnail while LinkedIn/X show the full landscape.
 *
 * Usage: pnpm og-cards   (requires rsvg-convert: brew install librsvg)
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "public/assets/images/og";
const TMP = join(process.env.TMPDIR ?? "/tmp", "og-cards");

/** Cards to render. `lines` is the display title, split by hand for balance. */
const CARDS = [
  {
    file: "cognitive-debt",
    eyebrow: "THE FRAMEWORK",
    lines: ["Cognitive", "Debt"],
    tagline: "The interest on AI you cannot explain",
  },
  {
    file: "glossary",
    eyebrow: "GLOSSARY",
    lines: ["Agentic AI,", "in plain terms"],
    tagline: "Harness · Agents · Tool Use · MCP · Sovereignty",
  },
  {
    file: "tools",
    eyebrow: "TOOLS",
    lines: ["Instruments,", "not demos"],
    tagline: "AI Radar · Idea Assessor",
  },
  {
    file: "posts",
    eyebrow: "WRITING",
    lines: ["Essays on", "sovereign AI"],
    tagline: "Cognitive Debt · Agentic Engineering · DACH",
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The second line is the gold italic accent, echoing the site's headings. */
function svg({ eyebrow, lines, tagline }) {
  const [head, accent] = lines;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="${esc(head)} ${esc(accent)}">
  <rect width="1200" height="630" fill="#0e0b08"/>
  <defs>
    <radialGradient id="warm" cx="600" cy="300" r="620" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1c1309" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#0e0b08" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#warm)"/>

  <!-- P|G monogram, centered top -->
  <line x1="600" y1="70" x2="600" y2="140" stroke="#d49140" stroke-width="3" stroke-linecap="round"/>
  <text x="574" y="127" font-family="Cormorant, Georgia, serif" font-size="56" font-weight="500" fill="#ede4d3" text-anchor="middle">P</text>
  <text x="626" y="127" font-family="Cormorant, Georgia, serif" font-size="56" font-weight="500" fill="#ede4d3" text-anchor="middle">G</text>

  <text x="600" y="200" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="20" font-weight="500" fill="#d49140" letter-spacing="0.3em" text-anchor="middle">${esc(eyebrow)}</text>

  <text x="600" y="330" font-family="Cormorant, Georgia, serif" font-size="82" font-weight="400" fill="#ede4d3" text-anchor="middle">${esc(head)}</text>
  <text x="600" y="420" font-family="Cormorant, Georgia, serif" font-size="82" font-weight="400" font-style="italic" fill="#d4b572" text-anchor="middle">${esc(accent)}</text>

  <line x1="552" y1="468" x2="648" y2="468" stroke="#d49140" stroke-width="2.5" stroke-linecap="round"/>

  <text x="600" y="516" font-family="Outfit, 'Helvetica Neue', system-ui, sans-serif" font-size="23" font-weight="400" fill="#a39d8d" text-anchor="middle">${esc(tagline)}</text>

  <text x="600" y="580" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="16" font-weight="500" fill="#7d7567" letter-spacing="0.2em" text-anchor="middle">DR. PASCAL GIESSLER · PASCAL-GIESSLER.DE</text>
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(TMP, { recursive: true });

for (const card of CARDS) {
  const src = join(TMP, `${card.file}.svg`);
  const out = join(OUT_DIR, `${card.file}.png`);
  writeFileSync(src, svg(card));
  execFileSync("rsvg-convert", ["-w", "1200", "-h", "630", src, "-o", out]);
  console.log(`rendered ${out}`);
}

rmSync(TMP, { recursive: true, force: true });
