# Publier sur le site

## En un mot

**Il n'y a rien à faire d'autre qu'écrire et cliquer « Publier ».**

1. Aller sur <https://zaliasekai.netlify.app/admin/>
2. Se connecter : **« Se connecter avec un jeton d'accès »**, coller le jeton
   (une seule fois — le navigateur s'en souvient ensuite)
3. Écrire ou modifier un texte
4. Cliquer **« Publier »**
5. Attendre **2 à 3 minutes**, puis recharger la page du site (`Cmd-R` / `F5`)

Le site se reconstruit tout seul. Pas de bouton à aller chercher ailleurs, pas
de tableau de bord à ouvrir, pas de ligne de commande.

> **Si une ancienne note vous dit d'aller cliquer « Trigger deploy » sur
> Netlify : c'est faux, et ce n'est plus nécessaire.** La publication
> automatique a été réparée. Ces notes ont été supprimées.

## Les deux champs qu'on confond toujours

| champ | où ça se voit | si on le vide |
|---|---|---|
| **Chapeau** | en italique sous le titre, sur la page | la page n'a plus de chapeau — c'est tout |
| **Description Google** | nulle part sur la page ; dans les résultats Google et les aperçus de partage | le texte sort peu à peu des résultats de recherche |

Autrefois ces deux rôles étaient tenus par **un seul champ** : vider le chapeau
parce qu'il faisait doublon à l'écran effaçait aussi, sans prévenir, le résumé
affiché par Google. Quatre textes avaient perdu le leur de cette manière. Les
deux champs sont désormais séparés, on peut toucher à l'un sans abîmer l'autre.

## Pourquoi ça prend 2-3 minutes

« Publier » enregistre le texte sur GitHub, où vivent tous les contenus.
Netlify s'en aperçoit, reconstruit les 49 pages du site et les met en ligne.
C'est ce passage qui prend quelques minutes — il est normal que la page ne
change pas dans la seconde.

## Si ça ne marche vraiment pas

Dans l'ordre :

1. **Recharger en vidant le cache** : `Cmd-Maj-R` (Mac) ou `Ctrl-F5`.
2. **Vérifier que la publication est bien partie** : les textes publiés
   apparaissent sur <https://github.com/SLNDeditor/site/commits/main>.
   Si le texte y est, c'est que le site est simplement en train de se
   reconstruire — attendre.
3. **Si le texte n'y est pas** : le jeton GitHub ne fonctionne plus.
   Se reconnecter sur `/admin/` avec un jeton neuf (voir `ADMIN.md`).
4. **Si la page `/admin/` reste blanche** : voir `ADMIN.md`, section
   « Si l'admin ne s'ouvre plus ».

## Les erreurs déjà rencontrées

**« unrecognized Git contributor » / le site ne se met plus à jour du tout.**
L'abonnement Netlify gratuit n'autorise **qu'un seul contributeur Git** sur un
dépôt privé. En septembre 2026, des commits portant une mention
`Co-Authored-By:` ont introduit un second contributeur et Netlify a suspendu
toutes les reconstructions : Zalia publiait, l'admin disait « publié », et le
site ne bougeait pas.

**À ne jamais refaire** : pas de `Co-Authored-By:` dans les messages de commit
de ce dépôt. La solution durable est de rendre le dépôt public — la limite de
contributeurs ne s'applique qu'aux dépôts privés (voir `ADMIN.md`).
