# Administration du site (Sveltia CMS)

Éditeur en ligne façon WordPress pour ajouter / modifier les articles.
Fichiers : `public/admin/index.html` (la page) et `public/admin/config.yml` (les champs).

## Ce qui marche déjà
La page `/admin/` charge Sveltia en français et propose l'édition des **Articles** avec
exactement les champs voulus :

- **Titre (héro)**
- **Image (héro)** — facultative
- **Date** + case **« Afficher la date »** (décocher = date masquée sur l'article)
- **Rubrique (placement)** — liste déroulante : Essai, Théâtre, Récit, Actualités,
  Interventions, Revue de presse, Articles (sélection), Vidéos (sélection), Page
- **Vidéo YouTube** — facultative (identifiant)
- **Chapeau** — éditeur avec gras / italique / citation
- **Corps du texte** — éditeur riche : gras, italique, titres, listes, citation, lien, image

## Tester en local tout de suite (sans GitHub)
1. Lancer le site : `npx astro dev`
2. Ouvrir `http://localhost:4321/admin/index.html`
3. Cliquer **« Travailler avec un dépôt local »**, puis sélectionner le dossier `site/`.
   L'édition écrit directement dans les fichiers du projet.

## Les 2 étapes restantes (à faire dans une session connectée à GitHub)

1. **Édition en ligne** — dans `public/admin/config.yml`, remplacer `OWNER/REPO`
   par le vrai dépôt (ex. `zaliasekai/site`). Ensuite Zalia ouvrira
   `https://<le-site>/admin/`, se connectera avec GitHub, écrira, cliquera Publier :
   le site se met à jour tout seul. **Rien à installer sur son ordinateur.**

2. **Images du héro téléversées depuis le CMS** — le site optimise aujourd'hui les
   images via `image()` (chemin relatif `./images/...`). Les images *téléversées par le
   CMS* arrivent en `/src/content/blog/images/...`. Il faudra choisir une convention
   unique (soit adapter le schéma pour accepter ce chemin, soit ranger les images du
   héro dans `public/`). En attendant, on peut continuer à ajouter les images de héro
   « à la main » comme jusqu'ici ; **tout le reste (texte, chapeau, date, placement)
   fonctionne via le CMS.**

## Édition des menus (prochaine étape, non incluse)
Le menu du header et la barre latérale sont pilotés par `src/lib/categories.ts`.
Pour les rendre modifiables depuis le CMS, il faudra sortir `NAV` / les sélections
curatées dans un fichier de données (JSON) qu'une rubrique « Réglages » de Sveltia
pourra éditer. Prévu pour un second temps.
