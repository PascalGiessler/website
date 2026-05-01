import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

function parseDate(dateStr) {
  const [month, day, year] = dateStr.split(" ");
  return new Date(`${month} ${parseInt(day)}, ${year}`);
}

export async function GET(context) {
  const posts = await getCollection("post");
  const items = posts
    .map((p) => ({ ...p, _date: parseDate(p.data.dateFormatted) }))
    .sort((a, b) => b._date.getTime() - a._date.getTime())
    .map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p._date,
      link: `/post/${p.id.replace(/\.md$/, "")}/`,
    }));

  return rss({
    title: "Dr. Pascal Giessler · Writing",
    description:
      "Articles and essays by Dr. Pascal Giessler on AI engineering, cloud architecture, technical leadership, and distributed systems.",
    site: context.site,
    items,
    customData: "<language>en-us</language>",
  });
}
