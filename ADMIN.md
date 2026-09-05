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
| **Chapeau** | résumé en italique sous le titre |
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
  pour les images insérées dans le corps du texte.
- **Anciennes images de héro** (`./images/…`, ajoutées à la main) : toujours
  optimisées par Astro, continuent de fonctionner. Les deux conventions
  cohabitent (schéma `heroImage: z.union([image(), z.string()])`).

## Tester en local (sans GitHub)

1. `npx astro dev`
2. Ouvrir `http://localhost:4321/admin/index.html`
3. **« Travailler avec un dépôt local »** → sélectionner le dossier **`site/`**
   (le dossier racine, celui qui contient `.git` — pas un fichier).
   Chrome demande « Afficher les fichiers » puis « Enregistrer les modifications ».
   (Sveltia gère ce mode nativement : pas de `local_backend`, pas de proxy.)

## Point encore ouvert

**Édition en ligne** — dans `config.yml`, remplacer `OWNER/REPO` par le vrai
dépôt GitHub (ex. `zaliasekai/site`). Ensuite : ouvrir `https://<le-site>/admin/`,
se connecter avec GitHub, écrire, Publier — le site se met à jour seul.

Les menus du header et les sélections curatées (`NAV`, `CURATED_*` dans
`src/lib/categories.ts`) ne sont pas encore éditables depuis le CMS.
