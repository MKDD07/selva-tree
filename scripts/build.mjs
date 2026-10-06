import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { seoPages, siteName, siteOrigin, structuredData } from '../shared/seo.js';

process.env.NODE_ENV = 'production';
await build();
await build({ build: { ssr: 'src/entry-server.jsx', outDir: '.prerender',
  rollupOptions: { output: { entryFileNames: 'render.mjs' } } }, ssr: { noExternal: true } });
const { render } = await import('../.prerender/render.mjs');
const template = await readFile('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const [path, page] of Object.entries(seoPages)) {
  const url = siteOrigin + path;
  const tags = `<title>${escape(page.title)}</title>
    <meta name="description" content="${escape(page.description)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escape(siteName)}">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="${escape(page.title)}">
    <meta property="og:description" content="${escape(page.description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${siteOrigin}/images/fallback.jpeg">
    <meta property="og:image:alt" content="Selva Tree property photograph">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escape(page.title)}">
    <meta name="twitter:description" content="${escape(page.description)}">
    <meta name="twitter:image" content="${siteOrigin}/images/fallback.jpeg">
    <script id="site-schema" type="application/ld+json">${JSON.stringify(structuredData(path)).replaceAll('<', '\\u003c')}</script>`;
  const html = template.replace(/<title>.*?<\/title>/s, tags)
    .replace(/\s*<meta name="description" content="Selva Tree Hotels &amp; Resorts[^>]+>/, '')
    .replace('<div id="root"></div>', () => `<div id="root">${render(path)}</div>`);
  await writeFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, html);
  console.log(`Pre-rendered ${path}`);
}
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(seoPages).map(path => `<url><loc>${siteOrigin}${path}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/llms.txt', `# ${siteName}\n\n> Countryside stays and event spaces in Sohna Rural, Gurugram, Haryana, India.\n\n## Contact\n\n- Email: booking@selvatreehotels.com\n- Phone: +91 98110 73959\n- Address: Sohna Rural, Gurugram, Haryana 122103, India\n- Availability, pricing, capacity and arrangements: confirm with the reservations team.\n- Property photographs: see the gallery. Pexels stock images elsewhere are illustrative.\n\n## Pages\n\n${Object.entries(seoPages).map(([path, page]) => `- [${page.label}](${siteOrigin}${path}): ${page.description}`).join('\n')}\n`);
await writeFile('dist/404.html', '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Selva Tree</title><body><main><h1>Page not found</h1><p>This page may have moved. Explore <a href="/">Selva Tree Hotels &amp; Resorts</a> or <a href="/contact">contact our team</a>.</p></main></body></html>');
