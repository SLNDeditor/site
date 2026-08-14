import fs from 'node:fs';
import path from 'node:path';

const SRC = '../recovery/output';
const DEST = 'src/content/blog';

// nettoyer les exemples + anciens fichiers
for (const f of fs.readdirSync(DEST)) {
  if (f.endsWith('.md') || f.endsWith('.mdx')) fs.unlinkSync(path.join(DEST, f));
}
// copier les images
fs.rmSync(path.join(DEST, 'images'), { recursive: true, force: true });
fs.cpSync(path.join(SRC, 'images'), path.join(DEST, 'images'), { recursive: true });

function parseFrontmatter(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const fm = m[1], body = m[2];
  const get = (k) => {
    const r = fm.match(new RegExp('^' + k + ': (.*)$', 'm'));
    if (!r) return '';
    let v = r[1].trim();
    if (v.startsWith('"')) { try { return JSON.parse(v); } catch { return v.replace(/^"|"$/g, ''); } }
    return v;
  };
  const images = [...fm.matchAll(/^\s*-\s*(images\/\S+)$/gm)].map((x) => x[1]);
  return { title: get('title'), date: get('date'), description: get('description'), source: get('source'), images, body };
}

let count = 0;
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.md'))) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
  const { title, date, description, source, images, body } = parseFrontmatter(raw);

  const hero = images[0] || null;
  let md = body;
  // normaliser les chemins d'images du corps -> ./images/
  md = md.replace(/\]\(images\//g, '](./images/');
  // retirer la 1re occurrence inline de l'image de couverture (évite le doublon avec le hero)
  if (hero) {
    const heroFile = hero.replace(/^images\//, '');
    const re = new RegExp('^!\\[[^\\]]*\\]\\(\\.\\/images\\/' + heroFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\)\\s*$', 'm');
    md = md.replace(re, '');
  }
  md = md.replace(/\n{3,}/g, '\n\n').trim();

  const fm = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDate: ${date}`,
    hero ? `heroImage: "./${hero}"` : null,
    `source: ${source}`,
    '---',
    '',
  ].filter((l) => l !== null).join('\n');

  fs.writeFileSync(path.join(DEST, file), fm + '\n' + md + '\n');
  count++;
}
console.log(`✓ ${count} articles écrits dans ${DEST}`);
console.log(`✓ images copiées : ${fs.readdirSync(path.join(DEST, 'images')).length}`);
