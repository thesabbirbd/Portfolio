#!/usr/bin/env bash
# =============================================================================
# PUBLISH STANDALONE GITHUB REPOSITORIES
# THE SABBiR OS — Open-Source Software Publishing Pipeline
# Author: Md Sabbirul Islam Khan
# =============================================================================

set -e

REPOS=(
  "khata2sheet-ai"
  "sara-control-plane"
  "wa-reminder-companion"
  "netpulse-tg"
  "bd-biz-normalizer"
  "leon-hybrid-agent"
  "scannable-barcode-qr-bd"
  "bd-taka-words-ocr"
)

echo "=========================================================="
echo "🚀 THE SABBiR OS Standalone GitHub Repositories Publisher"
echo "=========================================================="
echo ""

# Check for gh CLI
if command -v gh >/dev/null 2>&1; then
  echo "✓ GitHub CLI (gh) detected."
else
  echo "⚠️ GitHub CLI (gh) not found in PATH."
  echo "Install it via 'sudo apt install gh' or manually push with git."
fi

echo ""
echo "Repositories ready for release:"
for r in "${REPOS[@]}"; do
  echo "  • github-repos/$r"
done
echo ""

read -p "Would you like to initialize git repos and push to your GitHub account? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Publishing cancelled. All repositories remain clean and ready in github-repos/."
  exit 0
fi

for r in "${REPOS[@]}"; do
  DIR="github-repos/$r"
  echo ""
  echo "----------------------------------------------------------"
  echo "📦 Processing $r..."
  echo "----------------------------------------------------------"
  
  if [ -d "$DIR" ]; then
    (
      cd "$DIR"
      if [ ! -d ".git" ]; then
        git init -b main
        git add .
        git commit -m "feat: initial open-source release of $r by THE SABBiR"
        echo "✓ Initialized git repository for $r."
      fi

      if command -v gh >/dev/null 2>&1; then
        echo "Creating GitHub repository under your account..."
        gh repo create "$r" --public --source=. --remote=origin --push || {
          echo "Notice: Repository may already exist or needs manual push."
        }
      else
        echo "Manual remote push needed. Run: git remote add origin git@github.com:thesabbir/$r.git && git push -u origin main"
      fi
    )
  fi
done

echo ""
echo "=========================================================="
echo "🎉 All 6 repositories processed successfully!"
echo "=========================================================="
