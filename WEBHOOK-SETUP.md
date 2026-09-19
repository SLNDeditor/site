# 🔗 Configuration du Webhook (Redéploiement automatique)

Si tu crées un dépôt GitHub pour le code, tu peux activer un webhook qui redéploie automatiquement à chaque `git push`.

---

## 📋 Étapes

### **Étape 1 : Créer un Build Hook sur Netlify**

1. Aller sur : https://app.netlify.com/sites/zaliasekai/settings/deploys
2. Chercher **« Build hooks »** (dans la section Build & deploy)
3. Cliquer **« Add build hook »**
4. Donner un nom : `GitHub Push`
5. Branche : `main`
6. **Copier l'URL générée** (elle ressemble à `https://api.netlify.com/build_hooks/...`)

### **Étape 2 : Ajouter le Webhook à GitHub**

1. Aller sur le dépôt GitHub (ex. SLNDeditor/site ou ton propre repo)
2. Aller dans **Settings** → **Webhooks**
3. Cliquer **« Add webhook »**
4. **URL** : Coller l'URL du build hook de Netlify
5. **Content type** : `application/json`
6. **Events** : Choisir **« Just the push event »**
7. **Active** : ✅ Cocher
8. Cliquer **« Add webhook »**

### **Étape 3 : Tester**

```bash
git push origin main
```

**Vérifier** : Aller sur Netlify Deploys → un nouveau déploiement devrait apparaître en 10 sec

---

## ✅ Résultat

À chaque `git push` sur `main` → Netlify reconstruit et déploie automatiquement ! 🎯

---

## 🔧 Dépannage

### Webhook ne déclenche rien ?

1. Vérifier sur GitHub → Repo Settings → Webhooks → cliquer sur le hook
2. Aller dans l'onglet **« Recent Deliveries »**
3. Voir si des erreurs s'affichent
4. Vérifier l'URL du hook (elle ne doit pas avoir de faute de frappe)

### Déploiement échoue avec erreur GitHub ?

Voir la section « Build failed: Unrecognized Git contributor » dans TROUBLESHOOT.md
