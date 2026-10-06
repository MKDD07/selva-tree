// ALL CONTENT LIVES HERE. Edit values; layout stays untouched.
// Replace img() with your real photos, e.g. '/photos/pool.jpg' (put files in /public/photos).
import { img } from './images';

export const brand = {
  name: 'Selva Tree Hotels & Resorts',
  tagline: 'A private retreat combining nature, sustainability, and luxury.',
  phone: '+91 72104 83929',
  contactPerson: 'Chandrapal',
  whatsapp: '917210483929',
  email: 'booking@selvatreehotels.com',
  address: 'Selva Tree Hotels & Resorts, Sohna Rural, Gurugram, Haryana 122103',
  mapsUrl: 'https://maps.app.goo.gl/qMk8xXE67VsBXSbu6',
};

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about-us', label: 'About Us' },
  { to: '/stay', label: 'Suites' },
  { to: '/dining', label: 'Dining' },
  { to: '/events', label: 'Events' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Book Now' },
];

import gallery001 from '../assets/gallery/gallery_001.jpeg';
import gallery002 from '../assets/gallery/gallery_002.jpeg';
import gallery003 from '../assets/gallery/gallery_003.jpeg';
import gallery004 from '../assets/gallery/gallery_004.jpeg';
import gallery005 from '../assets/gallery/gallery_005.jpeg';
import gallery006 from '../assets/gallery/gallery_006.jpeg';
import gallery007 from '../assets/gallery/gallery_007.jpeg';
import gallery008 from '../assets/gallery/gallery_008.jpeg';
import gallery009 from '../assets/gallery/gallery_009.jpeg';
import gallery010 from '../assets/gallery/gallery_010.jpeg';
import gallery011 from '../assets/gallery/gallery_011.jpeg';

export const galleryImages = [
  gallery001,
  gallery002,
  gallery003,
  gallery004,
  gallery005,
  gallery006,
  gallery007,
  gallery008,
  gallery009,
  gallery010,
  gallery011,
];

export const farmhouses = [
  {
    id: 'selva-tree',
    name: 'Selva Tree Hotels & Resorts',
    tag: 'Private Luxury Estate',
    blurb: 'A private retreat combining nature, sustainability, and luxury with lush lawns, private pool, and peaceful Aravalli surroundings.',
    images: galleryImages,
  },
];

export const faq = [
  { 
    q: 'Which is the best resort in Gurgaon for a destination wedding?', 
    a: 'Selva Tree Hotels & Resorts in Sohna, Gurugram offers an idyllic destination wedding venue with sprawling lawns hosting up to 400 guests, 2 guest rooms, poolside settings, and flexible catering and decor policies.' 
  },
  { 
    q: 'How many guests can Selva Tree Hotels & Resorts accommodate for an event?', 
    a: 'Our venues accommodate events of all sizes: the drawing room & pre-function lawn host up to 200 guests, while our grand poolside lawn accommodates up to 400 guests with ample private parking.' 
  },
  { 
    q: 'Is there a banquet hall or indoor space available at Selva Tree Hotels & Resorts?', 
    a: 'Yes. We offer an air-conditioned 863 sq. ft. drawing hall with seamless Wi-Fi and attached lawns, ideal for indoor gatherings, weather backups, conferences, and intimate ceremonies.' 
  },
  { 
    q: 'Can I host a poolside event or Mehndi ceremony at Selva Tree Hotels & Resorts?', 
    a: 'Yes. Our shimmering swimming pool deck and adjoining lawns are popular for vibrant Haldi, Mehndi, cocktail pool parties, and starlit anniversary dinners.' 
  },
  { 
    q: 'What types of events can be organised at Selva Tree Hotels & Resorts?', 
    a: 'We host destination weddings, pre-wedding rituals (Haldi/Mehndi/Roka), birthday parties, corporate offsites, retreats, family reunions, and small gatherings under 50 pax.' 
  },
  { 
    q: 'Are lockers and private rooms available for guests to store their valuables?', 
    a: 'Yes. Secure private rooms with storage lockers are provided for the host family and guests during the event duration.' 
  },
  { 
    q: 'What are the catering and DJ policies?', 
    a: 'Both in-house and outside catering are allowed (vegetarian & non-vegetarian). Outside decorators, outside DJs, and outside alcohol are also warmly permitted.' 
  },
  { 
    q: 'How do I book?', 
    a: 'Send an enquiry through our contact form, or connect with us directly on WhatsApp/Call to arrange a farm visit and confirm your dates.' 
  },
];

// Each page is a list of sections. `type` picks the component in components/Sections.jsx.
export const pages = {
  '/': [
    { type: 'hero', eyebrow: 'Nature-inspired stays · Manesar, Gurgaon', title: 'Countryside stays & celebrations in Gurugram.', text: brand.tagline, image: img('dbf-hero', 2000, 1200), cta: { label: 'Book Now', to: '/contact' }, cta2: { label: 'Our Story', to: '/about-us' } },
    { 
      type: 'mosaic', 
      theme: 'rose', 
      eyebrow: 'The Selva Tree Experience',
      title: 'Curated comfort, sustainability & thoughtful touches.',
      items: [
        {
          title: 'Exceptional Luxury',
          text: 'Luxury curated with warmth, design, and care, where every corner of our villa feels personal, intentional, and deeply comforting.',
          image: img('dbf-luxury-pool', 800, 1000),
        },
        {
          title: 'Sustainable Approach',
          text: 'Powered by solar energy with groundwater harvesting, automated water-saving sprinklers, and organic farm surroundings.',
          image: img('dbf-eco-nature', 1000, 600),
        },
        {
          title: 'Signature Touches',
          text: 'Thoughtful welcome experiences, customized bonfire evenings, and personalized surprises designed to leave a lasting impression.',
          image: img('dbf-welcome-gift', 600, 600),
        },
        {
          title: 'Exclusive Dining & Perks',
          text: 'Freshly cooked home-style meals, live barbecues, private pool access, and tranquil countryside relaxation for your group.',
          image: img('dbf-chef-dining', 600, 600),
        },
      ]
    },
    { 
      type: 'featureBanner', 
      theme: 'rose',
      eyebrow: 'YOUR PRIVATE GETAWAY',
      title: 'Let Your Private Oasis Welcome You & Yours',
      text: 'Selva Tree Hotels & Resorts becomes your private curated escape — meticulously maintained, bathed in nature, and thoughtfully prepared for memorable celebrations and retreats.',
      cta: { label: 'Book Your Stay', to: '/contact' },
      image: img('dbf-villa-ext', 1000, 850),
      badges: [
        { prefix: '100% Private', text: 'exclusive estate for your group', pos: 'tl' },
        { prefix: 'Solar Powered', text: 'eco-friendly & sustainable', pos: 'mr' },
        { prefix: 'Trusted', text: 'by 500+ happy families & hosts', pos: 'bl' },
      ]
    },
    {
      type: 'featureSplit',
      eyebrow: 'Explore Our Accommodations',
      title: 'Unveiling Our Suites & Rooms',
      subtitle: 'Seven distinctive rooms across Premium, Deluxe, and Arawali collections.',
      paragraphs: [
        'Composed with precision, our accommodation collection thoughtfully features 7 well-appointed rooms nestled amidst nature’s beauty: 4 spacious Deluxe Rooms, 2 luxury Premium Suites, and 1 exclusive Arawali Room overlooking the grand hill vistas.',
        'Each room is carefully designed with plush cushioned king beds, daylit windows, and modern en-suite amenities, allowing guests to effortlessly unwind in serene countryside comfort.',
        'Whether booking an individual room or reserving the entire 7-room estate for exclusive celebrations and gatherings, we comfortably host families and groups in complete privacy and style.'
      ],
      points: [
        '4 Deluxe Rooms (Garden & pool vistas)',
        '2 Premium Rooms (Elevated luxury & comfort)',
        '1 Arawali Room (Panoramic hill views)',
        'Private estate buyout for up to 25 guests'
      ],
      tag: '4 Deluxe · 2 Premium · 1 Arawali',
      image: img('dbf-suites-lux', 1200, 1000),
      cta: { label: 'Explore Suites', to: '/stay' },
      flip: false,
    },
    {
      type: 'featureSplit',
      theme: 'sand',
      eyebrow: 'Events & Celebrations',
      title: 'Where Celebrations Come to Life',
      subtitle: 'Two expansive lawns spanning over 10,000 sq. ft each.',
      paragraphs: [
        'Two expansive lawns, each spanning over 10,000 sq. ft, offer the perfect canvas for unforgettable events and celebrations to unfold. At Selva Tree Hotels & Resorts, our distinct event spaces aren’t just lawns; they are versatile spaces crafted with the beauty of nature that serve as the backdrop for some of the most cherished moments in your life.',
        'Whether you\'re searching for a resort in Gurgaon for birthday celebrations or looking to host an event that’s unique and personal, we’ve got you covered. From dreamy star-lit weddings and laughter-filled birthday bashes to innovation-sparking corporate retreats and everything in between, let your wildest imaginations soar.',
        'Want to turn up the vibe? We can arrange for a professional DJ to set the energy and skilled bartenders to mix well-designed drinks, available upon request. Because at Selva Tree Hotels & Resorts, we don’t just host events — we infuse every celebration with creativity.'
      ],
      points: [
        '2 expansive lawns (10,000+ sq. ft each)',
        'Ideal for weddings, parties & corporate offsites',
        'Professional DJ & skilled bartending upon request',
        'Complete estate privacy for your celebration'
      ],
      tag: '20,000+ sq. ft Event Lawns',
      image: img('dbf-celebration-lawn', 1200, 1000),
      cta: { label: 'Plan Your Event', to: '/events' },
      flip: true,
    },
    {
      type: 'featureSplit',
      eyebrow: 'Farm-to-Table Gourmet',
      title: 'Let Us Feed Your Soul',
      subtitle: 'Indian, Continental, and Chinese cuisine crafted with fresh ingredients.',
      paragraphs: [
        'At Selva Tree Hotels & Resorts, dining is more than just food; it is about healing the soul. In our world, every moment is to be relished. From that first bite of a delightful snack to a sumptuous dinner, and even the refreshing start of breakfast, the feeling is nothing short of a reward.',
        'Our painstakingly prepared meal plan aims to deepen your getaway by highlighting the fresh, expertly crafted flavours made with care on the farm. Our Food and Beverages (F&B) Manager ensures that every dining experience at our property is truly a class apart with meticulous attention to detail and a commitment to excellence.',
        'Our chefs use only fresh ingredients, combining traditional techniques with innovative flavours, thus ensuring every dish is a delight for your taste buds. Guests get to choose from our elaborate curated menu.'
      ],
      points: [
        'Authentic Indian, Continental & Chinese cuisines',
        'Dedicated F&B Manager & in-house executive chefs',
        'Fresh farm-sourced ingredients & custom live BBQ',
        'Elaborate breakfast, snacks & multi-course dinners'
      ],
      tag: 'Curated Multi-Cuisine Dining',
      image: img('dbf-dining-gourmet', 1200, 1000),
      cta: { label: 'Reserve with Dining', to: '/contact' },
      flip: false,
    },
    { type: 'stats', items: [{ value: 2005, suffix: '', label: 'Established Year' }, { value: 200, suffix: '+', label: 'Seating Lawn Capacity' }, { value: 300, suffix: '+', label: 'Floating Guests Capacity' }, { value: 7, suffix: '', label: 'Private Guest Rooms' }] },
    {
      type: 'amenities',
      title: 'Amenities & Policies',
      theme: 'sand',
      items: [
        { iconKey: 'swimming-pool', label: 'Pets Friendly' },
        { iconKey: 'jacuzzi', label: '6-Seater Jacuzzi' },
        { iconKey: 'spacious-outdoor-lawn', label: 'Spacious Outdoor Lawn' },
        { iconKey: 'sufficient-car-parking', label: 'Sufficient Car Parking' },
        { iconKey: '2-private-guest-rooms', label: '7 Private Guest Rooms' },
        { iconKey: 'table-tennis', label: 'Table Tennis & Games' },
        { iconKey: 'childrens-play-area', label: "Children's Play Area" },
        { iconKey: 'trampoline', label: 'Trampoline' },
        { iconKey: 'bonfire-bbq', label: 'Bonfire & BBQ Evenings' },
        { iconKey: 'inhouse-outside-dj', label: 'JBL Party Box & DJ Setup' },
        { iconKey: 'pet-friendly-estate', label: 'Pet-friendly Estate' },
        { iconKey: '24-hour-security', label: '24-Hour Security & Caretaker' },
      ]
    },
    { 
      type: 'eventShowcase',
      theme: 'sand',
      title: 'Unforgettable Events, Perfect Venues',
      text: 'From dreamy weddings to lively celebrations, our properties set the stage for every special moment.',
      items: [
        {
          title: 'Weddings & Receptions',
          text: 'Expansive lush green outdoor lawns hosting up to 200 seating and 300 floating guests with customized decor and catering.',
          badge: 'Up to 300 guests',
          image: img('dbf-event-wedding', 600, 600),
        },
        {
          title: 'Corporate Offsites & Gatherings',
          text: 'Private serene countryside surroundings ideal for team building, strategy sessions, and corporate offsites in Sohna.',
          badge: 'Complete estate privacy',
          image: img('dbf-event-retreat', 600, 600),
        },
        {
          title: 'Birthdays & Private Parties',
          text: 'Host intimate gatherings (<50 pax) or grand birthday bashes with outside catering, decor, and DJ flexibility.',
          badge: 'Flexible party policy',
          image: img('dbf-event-birthday', 600, 600),
        },
        {
          title: 'Family & Pre-Wedding Functions',
          text: 'Haldi, Mehendi, Roka, and anniversary celebrations in peaceful natural greenery away from city noise.',
          badge: 'Day & evening celebrations',
          image: img('dbf-event-wellness', 600, 600),
        },
      ]
    },
    {
      type: 'testimonials',
      title: 'Highly rated by guests & hosts',
      subtitle: 'Real experiences from families, couples, and corporate groups who stayed with us.',
      items: [
        {
          stars: 5,
          name: 'Rajesh & Sunita Sharma',
          role: '25th Anniversary Celebration',
          location: 'Gurugram',
          title: 'A serene oasis with seamless hospitality',
          review: 'We celebrated our 25th wedding anniversary here with 80 guests. The expansive green lawn, spotless pool deck, and attentive staff made the evening absolutely magical. Our family loved the peaceful ambiance.',
        },
        {
          stars: 5,
          name: 'Ananya & Vikram Malhotra',
          role: 'Destination Wedding',
          location: 'Delhi NCR',
          title: 'The perfect wedding venue under open skies',
          review: 'Hosting our Sangeet and wedding reception at Selva Tree Hotels & Resorts was the best decision. Having flexibility with outside decorators and catering allowed us to customize every single detail perfectly.',
        },
        {
          stars: 5,
          name: 'Rohan Deshmukh',
          role: 'Corporate Offsite Organiser',
          location: 'Cyber City, Gurgaon',
          title: 'Exceptional setting for our leadership retreat',
          review: 'Our company of 35 spent 2 productive days here. The combination of the air-conditioned hall for presentations and the outdoor lawns for team-building gave us the ideal balance of work and relaxation.',
        },
        {
          stars: 5,
          name: 'Pooja & Karan Mehra',
          role: 'Birthday & Pool Party',
          location: 'South Delhi',
          title: 'Unforgettable poolside vibes and total privacy',
          review: 'Booked the estate for a milestone birthday party. The sound setup, jacuzzi, bonfire in the evening, and private rooms were top-notch. Having complete estate privacy made all the difference.',
        }
      ]
    },
    {
      type: 'faq',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about your luxury staycation & event reservations.',
      items: faq,
    },
    { type: 'cta', title: 'Your dates, your people, your farm.', text: 'Tell us what you are planning and we will take care of the rest.', cta: { label: 'Book Now', to: '/contact' } },
  ],
  '/about-us': [
    { type: 'head', eyebrow: 'About Us', title: 'About Selva Tree Hotels & Resorts.', text: 'Established in 2005, Selva Tree Hotels & Resorts offers picturesque greenery, peaceful landscapes, and a soothing atmosphere.', image: img('dbf-about-head', 2000, 900) },
    { 
      type: 'split', 
      eyebrow: 'Our Heritage', 
      title: 'Established in 2005, sustained by nature.', 
      text: [
        'Selva Tree Hotels & Resorts is nestled in Sohna of Gurugram, Haryana, posing as a breathtaking venue idyllic for hosting various functions, staycations, and memorable celebrations. Established in 2005, the estate envelops picturesque greenery and a soothing countryside atmosphere.',
        'This enchanting place provides a serene escape from the chaos of everyday life, making it an ideal setting for both daytime and evening festivities. Breathtaking vistas create an amazing backdrop, elevating the overall ambiance to one of tranquillity and natural beauty.',
        'Whether you are planning a grand wedding celebration, a family get-together, or an intimate birthday party, Selva Tree Hotels & Resorts offers flexible hospitality with in-house and outside catering, decor, DJ, and alcohol permissions.'
      ], 
      image: img('dbf-story', 1100, 1300), 
      points: [
        'Established in 2005 in Sohna Rural, Gurugram',
        'Outdoor lawn with 200 seating & 300 floating guest capacity',
        '2 comfortable private rooms & sufficient on-site parking',
        'Inhouse & outside catering, decorators, DJ & alcohol permitted'
      ],
      link: { label: 'Book Your Stay', to: '/contact' }
    },
    {
      type: 'split',
      flip: true,
      eyebrow: 'Capacity & Policies',
      title: 'Space, freedom & personalized celebrations.',
      text: [
        'Space & Capacity: Our expansive outdoor lawn comfortably accommodates 200 seating and up to 300 floating guests, complemented by 2 well-equipped private rooms.',
        'Flexible Policies: We welcome outside decorators and outside catering alongside our in-house culinary preparations, allowing you to curate your event exactly as envisioned. Outside DJ and outside alcohol are also permitted.'
      ],
      image: img('dbf-vision', 1100, 1300),
      points: [
        'Small party friendly (<50 pax allowed)',
        'Delightful vegetarian & non-vegetarian multi-cuisine options',
        'Idyllic setting for daytime ceremonies & starlit evening receptions'
      ]
    },
    {
      type: 'cards',
      eyebrow: 'Why Choose Us',
      title: 'Everything you need for an unforgettable event.',
      variant: 'icon',
      items: [
        { icon: 'Trees', title: 'Picturesque Greenery', text: 'Sprawling natural gardens and open skies providing a stunning backdrop for photography and celebrations.' },
        { icon: 'ShieldCheck', title: 'Sufficient Parking', text: 'Ample private parking inside the estate for all visiting vehicles and buses.' },
        { icon: 'Utensils', title: 'Catering Flexibility', text: 'Choose our in-house freshly crafted menus or bring your own preferred outside caterers.' },
        { icon: 'Speaker', title: 'DJ & Music Permitted', text: 'In-house DJ available or bring your own DJ to set the right celebratory vibe.' },
        { icon: 'HeartHandshake', title: 'Warmth & Hospitality', text: 'A family-owned retreat established since 2005 with dedicated care for every host and guest.' },
        { icon: 'Sun', title: 'Day & Night Events', text: 'Equally enchanting for morning sunshine ceremonies, poolside afternoons, and starlit banquets.' }
      ]
    },
    { type: 'cta', title: 'Experience the serenity of Selva Tree Hotels & Resorts.', text: 'Plan your celebration, wedding, or private getaway with us today.', cta: { label: 'Book Now', to: '/contact' } }
  ],
  '/stay': [
    { type: 'head', eyebrow: 'Stay & Rooms', title: 'Rooms & countryside stays in Gurugram.', text: '7 curated private guest rooms across Deluxe, Premium, and Arawali suites with pool and lawn access.', image: img('dbf-stay-head', 2000, 900) },
    { type: 'cards', eyebrow: 'Accommodations', title: 'Your countryside comfort.', variant: 'image', items: [
      { title: 'Deluxe Rooms (4 Rooms)', text: 'Ground and first floor rooms with serene garden views, plush king beds, and rain shower.', image: img('dbf-s1', 900, 1100) },
      { title: 'Premium Suites (2 Rooms)', text: 'Elevated luxury suites featuring artisan furnishings, private patio, and pool deck access.', image: img('dbf-s2', 900, 1100) },
      { title: 'Arawali Room (1 Room)', text: 'Exclusive scenic room offering picturesque panoramas of the rolling Arawali hills.', image: img('dbf-suites-lux', 900, 1100) }
    ] },
    {
      type: 'amenities',
      title: 'Amenities & Inclusions',
      theme: 'sand',
      items: [
        { iconKey: 'swimming-pool', label: 'Swimming Pool' },
        { iconKey: 'jacuzzi', label: '6-Seater Jacuzzi' },
        { iconKey: 'expansive-lawn', label: 'Spacious Outdoor Lawn' },
        { iconKey: 'sufficient-car-parking', label: 'Sufficient Car Parking' },
        { iconKey: '2-private-rooms', label: '7 Private Guest Rooms (4 Deluxe, 2 Premium, 1 Arawali)' },
        { iconKey: 'table-tennis', label: 'Table Tennis' },
        { iconKey: 'childrens-play-area', label: "Children's Play Area" },
        { iconKey: 'trampoline', label: 'Trampoline' },
        { iconKey: 'bonfire-bbq', label: 'Bonfire & BBQ' },
        { iconKey: 'inhouse-outside-dj', label: 'JBL Party Box / DJ' },
        { iconKey: 'pet-friendly', label: 'Pet-friendly Estate' },
        { iconKey: '24-hour-security', label: '24-Hour Security' },
      ]
    },
    { type: 'faq', title: 'Good to know', items: faq },
    { type: 'cta', title: 'Ready when you are.', text: 'Share your dates and group size.', cta: { label: 'Book Now', to: '/contact' } },
  ],
  '/events': [
    { 
      type: 'head', 
      eyebrow: 'Weddings & Celebrations', 
      title: 'Wedding & event venues in Gurugram.', 
      text: 'Dreaming of the perfect event? Selva Tree Hotels & Resorts offers unique spaces to bring it to life. Choose a sprawling lawn for open-air celebrations, or a spacious indoor hall for any occasion.', 
      image: img('dbf-events-head', 2000, 900) 
    },
    {
      type: 'eventVenues',
      eyebrow: 'Event Spaces & Capacities',
      title: 'Versatile indoor & outdoor venues.',
      subtitle: 'Two unique spaces with pre-function areas, air-conditioned comfort, and sprawling green lawns.',
      intro: 'Unfold your dream event at Selva Tree Hotels & Resorts Gurgaon, one of the top wedding and celebration destinations, where every milestone becomes a lasting memory. From grand galas to productive corporate meetings, we have got you covered.',
      venues: [
        {
          name: 'The Drawing Hall & 13,000 sq. ft. Lawn',
          badge: 'Indoor & Outdoor Combination',
          tag: 'Up to 200 Guests · 13,000 sq. ft.',
          description: 'Host your events in our sophisticated 863 sq. ft. drawing hall—exuding elegance while accommodating up to 60 guests in air-conditioned comfort with seamless Wi-Fi. Step right outside to our expansive 13,000 sq. ft. lawn, blanketed in lush greenery for open-air celebrations hosting up to 200 guests.',
          image: galleryImages[0] || img('dbf-wed', 1200, 900),
          highlights: [
            '863 sq. ft. Air-Conditioned Drawing Room with Wi-Fi',
            'Seamless Indoor-Outdoor Flow to 13,000 sq. ft. Lawn',
            'Ideal for Anniversaries, Bachelorettes, Roka & Sangeet',
            'Sufficient on-site parking & dedicated pre-function area'
          ],
          capacities: {
            seating: '200',
            floating: '100',
            theatre: '100',
            classroom: '60',
            cluster: '60',
            uShape: '60',
            boardroom: '60'
          }
        },
        {
          name: 'Grand Poolside Lawn (Qubes)',
          badge: 'Grand Wedding & Gala Lawn',
          tag: 'Up to 400 Guests · 20,000 sq. ft.',
          description: 'Beyond the drawing room lies our grand 20,000 sq. ft. lawn with the capacity to host up to 400 guests. Perfectly positioned next to the shimmering swimming pool, it sets a breathtaking stage for magical destination weddings under the stars, vibrant Haldi rituals, and grand corporate galas.',
          image: galleryImages[1] || img('dbf-party', 1200, 900),
          highlights: [
            'Sprawling 20,000 sq. ft. lawn hosting up to 400 guests',
            'Direct access to shimmering swimming pool & illuminated deck',
            'Perfect for destination weddings, Haldi & starlit banquets',
            'Outside catering, outside decorators, DJ & alcohol permitted'
          ],
          capacities: {
            seating: '400',
            floating: '200',
            theatre: '200',
            classroom: '120',
            cluster: '120',
            uShape: '120',
            boardroom: '120'
          }
        }
      ]
    },
    { type: 'contact' },
    { type: 'faq', title: 'Frequently Asked Questions', subtitle: 'Everything you need to know about hosting your dream event at Selva Tree Hotels & Resorts.', items: faq },
    { type: 'cta', title: 'Let Us Plan Your Dream Celebration.', text: 'Tell us about your occasion, dates and guest count — we will take care of every detail.', cta: { label: 'Book Now', to: '/contact' } },
  ],
  '/gallery': [
    { type: 'gallery' },
  ],
  '/contact': [
    { type: 'contactHero', image: img('dbf-hero', 2000, 1200) },
    { type: 'contact' },
    { type: 'map' },
    { type: 'faq', title: 'Quick answers', items: faq },
  ],
  '/book-now': [
    { type: 'contactHero', image: img('dbf-hero', 2000, 1200) },
    { type: 'contact' },
    { type: 'map' },
    { type: 'faq', title: 'Quick answers', items: faq },
  ],
  '/dining': [
    {
      type: 'head',
      eyebrow: 'Farm-to-Table Experience',
      title: 'Curated gourmet dining in nature.',
      text: 'Indulge in fresh multi-cuisine delicacies, live outdoor barbecue, and candlelit garden dinners crafted by our private culinary team.',
      image: img('dbf-dining-head', 2000, 900),
    },
    {
      type: 'featureSplit',
      eyebrow: 'Chef-Crafted Flavors',
      title: 'Healing cuisine made with care.',
      subtitle: 'Indian, Continental, and Oriental favorites prepared with fresh local ingredients.',
      paragraphs: [
        'At Selva Tree Hotels & Resorts, every meal is an immersive escape. Our dedicated Food and Beverages manager and executive chefs craft wholesome meals tailored to your taste buds and dietary needs.',
        'Choose from expansive breakfast spreads by the pool, live outdoor barbecue counters beneath the night sky, or lavish buffet spreads on our manicured event lawns.'
      ],
      points: [
        'Farm-fresh ingredients and organic spices',
        'Live barbecue & bonfire grilling sessions',
        'Private poolside candlelit dinner set-ups',
        'Custom multi-course menus for events'
      ],
      tag: 'Gourmet Dining',
      image: img('dbf-dining-gourmet', 1200, 1000),
      cta: { label: 'Book with Dining', to: '/contact' },
      flip: false,
    },
    { type: 'contact' },
    { type: 'faq', title: 'Dining Questions', items: faq },
  ],
  '/facilities': [
    {
      type: 'head',
      eyebrow: 'Estate Amenities',
      title: 'World-class facilities in Sohna.',
      text: 'From a crystal-clear swimming pool and 6-seater jacuzzi to expansive sports lawns and secure parking, experience uncompromised luxury.',
      image: img('dbf-facilities-head', 2000, 900),
    },
    {
      type: 'amenities',
      title: 'Estate Amenities & Leisure',
      theme: 'sand',
      items: [
        { iconKey: 'swimming-pool', label: 'Private Swimming Pool' },
        { iconKey: 'jacuzzi', label: '6-Seater Heated Jacuzzi' },
        { iconKey: 'spacious-outdoor-lawn', label: '20,000+ sq. ft Lush Lawns' },
        { iconKey: 'sufficient-car-parking', label: 'Valet & Ample Parking' },
        { iconKey: 'table-tennis', label: 'Table Tennis & Sports Arena' },
        { iconKey: 'childrens-play-area', label: "Children's Adventure Play Area" },
        { iconKey: 'trampoline', label: 'Full-Size Trampoline' },
        { iconKey: 'bonfire-bbq', label: 'Bonfire & Live BBQ Pit' },
        { iconKey: 'inhouse-outside-dj', label: 'High-Power DJ & Sound Setup' },
        { iconKey: 'pet-friendly-estate', label: '100% Pet-Friendly Grounds' },
        { iconKey: '24-hour-security', label: '24x7 Gated Security & Staff' },
      ]
    },
    { type: 'contact' },
    { type: 'faq', title: 'Facility FAQs', items: faq },
  ],
  '/weddings-events': [
    {
      type: 'head',
      eyebrow: 'Weddings & Celebrations',
      title: 'Grand destination weddings in Gurgaon.',
      text: 'Exchange vows under star-lit skies on over 20,000 sq. ft. of emerald lawns, complemented by air-conditioned banquet halls and boutique suites.',
      image: img('dbf-weddings-head', 2000, 900),
    },
    {
      type: 'eventShowcase',
      theme: 'sand',
      title: 'Celebration Venues for Every Occasion',
      text: 'From Mehndi and Haldi celebrations to starlit receptions and grand anniversary galas.',
      items: [
        {
          title: 'Royal Wedding Lawns',
          text: 'Expansive lush green outdoor lawns hosting up to 200 seating and 400 floating guests with customized decor and catering.',
          badge: 'Up to 400 guests',
          image: img('dbf-event-wedding', 600, 600),
        },
        {
          title: 'Cocktail & Sangeet Evenings',
          text: 'Illuminated poolside deck with professional JBL sound system, DJ facilities, and ambient garden lighting.',
          badge: 'Party ready',
          image: img('dbf-party', 600, 600),
        },
        {
          title: 'Corporate Galas & Offsites',
          text: 'Peaceful countryside ambiance combined with modern presentation facilities, Wi-Fi, and executive catering.',
          badge: 'Complete privacy',
          image: img('dbf-event-retreat', 600, 600),
        },
      ]
    },
    { type: 'contact' },
    { type: 'faq', title: 'Wedding & Event Inquiries', items: faq },
  ],
  '/farmhouse-for-pool-party-in-gurgaon': [
    {
      type: 'head',
      eyebrow: 'Poolside Celebrations',
      title: 'Farmhouse for pool party in Gurgaon.',
      text: 'Host the ultimate sun-soaked pool party at Selva Tree. Crystal clear pool, sun loungers, outdoor bar counter, and booming audio setup.',
      image: img('dbf-pool-party-head', 2000, 900),
    },
    {
      type: 'featureSplit',
      eyebrow: 'Private Pool Retreat',
      title: 'Make a splash with your inner circle.',
      subtitle: 'Exclusive pool access, jacuzzi, and private lawn for groups of up to 50 guests.',
      paragraphs: [
        'Looking for the top farmhouse with pool in Gurgaon? Selva Tree Hotels & Resorts gives you private, undisturbed access to our pool deck, shaded cabanas, and manicured lawns.',
        'Play your favorite tracks on our JBL party box, fire up the barbecue grill, and sip cool drinks as the sun sets over the Aravalli hills.'
      ],
      points: [
        'Crystal blue pool with illuminated deck',
        '6-seater jacuzzi and sun loungers',
        'Outside catering and outside beverages permitted',
        'Overnight luxury stay suites available'
      ],
      tag: 'Top Pool Venue',
      image: img('dbf-luxury-pool', 1200, 1000),
      cta: { label: 'Book Pool Party', to: '/contact' },
      flip: true,
    },
    { type: 'contact' },
    { type: 'faq', title: 'Pool Party FAQs', items: faq },
  ],
  '/farmhouse-for-birthday-party-in-gurgaon': [
    {
      type: 'head',
      eyebrow: 'Birthday Parties & Milestones',
      title: 'Farmhouse for birthday party in Gurgaon.',
      text: 'Celebrate birthdays in style with open-air lawns, personalized themed decor, DJ sound systems, and bonfire evenings in Sohna.',
      image: img('dbf-birthday-head', 2000, 900),
    },
    {
      type: 'featureSplit',
      eyebrow: 'Unforgettable Birthdays',
      title: 'Turn another year older, surrounded by nature.',
      subtitle: 'Spacious lawns, trampoline, indoor drawing room, and delicious live catering.',
      paragraphs: [
        'Whether planning a first birthday celebration, an 18th milestone bash, or a golden jubilee gathering, Selva Tree offers flexible indoor-outdoor party spaces in Gurgaon.',
        'Enjoy total freedom with decoration, music, and food choices while our on-site team ensures seamless hospitality from arrival to checkout.'
      ],
      points: [
        'Lush lawn setup with trampoline and kids play zone',
        'DJ setup and dance floor arrangements',
        'Choice of in-house chef catering or outside catering',
        'Ample parking for all your attending guests'
      ],
      tag: 'Birthday Destination',
      image: img('dbf-event-birthday', 1200, 1000),
      cta: { label: 'Plan Birthday Bash', to: '/contact' },
      flip: false,
    },
    { type: 'contact' },
    { type: 'faq', title: 'Birthday Party FAQs', items: faq },
  ],
  '/terms-conditions': [
    {
      type: 'head',
      eyebrow: 'Guest Guidelines',
      title: 'Terms & conditions.',
      text: 'Review our booking policies, check-in requirements, and guidelines designed to ensure a safe, peaceful stay for all guests.',
      image: img('dbf-policy-head', 2000, 900),
    },
    {
      type: 'split',
      eyebrow: 'Policies & Rules',
      title: 'Fair and transparent terms.',
      paragraphs: [
        'Standard check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in or late check-out is subject to room availability and prior arrangement.',
        'A valid government-issued photo ID (Aadhaar, Passport, or Driving License) is mandatory for all adult guests at the time of check-in.',
        'Reservations are confirmed upon payment of the advance deposit. Cancellation requests made more than 7 days prior to arrival are eligible for full credit towards future dates.',
        'Selva Tree Hotels & Resorts maintains a peaceful environment. While celebrations are welcomed, we observe outdoor sound restrictions after 10:00 PM in accordance with local regulations.'
      ],
      points: [
        'Standard Check-in: 2:00 PM | Check-out: 11:00 AM',
        'Government photo ID required for all staying guests',
        'Advance deposit required for reservation confirmation',
        'Pet-friendly estate: please keep pets supervised'
      ],
      tag: 'Guest Policy',
      image: img('dbf-story', 1200, 1000),
      flip: true,
    },
    { type: 'faq', title: 'Common Policy Questions', items: faq },
  ],
};
