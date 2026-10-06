import { imageQueries } from '../shared/image-queries.js';

const schema = `CREATE TABLE IF NOT EXISTS image_assets (
  slot TEXT PRIMARY KEY, photo_id INTEGER NOT NULL, object_key TEXT NOT NULL,
  photographer TEXT NOT NULL, photographer_url TEXT NOT NULL,
  photo_url TEXT NOT NULL, source_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
const isPexelsUrl = (value, host) => {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === host; }
  catch { return false; }
};

async function fallback(request, env) {
  const response = await env.ASSETS.fetch(new Request(new URL('/images/fallback.jpeg', request.url)));
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store');
  return new Response(request.method === 'HEAD' ? null : response.body, { status: response.status, headers });
}

async function image(request, env, slot) {
  if (!Object.hasOwn(imageQueries, slot)) return new Response('Image not found', { status: 404 });
  if (!env.DB || !env.IMAGES) return fallback(request, env);
  try {
    // Also initializes newly auto-provisioned D1 databases on first use.
    await env.DB.prepare(schema).run();
    const key = `pexels/${slot}.jpg`;
    let object = await env.IMAGES.get(key);
    if (!object) {
      if (!env.PEXELS_API_KEY) return fallback(request, env);
      let photo = await env.DB.prepare('SELECT * FROM image_assets WHERE slot = ?').bind(slot).first();
      if (!photo) {
        const search = new URL('https://api.pexels.com/v1/search');
        search.search = new URLSearchParams({ query: imageQueries[slot], per_page: '1', orientation: 'landscape' });
        const result = await fetch(search, {
          headers: { Authorization: env.PEXELS_API_KEY.trim() }, signal: AbortSignal.timeout(10000),
        });
        if (!result.ok) return fallback(request, env);
        const selected = (await result.json()).photos?.[0];
        if (!selected || !isPexelsUrl(selected.src?.large2x, 'images.pexels.com') ||
          !isPexelsUrl(selected.url, 'www.pexels.com') ||
          !isPexelsUrl(selected.photographer_url, 'www.pexels.com')) return fallback(request, env);
        photo = { photo_id: selected.id, photographer: selected.photographer,
          photographer_url: selected.photographer_url, photo_url: selected.url, source_url: selected.src.large2x };
      }
      if (!isPexelsUrl(photo.source_url, 'images.pexels.com')) return fallback(request, env);
      const download = await fetch(photo.source_url, { signal: AbortSignal.timeout(10000), redirect: 'manual' });
      if (!download.ok || !download.headers.get('content-type')?.startsWith('image/')) return fallback(request, env);
      const bytes = await download.arrayBuffer();
      if (bytes.byteLength > 10 * 1024 * 1024) return fallback(request, env);
      // Save attribution before making a cached image available.
      await env.DB.prepare(`INSERT OR IGNORE INTO image_assets
        (slot, photo_id, object_key, photographer, photographer_url, photo_url, source_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .bind(slot, photo.photo_id, key, photo.photographer, photo.photographer_url, photo.photo_url, photo.source_url).run();
      await env.IMAGES.put(key, bytes, { httpMetadata: { contentType: download.headers.get('content-type') } });
      object = await env.IMAGES.get(key);
    }
    if (!object) return fallback(request, env);
    const headers = new Headers({ 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' });
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);
    if (request.headers.get('If-None-Match') === object.httpEtag) return new Response(null, { status: 304, headers });
    return new Response(request.method === 'HEAD' ? null : object.body, { headers });
  } catch (error) {
    const message = String(error.message || 'Unknown error')
      .replaceAll(env.PEXELS_API_KEY?.trim() || '__no_secret__', '[redacted]');
    console.error('Image service unavailable; serving local fallback.', message.slice(0, 300));
    return fallback(request, env);
  }
}

async function credits(env) {
  let rows = [];
  if (env.DB) {
    await env.DB.prepare(schema).run();
    rows = (await env.DB.prepare('SELECT DISTINCT photographer, photographer_url, photo_url FROM image_assets ORDER BY photographer').all()).results;
  }
  const items = rows.filter(row => isPexelsUrl(row.photo_url, 'www.pexels.com') && isPexelsUrl(row.photographer_url, 'www.pexels.com'))
    .map(row => `<li>Photo by <a href="${escapeHtml(row.photographer_url)}">${escapeHtml(row.photographer)}</a> on <a href="${escapeHtml(row.photo_url)}">Pexels</a></li>`).join('');
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Photo credits</title><body><main><h1>Photo credits</h1><p>Stock photography provided by <a href="https://www.pexels.com">Pexels</a> is illustrative. See our <a href="/gallery">gallery</a> for property photographs.</p><ul>${items}</ul><p><a href="/">Return to the website</a></p></main></body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'", 'Cache-Control': 'no-store' },
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    if (pathname.startsWith('/api/images/')) return image(request, env, pathname.slice('/api/images/'.length));
    if (pathname === '/api/photo-credits') {
      try { const response = await credits(env); return request.method === 'HEAD' ? new Response(null, response) : response; }
      catch { return new Response('Photo credits temporarily unavailable', { status: 503 }); }
    }
    return new Response('Not found', { status: 404 });
  },
};
