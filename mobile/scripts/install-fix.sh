#!/usr/bin/env bash
# Run in Codespace from repo root:
#   bash mobile/scripts/install-fix.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "==> Writing mobile/lib/content.ts"
cat > mobile/lib/content.ts << 'EOF'
import content from "../../shared/content.json";

export const { stats, steps, propertyTypes, quantities, contact, payout } = content;
EOF

echo "==> Copying mobile/app/index.tsx from repo (must exist)"
if [ ! -f mobile/app/index.tsx ]; then
  echo "ERROR: mobile/app/index.tsx missing"
  exit 1
fi

echo "==> Checking shared/content.json"
if ! python3 -c "import json; json.load(open('shared/content.json'))" 2>/dev/null; then
  echo "ERROR: shared/content.json has JSON syntax error — fix commas/brackets first"
  exit 1
fi
if ! grep -q '"contact"' shared/content.json || ! grep -q '"payout"' shared/content.json; then
  echo "ERROR: shared/content.json missing contact or payout section"
  exit 1
fi

echo "==> Typecheck mobile"
cd mobile && npx tsc --noEmit && echo "OK — no TypeScript errors"

echo ""
echo "Done. Start Expo:"
echo "  cd mobile && npx expo start --port 8081 --clear"
