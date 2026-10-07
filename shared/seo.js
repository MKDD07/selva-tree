export const siteOrigin = 'https://selva-tree.mkmkataria07.workers.dev';
export const siteName = 'Selva Tree Hotels & Resorts';
export const seoPages = {
  '/': {
    title: 'Selva Tree Hotels & Resorts | Luxury Farmhouse in Gurgaon & Sohna',
    description: 'Selva Tree Hotels & Resorts is a luxury private farmhouse in Sohna, Gurugram. Features private pool, jacuzzi, 20,000+ sq. ft lawns, 7 boutique suites for staycations, weddings & parties.',
    keywords: 'luxury farmhouse in gurgaon, farmhouse in gurgaon for party, farmhouse in sohna, selvatree hotels and resorts, selva tree farmhouse, farmhouse with pool gurgaon, private farmhouse staycation gurgaon, destination wedding farmhouse gurgaon',
    label: 'Home', type: 'WebPage',
  },
  '/about-us': {
    title: 'About Selva Tree Hotels & Resorts | Luxury Farmhouse Retreat Sohna',
    description: 'Discover Selva Tree Hotels & Resorts, an eco-luxury farmhouse retreat in Sohna, Gurugram established in 2005. Sprawling lawns, scenic Aravalli hills, private pool & bespoke hospitality.',
    keywords: 'about selva tree hotels resorts, luxury farmhouse retreat sohna, eco resort gurgaon, private farmhouse estate gurugram, dr bhagat farm house sohna',
    label: 'About us', type: 'AboutPage',
  },
  '/stay': {
    title: 'Luxury Farmhouse Stay & Rooms in Gurgaon | Selva Tree Resort',
    description: 'Book a private luxury farmhouse stay in Sohna, Gurugram at Selva Tree. 7 boutique rooms across Deluxe, Premium & Arawali suites with private pool, jacuzzi & lush lawns.',
    keywords: 'farmhouse stay in gurgaon, luxury farmhouse room booking, private farmhouse with rooms sohna, weekend staycation farmhouse gurgaon, selva tree rooms suites',
    label: 'Rooms & stays', type: 'CollectionPage',
  },
  '/events': {
    title: 'Farmhouse for Events & Celebrations in Gurgaon | Selva Tree',
    description: 'Host grand events at Selva Tree luxury farmhouse in Sohna, Gurugram. 20,000+ sq. ft party lawns, AC drawing hall, poolside deck & capacity up to 400 guests with outside catering permitted.',
    keywords: 'farmhouse for events gurgaon, farmhouse for party in gurgaon, party lawn sohna gurugram, corporate offsite farmhouse gurgaon, event venues sohna',
    label: 'Weddings & events', type: 'CollectionPage',
  },
  '/gallery': {
    title: 'Farmhouse Photo Gallery | Selva Tree Hotels & Resorts Gurgaon',
    description: 'View real photos of Selva Tree Hotels & Resorts luxury farmhouse in Sohna, Gurugram: private swimming pool, boutique suites, 20,000+ sq. ft wedding lawns & gardens.',
    keywords: 'selva tree photos, farmhouse pictures gurgaon, selva tree resort photos sohna, luxury farmhouse gallery gurugram',
    label: 'Photo gallery', type: 'CollectionPage',
  },
  '/contact': {
    title: 'Contact & Farmhouse Booking | Selva Tree Hotels & Resorts Gurgaon',
    description: 'Contact Selva Tree Hotels & Resorts farmhouse in Sohna, Gurugram for reservations. Call Chandrapal at +91 72104 83929 or email booking@selvatreehotels.com for pricing & dates.',
    keywords: 'contact selva tree farmhouse, selvatree booking phone number, farmhouse rental sohna gurugram contact, book farmhouse in gurgaon',
    label: 'Contact & booking', type: 'ContactPage',
  },
  '/dining': {
    title: 'Farm-to-Table Dining & BBQ in Gurgaon | Selva Tree Farmhouse',
    description: 'Indulge in organic farm-to-table gourmet dining, live outdoor BBQ, and poolside candlelit dinners at Selva Tree Hotels & Resorts farmhouse in Sohna, Gurugram.',
    keywords: 'farm to table dining gurgaon, poolside dinner gurgaon, live bbq farmhouse sohna, organic food retreat gurugram, selva tree dining',
    label: 'Dining', type: 'WebPage',
  },
  '/facilities': {
    title: 'Farmhouse Amenities with Pool & Jacuzzi | Selva Tree Gurgaon',
    description: 'Experience luxury amenities at Selva Tree farmhouse in Sohna, Gurugram: private swimming pool, 6-seater jacuzzi, 20,000+ sq. ft lawns, bonfire, DJ sound & sports zone.',
    keywords: 'farmhouse with swimming pool gurgaon, farmhouse with jacuzzi gurgaon, pet friendly farmhouse gurgaon, luxury amenities selva tree sohna',
    label: 'Facilities', type: 'WebPage',
  },
  '/weddings-events': {
    title: 'Farmhouse for Destination Weddings in Gurgaon | Selva Tree Resorts',
    description: 'Plan your dream wedding at Selva Tree luxury farmhouse in Sohna, Gurugram. Sprawling 20,000+ sq. ft lawns for 400 guests, poolside haldi/mehendi, suites & outside catering.',
    keywords: 'farmhouse for wedding in gurgaon, destination wedding farmhouse sohna, wedding lawn in gurgaon with rooms, pre wedding venue gurgaon, selva tree wedding lawn',
    label: 'Weddings & events', type: 'CollectionPage',
  },
  '/farmhouse-for-pool-party-in-gurgaon': {
    title: 'Farmhouse for Pool Party in Gurgaon with Private Pool | Selva Tree',
    description: 'Book the ultimate private farmhouse for pool party in Gurgaon at Selva Tree Sohna. Crystal-clear swimming pool, jacuzzi, sound system, bonfire & outside catering allowed.',
    keywords: 'farmhouse for pool party in gurgaon, private pool farmhouse for rent in gurgaon, pool party venue sohna, farmhouse with pool for 1 day in gurgaon, selva tree pool party',
    label: 'Pool party', type: 'ItemPage',
  },
  '/farmhouse-for-birthday-party-in-gurgaon': {
    title: 'Farmhouse for Birthday Party in Gurgaon | Selva Tree Hotels & Resorts',
    description: 'Host memorable milestone birthday parties & private bashes at Selva Tree farmhouse in Gurgaon. Sprawling lawns, pool deck, live BBQ, music setup & kids play area.',
    keywords: 'farmhouse for birthday party in gurgaon, birthday party venues in gurgaon with pool, private party farmhouse sohna, bday celebration farmhouse gurugram',
    label: 'Birthday party', type: 'ItemPage',
  },
  '/terms-conditions': {
    title: 'Terms & Booking Policies | Selva Tree Farmhouse Gurgaon',
    description: 'Review booking terms, check-in policies, party guidelines, and safety rules for Selva Tree Hotels & Resorts luxury farmhouse in Sohna, Gurugram.',
    keywords: 'selva tree booking policy, farmhouse rules gurgaon, terms conditions selvatree hotels',
    label: 'Terms & conditions', type: 'WebPage',
  },
};
export const canonicalPath = path => path === '/book-now' ? '/contact' : path;
export function structuredData(path) {
  path = canonicalPath(path);
  const page = seoPages[path];
  const url = siteOrigin + (path === '/' ? '/' : path);
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'LodgingBusiness', '@id': siteOrigin + '/#business', name: siteName,
      alternateName: 'Selva Tree Farmhouse Gurugram',
      url: siteOrigin + '/', telephone: '+917210483929', email: 'booking@selvatreehotels.com',
      image: siteOrigin + '/images/fallback.jpeg',
      description: 'Selva Tree Hotels & Resorts is an eco-luxury farmhouse retreat in Sohna Rural, Gurugram featuring private swimming pool, 6-seater jacuzzi, 20,000+ sq. ft event lawns, and 7 boutique guest suites.',
      address: { '@type': 'PostalAddress', streetAddress: 'Sohna Rural', addressLocality: 'Gurugram', addressRegion: 'Haryana', postalCode: '122103', addressCountry: 'IN' },
      geo: { '@type': 'GeoCoordinates', latitude: '28.2477', longitude: '77.0620' },
      hasMap: 'https://maps.app.goo.gl/qMk8xXE67VsBXSbu6',
      priceRange: '₹₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, Credit Card, UPI, Net Banking',
      checkinTime: '14:00',
      checkoutTime: '11:00',
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Private Swimming Pool', value: true },
        { '@type': 'LocationFeatureSpecification', name: '6-Seater Heated Jacuzzi', value: true },
        { '@type': 'LocationFeatureSpecification', name: '20,000+ sq. ft Event Lawns', value: true },
        { '@type': 'LocationFeatureSpecification', name: '7 Luxury Suites', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Air-Conditioned Banquet Hall', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Bonfire & Live Barbecue', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Sufficient Car Parking', value: true },
        { '@type': 'LocationFeatureSpecification', name: '24x7 Security & Caretaker', value: true },
      ],
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
