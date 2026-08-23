# CMS Setup (one-time, technical)

This is a one-time setup job for whoever manages the GitHub repo and Cloudflare account — not the day-to-day content editor. For day-to-day editing, see `EDITING.md`.

The CMS (Sveltia, at `/admin/`) needs a way to authenticate the editor against GitHub without a Netlify account. That's what the Cloudflare Worker below does — it's a small OAuth relay, nothing more.

**Why not a hand-written Worker?** OAuth proxies are security-sensitive — a subtly wrong implementation can leak tokens. Rather than writing one from scratch, use the actual [`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) project, which Sveltia CMS's own docs recommend for exactly this setup. It's small, maintained, and designed to be deployed as-is.

## 1. Create a GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**.
2. Homepage URL: `https://glchurch.co.uk` (or your Vercel preview URL for now).
3. Authorization callback URL: `https://<your-worker-subdomain>.workers.dev/callback` — you'll know the exact subdomain after step 2, so it's fine to come back and fill this in.
4. Save the **Client ID** and generate a **Client Secret**. Keep the secret private.

## 2. Deploy the Cloudflare Worker

1. Clone `https://github.com/sveltia/sveltia-cms-auth`.
2. Follow that repo's README to deploy via `wrangler deploy` (needs a free Cloudflare account).
3. Set the Worker's environment variables/secrets to your GitHub OAuth app's Client ID and Client Secret (the repo's README names the exact variable names — follow it exactly).
4. Note the deployed Worker URL, e.g. `https://gracelink-cms-auth.<your-subdomain>.workers.dev`.
5. Go back to the GitHub OAuth App (step 1) and set the callback URL to `<that-worker-url>/callback`.

## 3. Point the CMS at the Worker

Edit `src/admin/config.yml` and replace the placeholder:

```yaml
backend:
  name: github
  repo: GraceLinkMedia/Gracelink
  branch: main
  base_url: https://REPLACE-WITH-YOUR-WORKER.workers.dev
  auth_endpoint: auth
```

Set `base_url` to the Worker URL from step 2 (no trailing slash, no `/callback`). Commit and push — Vercel will redeploy automatically.

## 4. Test it

1. Visit `https://glchurch.co.uk/admin/`.
2. Click "Login with GitHub".
3. You should be redirected to GitHub, asked to authorize, then land back in the CMS.
4. Anyone the CMS should be able to log in needs **write access to the `GraceLinkMedia/Gracelink` GitHub repo** — add the second editor as a collaborator (GitHub repo → Settings → Collaborators) before they try to log in.

## Notes

- `publish_mode: simple` in `config.yml` means edits commit straight to `main` — no draft/review step. That matches the brief's "keep it simple" instruction, but it does mean a saved edit goes live on the next Vercel deploy (usually under a minute). If that ever feels too fast, this is the one line to change (`publish_mode: editorial_workflow`).
- Uploaded images land in `src/assets/images/uploads/` and are committed to the repo like any other file — the Eleventy build then generates the responsive AVIF/WebP/JPEG variants automatically. No manual optimization step needed.
- The `media_libraries` WebP transform in `config.yml` is a best-effort Sveltia feature to shrink images before they're even committed. Sveltia is a fast-moving project, so if that specific setting stops working in a future version, it's not load-bearing — the build-time image pipeline (`@11ty/eleventy-img`) still guarantees optimized output regardless.
