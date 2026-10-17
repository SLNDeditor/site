#!/bin/bash
#
# Récupère en local ce que Zalia a publié en ligne. C'est le SEUL sens de mise
# à jour automatique (voir AGENTS.md). À lancer au début de chaque session.
#
#   ./sync.sh

set -euo pipefail
cd "$(dirname "$0")"

fail() { echo "❌ $1" >&2; exit 1; }

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "main" ]; then
  echo "↪️  Retour sur main (on était sur « $branch »)"
  [ -z "$(git status --porcelain --untracked-files=no)" ] \
    || fail "Modifications non validées sur « $branch ». Les committer ou les ranger (git stash) d'abord."
  git checkout main --quiet
fi

before=$(git rev-parse HEAD)
git fetch origin main --quiet
behind=$(git rev-list --count HEAD..origin/main)

if [ "$behind" -eq 0 ]; then
  echo "✅ Déjà à jour — rien de nouveau depuis l'admin."
  exit 0
fi

echo "📥 $behind nouveau(x) commit(s) en ligne :"
git --no-pager log --reverse --pretty='   %ad  %s' --date=short HEAD..origin/main

# --ff-only : si ça refuse, c'est que le local a divergé. Ne jamais forcer —
# ce qui est en ligne fait foi.
git merge --ff-only origin/main --quiet \
  || fail "Le local a divergé d'origin/main. NE PAS forcer : ce qui est en ligne fait foi.
   Inspecter avec : git log --oneline --graph HEAD origin/main"

echo
echo "📝 Textes modifiés :"
git --no-pager diff --stat "$before" HEAD -- src/content || true
echo
echo "✅ Local aligné sur l'en-ligne ($(git log -1 --pretty='%h %s' | cut -c1-60))"
