/** Shared post routing, publication dates and archive ordering. */
export function slugOf(entry) {
  return entry.id.replace(/\.md$/, "");
}

export function postPath(entry) {
  const slug = slugOf(entry);
  return (entry.data?.lang ?? "en") === "de" ? `/de/post/${slug}/` : `/post/${slug}/`;
}

/** Existing editorial dates and ISO dates are date-only values in UTC. */
export function postDate(value) {
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const date = new Date(`${text}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === text ? date : new Date(NaN);
  }
  const match = text.match(/^([A-Za-z]{3}) (\d{1,2})(?:st|nd|rd|th)?, (\d{4})$/);
  if (!match) return new Date(NaN);
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(match[1]);
  if (month < 0) return new Date(NaN);
  const date = new Date(Date.UTC(Number(match[3]), month, Number(match[2])));
  return date.getUTCMonth() === month ? date : new Date(NaN);
}

export function formatPostDate(value, lang = "en") {
  return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(postDate(value));
}

/**
 * Future and malformed dates stay out of routes, navigation and RSS.
 * @template {{id: string, data: {dateFormatted: string, lang?: string}}} T
 * @param {T[]} posts
 * @param {{lang?: string, now?: Date}} [options]
 */
export function sortedPosts(posts, { lang, now = new Date() } = {}) {
  return posts
    .filter((p) => !lang || (p.data.lang ?? "en") === lang)
    .map((p) => ({ ...p, _date: postDate(p.data.dateFormatted), _path: postPath(p) }))
    .filter((p) => Number.isFinite(p._date.getTime()) && p._date <= now)
    .sort((a, b) => b._date.getTime() - a._date.getTime() || a.id.localeCompare(b.id));
}
