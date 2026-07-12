import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { sortedPosts } from "../lib/posts.mjs";

export async function GET(context) {
  const posts = await getCollection("post");
  const items = sortedPosts(posts).map((p) => ({
    title: p.data.title,
    description: p.data.description,
    pubDate: p._date,
    link: p._path,
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
