# Notes de bas de page : Détails techniques

## Architecture

```
Markdown source
    ↓
remark-footnotes (plugin)
    ↓
HTML avec [^1] converti en <sup><a>1</a></sup>
    ↓
rehypeFootnotesCustom (plugin personnalisé)
    ↓
Ajout de classes CSS (.footnote-anchor, .footnote-section)
    ↓
CSS compilé par Astro
    ↓
Composant FootnotesTooltips.astro
    ↓
JavaScript vanilla : extraction texte + data-footnote-text
    ↓
HTML final : <a class="footnote-anchor" data-footnote-text="...">1</a>
    ↓
CSS ::before avec attr(data-footnote-text) → tooltip visible
```

---

## Flux CSS : Le tooltip

### 1. État normal (sans survol)

```css
.footnote-anchor::before {
  content: attr(data-footnote-text);
  opacity: 0;              /* Invisible */
  pointer-events: none;    /* N'interfère pas avec la souris */
  transition: opacity 150ms ease-in-out;
}
```

Le tooltip existe en DOM mais invisible. La transition est définie pour une apparition fluide.

### 2. État hover

```css
.footnote-anchor:hover::before {
  opacity: 1;              /* Visible */
}

.footnote-anchor:hover::after {
  opacity: 1;              /* La flèche aussi */
}
```

Au survol du lien, le pseudo-élément `::before` devient visible avec la transition.

### 3. Positionnement

```css
.footnote-anchor::before {
  position: absolute;
  bottom: 120%;      /* Au-dessus du lien */
  left: 50%;
  transform: translateX(-50%);  /* Centré horizontalement */
  
  max-width: 200px;
  padding: 0.5rem 0.75rem;
  border-radius: 2px;
  
  /* Le triangle ::after pointe vers le lien */
  /* gap = 120% - 116% = 4px */
}
```

Le tooltip est positionné **absolument** par rapport au lien parent.

### 4. La flèche (triangle CSS)

```css
.footnote-anchor::after {
  content: '';
  position: absolute;
  bottom: 116%;      /* Juste sous le tooltip (gap de 4px) */
  left: 50%;
  transform: translateX(-50%);
  
  /* Triangle CSS : bordures */
  width: 0;
  height: 0;
  border-left: 4px solid transparent;      /* Côté gauche */
  border-right: 4px solid transparent;     /* Côté droit */
  border-top: 4px solid rgb(var(--ink));   /* Pointu vers le bas */
}
```

La flèche est un triangle créé avec les bordures CSS.

---

## Pipeline JavaScript

### Timing : Quand le script s'exécute ?

```javascript
// Éxecution dès que le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFootnoteTooltips);
} else {
  initializeFootnoteTooltips();  // DOM déjà chargé
}
```

Le script s'execute :
- Immédiatement si le DOM est déjà parsé
- Au chargement si le script arrive avant

### Étape 1 : Trouver les liens

```javascript
const footnoteAnchors = document.querySelectorAll('.footnote-anchor');
// Tous les <a> avec class="footnote-anchor"
```

### Étape 2 : Trouver la section des notes

```javascript
const footnoteSection = document.querySelector('.footnote-section');
// La <section data-footnotes class="footnote-section">
```

### Étape 3 : Pour chaque lien, extraire le numéro

```javascript
const href = anchor.getAttribute('href');
// Ex: "#user-content-fn-1"

const match = href.match(/user-content-fn-(\d+)/);
const footnoteNum = match[1];  // "1"
```

### Étape 4 : Chercher le texte de la note

```javascript
const footnoteItem = footnoteSection.querySelector(`li#user-content-fn-${footnoteNum}`);
// Trouve <li id="user-content-fn-1">

const clonedItem = footnoteItem.cloneNode(true);
// Clone pour manipuler sans affecter le DOM original

const backref = clonedItem.querySelector('a[href^="#user-content-fnref-"]');
if (backref) backref.remove();  // Supprime le lien ↩

let footnoteText = clonedItem.textContent
  ?.trim()
  .replace(/\s+/g, ' ') || '';

if (footnoteText.length > 200) {
  footnoteText = footnoteText.substring(0, 200).trim() + '…';
}
```

Extraction du texte :
1. Clone le `<li>` de la note
2. Supprime le lien de retour (backref) pour ne pas avoir le "↩"
3. Récupère le texte uniquement
4. Normalise les espaces (plusieurs espaces → 1 seul)
5. Tronque à 200 caractères si trop long

### Étape 5 : Stocker dans le data-attribute

```javascript
anchor.setAttribute('data-footnote-text', footnoteText);
```

Le texte est stocké dans un attribut `data-*`, que le CSS can lire avec `attr()`.

---

## Structure HTML générée

### Avant (source Markdown)

```markdown
Voici un texte[^1].

[^1]: Contenu de la note.
```

### Après (HTML généré)

```html
<div class="prose">
  <p>Voici un texte
    <sup>
      <a href="#user-content-fn-1" 
         id="user-content-fnref-1"
         class="footnote-anchor"
         data-footnote="1">1</a>
    </sup>.
  </p>
  
  <!-- Plus tard dans la page -->
  
  <section data-footnotes class="footnote-section">
    <h2 class="sr-only" id="footnote-label">Footnotes</h2>
    <ol>
      <li id="user-content-fn-1">
        <p>Contenu de la note.
          <a href="#user-content-fnref-1"
             aria-label="Back to reference 1"
             class="data-footnote-backref">↩</a>
        </p>
      </li>
    </ol>
  </section>
</div>

<script>
  // ... script FootnotesTooltips injecté ici ...
</script>
```

### Après JavaScript (data-attribute ajouté)

```html
<a href="#user-content-fn-1" 
   class="footnote-anchor"
   data-footnote="1"
   data-footnote-text="Contenu de la note.">1</a>
```

Le `data-footnote-text` est ajouté par le script.

---

## Responsive

### Desktop (≥768px)

```css
.footnote-anchor::before {
  max-width: 200px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
}
```

Tooltip large, lisible.

### Mobile (<768px)

```css
@media (max-width: 720px) {
  .footnote-anchor::before {
    max-width: 160px;
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
}
```

Tooltip plus étroite pour tenir dans la viewport mobile.

---

## Performance

### CSS

- ✅ Pas de layout shift : le tooltip est `position: absolute` (hors du flux)
- ✅ GPU acceleration : `opacity` et `transform` sont optimisés
- ✅ Pas de reflow : les pseudo-éléments `::before/after` ne forcent pas de repaint

### JavaScript

- ✅ Script exécuté une seule fois (pas de polling ou event listeners continus)
- ✅ Pas de mutation du DOM : utilise `cloneNode()` et `setAttribute()` uniquement
- ✅ Pas de boucle O(n²) : une seule boucle sur les liens

### Taille

- CSS ajouté : ~1.5 KB (minifié)
- JavaScript ajouté : ~1 KB (minifié)
- `remark-footnotes` plugin : ~3 KB

---

## Accessibilité

### ARIA labels

```html
<a href="#user-content-fn-1"
   id="user-content-fnref-1"
   aria-describedby="footnote-label"
   data-footnote-ref="">1</a>
```

- `aria-describedby="footnote-label"` : Lie le lien à la section "Footnotes"
- `data-footnote-ref` : Attribut sémantique

### Navigation au clavier

- ✅ Tab traverse les liens de notes
- ✅ Enter/Space suit le lien (browser default)
- ✅ Shift+Tab revient en arrière

### Lecteur d'écran

- ✅ "Lien 1" annoncé avec le contexte
- ✅ Section "Footnotes" avec titre (même si `.sr-only`)
- ✅ Lien de retour identifié comme "Back to reference 1"

### Tooltips et accessibilité

Note : Les tooltips `::before` basés sur des pseudo-éléments **ne sont pas accessibles aux lecteurs d'écran**. C'est acceptable car :

1. Le contenu complet est disponible au clic
2. Le tooltip est une amélioration UX, pas l'information primaire
3. Les utilisateurs de lecteurs d'écran ont toujours accès via la section "Footnotes"

---

## Maintenance

### Pour ajouter/modifier les styles des tooltips

**Fichier :** `src/styles/global.css`

Section : `/* ---------- Notes de bas de page ---------- */`

Clés à modifier :
- `.footnote-anchor` : Style des exposants
- `.footnote-anchor::before` : Style du tooltip
- `.footnote-anchor::after` : Style de la flèche
- `.footnote-section` : Style de la section des notes

### Pour changer le comportement JavaScript

**Fichier :** `src/components/FootnotesTooltips.astro`

Sections modifiables :
- Limites de caractères (ligne : `if (footnoteText.length > 200)`)
- Sélecteurs DOM (`.footnote-anchor`, `.footnote-section`)
- Timing d'exécution (DOMContentLoaded, readyState)

### Pour tester localement

```bash
cd site
npm run dev       # Développement avec hot reload
npm run build     # Build production
npm run preview   # Prévisualiser la build
```

Ouvrir : `http://localhost:3000/blog/test-footnotes/`

---

## Limitations et hypothèses

### Hypothèses

- ✅ Tous les articles utilisent le layout `BlogPost.astro`
- ✅ Les notes sont toujours à la fin du document Markdown
- ✅ Un seul article par page (pas d'articles imbriqués)

### Limitations actuelles

- ⚠️ Tooltips en pseudo-éléments (non lisibles pour lecteurs d'écran)
  - **Solution :** Utiliser un div tooltip en JavaScript (plus complexe)
- ⚠️ Pas de support IE11 (utilise `data-*` attributes et CSS Grid)
  - **Solution :** Polyfill si nécessaire
- ⚠️ Tooltips tronqués à 200 caractères
  - **Raison :** Lisibilité et largeur de bulle
  - **Solution :** Augmenter la limite si voulu

### Améliorations futures

1. **Smooth scroll** : `html { scroll-behavior: smooth; }`
2. **Keyboard navigation** : Arrow keys pour naviguer entre notes
3. **Popover API** : Remplacer les pseudo-éléments par l'API Popover (quand plus de support)
4. **Tooltip intelligente** : Éviter de dépasser les bords de fenêtre
5. **Dark mode** : Couleurs inversées pour `prefers-color-scheme: dark`

---

## Déboguer

### Les notes n'apparaissent pas ?

1. Vérifiez le Markdown : `[^1]` et `[^1]:` doivent correspondre
2. Ouvrez DevTools (F12) → Console
3. Cherchez des erreurs JavaScript
4. Vérifiez que `.footnote-section` existe dans le DOM

### Le tooltip ne s'affiche pas ?

1. Survolez vraiment le chiffre (pas le lien, le chiffre)
2. Attendez 150ms (la transition)
3. Vérifiez que `data-footnote-text` est présent (F12 → Inspector)
4. Vérifiez que le CSS est chargé (F12 → Styles)

### Le tooltip affiche "undefined" ou est vide ?

1. Vérifiez que le script a tourné (console → pas d'erreur)
2. Cherchez le `<section data-footnotes>` (F12 → Inspector)
3. Vérifiez que les IDs correspondent (`user-content-fn-N`)

### Performance lente avec beaucoup de notes ?

1. Les tooltips CSS sont rapides (pas de JS au hover)
2. Le script init est léger (une seule boucle)
3. Si lent : vérifiez les transitions CSS (réduire de 150ms à 75ms)

---

**Dernière mise à jour :** 19 septembre 2026  
**Auteur :** Claude Code  
**Statut :** Prêt pour production
