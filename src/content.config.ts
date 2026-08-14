import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			// Afficher ou non la date sur l'article (par défaut : affichée)
			showDate: z.boolean().optional().default(true),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// Rubrique : essai | litterature | actualites | videos | interventions | page
			category: z.string().optional(),
			// Identifiant YouTube de la vidéo (ex. "5DxPb8X4Z5s"), affichée en haut de l'article.
			video: z.string().optional(),
		}),
});

export const collections = { blog };
