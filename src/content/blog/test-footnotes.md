---
title: "Test des notes de bas de page interactives"
description: "Article de démonstration des notes de bas de page avec tooltips interactifs au survol"
pubDate: 2026-09-19
showDate: true
category: essai
---

Cet article teste la fonctionnalité des notes de bas de page interactives récemment implémentée pour Zalia Sékaï.

## Notes de bas de page simples

Voici un texte avec une note de bas de page[^1]. Vous pouvez survoler le chiffre exposant pour voir le contenu de la note dans une bulle interactive.

Une autre phrase avec une autre note[^2]. Les notes peuvent contenir du texte plus long, qui sera raccourci dans la bulle si nécessaire.

Et encore une[^3] pour tester plusieurs notes.

## Navigation bidirectionnelle

Les notes de bas de page offrent une navigation bidirectionnelle :
- Cliquez sur le chiffre exposant dans le texte pour accéder à la note de bas de page
- Cliquez sur le petit lien de retour (↑) dans la note pour revenir au texte

## Comportement du tooltip

Le tooltip affiche :
- Automatiquement au survol du chiffre exposant
- Avec un délai rapide (150ms)
- Un maximum de 200 caractères (tronqué avec « … » si trop long)
- Une petite flèche pointant vers le chiffre

## Responsive

La bulle tooltip est adaptée aux écrans mobiles :
- Plus étroite sur les petits écrans
- Texte lisible avec bonne ligne-hauteur
- Positionnée correctement même en bas de page

---

[^1]: Ceci est la première note de bas de page. Elle peut contenir du texte explicatif.

[^2]: Voici une deuxième note, plus longue que la première, pour montrer comment le tooltip gère un texte plus substantiel avec plusieurs mots.

[^3]: Une troisième note pour montrer que le système fonctionne avec plusieurs notes successives.
