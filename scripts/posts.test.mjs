import test from "node:test";
import assert from "node:assert/strict";
import { postDate, formatPostDate, sortedPosts } from "../src/lib/posts.mjs";
const entry = (id, dateFormatted, lang = "en") => ({ id, data: { dateFormatted, lang } });

test("legacy editorial dates and ISO dates share the same UTC day", () => {
  assert.equal(postDate("Jun 29th, 2026").toISOString(), "2026-06-29T00:00:00.000Z");
  assert.equal(postDate("2026-10-22").toISOString(), "2026-10-22T00:00:00.000Z");
  assert.ok(Number.isNaN(postDate("Feb 31st, 2026").getTime()));
  assert.ok(Number.isNaN(postDate("2026-02-31").getTime()));
});
test("a local archive excludes other languages, future dates and invalid dates", () => {
  const posts = [entry("en.md", "Oct 22nd, 2026"), entry("future.md", "Oct 26th, 2026", "de"), entry("older.md", "Oct 13th, 2026", "de"), entry("newer.md", "Oct 22nd, 2026", "de"), entry("bad.md", "invalid", "de")];
  const result = sortedPosts(posts, { lang: "de", now: new Date("2026-10-25T12:00:00Z") });
  assert.deepEqual(result.map(p => p.id), ["newer.md", "older.md"]);
  assert.equal(result[0]._path, "/de/post/newer/");
  assert.equal(posts.length, 5);
});
test("RSS ordering includes both languages and deterministic ties", () => {
  const result = sortedPosts([entry("b.md", "Oct 22nd, 2026", "de"), entry("a.md", "Oct 22nd, 2026")], { now: new Date("2026-10-25T00:00:00Z") });
  assert.deepEqual(result.map(p => p._path), ["/post/a/", "/de/post/b/"]);
});
test("visible dates use the page language and remain timezone independent", () => {
  assert.equal(formatPostDate("2026-10-22", "de"), "22. Okt. 2026");
  assert.equal(formatPostDate("2026-10-22", "en"), "22 Oct 2026");
});
