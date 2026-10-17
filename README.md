# zalia sékaï — site

Code source du site de l'écrivaine **zalia sékaï** : <https://zaliasekai.netlify.app>

Essais, théâtre, récits et vidéos autour de l'exil, de l'Algérie, de la
colonisation et de l'œuvre de Kateb Yacine.

## Droits sur les textes

Les textes, images et enregistrements publiés ici sont l'œuvre de zalia sékaï.
Le site en précise les conditions d'usage :

> Vous pouvez librement télécharger, citer mes textes,
> à condition d'en indiquer les sources.

Le dépôt est public pour des raisons techniques d'hébergement ; cela ne vaut
pas cession de droits sur les œuvres qu'il contient.

## Comment le site est publié

L'autrice écrit depuis une interface d'administration en ligne (Sveltia CMS).
Chaque publication commite sur `main`, et Netlify reconstruit le site.

```
/admin/ → commit sur main → build Netlify → site en ligne
```

**La mise à jour ne va que dans ce sens.** Ce qui est en ligne fait foi : une
copie locale ne doit jamais être republiée par-dessus. Voir `AGENTS.md`.

| document | pour qui |
|---|---|
| [`PUBLIER.md`](PUBLIER.md) | l'autrice — publier, et quoi faire si ça coince |
| [`ADMIN.md`](ADMIN.md) | les champs du CMS, l'éditeur, le dépannage |
| [`AGENTS.md`](AGENTS.md) | règles de travail sur le dépôt (sens unique, interdits) |

## Technique

[Astro](https://astro.build) 7, contenu en Markdown dans `src/content/`,
images optimisées à la compilation, polices auto-hébergées. Hébergement Netlify.

```sh
npm install
npm run dev     # http://localhost:4321
npm run build   # → dist/
./sync.sh       # récupérer ce qui a été publié en ligne
```

La configuration de build (version de Node, en-têtes, cache) est dans
`netlify.toml`, versionnée — pas dans l'interface Netlify.
