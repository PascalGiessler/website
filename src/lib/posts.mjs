/**
 * Post routing helpers.
 *
 * Long-form essays live in the URL space of the language they are written in:
 * German essays at /de/post/<slug>/, English essays at /post/<slug>/. There is
 * no translation pair, each essay exists once. Serving a German essay from the
 * English space (as we did until 2026-07-12) tells Google the wrong thing about
 * a page whose whole purpose is to rank in DACH.
 */

/** Strip the .md suffix from a content-collection id. */
export function slugOf(entry) {
  return entry.id.replace(/\.md$/, "");
}

/** Canonical path for a post, derived from its own language. */
export function postPath(entry) {
  const slug = slugOf(entry);
  return (entry.data?.lang ?? "en") === "de" ? `/de/post/${slug}/` : `/post/${slug}/`;
}

/** Parse the human "Jun 29th, 2026" date used across the collection. */
export function postDate(dateFormatted) {
  const [month, day, year] = String(dateFormatted).split(" ");
  return new Date(`${month} ${parseInt(day, 10)}, ${year}`);
}

/** All posts, newest first, with their resolved path. */
export function sortedPosts(posts) {
  return posts
    .map((p) => ({ ...p, _date: postDate(p.data.dateFormatted), _path: postPath(p) }))
    .sort((a, b) => b._date.getTime() - a._date.getTime());
}
