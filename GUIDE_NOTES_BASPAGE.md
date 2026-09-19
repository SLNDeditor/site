# Guide : Notes de bas de page interactives

## Vue d'ensemble

Zalia Sékaï supporte désormais les **notes de bas de page interactives** en Markdown. Quand vous écrivez des notes avec la syntaxe standard, elles s'affichent avec :

- Des **chiffres en exposant** clickables
- Une **bulle de tooltip** qui s'affiche au survol (sans cliquer)
- Une **navigation bidirectionnelle** (article ↔ notes)
- Un **style cohérent** avec la mise en page du site

---

## Syntaxe Markdown

### Écrire une note de bas de page

Deux étapes simples :

**1. Dans le texte, indiquez une référence à la note :**

```markdown
Voici un texte avec une note de bas de page[^1].
```

**2. À la fin du document, définissez le contenu de la note :**

```markdown
[^1]: Ceci est le contenu de la note. Il peut être aussi long que vous le souhaitez.
```

### Exemple complet

```markdown
---
title: "Mon article"
---

Cet article traite d'un sujet complexe[^1]. Voici une deuxième note[^2].

## Conclusion

Les notes de bas de page enrichissent le texte[^3].

---

[^1]: La première note. Elle fournit du contexte ou une explication.

[^2]: Une deuxième note avec plus de détails. Elle peut contenir plusieurs phrases ou même du formatage comme **gras** ou *italique*.

[^3]: Une troisième note pour montrer que vous pouvez en avoir autant que vous le souhaitez.
```

---

## Fonctionnalités

### 1. Exposant clickable

Les chiffres de note s'affichent en **petit et surlevé** dans le texte.

- Cliquez dessus pour sauter à la note en bas de page
- Cliquez sur la flèche ↩ dans la note pour revenir au texte

### 2. Tooltip au survol

Passez la souris sur un chiffre de note pour voir un **aperçu du contenu** :

- La bulle s'affiche automatiquement
- Elle montre les 200 premiers caractères (tronqué avec « … » si plus long)
- Idéal pour des notes longues : vous voyez le contenu sans scroller

### 3. Style responsive

Sur **mobile** :

- Les tooltips sont plus étroites
- Le texte reste lisible
- La navigation fonctionne au toucher

### 4. Navigation bidirectionnelle

Vous pouvez naviguer dans les deux sens :

```
Texte [^1] ← Cliquez pour aller à la note
    ↓
Note [^1]: ... ← Cliquez sur ↩ pour revenir au texte
```

---

## Conseils de rédaction

### Quand utiliser les notes de bas de page ?

✅ **Utilisez les notes pour :**

- Fournir des explications supplémentaires sans interrompre la lecture
- Citer des sources ou des références
- Ajouter du contexte historique ou culturel
- Inclure des définitions de termes spécialisés
- Ajouter des remarques ou nuances

❌ **Évitez les notes pour :**

- Informations essentielles (utilisez plutôt le texte principal)
- Publicités ou auto-promotion excessive
- Texte très long (préférez un paragraphe normal ou un article séparé)

### Longueur recommandée

- **Court (idéal) :** 1-3 phrases
- **Moyen :** 1 paragraphe (max ~200 caractères dans le tooltip)
- **Long :** OK, mais le tooltip sera tronqué — le lecteur peut cliquer pour lire tout

### Formatage dans les notes

Les notes acceptent le **Markdown** :

```markdown
[^1]: Voici une note avec **gras**, *italique* et [lien](http://exemple.com).
```

---

## Exemple en action

Voir l'article de test : `/blog/test-footnotes/`

Cet article démontre :

- Plusieurs notes consécutives
- Tooltips court et long
- Navigation bidirectionnelle
- Comportement responsive

---

## Dépannage

### Les notes n'apparaissent pas ?

✓ Vérifiez la syntaxe `[^1]` ... `[^1]: texte`  
✓ Assurez-vous que les numéros correspondent (`[^1]` et `[^1]:`)  
✓ Les notes doivent être à la fin du document Markdown

### Le tooltip ne s'affiche pas au survol ?

✓ C'est normal sur mobile (utilisez le clic à la place)  
✓ Sur desktop, passez la souris directement sur le chiffre  
✓ Vérifiez que le CSS a bien chargé (F12 → Console pour voir les erreurs)

### Les caractères spéciaux s'affichent mal dans la bulle ?

✓ C'est un problème de rendu HTML — signalez-le si c'est blocage  
✓ Pour l'instant, évitez les caractères très spécialisés dans les notes

---

## Aperçu technique

Pour les curieux :

- **Plugin Markdown :** `remark-footnotes` convertit la syntaxe en HTML
- **CSS :** Stylisation en exposant avec bulle tooltip
- **JavaScript :** Extrait le texte des notes et le met dans `data-footnote-text`
- **Accessibilité :** Les liens ont des attributs ARIA appropriés

---

## Questions ?

Si vous avez des questions ou des suggestions pour améliorer les notes de bas de page, n'hésitez pas à les signaler !

---

**Dernière mise à jour :** 19 septembre 2026
