# 🚀 Redéployer le site après modifications dans l'admin

Après avoir édité un article ou une page dans l'admin Sveltia CMS, **tu dois republier le site** pour que les changements apparaissent en ligne.

## ✅ Méthode simple (recommandée pour Zalia)

### Via le dashboard Netlify (sans ligne de commande)

1. **Aller sur** : https://app.netlify.com/sites/zaliasekai/deploys
2. **Cliquer sur** le bouton bleu **« Trigger deploy »** (en haut à droite)
3. **Sélectionner** « Deploy site »
4. ✅ Le déploiement se lance (2-3 minutes)
5. **C'est tout !** Les changements sont en ligne

---

## 🛠️ Méthode avancée (si tu as Node.js/npm)

### Via ligne de commande

```bash
cd zaliasekai/site
npm run build
npx netlify deploy --prod --dir dist --site 6f9b1026-2fe0-4409-bd33-53be885893fc
```

Puis entrer le token Netlify quand demandé (voir plus bas).

---

## 🔑 Si tu veux un token Netlify personnel

1. Aller sur https://app.netlify.com/user/applications/personal-access-tokens
2. **Créer un nouveau token** : « New access token »
3. **Donner un nom** : « Redeploy zaliasekai »
4. **Copier le token** généré
5. Créer un fichier `.env.local` à la racine du projet :
   ```
   NETLIFY_AUTH_TOKEN=<colle-le-token-ici>
   ```
6. Maintenant tu peux lancer `npx netlify deploy --prod` sans entrer de token

---

## 📝 Fichier `.netlifyrc` (déploiement automatisé)

Si tu veux déployer sans tape aucune commande, tu peux créer un fichier `.netlifyrc` à la racine :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 3000
```

Puis simplement : `netlify deploy --prod`

---

## ⚠️ Problème d'auto-build GitHub (cassé)

L'auto-build Netlify ↔ GitHub est désactivé actuellement car Netlify ne reconnaît pas les contributeurs du repo. **C'est normal, utilise une des méthodes ci-dessus.**

---

## 📞 Si ça ne marche pas

- Vérifier que tu es connecté à https://app.netlify.com avec le bon compte (laurent.marissal@proton.me)
- Site ID : `6f9b1026-2fe0-4409-bd33-53be885893fc`
- Repo GitHub : `SLNDeditor/site`
