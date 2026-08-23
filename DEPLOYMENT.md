# Deploying to Vercel

This is a one-time setup job. After this, every push to `main` deploys automatically — there's nothing to run manually.

## 1. Push this repo to GitHub

The remote is already set to `https://github.com/GraceLinkMedia/Gracelink.git`. Once you're ready:

```
git push -u origin main
```

(Ask before running this if you want it done for you — pushing is a one-way, visible action, so it's worth doing deliberately rather than by default.)

## 2. Connect Vercel to the repo

1. Sign up / log in at vercel.com with GitHub.
2. **Add New Project** → import `GraceLinkMedia/Gracelink`.
3. Vercel should auto-detect Eleventy. If it asks for a build command / output directory, use:
   - Build command: `npx eleventy`
   - Output directory: `_site`
4. Deploy. You'll get a free `*.vercel.app` preview URL immediately — review the site there before touching DNS.

## 3. Point the domain at Vercel

Once the preview looks right:

1. In the Vercel project → **Settings → Domains** → add `glchurch.co.uk` (and `www.glchurch.co.uk` if you want both).
2. Vercel will show you exactly which DNS records to add.
3. Log into IONOS → DNS settings for `glchurch.co.uk` → add those records (typically an `A` record for the bare domain and a `CNAME` for `www`).
4. DNS changes can take a few hours to propagate. Vercel issues a free SSL certificate automatically once it verifies the domain.
5. Only after this is confirmed working should the IONOS Web Hosting Plus plan be downgraded to domain-only, per the brief.

## 4. Environment / redirects

- `vercel.json` (already in the repo) handles the WordPress redirect cleanup and enforces trailing slashes on every URL.
- No environment variables are needed for the site build itself. The Sveltia CMS's GitHub OAuth Worker is a separate deployment (see `CMS-SETUP.md`) and doesn't affect the Vercel build.

## Ongoing workflow

- The non-technical editor uses `/admin/` (see `EDITING.md`) — their saves commit straight to `main`.
- Any code/template changes from a developer also just need `git push` to `main` — Vercel redeploys within about a minute either way.
