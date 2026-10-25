# Design System

## Theme
Always dark. Scene: senior technical architect reviewing portfolios after hours on a high-DPI display, wanting to assess whether this person has the real depth to lead an AI architecture initiative. The darkness is the brand identity, not a preference.

## Color Strategy: Committed
Warm copper/gold anchors the brand through headings, links and portrait framing. Readable warm off-white text and open editorial rows carry the content. Preserve the dark visual identity; avoid decorative networks and grain.

## Colors (OKLCH)
```css
--bg:          oklch(0.12 0.008 58);   /* near-black, amber-tinted */
--surface:     oklch(0.17 0.010 57);   /* raised surface */
--gold:        oklch(0.72 0.12 54);    /* primary identity gold */
--gold-light:  oklch(0.82 0.08 56);    /* text gold, readable */
--text:        oklch(0.93 0.008 65);   /* warm off-white */
--text-2:      oklch(0.76 0.011 65);   /* secondary text */
--text-3:      oklch(0.66 0.010 65);   /* tertiary/placeholder */
--border:      oklch(0.28 0.010 57);   /* subtle border */
--border-gold: oklch(0.36 0.065 54);   /* gold-tinted border accent */
```

## Typography
- **Display**: Cormorant (self-hosted via Fontsource), weights 300/400/500, italic — editorial, academic authority
- **Body/UI**: Outfit (self-hosted via Fontsource), weights 300/400/500/600 — clean geometric, modern without being tired
- **Technical labels**: JetBrains Mono (self-hosted via Fontsource), weights 400/500 — signals engineering identity

## Spacing
- Section vertical gaps: 80-120px
- Content max-width: 1200px
- Body line length: max 65ch

## Motion
- Entrance: fadeUp, 0.7s, cubic-bezier(0.16, 1, 0.3, 1), staggered 120ms delays
- Hover: gold accent reveals, 200ms ease-out
- Never animate layout properties

## Absolute Bans
- Side-stripe borders (border-left/right > 1px as accent)
- Gradient text (background-clip: text)
- Glassmorphism as decoration
- Hero-metric template (big number, small label)
- Identical card grids
- Em dashes

## Editorial refinement · 2026-10-25
Home is a Persuade surface with published work as evidence. The page sequence is profile, work areas, published LinkedIn writing and essays, practical tools, engineering principles, then contact/newsletter. The hero pairs readable role/context copy with an unmasked portrait. Qualifications use plain text, not decorative chips.

Desktop navigation foregrounds About, Writing, Tools and Publications. All seven destinations remain in the mobile menu, while Cognitive Debt, Series and Glossary also appear in the footer. Controls have at least 44px hit areas; the menu traps keyboard focus while open, closes with Escape and restores focus. There is a skip link.

Dates and reading time use readable tabular body text. Use one clear section heading, avoid repeated eyebrow labels and unrelated quotations. Backgrounds remain flat. The shared profile source and all confirmed roles are unchanged.

## Editorial imagery
The website remains visual. Use authored editorial imagery where it supports a technical idea, alongside Pascal’s portrait and real tool screenshots. A dark graphite and brushed-brass physical model accompanies the engineering principles on home. It is conceptual artwork, not an actual product or client installation. Preserve the visual subject on mobile, avoid text baked into images, and use responsive WebP variants with lazy loading for images below the fold. Do not replace useful imagery with a text-only treatment during routine maintenance.
