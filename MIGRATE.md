# Migrate repo-link (Origin) → Reoil (GitHub)

## Status

This migration could not be completed automatically from the Cloud Agent environment:

1. **Origin clone blocked** — The agent token is not scoped for `rekha-sharama/repo-link`. Running `origin repo view rekha-sharama/repo-link` returns: *"Your Origin token is not scoped for rekha-sharama/repo-link."*
2. **GitHub push needs a PAT** — No GitHub credentials are available in this environment. You must supply a [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scope.

## Run locally (recommended)

From your machine (where you have access to both remotes):

```bash
git clone https://origin.cursor.com/git/rekha-sharama/repo-link.git
cd repo-link
git remote add github https://github.com/rekhavijay9890-ops/Reoil.git
git push https://<YOUR_GITHUB_TOKEN>@github.com/rekhavijay9890-ops/Reoil.git main
```

Replace `<YOUR_GITHUB_TOKEN>` with a token that has `repo` (or `public_repo` for public repos) permission.

### Push all branches and tags (optional)

```bash
git push https://<YOUR_GITHUB_TOKEN>@github.com/rekhavijay9890-ops/Reoil.git --all
git push https://<YOUR_GITHUB_TOKEN>@github.com/rekhavijay9890-ops/Reoil.git --tags
```

### Safer token usage

Instead of embedding the token in the URL:

```bash
git remote set-url github https://github.com/rekhavijay9890-ops/Reoil.git
gh auth login   # or: git credential-manager / store a PAT
git push github main
```

## Current GitHub target

- **Repo:** https://github.com/rekhavijay9890-ops/Reoil
- **Default branch:** `main` (currently contains only an initial README)
