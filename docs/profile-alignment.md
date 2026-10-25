# Public profile alignment

Updated 2026-10-25 from Pascal’s confirmed role and positioning in the LinkedIn strategy conversation.

The public identity is Principal AI & AI Lead at Haufe Akademie, Mentor and Strategic Advisor. His responsibility covers organisational AI transformation, close collaboration with the CTO and strategic initiatives. A formal Head-of-AI title, team size, budget or quantified impact is not claimed.

`src/data/entity.ts` owns the shared role, descriptions and personal facts. Home copy imports these facts; both About routes use a single bilingual body. The footer, metadata, Person schema and author biography use the same identity. Cognitive Debt remains a topic, not the sole identity. Pascal later explicitly approved “Ex-CTO” and “Stealth CEO” on the website as supporting roles. The shared entrepreneurialLine appears on home, About and in the footer in both languages. His other projects remain undisclosed. This website-specific instruction supersedes the earlier omission of former CTO wording; it does not change the separate LinkedIn instructions.

The existing warm black, gold accents, Cormorant, Outfit and JetBrains Mono remain the visual identity. Updated prose follows the Humanizer skill. The older Brand-OS files were not edited by this website task; confirmed current role facts override their older bios.

`npm run build` runs `scripts/check-profile.mjs` after the static build. It checks the role in Person schema and visible copy on every HTML page, visible FAQ/schema agreement and obsolete front-page positioning.
