# Selva Tree / Dr Bhagat Farm House

React + Vite frontend with a Cloudflare Worker, R2 photo cache, and D1 photo metadata.

## Development

Use Node 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
```

Vite-only development uses local photos. For the complete Worker API, copy
`.dev.vars.example` to `.dev.vars`, supply your Pexels key, then run:

```sh
npm run dev:cloudflare
```

## Cloudflare deployment

The checked-in `wrangler.jsonc` avoids framework auto-configuration and connects:

- Worker: `selva-tree`
- R2 `IMAGES`: bucket `selva-tree`
- D1 `DB`: `selva-tree-hotels-resorts`, ID `6330fcfb-45bc-4b27-9c72-416467f40450`
- Static assets: `dist`, with SPA navigation fallback and Worker-first `/api/*` routes

Cloudflare Git build settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build environment: `NODE_VERSION=24`
- Root directory: repository root

For a manual deploy, run `npm run deploy`.

Set `PEXELS_API_KEY` as a **secret** in the Worker's Variables and Secrets settings,
or run `npx wrangler secret put PEXELS_API_KEY`. Never use a `VITE_` prefix for this
key: Vite-prefixed values are public browser configuration. `.dev.vars` is ignored.

Apply the initial table with `npm run db:migrate:remote` (or `:local`). The Worker
also creates the `image_assets` table if missing, so first-deploy image requests
remain safe. This table stores photo metadata and attribution, not booking data.

## Images

Pexels supplies stock photos, not AI image generation. Fixed image slots are mapped
to search terms in `shared/image-queries.js`. Photos are fetched server-side on the
first request, stored in R2, and credited using D1 metadata at `/api/photo-credits`.
The API does not accept arbitrary search terms or offer public uploads.

Existing property photos remain local. Missing credentials or an upstream failure
serve `public/images/fallback.jpeg` without caching the fallback. No Unsplash or
Picsum URLs are used. Stock photos are illustrative; the gallery contains property
photos. Cached photos remain stable until their R2 object and D1 row are removed.

## Validation

```sh
npm test
npm run build
npx wrangler deploy --dry-run
```
