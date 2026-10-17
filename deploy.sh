#!/bin/bash
#
# ⚠️  CE SCRIPT VA À CONTRESENS. Il est DÉSACTIVÉ par défaut.
#
# La mise à jour du site ne se fait que dans un sens : Zalia publie depuis
# /admin/, ça écrit sur origin/main, Netlify reconstruit. Ce qui est en ligne
# fait foi (voir AGENTS.md).
#
# Ce script, lui, prend le contenu du DOSSIER LOCAL et le pousse en ligne sans
# passer par git. Lancé depuis une copie en retard — ce qui est l'état normal
# du dépôt local, puisque Zalia publie entre les sessions — il remet en ligne
# un état ancien et efface les textes publiés depuis. Le dépôt GitHub garde la
# bonne version : le site semble alors se « réparer » tout seul à la
# publication suivante, de quoi croire que l'admin déraille.
#
# EN TEMPS NORMAL, NE PAS S'EN SERVIR. Pour publier : /admin/, c'est tout.
# Pour mettre du code en ligne : git push origin main après un git pull.
#
# Il ne reste là que pour un cas de secours (Netlify qui ne reconstruit plus du
# tout alors que le site doit être remis en ligne), et il exige alors une
# autorisation explicite :
#
#   ./deploy.sh --j-ecrase-ce-qui-est-en-ligne
#
set -euo pipefail
cd "$(dirname "$0")"

fail() { echo "❌ $1" >&2; exit 1; }

if [ "${1:-}" != "--j-ecrase-ce-qui-est-en-ligne" ]; then
  cat >&2 <<'EOF'
❌ Déploiement refusé.

   Ce script remplace le site en ligne par le contenu du dossier local, et
   efface donc les textes que Zalia a publiés depuis l'admin. La mise à jour
   ne va que dans un sens : /admin/ → GitHub → Netlify.

   Pour publier un texte      : https://zaliasekai.netlify.app/admin/
   Pour mettre du code en ligne : git pull --ff-only && git push origin main
   Pour récupérer en local     : git pull --ff-only

   Si le site doit vraiment être republié depuis cette machine, en connaissance
   de cause et après avoir tiré :

       ./deploy.sh --j-ecrase-ce-qui-est-en-ligne
EOF
  exit 1
fi

echo "⚠️  Republication depuis le dossier local — ce qui est en ligne sera remplacé."

echo "🔍 Contrôle de l'état du dépôt..."

branch=$(git rev-parse --abbrev-ref HEAD)
[ "$branch" = "main" ] || fail "Branche courante : « $branch », attendu « main ».
 → git checkout main"

[ -z "$(git status --porcelain --untracked-files=no)" ] || fail "Des modifications ne sont pas validées.
 → les committer avant de republier"

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

[ -f .env ] || fail "Fichier .env manquant. Le créer à partir de .env.example."
set -a; . ./.env; set +a
[ -n "${NETLIFY_AUTH_TOKEN:-}" ] || fail "NETLIFY_AUTH_TOKEN absent de .env"
SITE_ID="${NETLIFY_SITE_ID:-6f9b1026-2fe0-4409-bd33-53be885893fc}"

echo "📦 Build..."
npm run build

echo "📤 Déploiement sur Netlify..."
npx netlify deploy --prod --dir dist --site "$SITE_ID"

echo "✅ En ligne : https://zaliasekai.netlify.app"
