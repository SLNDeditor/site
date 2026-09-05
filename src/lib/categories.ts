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

// --- Rubrique Théâtre : arborescence de la barre latérale --------------------
// L'arbre est reconstruit à partir du frontmatter des articles `category:
// theatre` (aucune liste à tenir à jour ici) — bloc `menu:` de chaque article :
//   • `menu.group`  = intitulé du sous-menu de 1er niveau (ex. « En Attendant
//     l'algérie »). Vide → l'article est lui-même un item de 1er niveau.
//   • `menu.parent` = slug d'un article parent, pour imbriquer plus profond
//     (ex. les interventions sous « principe-des-interventions »).
//   • `menu.order`  = ordre croissant dans le groupe / sous le parent.
//   • `menu.label`  = libellé court affiché dans le menu (défaut : le titre).
// Un groupe est placé selon le plus petit `order` de ses membres.

export type TheatreNode = {
	label: string;
	href?: string;
	id?: string;
	children?: TheatreNode[];
};

export async function getTheatreTree(): Promise<TheatreNode[]> {
	const all = await getCollection('blog');
	const posts = all.filter((p) => p.data.category === 'theatre');
	const ord = (p: (typeof posts)[number]) => p.data.menu?.order ?? 999;
	const lbl = (p: (typeof posts)[number]) => p.data.menu?.label || p.data.title;

	const nodeFor = (p: (typeof posts)[number]): TheatreNode => {
		const kids = posts
			.filter((c) => c.data.menu?.parent === p.id)
			.sort((a, b) => ord(a) - ord(b))
			.map(nodeFor);
		return {
			label: lbl(p),
			href: `/blog/${p.id}/`,
			id: p.id,
			children: kids.length ? kids : undefined,
		};
	};

	// Items de 1er niveau : ceux sans `menu.parent`.
	const top = posts.filter((p) => !p.data.menu?.parent);
	const groups = new Map<string, (typeof posts)[number][]>();
	const standalone: (typeof posts)[number][] = [];
	for (const p of top) {
		const g = p.data.menu?.group;
		if (g) (groups.get(g) ?? groups.set(g, []).get(g)!).push(p);
		else standalone.push(p);
	}

	const entries: { order: number; node: TheatreNode }[] = [];
	for (const [name, members] of groups) {
		members.sort((a, b) => ord(a) - ord(b));
		entries.push({
			order: Math.min(...members.map(ord)),
			node: { label: name, children: members.map(nodeFor) },
		});
	}
	for (const p of standalone) entries.push({ order: ord(p), node: nodeFor(p) });
	entries.sort((a, b) => a.order - b.order);
	return entries.map((e) => e.node);
}

// Parcours à plat de l'arborescence Théâtre, dans l'ordre d'affichage.
export function flattenTheatre(nodes: TheatreNode[]): TheatreNode[] {
	return nodes.flatMap((n) => [n, ...(n.children ? flattenTheatre(n.children) : [])]);
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
