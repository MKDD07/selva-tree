export const siteOrigin = 'https://selva-tree.mkmkataria07.workers.dev';
export const siteName = 'Selva Tree Hotels & Resorts';
export const seoPages = {
  '/': {
    title: 'Selva Tree Hotels & Resorts | Stays & Events in Gurugram',
    description: 'Discover Selva Tree Hotels & Resorts in Sohna, Gurugram. Explore countryside stays, poolside spaces and wedding venues, and contact us to plan your visit.',
    label: 'Home', type: 'WebPage',
  },
  '/about-us': {
    title: 'About Selva Tree Hotels & Resorts | Sohna, Gurugram',
    description: 'Get to know Selva Tree Hotels & Resorts in Sohna, Gurugram. Discover our countryside setting, hospitality and spaces for stays and private celebrations.',
    label: 'About us', type: 'AboutPage',
  },
  '/stay': {
    title: 'Rooms & Countryside Stays in Gurugram | Selva Tree',
    description: 'Explore rooms and countryside stays at Selva Tree in Sohna, Gurugram. Discuss room arrangements, pool access, meals and availability for your group.',
    label: 'Rooms & stays', type: 'CollectionPage',
  },
  '/events': {
    title: 'Wedding & Event Venues in Gurugram | Selva Tree',
    description: 'Explore indoor, lawn and poolside event spaces at Selva Tree in Gurugram for weddings, birthdays and corporate gatherings. Enquire about dates and layouts.',
    label: 'Weddings & events', type: 'CollectionPage',
  },
  '/gallery': {
    title: 'Property Photo Gallery | Selva Tree Hotels & Resorts',
    description: 'Browse property photographs of Selva Tree Hotels & Resorts. Explore rooms, gardens, poolside areas and celebration spaces before planning your visit.',
    label: 'Photo gallery', type: 'CollectionPage',
  },
  '/contact': {
    title: 'Contact & Booking Enquiries | Selva Tree Hotels & Resorts',
    description: 'Contact Selva Tree Hotels & Resorts for stays and events in Sohna, Gurugram. Email booking@selvatreehotels.com or call +91 98110 73959 to enquire.',
    label: 'Contact & booking', type: 'ContactPage',
  },
};
export const canonicalPath = path => path === '/book-now' ? '/contact' : path;
export function structuredData(path) {
  path = canonicalPath(path);
  const page = seoPages[path];
  const url = siteOrigin + (path === '/' ? '/' : path);
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'LodgingBusiness', '@id': siteOrigin + '/#business', name: siteName,
      url: siteOrigin + '/', telephone: '+919811073959', email: 'booking@selvatreehotels.com',
      image: siteOrigin + '/images/fallback.jpeg',
      address: { '@type': 'PostalAddress', streetAddress: 'Sohna Rural', addressLocality: 'Gurugram', addressRegion: 'Haryana', postalCode: '122103', addressCountry: 'IN' },
      hasMap: 'https://maps.app.goo.gl/qMk8xXE67VsBXSbu6',
    },
    { '@type': 'WebSite', '@id': siteOrigin + '/#website', url: siteOrigin + '/', name: siteName, publisher: { '@id': siteOrigin + '/#business' }, inLanguage: 'en-IN' },
    { '@type': page.type, '@id': url + '#webpage', url, name: page.title, description: page.description,
      isPartOf: { '@id': siteOrigin + '/#website' }, about: { '@id': siteOrigin + '/#business' }, inLanguage: 'en-IN',
      ...(path !== '/' && { breadcrumb: { '@id': url + '#breadcrumb' } }),
    },
    ...(path === '/' ? [] : [{ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin + '/' },
      { '@type': 'ListItem', position: 2, name: page.label, item: url },
    ] }]),
  ] };
}
