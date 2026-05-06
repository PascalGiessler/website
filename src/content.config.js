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

// Series metadata: one _series.md per topic directory
const seriesCollection = defineCollection({
	loader: glob({ pattern: "*/_series.md", base: "./src/content/series" }),
	schema: z.object({
		title: z.string(),
		italic_word: z.string(),
		position: z.number().int().positive(),
		language: z.enum(["en", "de"]),
		published_at: z.string(),
		atom_count: z.number().int().positive(),
		thesis: z.string(),
		synthesis_post: z.string().optional(),
		force_publish: z.boolean().optional(),
	}),
});

// Atoms: numbered markdown files inside each topic directory
const atomCollection = defineCollection({
	loader: glob({ pattern: "*/[0-9]*-*.md", base: "./src/content/series" }),
	schema: z.object({
		title: z.string(),
		position: z.number().int().positive(),
		linkedin_url: z.string().optional(),
		series: z.string(),
	}).passthrough(),
});

export const collections = {
	post: postCollection,
	series: seriesCollection,
	atom: atomCollection,
};
