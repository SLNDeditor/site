#!/bin/bash
#
# Déploiement MANUEL de secours. En temps normal il ne sert à rien :
# publier depuis /admin/ suffit, Netlify reconstruit tout seul (voir PUBLIER.md).
#
# Pourquoi les garde-fous ci-dessous : ce script publie ce qu'il y a dans le
# dossier local, sans regarder git. Lancé depuis une copie en retard — par
# exemple une vieille branche de travail — il remettait en ligne un état
# ancien et effaçait du site les textes publiés entre-temps par Zalia depuis
# l'admin. Le dépôt GitHub, lui, gardait la bonne version : le site semblait
# alors se « réparer » tout seul à la publication suivante. De quoi croire
# que l'admin déraille.
#
#   ./deploy.sh          refuse de partir si le dossier local n'est pas
#                        exactement à jour avec origin/main
#   ./deploy.sh --force  passe outre (à n'utiliser qu'en connaissance de cause)

set -euo pipefail
cd "$(dirname "$0")"

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

fail() { echo "❌ $1" >&2; exit 1; }

if [ "$FORCE" -eq 0 ]; then
  echo "🔍 Contrôle de l'état du dépôt..."

  branch=$(git rev-parse --abbrev-ref HEAD)
  [ "$branch" = "main" ] || fail "Branche courante : « $branch », attendu « main ».
   → git checkout main"

  [ -z "$(git status --porcelain --untracked-files=no)" ] || fail "Des modifications ne sont pas validées.
   → les committer, ou lancer ./deploy.sh --force en connaissance de cause"

  git fetch origin main --quiet
  local_sha=$(git rev-parse HEAD)
  remote_sha=$(git rev-parse origin/main)
  if [ "$local_sha" != "$remote_sha" ]; then
    behind=$(git rev-list --count HEAD..origin/main)
    ahead=$(git rev-list --count origin/main..HEAD)
    fail "Le dossier local n'est pas synchronisé avec origin/main (retard : $behind, avance : $ahead).
   Déployer maintenant écraserait en ligne les textes publiés depuis l'admin.
   → git pull --ff-only   (puis relancer)"
  fi

  echo "✅ À jour avec origin/main ($(git log -1 --pretty='%h %s' | cut -c1-60))"
else
  echo "⚠️  --force : contrôles ignorés. Ce qui est en ligne sera remplacé par le dossier local."
fi

[ -f .env ] || fail "Fichier .env manquant. Le créer à partir de .env.example."
set -a; . ./.env; set +a
[ -n "${NETLIFY_AUTH_TOKEN:-}" ] || fail "NETLIFY_AUTH_TOKEN absent de .env"
SITE_ID="${NETLIFY_SITE_ID:-6f9b1026-2fe0-4409-bd33-53be885893fc}"

echo "📦 Build..."
npm run build

echo "📤 Déploiement sur Netlify..."
npx netlify deploy --prod --dir dist --site "$SITE_ID"

echo "✅ En ligne : https://zaliasekai.netlify.app"
