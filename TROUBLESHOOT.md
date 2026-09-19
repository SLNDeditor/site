# 🔧 Dépannage : Collection "Pages" n'apparaît pas dans l'admin

## ✅ Diagnostic rapide

Si tu ne vois que **« Articles »** et pas **« Pages »** dans l'admin Sveltia CMS → le déploiement n'a pas réussi ou n'a pas eu lieu.

---

## 📋 Checklist

### Étape 1 : Vérifier le statut Netlify

1. Va sur : https://app.netlify.com/sites/zaliasekai/deploys
2. Cherche un déploiement récent avec le commit `Créer collection Pages...`
3. **Vérifier son statut** :
   - 🟢 **Published** = succès ✅
   - 🟡 **Building** = en cours (attendre 5 min)
   - 🔴 **Failed** = erreur (voir la section « Erreur de build » ci-dessous)

### Étape 2 : Redéployer manuellement

Si rien n'est affiché ou que c'est en erreur :

1. Aller sur Netlify → Deploys
2. Cliquer sur **« Trigger deploy »** → **« Deploy site »**
3. Attendre le message « Deploy published »
4. Rafraîchir l'admin (`F5`)

---

## 🔴 Si le build échoue

### Erreur : « Cannot read properties of undefined »

**Cause** : Erreur dans le fichier `.astro` ou la config

**Solution** : Vérifier les fichiers :
- `src/pages/about.astro`
- `src/content.config.ts`
- `public/admin/config.yml`

### Erreur : « Collection introuvable »

**Cause** : Le CMS ne reconnaît pas la configuration

**Solution** : 
1. Vider le cache du navigateur (Ctrl+Shift+Del)
2. Recharger l'admin
3. Attendre 30 sec

---

## ✨ Si tout fonctionne

Une fois que tu vois **« Pages »** dans l'admin :

1. Clique sur **« Pages »**
2. Tu dois voir **« L'auteure »** (ou « About »)
3. Clique pour éditer
4. Change le contenu
5. Clique **« Publish »**

✅ Les changements sont **en ligne immédiatement** !

---

## 🆘 Dernier recours

Si rien ne marche après 30 minutes :

1. **Vérifier les logs Netlify** :
   - Netlify → Deploys → clic sur un déploiement → onglet « Logs »
   - Chercher des messages d'erreur rouges

2. **Réinitialiser le dépôt GitHub** :
   ```bash
   cd zaliasekai/site
   git fetch origin
   git reset --hard origin/main
   npm run build
   ```

3. **Contacter support Netlify** avec :
   - Site ID : `6f9b1026-2fe0-4409-bd33-53be885893fc`
   - Dernier commit : `Créer collection Pages...`
   - Message d'erreur complet (depuis les logs)

---

## 📞 Références

- Netlify dashboard: https://app.netlify.com/sites/zaliasekai
- Admin Sveltia CMS: https://zaliasekai.netlify.app/admin
- Dépôt GitHub: https://github.com/SLNDeditor/site
