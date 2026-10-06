import { Link } from 'react-router-dom';
const guides = {
  '/': ['Plan a stay or celebration at Selva Tree', 'Selva Tree Hotels & Resorts welcomes enquiries for countryside stays, weddings and private events in Sohna Rural, Gurugram. Explore the property, then share your dates and group size with our team.', '/stay', 'Explore rooms and stays'],
  '/about-us': ['A countryside setting in Sohna, Gurugram', 'Our property brings together accommodation, gardens and gathering spaces. Use the gallery to explore property photographs, and contact us to discuss which spaces suit your visit.', '/gallery', 'See property photographs'],
  '/stay': ['What to confirm before booking your stay', 'Tell us your check-in and check-out dates, number of adults and children, and room preferences. Our team will confirm available rooms, overnight capacity, meal arrangements, pool access and the quoted inclusions before you book.', '/contact', 'Enquire about a stay'],
  '/events': ['Plan your venue around your occasion', 'For a wedding, birthday or corporate gathering, share your date, guest count and preferred indoor or outdoor layout. Confirm seated and standing capacity, catering, decoration, music arrangements and a weather backup with the team.', '/contact', 'Discuss your event'],
  '/gallery': ['Property photographs to help you plan', 'This gallery shows photographs from the property. Stock photographs elsewhere on the website are illustrative. Contact our team to confirm the current room setup, event layout and availability for your dates.', '/events', 'Explore event spaces'],
  '/contact': ['How booking enquiries work', 'Email booking@selvatreehotels.com, call Chandrapal at +91 72104 83929, or send your details using the WhatsApp enquiry form. A submitted enquiry is not a confirmed booking: the team will discuss availability, pricing and arrangements with you.', '/stay', 'Review rooms and stays'],
};
export default function PageGuide({ pathname }) {
  const guide = guides[pathname === '/book-now' ? '/contact' : pathname];
  if (!guide) return null;
  return <section className="page-guide wrap"><h2>{guide[0]}</h2><p>{guide[1]}</p><Link to={guide[2]}>{guide[3]} <span aria-hidden="true">↗</span></Link></section>;
}
