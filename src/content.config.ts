import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Héro : les deux conventions cohabitent, mais elles ne se valident pas de la
// même façon.
//   « /blog-media/… » : fichier de `public/`, téléversé depuis le CMS. Il doit
//     rester une **chaîne**. `image()` accepte la valeur à la validation puis
//     cherche le fichier à la racine du projet (pas dans `public/`) : la
//     construction s'arrête alors sur `ImageNotFound`, l'admin affiche
//     « publié » et le site en ligne ne bouge plus. D'où le test de chemin
//     absolu **avant** `image()` — un `z.union` retient la première branche qui
//     valide.
//   « ./images/… » : image locale, optimisée par Astro (convention historique).
const heroImage = (image: SchemaContext['image']) =>
	z.union([z.string().startsWith('/'), image(), z.string()]).optional();

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Description SEO : sert UNIQUEMENT à la balise <meta name="description">
			// (Google, partages sur les réseaux). Jamais affichée sur la page.
			description: z.string().optional().default(''),
			// Chapeau : court paragraphe affiché en italique sous le titre.
			// Markdown restreint (gras, italique, citation). Ne va PAS dans le SEO.
			lead: z.string().optional().default(''),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			// Afficher ou non la date sur l'article (par défaut : affichée)
			showDate: z.boolean().optional().default(true),
			updatedDate: z.coerce.date().optional(),
			// Voir `heroImage` plus haut : image locale optimisée
			// (« ./images/… ») ou chemin absolu vers /public (« /blog-media/… »).
			heroImage: heroImage(image),
			// Rubrique : essai | theatre | recit | actualites | interventions |
			// revue-de-presse | article | videos | page
			category: z.string().optional(),
			// Identifiant YouTube de la vidéo (ex. "5DxPb8X4Z5s"), affichée en haut de l'article.
			video: z.string().optional(),
			// Numéro de la revue NADA associée : la couverture (héro) devient un
			// lien vers le PDF `public/nada/nada-<n>.pdf` (lecture + téléchargement).
			nada: z.coerce.number().nullish().transform((v) => v ?? undefined),
			// Emplacement dans le menu latéral (rubrique Théâtre uniquement).
			//   group  = intitulé du sous-menu de 1er niveau (ex. « En Attendant
			//            l'algérie ») ; vide = item de 1er niveau (comme Guelma/Selma).
			//   parent = identifiant (slug) d'un article parent, pour imbriquer plus
			//            profond (ex. les interventions sous « principe-des-interventions »).
			//   order  = ordre croissant dans le groupe / sous le parent.
			//   label  = libellé court affiché dans le menu (défaut : le titre).
			menu: z
				.object({
					group: z.string().optional(),
					parent: z.string().optional(),
					order: z.coerce.number().optional(),
					label: z.string().optional(),
				})
				.nullable()
				.optional(),
		}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Idem collection « blog » : description = SEO seul, lead = chapeau visible.
			description: z.string().optional().default(''),
			lead: z.string().optional().default(''),
			heroImage: heroImage(image),
			updatedDate: z.coerce.date().optional(),
		}),
});

export const collections = { blog, pages };
