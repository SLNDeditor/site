# 🔧 Corriger le problème "Unrecognized Git contributor"

## 🎯 Le problème

Netlify refuse de déployer automatiquement les commits poussés vers GitHub car **le contributeur n'est pas reconnu**. Message d'erreur :

```
Build failed: unrecognized Git contributor.
Your plan allows only one contributor on private repos.
```

**Impact** : Le workflow complet ne fonctionne pas :
- ❌ Zalia édite dans Sveltia CMS
- ❌ Sveltia CMS commite sur GitHub
- ❌ Netlify refuse le commit (pas reconnu)
- ❌ Le site ne se met pas à jour

---

## ✅ Solution (3 options)

### **Option 1 : Lier le compte GitHub à Netlify** ⭐ RECOMMANDÉ

**C'est la solution la plus simple et pérenne.**

**Étapes** :

1. Aller sur : https://app.netlify.com/sites/zaliasekai/settings/manage-contributors
   
2. Ou manuellement :
   - Netlify → zaliasekai → Settings → Build & deploy
   - Chercher **« Manage Git contributors »**

3. Cliquer **« Link your Git account »**

4. Autoriser Netlify à accéder à GitHub (OAuth)

5. Sauvegarder

6. **Trigger un nouveau deploy** : https://app.netlify.com/sites/zaliasekai/deploys → « Trigger deploy »

7. ✅ Ça devrait marcher !

**Temps** : 2 minutes

---

### **Option 2 : Rendre le repo public**

Si le problème persiste, tu peux rendre le repo GitHub public pour contourner la limite de contributeurs privés.

1. GitHub → SLNDeditor/site → Settings → Change repository visibility → Public
2. Sauvegarder
3. Retrying the deploy

**Avantage** : Pas de limite de contributeurs
**Inconvénient** : Le code est public (mais pas grave pour un blog)

**Temps** : 30 secondes

---

### **Option 3 : Upgrader Netlify Pro** (Payant)

Si tu veux garder le repo privé avec contributeurs illimités, upgrader Netlify vers Pro (~$19/mois).

**Avantage** : Full control
**Inconvénient** : Coût

---

## 🚀 Après avoir réglé le problème

Le workflow fonctionnera ainsi :

1. **Zalia édite** dans Sveltia CMS : https://zaliasekai.netlify.app/admin
2. **Sveltia CMS commite** sur GitHub
3. **GitHub webhook** déclenche Netlify
4. **Netlify redéploie** automatiquement
5. **Le site est à jour** en 2-3 minutes

✨ **Zalia n'a plus rien à faire**, c'est automatique !

---

## 🔗 Référence

- **Problème** : https://docs.netlify.com/git/overview/#unrecognized-contributors
- **Manage contributors** : https://app.netlify.com/sites/zaliasekai/settings/manage-contributors
- **Build & deploy settings** : https://app.netlify.com/sites/zaliasekai/settings/deploys
