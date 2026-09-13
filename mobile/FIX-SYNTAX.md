# Fix syntax errors in Codespace

## One-command fix

From the repo root in Codespace:

```bash
git pull origin main
bash mobile/scripts/fix-codespace.sh
```

This repairs `shared/content.json` and `mobile/lib/content.ts`, then runs a TypeScript check.

## What went wrong

GitHub `main` has three problems that cause red squiggles:

1. **`shared/content.json` is truncated** — it starts with `"contact":` instead of `{ "stats": [...]`. That is invalid JSON.
2. **`mobile/lib/content.ts` is missing** on GitHub.
3. **`mobile/app/index.tsx` imports `../lib/contact-actions`** but that file does not exist on GitHub.

Also: **never paste `import ...` lines into the terminal** — that is bash, not TypeScript.

## After the fix

```bash
cd mobile
npx expo start --port 8081 --clear
```

## Manual check (optional)

```bash
python3 -c "import json; json.load(open('shared/content.json')); print('JSON OK')"
cd mobile && npx tsc --noEmit
```
