# zalia sékaï — règles de travail

## ⚠️ RÈGLE ABSOLUE : la mise à jour ne va que dans UN SEUL SENS

**Ce qui est en ligne fait foi. On ne l'écrase jamais.**

Zalia publie ses textes depuis <https://zaliasekai.netlify.app/admin/>. Chaque
publication écrit directement sur `origin/main`, puis Netlify reconstruit le
site. Une fois un texte enregistré en ligne, **il n'y a pas de retour en
arrière** : ce contenu est la référence.

```
    Zalia → /admin/ → origin/main → Netlify → le site en ligne
                           │
                           ▼
                    dépôt local (copie suiveuse)
```

| sens | autorisé ? |
|---|---|
| en ligne → local (`git pull`) | **oui, toujours** — et c'est par là qu'on commence |
| local → en ligne | **seulement sur demande explicite de Laurent**, dans la session |

La règle ne gêne **jamais** Zalia : publier depuis `/admin/`, c'est justement
le sens autorisé (admin → `origin/main` → Netlify). Elle ne contraint que le
**dépôt local**, qui n'a pas à repousser par-dessus elle. Si une publication
n'apparaît pas en ligne, ce n'est donc pas la règle qui bloque : c'est la
reconstruction Netlify qui a échoué — voir `PUBLIER.md`, « Si ça ne marche
vraiment pas ».

### Au début de CHAQUE session de travail

Avant de lire ou de modifier quoi que ce soit :

```sh
./sync.sh
```

Il revient sur `main`, tire ce que Zalia a publié, refuse de forcer en cas de
divergence, et affiche la liste des textes qu'elle a modifiés depuis la
dernière fois. (Équivalent brut : `git checkout main && git pull --ff-only`.)

Le dépôt local est une copie **suiveuse**. Il est normal qu'il soit en retard :
Zalia a pu publier dix fois depuis la dernière session. Travailler sans avoir
tiré d'abord, c'est préparer un écrasement de son travail.

### Interdits, sans exception et sans demander

- `git push --force` / `--force-with-lease` sur `main`
- toute réécriture d'historique poussée (`rebase`, `commit --amend`, `filter-branch`,
  `reset --hard` suivi d'un push) sur une référence partagée
- `./deploy.sh` (déploiement Netlify depuis le dossier local) : il court-circuite
  git et remet en ligne l'état local, donc il efface les textes publiés depuis.
  Le script refuse de partir tout seul — ne pas contourner ce refus.
- écraser un fichier de `src/content/` par une version locale plus ancienne

### Ce qui reste normal

Modifier le code (templates, styles, configuration) puis `git push origin main`
après avoir tiré : oui, c'est le déroulement habituel d'une session avec Laurent.
Netlify reconstruit, et les textes de Zalia ne sont pas touchés puisqu'on est
parti de sa version.

### Messages de commit

**Jamais de trailer `Co-Authored-By:`.** Netlify y voit un second contributeur
Git et suspend toutes les reconstructions — l'admin continue alors d'afficher
« publié » pendant que le site ne bouge plus. C'est arrivé en septembre 2026.

---

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
