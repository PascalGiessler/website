import { test } from "node:test";
import assert from "node:assert/strict";
import { stripLinkedInSections, slugFromFilename, parseAtomFrontmatter } from "../src/lib/series.mjs";

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
