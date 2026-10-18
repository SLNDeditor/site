# Administration du site (Sveltia CMS)

Éditeur en ligne façon WordPress pour ajouter / modifier les articles.
Fichiers : `public/admin/index.html` (la page) et `public/admin/config.yml` (les champs).

## Principe (comme WordPress)

**Un seul endroit** : la collection « Articles ». On y écrit tous les textes.
La liste se replie **par rubrique** (bouton « Grouper par » → Rubrique).
⚠️ Si la liste se vide après avoir activé le groupement, retirer le bloc
`view_groups` dans `config.yml`.

## Champs d'un article

| champ | rôle |
|---|---|
| **Titre** | grand titre en haut de l'article |
| **Rubrique** | liste déroulante : Essai · Théâtre · Récit · Actualités · Interventions · Revue de presse · Articles (sélection) · Vidéos (sélection) · Page. Commande le menu et la barre latérale. |
| **Emplacement (menu Théâtre)** | bloc **replié**, à ouvrir **uniquement pour la rubrique Théâtre** (voir ci-dessous) |
| **Image (héro)** | facultative |
| **Numéro de revue NADA** | facultatif — si renseigné, la couverture devient un lien vers `public/nada/nada-<n>.pdf` (lecture + téléchargement, sans restriction) |
| **Date** + **Afficher la date** | |
| **Vidéo YouTube** | identifiant, facultatif |
| **Chapeau** | résumé en italique sous le titre — **visible**, aucun effet sur Google |
| **Description Google** | résumé affiché par Google et dans les aperçus de partage — **invisible** sur la page |
| **Corps du texte** | éditeur riche ; **bouton image** pour insérer une image n'importe où dans le texte |

Le titre d'un nouvel article apparaît **automatiquement** dans la barre latérale
de sa rubrique (rien à coder).

## Sous-menus (rubrique Théâtre)

Le bloc **« Emplacement (menu Théâtre) »** ne sert que pour Théâtre. Il reste
fermé le reste du temps.

| sous-champ | rôle |
|---|---|
| **Sous-menu** | nom du sous-menu de 1er niveau (existant : « En Attendant l'algérie »). **Taper un nom inédit crée un nouveau sous-menu.** Vide = l'article est un item de 1er niveau (comme « Guelma / Selma »). |
| **Ordre dans le menu** | petit nombre = plus haut |
| **Rattaché à l'article** | facultatif — identifiant d'un article parent pour imbriquer plus profond (ex. `principe-des-interventions`) |
| **Libellé court** | texte affiché dans le menu si le titre est trop long |

L'arbre du menu Théâtre est reconstruit à partir de ces champs
(`src/lib/categories.ts` → `getTheatreTree`).

## Images

- **Téléversées depuis le CMS** → rangées dans `public/blog-media/`, écrites en
  chemin absolu `/blog-media/nom.jpg`. Fonctionne pour l'image de héro **et**
  pour les images insérées dans le corps du texte. Côté schéma, un chemin
  commençant par `/` est reconnu comme fichier de `public/` **avant** d'être
  proposé à l'optimiseur d'Astro : sans cet ordre, la reconstruction s'arrête
  sur `ImageNotFound` et le site entier se gèle (c'est arrivé le 18/10/2026 —
  voir `PUBLIER.md`, et le commentaire dans `src/content.config.ts`).
- **Anciennes images de héro** (`./images/…`, ajoutées à la main) : toujours
  optimisées par Astro, continuent de fonctionner. Les deux conventions
  cohabitent (schéma `heroImage` dans `src/content.config.ts`).

## Tester en local (sans GitHub)

1. `npx astro dev`
2. Ouvrir `http://localhost:4321/admin/index.html`
3. **« Travailler avec un dépôt local »** → sélectionner le dossier **`site/`**
   (le dossier racine, celui qui contient `.git` — pas un fichier).
   Chrome demande « Afficher les fichiers » puis « Enregistrer les modifications ».
   (Sveltia gère ce mode nativement : pas de `local_backend`, pas de proxy.)

## Les deux champs « chapeau » et « description Google »

Longtemps, un **seul** champ `description` servait à la fois de chapeau visible
et de balise `<meta name="description">`. Vider le chapeau parce qu'il faisait
doublon à l'écran effaçait donc aussi le résumé Google, sans aucun signal.
C'est arrivé sur quatre articles en septembre 2026.

Depuis, deux champs distincts :

| frontmatter | rôle | rendu |
|---|---|---|
| `lead` | chapeau visible | markdown restreint, rendu par `src/lib/inline-markdown.ts` |
| `description` | SEO seul | `<meta name="description">` via `BaseHead` |

Si `description` est vide, `BlogPost.astro` retombe sur le chapeau en texte
brut, puis sur `SITE_DESCRIPTION` : le site ne peut plus produire de balise
`<meta name="description" content="">`.

## Connexion de Zalia : le jeton

Sur `/admin/`, **un seul bouton** : « Se connecter avec un jeton d'accès ».
Elle colle son jeton, et c'est tout — le navigateur le conserve, elle n'a pas
à recommencer à chaque fois.

### Pourquoi il n'y a qu'un bouton

Sveltia en propose deux. Le second, « Se connecter avec GitHub », **ne
fonctionne pas sur ce site** : il délègue au service OAuth de Netlify, et
aucun fournisseur GitHub n'y est installé —
`https://api.netlify.com/auth?provider=github&site_id=…` répond **404**.
C'était le bouton le plus visible (bleu plein) : cliquer dessus laissait la
page figée sur « Connexion… » indéfiniment, de quoi croire que l'admin est
cassée. Il est donc masqué par un petit script en bas de
`public/admin/index.html`.

Pour le rétablir : installer le fournisseur dans Netlify → *Site
configuration* → *Access & security* → *OAuth* → *Install provider* → GitHub
(il faut créer une OAuth App côté GitHub), puis supprimer ce script.

### Fabriquer le jeton

Deux formules. Le dépôt étant **public** depuis le 17/10/2026, la portée
nécessaire est plus étroite qu'avant : un jeton limité aux dépôts publics
suffit, il ne peut plus rien toucher de privé.

| | portée | expiration | pour qui |
|---|---|---|---|
| **Classique** `public_repo` | les 2 dépôts publics du compte | réglable sur **aucune** | ✅ le plus simple pour Zalia |
| **Fine-grained** | ce seul dépôt, `Contents: Read and write` | obligatoire (1 an max) | plus étroit, mais à refaire chaque année |

**Recommandé ici** : <https://github.com/settings/tokens> → *Generate new
token (classic)* → cocher **`public_repo` uniquement** (surtout pas `repo`
entier, ni `delete_repo`, ni `admin:*`) → *Expiration : No expiration*.

Le compromis est assumé : un jeton sans expiration évite à Zalia une panne
annoncée le jour où il expirerait, et sa portée réduite limite les dégâts en
cas de fuite. S'il fuite, le révoquer sur la même page et en générer un autre.

⚠️ Ce jeton authentifie **comme `SLNDeditor`**, qui est le propriétaire du
dépôt — ses écritures apparaissent donc sous ce nom. Lui donner son propre
compte GitHub en collaborateur signerait ses textes de son nom, mais ajoute un
compte à gérer.

## Si l'admin ne s'ouvre plus

La version de Sveltia est **épinglée** dans `public/admin/index.html`
(`@sveltia/cms@0.221.4`), avec un contrôle d'intégrité `integrity`.

Avant, l'URL ne portait aucun numéro de version : le navigateur récupérait la
dernière publiée. Sveltia est en 0.x et sort plusieurs versions par semaine
(743 à ce jour) — Zalia changeait donc de version d'éditeur sans le savoir, ce
qui explique les pannes d'admin sans modification du dépôt.

- **Page blanche + erreur `integrity` dans la console** : le fichier servi par
  unpkg ne correspond plus à l'empreinte. Ne pas retirer l'attribut : vérifier
  d'abord, c'est précisément ce contre quoi il protège (ce script manipule le
  jeton GitHub en écriture).
- **Pour changer de version** : la marche à suivre, avec la commande de calcul
  de l'empreinte, est en commentaire dans `public/admin/index.html`.

## Déploiement

Voir `PUBLIER.md`. En résumé : publier depuis `/admin/` suffit, Netlify
reconstruit tout seul en 2-3 minutes.

⚠️ **Netlify gratuit n'autorise qu'un seul contributeur Git sur un dépôt
privé.** Aucun `Co-Authored-By:` dans les messages de commit de ce dépôt : un
second contributeur suspend toutes les reconstructions, et l'admin continue
d'afficher « publié » comme si de rien n'était. Rendre le dépôt public lève
définitivement cette limite.

Les menus du header et les sélections curatées (`NAV`, `CURATED_*` dans
`src/lib/categories.ts`) ne sont pas éditables depuis le CMS.
