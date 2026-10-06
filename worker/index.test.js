import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './index.js';

function environment() {
  const rows = new Map();
  const objects = new Map();
  return {
    rows, objects,
    ASSETS: { fetch: async () => new Response('local image', { headers: { 'Content-Type': 'image/jpeg' } }) },
    DB: { prepare(sql) {
      let args;
      return {
        bind(...values) { args = values; return this; },
        async run() {
          if (sql.startsWith('INSERT')) rows.set(args[0], {
            slot: args[0], photo_id: args[1], object_key: args[2], photographer: args[3],
            photographer_url: args[4], photo_url: args[5], source_url: args[6],
          });
        },
        async first() { return rows.get(args[0]); },
        async all() { return { results: [...rows.values()] }; },
      };
    } },
    IMAGES: {
      async get(key) { return objects.get(key); },
      async put(key, bytes, options) {
        objects.set(key, { body: bytes, httpEtag: '"test-etag"',
          writeHttpMetadata(headers) { headers.set('Content-Type', options.httpMetadata.contentType); } });
      },
    },
  };
}
const request = (path, options) => new Request(`https://example.com${path}`, options);

test('unknown image slots and API routes are rejected', async () => {
  assert.equal((await worker.fetch(request('/api/images/arbitrary-query'), environment())).status, 404);
  assert.equal((await worker.fetch(request('/api/missing'), environment())).status, 404);
  assert.equal((await worker.fetch(request('/api/images/dbf-hero', { method: 'POST' }), environment())).status, 405);
});

test('missing key serves local fallback without caching it', async () => {
  const response = await worker.fetch(request('/api/images/dbf-hero'), environment());
  assert.equal(await response.text(), 'local image');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('Pexels key stays upstream; photo and credit are cached; second request makes no API calls', async (t) => {
  const env = environment();
  env.PEXELS_API_KEY = 'test-secret\r\n';
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls++;
    if (String(url).startsWith('https://api.pexels.com/')) {
      assert.equal(options.headers.Authorization, 'test-secret');
      return Response.json({ photos: [{ id: 1, photographer: 'Example Photographer',
        photographer_url: 'https://www.pexels.com/@example', url: 'https://www.pexels.com/photo/1/',
        src: { large2x: 'https://images.pexels.com/photos/1/example.jpeg' } }] });
    }
    assert.equal(options.redirect, 'manual');
    return new Response('photo bytes', { headers: { 'Content-Type': 'image/jpeg' } });
  });
  const first = await worker.fetch(request('/api/images/dbf-hero'), env);
  assert.equal(await first.text(), 'photo bytes');
  assert.equal(env.rows.size, 1);
  assert.equal(env.objects.size, 1);
  const second = await worker.fetch(request('/api/images/dbf-hero'), env);
  assert.equal(await second.text(), 'photo bytes');
  assert.equal(calls, 2);
  assert.ok(!JSON.stringify([...second.headers]).includes('test-secret'));
  const unchanged = await worker.fetch(request('/api/images/dbf-hero', { headers: { 'If-None-Match': '"test-etag"' } }), env);
  assert.equal(unchanged.status, 304);
});

test('rate limited Pexels API falls back to a local image', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 429 }));
  const env = environment();
  env.PEXELS_API_KEY = 'test-secret';
  const response = await worker.fetch(request('/api/images/dbf-hero'), env);
  assert.equal(await response.text(), 'local image');
  assert.equal(env.objects.size, 0);
});

test('HEAD has no body and photo credits escape untrusted content', async () => {
  const env = environment();
  env.rows.set('slot', { photographer: '<script>alert(1)</script>', photographer_url: 'https://www.pexels.com/@example', photo_url: 'https://www.pexels.com/photo/1/' });
  const response = await worker.fetch(request('/api/photo-credits'), env);
  const html = await response.text();
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.equal(await (await worker.fetch(request('/api/images/dbf-hero', { method: 'HEAD' }), env)).text(), '');
});
