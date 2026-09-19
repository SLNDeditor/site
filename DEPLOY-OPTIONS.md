# 🚀 3 Solutions de déploiement (sans GitHub)

Le site est déployé sur **Netlify**, pas GitHub. Voici 3 façons de republier après édition dans l'admin.

---

## **Option 1 : Dashboard Netlify (le plus simple)**

Pour Zalia (novice web) :

1. Va sur : https://app.netlify.com/sites/zaliasekai
2. Clique le bouton bleu **« Trigger deploy »** (haut droit)
3. Choisir **« Deploy site »**
4. Attendre le message vert « Published »
5. ✅ C'est en ligne !

**Temps** : 2-3 minutes
**Complexité** : Zéro (elle peut le faire)

---

## **Option 2 : Script Shell automatisé (pour toi)**

Crée un fichier `deploy.sh` à la racine du projet :

```bash
#!/bin/bash
cd "$(dirname "$0")"
npm run build
echo "Build done. Deploying..."
# Attendre token Netlify dans .env
source .env 2>/dev/null || {
  echo "❌ Fichier .env manquant"
  echo "À créer : NETLIFY_AUTH_TOKEN=<ton-token>"
  exit 1
}
npx netlify deploy --prod --dir dist --site 6f9b1026-2fe0-4409-bd33-53be885893fc
```

**Usage** :
```bash
chmod +x deploy.sh
./deploy.sh
```

**Temps** : 5 minutes
**Complexité** : Simple (toi ou un dev)

---

## **Option 3 : Webhook GitHub → Netlify (auto)**

Si tu crées un repo GitHub pour le code, tu peux activer un webhook qui redéploie automatiquement :

1. Aller sur Netlify → zaliasekai → Settings → **Build & deploy**
2. Trouver **Build hooks**
3. Créer un nouveau build hook (copier l'URL)
4. Sur GitHub → Repo settings → Webhooks → Add webhook
5. Coller l'URL du hook
6. Choisir « Push events »
7. Sauvegarder

**Résultat** : À chaque `git push`, Netlify redéploie automatiquement

**Temps** : 10 minutes (setup une fois)
**Complexité** : Intermédiaire

---

## 🔑 Pour obtenir le token Netlify

1. Aller sur https://app.netlify.com/user/applications/personal-access-tokens
2. Cliquer **« New access token »**
3. Donner un nom : « Redeploy zaliasekai »
4. Copier le token
5. Créer un fichier `.env` à la racine du projet :
   ```
   NETLIFY_AUTH_TOKEN=nfp_xxxxxxxxxxxxxxxxxxx
   ```
6. **⚠️ NE PAS COMMITER CE FICHIER** (ajouter `.env` dans `.gitignore`)

---

## 📋 Recommandation

**Pour Zalia** : Option 1 (Dashboard Netlify) - elle peut le faire elle-même, zéro risque

**Pour toi** : Option 2 (Script) - local et simple, à lancer quand tu modifies le code

**Pour l'avenir** : Option 3 (Webhook) - si tu crées un vrai repo GitHub

---

## 🔗 Liens rapides

- Dashboard : https://app.netlify.com/sites/zaliasekai
- Admin CMS : https://zaliasekai.netlify.app/admin
- Site en ligne : https://zaliasekai.netlify.app
