import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/post" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		dateFormatted: z.string(),
		lang: z.enum(["en", "de"]).default("en"),
	}),
});

export const collections = {
	post: postCollection,
};
