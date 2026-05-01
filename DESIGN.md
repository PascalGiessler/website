# Design System

## Theme
Always dark. Scene: senior technical architect reviewing portfolios after hours on a high-DPI display, wanting to assess whether this person has the real depth to lead an AI architecture initiative. The darkness is the brand identity, not a preference.

## Color Strategy: Committed
Gold carries 30-40% of the visual surface. Not restrained.

## Colors (OKLCH)
```css
--bg:          oklch(0.09 0.008 58);   /* near-black, amber-tinted */
--surface:     oklch(0.14 0.010 57);   /* raised surface */
--gold:        oklch(0.72 0.12 54);    /* primary identity gold */
--gold-light:  oklch(0.82 0.08 56);    /* text gold, readable */
--text:        oklch(0.93 0.008 65);   /* warm off-white */
--text-2:      oklch(0.67 0.011 65);   /* secondary text */
--text-3:      oklch(0.47 0.010 65);   /* tertiary/placeholder */
--border:      oklch(0.22 0.010 57);   /* subtle border */
--border-gold: oklch(0.36 0.065 54);   /* gold-tinted border accent */
```

## Typography
- **Display**: Cormorant (Google Fonts), weights 300/400/500, italic — editorial, academic authority
- **Body/UI**: Outfit (Google Fonts), weights 300/400/500/600 — clean geometric, modern without being tired
- **Technical labels**: JetBrains Mono (Google Fonts), weights 400/500 — signals engineering identity

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
