# Fix syntax errors in Codespace

## Common mistakes

1. **Pasting `import` into the terminal** — only paste code into `.tsx` files
2. **Missing `Alert` and `Linking`** in the react-native import
3. **Broken `shared/content.json`** — missing comma after `quantities]`

## Quick fix

### 1. Check JSON is valid

Open `shared/content.json`. After the `quantities` array you MUST have a comma:

```json
  ],
  "contact": {
```

Validate in terminal:
```bash
python3 -c "import json; json.load(open('shared/content.json')); print('JSON OK')"
```

### 2. Replace entire `mobile/app/index.tsx`

Select ALL (Ctrl+A) → Delete → Paste the file from the agent's last message → Save (Ctrl+S)

First lines MUST be exactly:

```tsx
import { Link } from "expo-router";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
```

### 3. `mobile/lib/content.ts`

```typescript
import content from "../../shared/content.json";

export const { stats, steps, propertyTypes, quantities, contact, payout } = content;
```

### 4. Reload

```bash
cd mobile && npx expo start --port 8081 --clear
```
