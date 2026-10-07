import { canonicalPath, seoPages, siteName, siteOrigin, structuredData } from '../shared/seo';

export function updateSeo(pathname) {
  const path = canonicalPath(pathname);
  const page = seoPages[path];
  if (!page) return;
  document.title = page.title;
  const url = siteOrigin + (path === '/' ? '/' : path);
  const values = {
    description: page.description,
    ...(page.keywords ? { keywords: page.keywords } : {}),
    robots: 'index, follow, max-image-preview:large',
    'og:title': page.title, 'og:description': page.description, 'og:url': url,
    'og:type': 'website', 'og:site_name': siteName, 'og:locale': 'en_IN',
    'og:image': siteOrigin + '/images/fallback.jpeg', 'og:image:alt': 'Selva Tree Hotels & Resorts luxury farmhouse photograph',
    'twitter:card': 'summary_large_image', 'twitter:title': page.title,
    'twitter:description': page.description, 'twitter:image': siteOrigin + '/images/fallback.jpeg',
  };
  for (const [name, content] of Object.entries(values)) {
    const attribute = name.startsWith('og:') ? 'property' : 'name';
    let meta = document.head.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute(attribute, name); document.head.append(meta); }
    meta.content = content;
  }
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
  canonical.href = url;
  let schema = document.getElementById('site-schema');
  if (!schema) { schema = document.createElement('script'); schema.id = 'site-schema'; schema.type = 'application/ld+json'; document.head.append(schema); }
  schema.textContent = JSON.stringify(structuredData(path));
}
