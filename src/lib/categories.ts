import { getCollection } from 'astro:content';

export type CatSlug = 'essai' | 'theatre' | 'recit' | 'actualites' | 'interventions' | 'revue-de-presse';

// Rubriques pilotées par le champ `category` (pages générées par [category].astro)
export const CATEGORIES: { slug: CatSlug; label: string }[] = [
	{ slug: 'essai', label: 'Essai' },
	{ slug: 'theatre', label: 'Théâtre' },
	{ slug: 'recit', label: 'Récit' },
	{ slug: 'actualites', label: 'Actualités' },
	{ slug: 'interventions', label: 'Interventions' },
	{ slug: 'revue-de-presse', label: 'Revue de presse' },
];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
	CATEGORIES.map((c) => [c.slug, c.label]),
);

// Menu principal du header (ordre d'affichage). Un item avec `children` est un
// menu déroulant. « Articles » et « Vidéos » sont des sélections curatées
// (voir CURATED_*), les autres renvoient à des pages-rubriques.
export type NavItem = { label: string; href?: string; children?: { href: string; label: string }[] };
export const NAV: NavItem[] = [
	{ href: '/articles', label: 'Articles' },
	{ href: '/essai', label: 'Essai' },
	{
		label: 'Littérature',
		children: [
			{ href: '/theatre', label: 'Théâtre' },
			{ href: '/recit', label: 'Récit' },
		],
	},
	{ href: '/videos', label: 'Vidéos' },
	{ href: '/interventions', label: 'Interventions' },
	{ href: '/actualites', label: 'Actualités' },
	{ href: '/revue-de-presse', label: 'Revue de presse' },
];

// Sélection « Articles » : essais mis en avant, dans cet ordre précis.
export const CURATED_ARTICLES: string[] = [
	'algeria-on-my-mind',
	'kateb-yacine-martin-luther-king',
	'guelma-selma-une-prosopopee-entre-kateb-yacine-et-martin-luther-king',
	'l-algerie-marche-dans-nos-reves',
	'algeriennes-surexposees-article',
	'l-identite-en-fragments',
	'kateb-yacine-et-les-langues-en-algerie',
	'la-langue-a-deux-tetes-le-cas-algerien',
];

// Sélection « Vidéos » : les vidéos seront ajoutées ensuite dans chaque texte.
export const CURATED_VIDEOS: string[] = [
	'french-dream-is-a-dream-3',
	'french-dream-is-a-dream-2',
	'french-dream-is-a-dream-1',
];

// Rubrique Théâtre : sous-groupe « Interventions » (liées à la pièce « En
// Attendant l'algérie »), affiché comme second bloc dans la barre latérale.
// Ordre imposé par l'autrice.
export const THEATRE_INTERVENTIONS: string[] = [
	'intervention-de-gilbert-grandguillaume',
	'intervention-de-djilali-hadjadj',
	'intervention-de-said-bouamama',
	'principe-des-interventions',
];

// Théâtre découpé en deux groupes pour la barre latérale : les textes de la
// pièce, puis les « Interventions » liées.
export async function getTheatreGroups() {
	const all = await getPostsByCategory('theatre');
	const set = new Set(THEATRE_INTERVENTIONS);
	const theatre = all.filter((p) => !set.has(p.id));
	const interventions = await getPostsBySlugs(THEATRE_INTERVENTIONS);
	return { theatre, interventions };
}

// Articles d'une rubrique, triés du plus récent au plus ancien
export async function getPostsByCategory(slug: string) {
	const posts = await getCollection('blog', (p) => p.data.category === slug);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// Articles d'une sélection curatée, dans l'ordre exact de la liste de slugs.
export async function getPostsBySlugs(slugs: string[]) {
	const all = await getCollection('blog');
	const byId = new Map(all.map((p) => [p.id, p]));
	return slugs.map((s) => byId.get(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}
