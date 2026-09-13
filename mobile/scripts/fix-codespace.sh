#!/usr/bin/env bash
# Fixes syntax errors when Codespace has stale/broken files from GitHub.
# Run from repo root: bash mobile/scripts/fix-codespace.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

TEMPLATES="$(cd "$(dirname "$0")/templates" && pwd)"

echo "==> Fixing shared/content.json"
cp "$TEMPLATES/content.json" shared/content.json

echo "==> Fixing mobile/content.json"
cp "$TEMPLATES/content.json" mobile/content.json

echo "==> Fixing mobile/lib/content.ts"
cat > mobile/lib/content.ts << 'CONTENT_TS_EOF'
import content from "../content.json";

export const { stats, steps, propertyTypes, quantities, contact, payout } = content;
CONTENT_TS_EOF

echo "==> Fixing mobile/app/index.tsx"
cp "$TEMPLATES/index.tsx" mobile/app/index.tsx

echo "==> Validating JSON"
python3 -c "import json; json.load(open('shared/content.json')); print('JSON OK')"

echo "==> Typecheck mobile"
cd mobile && npx tsc --noEmit && echo "TypeScript OK"

echo ""
echo "All fixed! Start Expo:"
echo "  cd mobile && npx expo start --port 8081 --clear"
