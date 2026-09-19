#!/bin/bash
set -e

echo "🚀 Déploiement zaliasekai sur Netlify..."
echo ""

# Vérifier que .env existe
if [ ! -f .env ]; then
  echo "❌ Fichier .env manquant"
  echo ""
  echo "À créer : .env"
  echo "---"
  echo "NETLIFY_AUTH_TOKEN=<ton-token-personnel>"
  echo "NETLIFY_SITE_ID=6f9b1026-2fe0-4409-bd33-53be885893fc"
  echo "---"
  echo ""
  echo "Pour obtenir le token :"
  echo "1. Aller sur https://app.netlify.com/user/applications/personal-access-tokens"
  echo "2. Créer un nouveau token"
  echo "3. Copier-coller ici dans .env"
  exit 1
fi

# Charger les variables
export $(cat .env | xargs)

if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
  echo "❌ NETLIFY_AUTH_TOKEN manquant dans .env"
  exit 1
fi

# Build
echo "📦 Build du site..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build échoué"
  exit 1
fi

echo "✅ Build réussi"
echo ""

# Deploy
echo "📤 Déploiement sur Netlify..."
npx netlify deploy --prod --dir dist --site 6f9b1026-2fe0-4409-bd33-53be885893fc

echo ""
echo "✅ Déploiement terminé !"
echo "🌍 Le site est en ligne : https://zaliasekai.netlify.app"
