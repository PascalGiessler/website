# Website maintenance

## Purpose and cadence

Maintain Pascal’s positioning as Principal AI & AI Lead, Mentor and Strategic Advisor, with Ex-CTO and Stealth CEO as explicitly approved supporting roles on the website, with useful technical writing for AI leaders, CTOs and Engineering Leads. Check on Tuesday and Friday at 10:00 Europe/Berlin. Friday also reviews navigation, metadata, content age and any accessible analytics. This is periodic editorial maintenance of a static site, not a real-time news feed.

The recurring task is a heartbeat in the existing Codex conversation. Do not create a second task with the same purpose. Keep the existing Monday LinkedIn drafts and every-two-day comment tasks unchanged.

## Sources and publication policy

Start from the git diff and the latest maintenance log. Preserve changes already present. Check Pascal’s published LinkedIn posts and language-specific Substack feeds. Verify original text, author, actual publication date and direct URL. Add only useful material that is not already on the site. Do not import Buffer drafts, scheduled posts, third-party comments or private conversations.

`src/data/linkedin.ts` contains selected published posts. Summaries in each site language link to the same original; English readers are told the original is German. They are links to existing publications, not backdated website articles. Keep original dates; a routine check does not change them.

For trends, read current primary sources and distinguish publication date from event date. Add material only when there is a concrete consequence for AI transformation, agent systems, evaluation, API semantics or engineering decisions. A quiet week needs no new trend article. Label an opinion as an opinion and an example as hypothetical when appropriate. Never imply an employer result or experience Pascal has not confirmed.

## Editorial and UI checks

Use `/Users/pascalgiessler/.agents/skills/humanizer/SKILL.md` for every revised public text, then recheck meaning and facts. Use `/Users/pascalgiessler/.agents/skills/impeccable/SKILL.md` for UI changes. Preserve the warm black and gold identity and existing typefaces. Prefer a few coherent improvements to frequent redesigns.

Keep the English and German archives separate, with an explicit link to the other language. Dates and reading-time labels follow the page language. `src/lib/posts.mjs` is shared by listings, routes, article dates and RSS; future or malformed dates do not enter publication lists.

Use analytics only if fresh data is accessible. Record period and sample size; do not infer causes from small samples or treat old data as current. Never read or expose secret configuration.

## Verification and handoff

Run `npm run test:scripts` and `npm run build`; the latter includes `check-profile.mjs`. Review desktop and mobile in the browser when UI changes, including wrapping, link targets and keyboard focus. Save a proof screenshot. Do not add dependencies for ordinary editorial work.

Log the actual source checks, changes, validation and any blocked access in `docs/maintenance/YYYY-MM-DD.md`. If nothing useful changed, record a no-change result without rewriting prose or public timestamps.

Leave changes local and report them in the conversation. Do not commit, push or deploy without separate authorisation. Do not publish LinkedIn comments or posts from this maintenance task. Existing exact-comment approval rules still apply.
