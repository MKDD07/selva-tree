import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { seoPages, siteOrigin } from '../shared/seo.js';
import worker from '../worker/index.js';

test('every indexable page contains readable HTML and unique complete metadata', async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const path of Object.keys(seoPages)) {
    const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one h1`);
    assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`href="${siteOrigin}${path}"`));
    assert.ok(html.includes('booking@selvatreehotels.com'));
    assert.ok(!html.includes('<div id="root"></div>'));
    assert.ok(!html.includes('<html lang="en" data-loading'));
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
    assert.ok(!titles.has(title)); titles.add(title);
    assert.ok(!descriptions.has(description)); descriptions.add(description);
    const schema = JSON.parse(html.match(/<script id="site-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.ok(schema['@graph'].some(item => item['@type'] === 'LodgingBusiness'));
    assert.ok(!JSON.stringify(schema).includes('aggregateRating'));
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)"/g)) await access('dist' + decodeURIComponent(match[1]));
  }
});

test('discovery files list only canonical pages', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, Object.keys(seoPages).length);
  assert.ok(!sitemap.includes('book-now'));
  assert.ok((await readFile('dist/robots.txt', 'utf8')).includes(`${siteOrigin}/sitemap.xml`));
  const summary = await readFile('dist/llms.txt', 'utf8');
  for (const path of Object.keys(seoPages)) assert.ok(summary.includes(`${siteOrigin}${path}`));
});

test('Worker serves prerendered pages, redirects aliases and returns genuine 404s', async () => {
  const env = { ASSETS: { fetch: async request => {
    const path = new URL(request.url).pathname;
    return new Response(path, { status: path === '/missing' ? 404 : 200 });
  } } };
  for (const path of Object.keys(seoPages)) {
    const response = await worker.fetch(new Request('https://example.com' + path), env);
    assert.equal(await response.text(), path === '/' ? '/index.html' : path + '.html');
  }
  for (const [from, to] of [['/book-now', '/contact'], ['/events/', '/events'], ['/stay.html', '/stay'], ['/index.html', '/']]) {
    const response = await worker.fetch(new Request('https://example.com' + from), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), 'https://example.com' + to);
  }
  const missing = await worker.fetch(new Request('https://example.com/missing'), env);
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get('X-Robots-Tag'), 'noindex');
});
