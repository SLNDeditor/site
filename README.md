# zalia sékaï — site

Code source du site de l'écrivaine **zalia sékaï** : <https://zaliasekai.netlify.app>

Essais, théâtre, récits et vidéos autour de l'exil, de l'Algérie, de la
colonisation et de l'œuvre de Kateb Yacine.

## Droits

**Les textes sont l'œuvre de Zalia Sékaï, qui en est seule titulaire des
droits. © Zalia Sékaï, tous droits réservés.** La citation est autorisée à
condition d'indiquer l'auteure et la source — c'est tout ce qu'autorise le
site :

> Vous pouvez librement télécharger, citer mes textes,
> à condition d'en indiquer les sources.

Reproduction intégrale, republication, traduction, adaptation, exploitation
commerciale et usage comme données d'entraînement supposent son autorisation
écrite préalable. Le dépôt est public pour des raisons techniques
d'hébergement : **cela n'emporte aucune cession de droits.**

Le code du site est distribué séparément sous licence MIT. Certaines images
(coupures de presse, photographies de tiers, affiches) appartiennent à leurs
auteurs respectifs.

👉 Le détail, section par section, est dans [`LICENSE`](LICENSE).

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
