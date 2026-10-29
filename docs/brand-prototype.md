# Lowercase pg loop prototype · 2026-10-29

This is a refinement within the existing dark, copper editorial identity. `PRODUCT.md` and `DESIGN.md` remain authoritative. Pascal selected the lowercase pg direction “I” to suggest an AI loop. He rejected the goggles reading and requested matched p/g curves, aligned bowls, no upper-right stalk, equal overall letter height and a lower g arc matching its upper bowl. On 29 October he selected the compact two-colour variant 3, “Fuge”, with a narrow diagonal separation. After reviewing the local integration, Pascal authorised publication with “go”.

## Current vector

`public/assets/brand/pg-monogram.svg` is the source of truth. Its viewBox is 190 × 146. All circular arcs use radius 40 and stroke width 16. The p stem spans y=7…138; the g bowl is centred at (135, 55) and its lower return at (135, 90). Both letters reach y=7…138. The p is copper (#D19360), the g warm ivory (#EEE9E0). A four-unit diagonal gap separates the colours along the shared S-shaped bridge. The lower g arc ends at 125 degrees, 25 degrees earlier than the preceding compact prototype, opening its left side further. Its terminal angle mirrors the 55-degree p terminal. The upper and lower right-hand g strokes form one continuous path to prevent a faint rendering seam.

`src/components/logo.astro` owns the shared header/footer lockup. The decorative mark sits beside the visible name inside the home link, with a minimum 44px hit area. Its fixed image dimensions are 38 × 29.2; CSS retains the aspect ratio with automatic height and reduces the width to 32px below 480px. Cormorant remains the name face. Public prose, role facts, palette tokens and fonts are unchanged.

## Derived assets

Run `npm run brand:assets` to derive the transparent 1024px-wide PNG, ink/ivory SVG variants, square padded SVG favicon, multi-size ICO and Apple touch icon from the master. The generator reads the master viewBox and centres it in the square favicon. SVG rasterisation uses local librsvg; this machine’s ImageMagick SVG delegate previously produced an empty alpha-only export. ImageMagick converts the rendered PNG to ICO.

The identity OG-card template has a managed logo slot, and the per-page OG generator reads the same master. Both derive the logo height from its viewBox. Monochrome exports replace both source colours, preserving the gap. Favicon and lockup cache keys identify the selected Fuge revision. No dependencies or animation were added.

## Iteration history and references

An intertwined serif concept was rejected as too ornamental. A later adjacent uppercase PG prototype preceded the lowercase loop. The taller copper loop was followed by a compact two-colour comparison; Pascal selected variant 3 from the final three refinements. References included the [PG monogram study](https://dribbble.com/shots/3629753-PG-monogram), [Jane Austen’s House identity](https://www.pentagram.com/work/jane-austens-house), [Justin LaClair’s negative-space monogram](https://dribbble.com/shots/17471471-Negative-Space-Monogram-Spring-2021) and [Dribbble’s PG monogram collection](https://dribbble.com/tags/pg-monogram). These informed general structural exploration only; no third-party logo asset was imported.

## Local validation

After integrating the selected Fuge variant, 18/18 script tests passed and the full build/profile check succeeded across 41 pages. Existing Astro/Zod/Node hints remain. The Impeccable hook reported no deterministic findings; no duplicate manual detector run was added. Earlier independent reviews covered previous logo drawings and are not asserted as approval of this selected variant.

The selected variant was inspected on the built site at 1280 × 800 and 390 × 844 on local preview port 4362: no horizontal overflow; both header and footer logo images loaded at the correct aspect ratio. Measured image widths are 38px on desktop and 32px on mobile, with both home links retaining 44px height. Evidence is in the chat workspace at `outputs/website-brand-prototype-2026-10-29/`: `pg-fuge-website-desktop.png` and `pg-fuge-website-mobile.png`. The phone viewport is browser emulation, not a physical-device test.

The approved release uses the existing main-branch GitHub Pages deployment workflow. Script tests, the build and profile checks are rerun before committing; workflow completion and the public website are checked after pushing. Local review captures under `.impeccable/` are excluded from the release. No analytics or publication research was imported as part of this branding task. No design-system migration or unrelated drift repair was performed.
