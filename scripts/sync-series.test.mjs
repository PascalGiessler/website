import { test } from "node:test";
import assert from "node:assert/strict";
import {
  stripLinkedInSections,
  slugFromFilename,
  parseAtomFrontmatter,
  topicFromId,
  parseAtomBody,
} from "../src/lib/series.mjs";

test("stripLinkedInSections removes HASHTAGS, FIRST COMMENT, ENGAGEMENT STRATEGY, Visual", () => {
  const input = `---
title: Foo
---

## HOOK

The hook line.

## BODY

The body paragraph.

## CTA

The cta question.

## HASHTAGS

#One #Two

## FIRST COMMENT

Internal note.

## ENGAGEMENT STRATEGY

- Bullet

## Visual

\`\`\`yaml
image_type: quote-card
\`\`\`
`;
  const out = stripLinkedInSections(input);
  assert.match(out, /## HOOK/);
  assert.match(out, /## BODY/);
  assert.match(out, /## CTA/);
  assert.doesNotMatch(out, /## HASHTAGS/);
  assert.doesNotMatch(out, /## FIRST COMMENT/);
  assert.doesNotMatch(out, /## ENGAGEMENT STRATEGY/);
  assert.doesNotMatch(out, /## Visual/);
  assert.doesNotMatch(out, /image_type: quote-card/);
});

test("stripLinkedInSections preserves frontmatter intact", () => {
  const input = `---
title: Foo
position: 1
linkedin_url: https://example.com
---

## HOOK
Body.
`;
  const out = stripLinkedInSections(input);
  assert.match(out, /^---\ntitle: Foo\nposition: 1\nlinkedin_url: https:\/\/example.com\n---/);
});

test("stripLinkedInSections is idempotent", () => {
  const input = `---
title: X
---

## HOOK

Hook.

## BODY

Body.
`;
  assert.equal(stripLinkedInSections(input), stripLinkedInSections(stripLinkedInSections(input)));
});

test("slugFromFilename strips leading digits and dash", () => {
  assert.equal(slugFromFilename("01-the-paradox.md"), "the-paradox");
  assert.equal(slugFromFilename("12-foo-bar.md"), "foo-bar");
});

test("slugFromFilename throws on filename without numeric prefix", () => {
  assert.throws(() => slugFromFilename("no-prefix.md"), /numeric prefix/);
});

test("parseAtomFrontmatter extracts position and title", () => {
  const md = `---
title: "The Paradox"
position: 1
series: "ai-cognitive-debt"
---

## HOOK
Body.
`;
  const fm = parseAtomFrontmatter(md);
  assert.equal(fm.title, "The Paradox");
  assert.equal(fm.position, 1);
  assert.equal(fm.series, "ai-cognitive-debt");
});

test("stripLinkedInSections preserves H2 inside fenced code blocks", () => {
  const input = `---
title: X
---

## HOOK

The hook.

## BODY

Real body talking about syntax:

\`\`\`markdown
## HASHTAGS
should not be stripped
\`\`\`

End of body.

## HASHTAGS

Real hashtags to strip.
`;
  const out = stripLinkedInSections(input);
  // The H2 inside the code block must survive
  assert.match(out, /## HASHTAGS\nshould not be stripped/);
  // The real ## HASHTAGS (after BODY) must be removed
  assert.doesNotMatch(out, /Real hashtags to strip/);
});

test("topicFromId splits topic and atom slug", () => {
  assert.deepEqual(
    topicFromId("ai-cognitive-debt/01-the-paradox"),
    { topic: "ai-cognitive-debt", atom: "the-paradox" }
  );
});

test("topicFromId throws on id without topic directory", () => {
  assert.throws(() => topicFromId("01-the-paradox"), /must include topic/);
});

test("parseAtomBody splits HOOK BODY CTA", () => {
  const md = `---
title: X
---

## HOOK

Hook line one.
Hook line two.

## BODY

Body paragraph.

## CTA

The CTA question.
`;
  const { hook, body, cta } = parseAtomBody(md);
  assert.equal(hook, "Hook line one.\nHook line two.");
  assert.equal(body, "Body paragraph.");
  assert.equal(cta, "The CTA question.");
});

test("parseAtomBody returns empty strings for missing sections", () => {
  const md = `---
title: X
---

## HOOK

Just the hook.
`;
  const { hook, body, cta } = parseAtomBody(md);
  assert.equal(hook, "Just the hook.");
  assert.equal(body, "");
  assert.equal(cta, "");
});

test("stripLinkedInSections removes Title-Case Engagement Strategy and Sources", () => {
  const input = `---
title: X
---

## HOOK
Hook.

## BODY
Body.

## CTA
CTA.

## Sources
- Source 1

## Engagement Strategy
Strategy text.
`;
  const out = stripLinkedInSections(input);
  assert.match(out, /## HOOK/);
  assert.match(out, /## BODY/);
  assert.match(out, /## CTA/);
  assert.doesNotMatch(out, /## Sources/);
  assert.doesNotMatch(out, /## Engagement Strategy/);
});

test("stripLinkedInSections removes 'Notiz' prefixed headings (DE)", () => {
  const input = `---
title: X
---

## Hook
Hook.

## Body
Body.

## Close
Close.

## Notiz für die Serie
Internal note.
`;
  const out = stripLinkedInSections(input);
  assert.match(out, /## Hook/);
  assert.match(out, /## Body/);
  assert.match(out, /## Close/);
  assert.doesNotMatch(out, /## Notiz/);
});

test("parseAtomBody falls back to Close when CTA is missing (DE atoms)", () => {
  const md = `---
title: X
---

## Hook
The hook line.

## Body
Body paragraph.

## Close
The German closing question?
`;
  const { hook, body, cta } = parseAtomBody(md);
  assert.equal(hook, "The hook line.");
  assert.equal(body, "Body paragraph.");
  assert.equal(cta, "The German closing question?");
});
