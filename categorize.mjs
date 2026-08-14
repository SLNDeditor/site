import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/blog';

// slug (nom de fichier sans .md) -> rubrique
const MAP = {
  // ---- ESSAI (rubrique ; les textes déjà mis en avant dans « Articles »/« Vidéos » en sont retirés) ----
  'algeriennes-surexposees': 'essai', // « Algériennes surexposées » (16 août 2025)
  // ---- ARTICLES (sélection curatée CURATED_ARTICLES ; retirés d'Essai) ----
  'algeria-on-my-mind': 'article',
  'kateb-yacine-martin-luther-king': 'article',
  'guelma-selma-une-prosopopee-entre-kateb-yacine-et-martin-luther-king': 'article',
  'l-algerie-marche-dans-nos-reves': 'article',
  'algeriennes-surexposees-article': 'article',
  'l-identite-en-fragments': 'article',
  'kateb-yacine-et-les-langues-en-algerie': 'article',
  'la-langue-a-deux-tetes-le-cas-algerien': 'article',
  // ---- VIDÉOS (sélection curatée CURATED_VIDEOS ; retirés d'Essai) ----
  'french-dream-is-a-dream-1': 'videos',
  'french-dream-is-a-dream-2': 'videos',
  'french-dream-is-a-dream-3': 'videos',
  // ---- LITTÉRATURE > THÉÂTRE (Pièce « En Attendant l'algérie ») ----
  'en-attendant-l-algerie': 'theatre',
  'principe-de-mise-en-scene': 'theatre',
  'presentation-de-la-piece': 'theatre',
  'photos-de-la-piece-jouee-a-la-ferme-du-bonheur': 'theatre',
  'repete-ad-nauseaum-en-attendant-l-algerie': 'theatre',
  // ---- LITTÉRATURE > THÉÂTRE > sous-groupe « Interventions » (barre latérale) ----
  'intervention-de-gilbert-grandguillaume': 'theatre',
  'intervention-de-djilali-hadjadj': 'theatre',
  'intervention-de-said-bouamama': 'theatre',
  'principe-des-interventions': 'theatre',
  // ---- LITTÉRATURE > RÉCIT (« Autopsie d'un exil ») ----
  'autopsie-d-un-exil-algerien-ou-lux-beaute-a-la-rose': 'recit',
  // ---- INTERVENTIONS ----
  'guelma-selma': 'interventions', // « GUELMA / SELMA »
  'festival-non-aligne': 'interventions',
  'conference-debat-algeriennes-surexposees': 'interventions', // « Conférence-débat » (Lyon 2, 28/11/2025)
  // ---- ACTUALITÉS ----
  'rencontres-avec-l-auteure': 'actualites',
  // ---- REVUE DE PRESSE ----
  'algerie-la-desossee': 'revue-de-presse',
  'les-exiles-n-ont-pas-realise-leurs-reves-ils-sont-dans-une-quete-sans-fin': 'revue-de-presse',
  // ---- PAGES hors menu ----
  'presentation-de-l-auteure': 'page',
  'contact': 'page',
  'avertissement': 'page',
};

let done = 0;
const missing = [];
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const slug = file.replace(/\.md$/, '');
  const cat = MAP[slug];
  if (!cat) { missing.push(slug); continue; }
  let txt = fs.readFileSync(path.join(DIR, file), 'utf8');
  // retirer une éventuelle ligne category existante puis l'insérer après pubDate
  txt = txt.replace(/^category:.*\n/m, '');
  txt = txt.replace(/^(pubDate:.*)$/m, `$1\ncategory: ${cat}`);
  fs.writeFileSync(path.join(DIR, file), txt);
  done++;
}
console.log(`✓ ${done} fichiers catégorisés`);
if (missing.length) console.log('⚠ non mappés :', missing);
