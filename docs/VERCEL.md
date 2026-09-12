# Deploy Reoil to Vercel

## Option A — Publish button (easiest)

1. Click **Publish** in the Cursor agent panel (top of chat)
2. Sign in to Vercel if prompted
3. Select your GitHub repo or deploy from current project
4. Add environment variables (see below)
5. Deploy

## Option B — Vercel dashboard

1. Push code to GitHub: `git push github main`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import **rekhavijay9890-ops/Reoil**
4. Add environment variables before deploying
5. Click **Deploy**

## Option C — Vercel CLI

```bash
cd /workspaces/Reoil
npx vercel login
npx vercel --prod
```

When prompted, add env vars in the Vercel dashboard after first deploy.

---

## Required environment variables

Add these in Vercel → Project → **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://anbaiyeecxaimqgvidid.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
| `ADMIN_KEY` | `reoil-admin-2026` (or your own secret) |

Apply to: **Production**, **Preview**, and **Development**.

---

## After deploy

Your live URL will be like: `https://reoil-xxx.vercel.app`

### Update mobile app

```bash
# mobile/.env
EXPO_PUBLIC_API_URL=https://your-app.vercel.app
```

Restart Expo: `npx expo start --tunnel`

### Test

| URL | Purpose |
|-----|---------|
| `https://your-app.vercel.app` | Landing page |
| `https://your-app.vercel.app/schedule` | Book pickup |
| `https://your-app.vercel.app/admin` | Admin dashboard |
| `https://your-app.vercel.app/api/health` | Check Supabase connected |

---

## Custom domain (optional)

Vercel → Project → **Settings** → **Domains** → add your domain.
