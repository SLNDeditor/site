#!/usr/bin/env node
/**
 * Contrôles après construction — `npm run verifier` (lance `astro build` avant).
 *
 * POURQUOI CE FICHIER
 * Le 7/11/2026, Zalia a republié douze fois de suite le même article parce
 * qu'un chapeau supprimé dans l'admin continuait de s'afficher sur la page de
 * la rubrique : deux gabarits y affichaient encore la « Description Google »
 * à la place du « Chapeau ». Rien n'avait signalé l'écart — ni la construction,
 * ni l'admin, qui affiche « publié » quoi qu'il arrive.
 *
 * Ces contrôles lisent le site CONSTRUIT (dist/) et échouent bruyamment si
 * l'écart se reforme. Ils ne remplacent pas un regard, ils attrapent les
 * régressions silencieuses.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { load as parseYaml } from 'js-yaml';

const DIST = 'dist';
const BLOG = 'src/content/blog';
const PAGES = 'src/content/pages';
const CONFIG = 'public/admin/config.yml';

let echecs = 0;
const ok = (m) => console.log(`  ✅ ${m}`);
const ko = (m) => { console.log(`  ❌ ${m}`); echecs += 1; };

// --- utilitaires -------------------------------------------------------------
const pagesHtml = (dir = DIST) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = join(dir, e.name);
		if (e.isDirectory()) return pagesHtml(p);
		return e.name.endsWith('.html') ? [p] : [];
	});

const url = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '');

// Le frontmatter est du YAML : on le lit avec un vrai parseur. Un mini-parseur
// maison se trompait sur les chaînes entre guillemets contenant « \n »
// (l'échappement restait littéral et faussait la comparaison).
const donnees = (f) => {
	const t = readFileSync(f, 'utf8');
	const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return {};
	try {
		return parseYaml(m[1]) ?? {};
	} catch {
		ko(`${f} : frontmatter illisible (YAML invalide)`);
		return {};
	}
};
const champ = (d, nom) => {
	const v = d?.[nom];
	return v === undefined || v === null ? '' : String(v);
};

const texteVisible = (html) => {
	let h = html.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/g, ' ');
	const m = h.match(/<main\b[\s\S]*?<\/main>/);
	h = m ? m[0] : h;
	return h
		.replace(/<[^>]+>/g, ' ')
		.replace(/&#39;|&rsquo;/g, "'")
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
};
// Ramène un texte à sa substance : sans accents, sans ponctuation, sans
// différence apostrophe droite / courbe — pour comparer un markdown rendu à
// la chaîne brute du frontmatter.
const noyau = (s) =>
	s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '')
		.slice(0, 200);

if (!existsSync(DIST)) {
	console.error("dist/ est absent : lancer `npm run build` d'abord.");
	process.exit(1);
}

// =============================================================================
console.log('\n1. L’emplacement du chapeau ne doit contenir QUE le chapeau');
// C'est exactement le bug du 7/11/2026 : deux gabarits rendaient la
// « Description Google » dans le bloc .lead, à la place du « Chapeau ».
// On ne cherche donc PAS la description dans toute la page (elle est souvent
// un extrait du corps du texte, on la retrouverait partout pour rien) : on
// regarde ce qu'il y a dans le bloc .lead, et rien d'autre.
{
	const avant = echecs;
	const fiches = [
		...readdirSync(BLOG).filter((f) => f.endsWith('.md')).map((f) => join(BLOG, f)),
		...(existsSync(PAGES) ? readdirSync(PAGES).filter((f) => f.endsWith('.md')).map((f) => join(PAGES, f)) : []),
	].map((f) => {
		const fm = donnees(f);
		return { f, lead: noyau(champ(fm, 'lead')), desc: noyau(champ(fm, 'description')) };
	});

	const chapeaux = fiches.filter((x) => x.lead).map((x) => x.lead);
	// descriptions qui ne sont PAS le début du chapeau : les confondre se voit
	const descriptions = fiches.filter((x) => x.desc && !x.lead.startsWith(x.desc.slice(0, 50)));

	const correspond = (a, b) => a && b && (a.startsWith(b.slice(0, 50)) || b.startsWith(a.slice(0, 50)));

	let blocs = 0;
	for (const p of pagesHtml()) {
		if (url(p).startsWith('/admin')) continue;
		const html = readFileSync(p, 'utf8');
		for (const m of html.matchAll(/class="lead[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/g)) {
			const n = noyau(texteVisible(m[1]));
			if (!n) continue;
			blocs += 1;
			if (chapeaux.some((c) => correspond(n, c))) continue;
			const coupable = descriptions.find((x) => correspond(n, x.desc));
			if (coupable) {
				ko(`${url(p)} : le bloc « chapeau » affiche la Description Google de « ${coupable.f} »`);
			} else {
				ko(`${url(p)} : le bloc « chapeau » affiche un texte qui n’est le chapeau d’aucun contenu`);
			}
		}
	}
	if (echecs === avant) ok(`${blocs} chapeau(x) affiché(s) — tous viennent bien du champ « Chapeau »`);
}

// =============================================================================
console.log('\n2. Un chapeau vidé dans l’admin doit disparaître de la page du texte');
// Vérification directe, article par article : /blog/<identifiant>/ doit
// montrer le chapeau de <identifiant>.md, et rien si le champ est vide.
{
	const avant = echecs;
	let vides = 0;
	for (const f of readdirSync(BLOG).filter((x) => x.endsWith('.md'))) {
		const slug = f.replace(/\.md$/, '');
		const page = join(DIST, 'blog', slug, 'index.html');
		if (!existsSync(page)) { ko(`/blog/${slug}/ n’a pas été construite`); continue; }
		const html = readFileSync(page, 'utf8');
		const bloc = [...html.matchAll(/class="lead[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/g)]
			.map((m) => noyau(texteVisible(m[1])))
			.filter(Boolean);
		const lead = noyau(champ(donnees(join(BLOG, f)), 'lead'));
		if (!lead) {
			vides += 1;
			if (bloc.length) ko(`/blog/${slug}/ affiche un chapeau alors que le champ « Chapeau » est vide`);
		} else if (!bloc.length) {
			ko(`/blog/${slug}/ n’affiche pas son chapeau`);
		} else if (!bloc.some((b) => b.startsWith(lead.slice(0, 50)) || lead.startsWith(b.slice(0, 50)))) {
			ko(`/blog/${slug}/ affiche un chapeau qui ne correspond pas au champ « Chapeau »`);
		}
	}
	if (echecs === avant) ok(`${vides} chapeau(x) vidé(s) dans l’admin — aucun ne réapparaît sur la page`);
}

// =============================================================================
console.log('\n3. Pas de liens imbriqués (HTML invalide)');
{
	const avant = echecs;
	for (const p of pagesHtml()) {
		const html = readFileSync(p, 'utf8');
		if (/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<a\b/.test(html)) ko(`${url(p)} contient des <a> imbriqués`);
	}
	if (echecs === avant) ok('aucune page concernée');
}

// =============================================================================
console.log('\n4. Toute page a une description Google non vide');
{
	const avant = echecs;
	for (const p of pagesHtml()) {
		if (url(p).startsWith('/admin')) continue;
		const m = readFileSync(p, 'utf8').match(/<meta name="description" content="(.*?)"/s);
		if (!m || !m[1].trim()) ko(`${url(p)} n’a pas de description Google`);
	}
	if (echecs === avant) ok('toutes les pages en ont une');
}

// =============================================================================
console.log('\n5. L’admin : chaque texte apparaît dans exactement une rubrique');
{
	const avant = echecs;
	const cfg = parseYaml(readFileSync(CONFIG, 'utf8'));
	const listes = cfg.collections.filter((c) => c.folder === BLOG);
	const filtrees = listes.filter((c) => c.filter);
	const fourreTout = listes.filter((c) => !c.filter);

	if (fourreTout.length !== 1) ko(`il faut exactement une liste sans filtre (filet de sécurité) — ${fourreTout.length} trouvée(s)`);

	// mêmes champs partout : un texte s'édite pareil où qu'on l'ouvre
	const ref = JSON.stringify(listes[0].fields.map((f) => f.name));
	for (const c of listes) {
		if (JSON.stringify(c.fields.map((f) => f.name)) !== ref) ko(`la liste « ${c.label} » n’a pas les mêmes champs que les autres`);
	}
	// la valeur par défaut de Rubrique doit correspondre au filtre
	for (const c of filtrees) {
		const cat = c.fields.find((f) => f.name === 'category');
		if (cat?.default !== c.filter.value) ko(`« ${c.label} » : Rubrique par défaut = ${cat?.default}, mais filtre = ${c.filter.value}`);
	}
	// chaque rubrique proposée dans le menu déroulant doit avoir sa liste
	const options = (listes[0].fields.find((f) => f.name === 'category')?.options ?? []).map((o) => o.value);
	for (const v of options) {
		if (!filtrees.some((c) => c.filter.value === v)) ko(`la rubrique « ${v} » est proposée dans l’admin mais n’a pas de liste dédiée`);
	}
	// aucun texte orphelin
	for (const f of readdirSync(BLOG).filter((f) => f.endsWith('.md'))) {
		const cat = champ(donnees(join(BLOG, f)), 'category');
		const n = filtrees.filter((c) => c.filter.value === cat).length;
		if (n === 0) ko(`« ${f} » (rubrique « ${cat} ») n’apparaît dans aucune liste filtrée de l’admin`);
		if (n > 1) ko(`« ${f} » apparaît dans ${n} listes de l’admin`);
	}
	// le repli par rubrique doit être appliqué d'office
	const vg = fourreTout[0]?.view_groups;
	if (!vg?.default || !vg?.groups?.some((g) => g.name === vg.default)) {
		ko('la liste « Tous les textes » n’est pas repliée par rubrique d’office (view_groups.default manquant)');
	}
	if (echecs === avant) ok(`${listes.length} listes, ${filtrees.length} rubriques, aucun texte orphelin`);
}

// =============================================================================
console.log(
	echecs === 0
		? '\n✅ Tout est conforme.\n'
		: `\n❌ ${echecs} problème(s). Le site est construit mais quelque chose ne correspond plus à ce que l’admin enregistre.\n`,
);
process.exit(echecs === 0 ? 0 : 1);
