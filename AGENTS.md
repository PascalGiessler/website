# Public profile and website

- Goal: consistent positioning for AI leadership and Head-of-AI roles, with technical depth in agentic systems, evaluation and organisational AI transformation.
- Current confirmed role: Principal AI & AI Lead at Haufe Akademie. Responsible for organisational AI transformation, close collaboration with the CTO and support of strategic initiatives. Mentor and Strategic Advisor. Do not claim a formal Head-of-AI title, staff/budget responsibility or unconfirmed results.
- `src/data/entity.ts` is the shared website identity. Use `PROFILE` and `ROLE` in visible biographies, metadata and schema. Confirmed role facts from 2026-10-25 take precedence over older Brand-OS bios; retain the established visual identity.
- Use `/Users/pascalgiessler/.agents/skills/humanizer/SKILL.md` for every new or revised public text in either language. Preserve supported meaning and never invent experience.
- Website-specific update confirmed by Pascal on 2026-10-25: include “Ex-CTO” and “Stealth CEO” as supporting roles. Principal AI & AI Lead remains primary. Stealth projects are not yet public; do not add project names, sectors, clients or other details. Do not link this positioning to SYNDIKAT7. This website permission does not change the separate LinkedIn positioning rules.
- Preserve language-specific Substack destinations, trailing-slash URLs and single-language article routes. Both About routes share one body component.
- Run `npm run build` and `npm run test:scripts`. The build includes a check of rendered Person data, visible role and FAQ/schema consistency across all HTML pages.

## Ongoing editorial maintenance

- Read `docs/website-maintenance.md` before scheduled website work. The website heartbeat runs Tuesday and Friday at 10:00 Europe/Berlin; Friday includes the deeper review. Existing LinkedIn and Buffer automations are separate and must not be duplicated.
- Use the Humanizer skill for all public prose, and Impeccable for visual or usability changes. Preserve the incumbent visual identity.
- Published LinkedIn selections live in `src/data/linkedin.ts`; one shared component renders them on both homepages and archives. Verify the original, author, date and direct URL before adding an entry. Buffer drafts and queued posts are not publications.
- Article lists follow the page language; provide the alternate-language archive link. `src/lib/posts.mjs` owns date-only UTC parsing, sorting and future-publication filtering for archives, routes and RSS.
- Never refresh public dates merely to appear current. Changes stay local unless deployment is separately authorised.
